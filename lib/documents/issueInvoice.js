import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import { REGISTRATION_SUPPORT_EMAIL } from "@/lib/sendPaymentConfirmationEmail";
import { generateInvoiceNumber } from "./documentNumber";
import { generateInvoicePdf } from "./generatePdf";
import { saveDocumentFile } from "./storage";
import { invoiceEmailTemplate } from "@/lib/emailTemplate";

export async function issueRegistrationInvoice({
  participant,
  payment,
  eventId,
  skipEmail = false,
}) {
  const existing = await prisma.registration_document_tbl.findFirst({
    where: {
      participant_id: participant.participant_id,
      payment_id: payment.payment_id,
      type: "INVOICE",
      status: { not: "VOID" },
    },
  });

  if (existing) {
    return existing;
  }

  const documentNumber = await generateInvoiceNumber(prisma);
  const buffer = await generateInvoicePdf({
    participant,
    invoiceNumber: documentNumber,
    amount: payment.amount,
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
      amount: payment.amount,
      currency: payment.currency || "USD",
      status: "ISSUED",
    },
  });

  if (!skipEmail) {
    try {
      await transporter.sendMail({
        from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
        to: participant.email,
        replyTo: REGISTRATION_SUPPORT_EMAIL,
        subject: `Conference Invoice ${documentNumber} – ACF Mombasa 2026`,
        html: invoiceEmailTemplate({
          name: participant.full_name,
          documentNumber,
          amount: payment.amount,
          paymentStatus: payment.status,
        }),
        attachments: [
          {
            filename: fileName,
            content: buffer,
            contentType: "application/pdf",
          },
        ],
      });
    } catch (emailError) {
      console.error("Invoice email failed:", emailError);
    }
  }

  return document;
}
