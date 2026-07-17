import { prisma } from "@/lib/prisma";
import { generateReceiptNumber } from "./documentNumber";
import { generateReceiptPdf } from "./generatePdf";
import { saveDocumentFile } from "./storage";
import { issueRegistrationInvoice } from "./issueInvoice";

export async function issuePaymentReceipt({
  participant,
  payment,
  paymentReference,
  paidAt = new Date(),
}) {
  const existing = await prisma.registration_document_tbl.findFirst({
    where: {
      payment_id: payment.payment_id,
      type: "RECEIPT",
    },
  });

  if (existing) {
    return { receipt: existing, invoice: null, buffer: null, fileName: existing.file_name };
  }

  let invoice = await prisma.registration_document_tbl.findFirst({
    where: {
      payment_id: payment.payment_id,
      type: "INVOICE",
      status: { not: "VOID" },
    },
  });

  if (!invoice) {
    invoice = await issueRegistrationInvoice({
      participant,
      payment,
      eventId: participant.event_id,
      skipEmail: true,
    });
  }

  await prisma.registration_document_tbl.update({
    where: { document_id: invoice.document_id },
    data: { status: "PAID" },
  });

  const receiptNumber = await generateReceiptNumber(prisma, invoice.document_number);
  const buffer = await generateReceiptPdf({
    participant,
    receiptNumber,
    invoiceNumber: invoice.document_number,
    amount: payment.amount,
    paymentReference,
    paidAt,
    method: payment.method === "ONSITE" ? "On-site" : "Paystack",
  });

  const { fileName, filePath } = await saveDocumentFile({
    type: "RECEIPT",
    documentNumber: receiptNumber,
    buffer,
  });

  const receipt = await prisma.registration_document_tbl.create({
    data: {
      participant_id: participant.participant_id,
      payment_id: payment.payment_id,
      event_id: participant.event_id,
      type: "RECEIPT",
      document_number: receiptNumber,
      file_name: fileName,
      file_path: filePath,
      amount: payment.amount,
      currency: payment.currency || "USD",
      status: "PAID",
      issued_at: paidAt,
    },
  });

  return { receipt, invoice, buffer, fileName };
}
