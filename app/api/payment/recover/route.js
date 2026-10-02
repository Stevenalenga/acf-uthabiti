import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";
import { ORGANIZATION } from "@/lib/documents/constants";
import {
  invoiceNumberCandidates,
} from "@/lib/payment/invoiceNumber";
import {
  issueRegistrationInvoice,
  sendInvoiceEmail,
} from "@/lib/documents/issueInvoice";

function isValidEmail(email) {
  return Boolean(email && email.includes("@") && email.includes("."));
}

function maskEmail(email) {
  const value = String(email || "").trim().toLowerCase();
  const at = value.indexOf("@");
  if (at < 1) return value;

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  const localMasked =
    local.length <= 2
      ? `${local[0] || "*"}*`
      : `${local[0]}${"*".repeat(Math.min(local.length - 2, 5))}${local.slice(-1)}`;

  const domainParts = domain.split(".");
  const name = domainParts[0] || "";
  const tld = domainParts.slice(1).join(".") || "";
  const nameMasked =
    name.length <= 2
      ? `${name[0] || "*"}*`
      : `${name[0]}${"*".repeat(Math.min(name.length - 1, 4))}`;

  return tld ? `${localMasked}@${nameMasked}.${tld}` : `${localMasked}@${nameMasked}`;
}

async function findInvoiceDocument(rawInvoiceNumber) {
  const { normalized, candidates, seq } = invoiceNumberCandidates(rawInvoiceNumber);
  if (!normalized) return null;

  const include = {
    participant: {
      include: {
        payments: { orderBy: { payment_id: "desc" }, take: 1 },
      },
    },
  };

  for (const candidate of candidates) {
    const doc = await prisma.registration_document_tbl.findFirst({
      where: {
        type: "INVOICE",
        status: { not: "VOID" },
        document_number: candidate,
      },
      orderBy: { document_id: "desc" },
      include,
    });
    if (doc) return doc;
  }

  if (seq) {
    return prisma.registration_document_tbl.findFirst({
      where: {
        type: "INVOICE",
        status: { not: "VOID" },
        document_number: {
          startsWith: `${ORGANIZATION.eventCode}/`,
          contains: `/${seq}/`,
        },
      },
      orderBy: { document_id: "desc" },
      include,
    });
  }

  return null;
}

function isUnpaid(participant, payment) {
  if (!participant || !payment) return false;
  if (participant.paid || payment.status === "SUCCESS") return false;
  return true;
}

async function findByEmail(email) {
  const participants = await prisma.participant_registration_tbl.findMany({
    where: { email },
    include: {
      payments: { orderBy: { payment_id: "desc" }, take: 1 },
      documents: {
        where: { type: "INVOICE", status: { not: "VOID" } },
        orderBy: { document_id: "desc" },
        take: 5,
      },
    },
    orderBy: { participant_id: "desc" },
    take: 10,
  });

  const invoices = [];

  for (const participant of participants) {
    const payment = participant.payments?.[0];
    if (!isUnpaid(participant, payment)) continue;

    const doc = participant.documents?.[0];
    if (!doc) continue;

    invoices.push({
      invoiceNumber: doc.document_number,
      fullName: participant.full_name,
      amount: doc.currency === "KES" ? Number(doc.amount) : Number(payment.amount),
      currency: doc.currency === "KES" ? "KES" : "USD",
    });
  }

  if (invoices.length === 0) {
    return Response.json(
      {
        error:
          "No unpaid invoice found for that email. Check the spelling, or register if you have not yet.",
      },
      { status: 404 }
    );
  }

  return Response.json(safeJson({ email, invoices }));
}

async function findByInvoice(invoiceNumber) {
  const doc = await findInvoiceDocument(invoiceNumber);

  if (!doc?.participant) {
    return Response.json(
      {
        error:
          "Invoice not found. Enter the invoice number exactly as shown (for example ACF2026/086/2026).",
      },
      { status: 404 }
    );
  }

  const participant = doc.participant;
  const payment = participant.payments?.[0];

  if (!isUnpaid(participant, payment)) {
    return Response.json(
      {
        error:
          "This registration is already fully paid. If you believe this is an error, please contact support.",
      },
      { status: 400 }
    );
  }

  return Response.json(
    safeJson({
      invoiceNumber: doc.document_number,
      email: participant.email,
      emailMasked: maskEmail(participant.email),
      fullName: participant.full_name,
    })
  );
}

async function resendInvoice(email) {
  const participants = await prisma.participant_registration_tbl.findMany({
    where: { email },
    include: {
      payments: { orderBy: { payment_id: "desc" }, take: 1 },
    },
    orderBy: { participant_id: "desc" },
    take: 5,
  });

  const unpaid = participants.filter((p) => isUnpaid(p, p.payments?.[0]));

  if (unpaid.length === 0) {
    // Avoid confirming whether the email exists in our system
    return Response.json(
      safeJson({
        success: true,
        message:
          "If we find an unpaid registration for that email, we will send the invoice shortly. Check your inbox and spam folder.",
      })
    );
  }

  const sentNumbers = [];

  for (const participant of unpaid) {
    const payment = participant.payments[0];
    const invoice = await issueRegistrationInvoice({
      participant,
      payment,
      eventId: participant.event_id,
      skipEmail: true,
    });

    const sent = await sendInvoiceEmail({
      participant,
      payment,
      document: invoice,
    });

    if (sent) sentNumbers.push(invoice.document_number);
  }

  if (sentNumbers.length === 0) {
    return Response.json(
      {
        error:
          "We found your registration, but the invoice email could not be sent. Please try again or contact support.",
      },
      { status: 502 }
    );
  }

  return Response.json(
    safeJson({
      success: true,
      message: `Invoice ${sentNumbers.join(", ")} has been sent to ${email}. Check your inbox and spam folder.`,
      invoiceNumbers: sentNumbers,
      email,
    })
  );
}

export async function POST(req) {
  try {
    const body = await req.json();
    const action = String(body.action || "").trim().toLowerCase();
    const email = String(body.email || "").trim().toLowerCase();
    const invoiceNumber = String(body.invoiceNumber || "").trim();

    if (action === "find_by_email") {
      if (!isValidEmail(email)) {
        return Response.json(
          { error: "Please enter a valid registration email." },
          { status: 400 }
        );
      }
      return findByEmail(email);
    }

    if (action === "find_by_invoice") {
      if (!invoiceNumber) {
        return Response.json(
          { error: "Please enter your registration / invoice number." },
          { status: 400 }
        );
      }
      return findByInvoice(invoiceNumber);
    }

    if (action === "resend_invoice") {
      if (!isValidEmail(email)) {
        return Response.json(
          { error: "Please enter a valid registration email." },
          { status: 400 }
        );
      }
      return resendInvoice(email);
    }

    return Response.json(
      {
        error:
          "Unknown action. Use find_by_email, find_by_invoice, or resend_invoice.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment recover failed:", error);
    return Response.json(
      { error: "Request failed. Please try again or contact support." },
      { status: 500 }
    );
  }
}
