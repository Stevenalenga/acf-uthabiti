/**
 * Restore wiped participant/payment/document rows from invoice PDFs on disk
 * and payment status hints in var/logs/mail.log.
 *
 * Usage: node scripts/restore-participants-from-invoices.js
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PDFParse } = require("pdf-parse");

const prisma = new PrismaClient();
const INVOICE_DIR = path.join(
  process.cwd(),
  "var",
  "registration-documents",
  "invoices"
);
const MAIL_LOG = path.join(process.cwd(), "var", "logs", "mail.log");

const PHASE_MAP = {
  "Early Bird": "EarlyBird",
  Regular: "Regular",
  "Late / On-site": "LateOnsite",
};

const TYPE_MAP = {
  Student: "student",
  "East Africa Participant": "eastAfrica",
  "International Participant": "other",
};

function parseMailLog() {
  const paidByInvoice = new Set();
  const referencesByInvoice = new Map();

  if (!fs.existsSync(MAIL_LOG)) return { paidByInvoice, referencesByInvoice };

  for (const line of fs.readFileSync(MAIL_LOG, "utf8").split(/\n+/)) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if (entry.kind === "RECEIPT" && entry.document) {
        // Receipt numbers look like RCP-ACF2026-003-2026-001
        const match = String(entry.document).match(
          /RCP-(ACF2026)-(\d+)-(\d+)/i
        );
        if (match) {
          const invoiceNumber = `${match[1]}/${match[2]}/${match[3]}`;
          paidByInvoice.add(invoiceNumber);
          if (entry.reference) {
            referencesByInvoice.set(invoiceNumber, entry.reference);
          }
        }
      }
    } catch {
      // ignore malformed lines
    }
  }

  return { paidByInvoice, referencesByInvoice };
}

async function extractInvoice(filePath) {
  const buf = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buf });
  try {
    const result = await parser.getText();
    const text = typeof result === "string" ? result : result.text || "";
    const lines = String(text)
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const invoiceLine = lines.find((l) => l.startsWith("Invoice No:"));
    const dateLine = lines.find((l) => l.startsWith("Date:"));
    const toIndex = lines.findIndex((l) => l === "To");
    const descIndex = lines.findIndex((l) => l.includes("Delegate Fees"));
    const amountLine = lines.find((l) => l.startsWith("TOTAL AMOUNT DUE"));

    if (!invoiceLine || toIndex < 0) return null;

    const documentNumber = invoiceLine.replace("Invoice No:", "").trim();
    const fullName = lines[toIndex + 1] || "";
    const email = (lines[toIndex + 2] || "").toLowerCase();
    const maybeOrg = lines[toIndex + 3] || "";
    const organization =
      maybeOrg &&
      !maybeOrg.startsWith("No.") &&
      !maybeOrg.includes("Description")
        ? maybeOrg
        : "Unknown";

    if (!email.includes("@") || !fullName) return null;

    let phase = "Regular";
    let type = "other";
    const descBlock = [lines[descIndex], lines[descIndex + 1]]
      .filter(Boolean)
      .join(" ");
    const tierMatch = descBlock.match(
      /\((Early Bird|Regular|Late \/ On-site)\s*[–-]\s*(Student|East Africa Participant|International Participant)\)/
    );
    if (tierMatch) {
      phase = PHASE_MAP[tierMatch[1]] || phase;
      type = TYPE_MAP[tierMatch[2]] || type;
    }

    let amount = null;
    if (amountLine) {
      const m = amountLine.match(/\$\s*([\d.]+)/);
      if (m) amount = Number(m[1]);
    }
    if (amount == null || Number.isNaN(amount)) {
      const qtyLine = lines.find((l) => /^\d+\s+[\d.]+\s+[\d.]+$/.test(l));
      if (qtyLine) amount = Number(qtyLine.split(/\s+/).pop());
    }

    let issuedAt = null;
    if (dateLine) {
      const raw = dateLine.replace("Date:", "").trim();
      const parsed = new Date(raw);
      if (!Number.isNaN(parsed.getTime())) issuedAt = parsed;
    }

    return {
      documentNumber,
      fullName,
      email,
      organization,
      phase,
      type,
      amount,
      issuedAt,
      filePath,
      fileName: path.basename(filePath),
    };
  } finally {
    await parser.destroy?.();
  }
}

async function main() {
  const event = await prisma.event_tbl.findFirst({
    where: { isActive: true },
  });
  if (!event) {
    throw new Error("No active event found. Seed event_tbl first.");
  }

  const { paidByInvoice, referencesByInvoice } = parseMailLog();
  const files = fs
    .readdirSync(INVOICE_DIR)
    .filter((f) => f.endsWith(".pdf") && !f.includes("TEST"))
    .sort();

  let restored = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const absolutePath = path.join(INVOICE_DIR, file);
    let invoice;
    try {
      invoice = await extractInvoice(absolutePath);
    } catch (error) {
      console.error("PARSE_FAIL", file, error.message);
      failed += 1;
      continue;
    }

    if (!invoice) {
      console.error("PARSE_EMPTY", file);
      failed += 1;
      continue;
    }

    const existingDoc = await prisma.registration_document_tbl.findUnique({
      where: { document_number: invoice.documentNumber },
    });
    if (existingDoc) {
      skipped += 1;
      continue;
    }

    const existingParticipant =
      await prisma.participant_registration_tbl.findFirst({
        where: {
          email: invoice.email,
          event_id: event.event_id,
        },
      });
    if (existingParticipant) {
      skipped += 1;
      continue;
    }

    const isPaid = paidByInvoice.has(invoice.documentNumber);
    const paymentReference =
      referencesByInvoice.get(invoice.documentNumber) || null;

    try {
      await prisma.$transaction(async (tx) => {
        const participant = await tx.participant_registration_tbl.create({
          data: {
            event_id: event.event_id,
            full_name: invoice.fullName,
            email: invoice.email,
            phone: "N/A (recovered)",
            organization: invoice.organization || "Unknown",
            country: "Unknown",
            profession: "Unknown",
            visa_info: null,
            phase: invoice.phase,
            type: invoice.type,
            media_consent: "Yes",
            report_consent: "Yes",
            emergency_contact: null,
            paid: isPaid,
            ...(invoice.issuedAt
              ? { createdAt: invoice.issuedAt, updatedAt: invoice.issuedAt }
              : {}),
          },
        });

        const payment = await tx.payment_tbl.create({
          data: {
            participant_id: participant.participant_id,
            amount: invoice.amount ?? 0,
            currency: "USD",
            method: invoice.phase === "LateOnsite" ? "ONSITE" : "PAYSTACK",
            status: isPaid ? "SUCCESS" : "PENDING",
            payment_reference: paymentReference,
            paidAt: isPaid ? invoice.issuedAt || new Date() : null,
            ...(invoice.issuedAt
              ? { createdAt: invoice.issuedAt, updatedAt: invoice.issuedAt }
              : {}),
          },
        });

        await tx.registration_document_tbl.create({
          data: {
            participant_id: participant.participant_id,
            payment_id: payment.payment_id,
            event_id: event.event_id,
            type: "INVOICE",
            document_number: invoice.documentNumber,
            file_name: invoice.fileName,
            file_path: absolutePath,
            amount: invoice.amount ?? 0,
            currency: "USD",
            status: isPaid ? "PAID" : "ISSUED",
            issued_at: invoice.issuedAt || new Date(),
          },
        });
      });

      restored += 1;
    } catch (error) {
      console.error(
        "RESTORE_FAIL",
        invoice.documentNumber,
        error.code || error.message
      );
      failed += 1;
    }
  }

  const total = await prisma.participant_registration_tbl.count();
  console.log(
    JSON.stringify(
      {
        restored,
        skipped,
        failed,
        participant_total: total,
        paid_from_mail_log: paidByInvoice.size,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
