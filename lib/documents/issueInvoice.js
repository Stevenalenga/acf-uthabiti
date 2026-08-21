import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import { REGISTRATION_SUPPORT_EMAIL } from "@/lib/sendPaymentConfirmationEmail";
import { logMail } from "@/lib/mailLog";
import { generateInvoiceNumber } from "./documentNumber";
import { generateInvoicePdf } from "./generatePdf";
import { saveDocumentFile, readDocumentFile } from "./storage";
import { invoiceEmailTemplate } from "@/lib/emailTemplate";
import {
  FAMILY_BANK_USD_TO_KES,
  convertUsdToKes,
  formatInvoiceAmount,
} from "./constants";

function normalizeInvoiceCurrency(currency) {
  return String(currency || "USD").toUpperCase() === "KES" ? "KES" : "USD";
}

function resolveInvoiceAmounts(usdAmount, currency) {
  const usd = Number(usdAmount);
  if (normalizeInvoiceCurrency(currency) === "KES") {
    return {
      currency: "KES",
      amount: convertUsdToKes(usd),
      usdAmount: usd,
      exchangeRate: FAMILY_BANK_USD_TO_KES,
    };
  }
  return {
    currency: "USD",
    amount: usd,
    usdAmount: usd,
    exchangeRate: null,
  };
}

export async function sendInvoiceEmail({ participant, payment, document, buffer }) {
  let pdfBuffer = buffer;
  const currency = normalizeInvoiceCurrency(document.currency);

  if (!pdfBuffer) {
    try {
      pdfBuffer = await readDocumentFile(document.file_path);
    } catch (readError) {
      console.error("Invoice PDF read failed, regenerating:", readError?.message);
      const amounts = resolveInvoiceAmounts(
        payment?.amount ?? document.amount,
        currency
      );
      pdfBuffer = await generateInvoicePdf({
        participant,
        invoiceNumber: document.document_number,
        amount: document.amount,
        currency,
        usdAmount: amounts.usdAmount,
        exchangeRate: amounts.exchangeRate,
      });
    }
  }

  try {
    await transporter.sendMail({
      from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
      to: participant.email,
      replyTo: REGISTRATION_SUPPORT_EMAIL,
      subject: `Conference Invoice ${document.document_number} – ACF Mombasa 2026 (${currency})`,
      html: invoiceEmailTemplate({
        name: participant.full_name,
        documentNumber: document.document_number,
        amount: document.amount,
        currency,
        amountLabel: formatInvoiceAmount(document.amount, currency),
        paymentStatus: payment?.status || "PENDING",
      }),
      attachments: [
        {
          filename: document.file_name,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    await logMail({
      kind: "INVOICE",
      to: participant.email,
      document: document.document_number,
      status: "SENT",
    });
    return true;
  } catch (emailError) {
    console.error("Invoice email failed:", emailError);
    await logMail({
      kind: "INVOICE",
      to: participant.email,
      document: document.document_number,
      status: "FAILED",
      error: emailError?.message || String(emailError),
    });
    return false;
  }
}

/**
 * Issue (or re-issue) a registration invoice in USD or KES.
 * Payment.amount remains the canonical USD fee; document.amount/currency
 * reflect the chosen invoice currency.
 */
export async function issueRegistrationInvoice({
  participant,
  payment,
  eventId,
  skipEmail = false,
  currency = "USD",
  forceNew = false,
}) {
  const desiredCurrency = normalizeInvoiceCurrency(currency);
  const amounts = resolveInvoiceAmounts(payment.amount, desiredCurrency);

  const existing = await prisma.registration_document_tbl.findFirst({
    where: {
      participant_id: participant.participant_id,
      payment_id: payment.payment_id,
      type: "INVOICE",
      status: { not: "VOID" },
    },
    orderBy: { issued_at: "desc" },
  });

  if (existing && !forceNew) {
    const existingCurrency = normalizeInvoiceCurrency(existing.currency);
    const sameCurrency = existingCurrency === desiredCurrency;
    const sameAmount = Number(existing.amount) === Number(amounts.amount);

    if (sameCurrency && sameAmount) {
      if (!skipEmail) {
        await sendInvoiceEmail({ participant, payment, document: existing });
      }
      return existing;
    }

    await prisma.registration_document_tbl.update({
      where: { document_id: existing.document_id },
      data: { status: "VOID" },
    });
  }

  const documentNumber = await generateInvoiceNumber(prisma);
  const buffer = await generateInvoicePdf({
    participant,
    invoiceNumber: documentNumber,
    amount: amounts.amount,
    currency: amounts.currency,
    usdAmount: amounts.usdAmount,
    exchangeRate: amounts.exchangeRate,
  });

  const { fileName, filePath } = await saveDocumentFile({
    type: "INVOICE",
    documentNumber,
    buffer,
  });

  const document = await prisma.registration_document_tbl.create({
    data: {
      participant_id: participant.participant_id,
      payment_id: payment.payment_id,
      event_id: eventId ? BigInt(eventId) : participant.event_id,
      type: "INVOICE",
      document_number: documentNumber,
      file_name: fileName,
      file_path: filePath,
      amount: amounts.amount,
      currency: amounts.currency,
      status: "ISSUED",
    },
  });

  if (!skipEmail) {
    await sendInvoiceEmail({ participant, payment, document, buffer });
  }

  return document;
}
