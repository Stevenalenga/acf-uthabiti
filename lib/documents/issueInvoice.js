import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import { REGISTRATION_SUPPORT_EMAIL } from "@/lib/sendPaymentConfirmationEmail";
import { logMail } from "@/lib/mailLog";
import { generateInvoiceNumber } from "./documentNumber";
import { generateInvoicePdf } from "./generatePdf";
import { saveDocumentFile, readDocumentFile } from "./storage";
import { invoiceEmailTemplate } from "@/lib/emailTemplate";

export async function sendInvoiceEmail({ participant, payment, document, buffer }) {
  let pdfBuffer = buffer;

  if (!pdfBuffer) {
    try {
      pdfBuffer = await readDocumentFile(document.file_path);
    } catch (readError) {
      console.error("Invoice PDF read failed, regenerating:", readError?.message);
      pdfBuffer = await generateInvoicePdf({
        participant,
        invoiceNumber: document.document_number,
        amount: document.amount,
      });
    }
  }

  try {
    await transporter.sendMail({
      from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
      to: participant.email,
      replyTo: REGISTRATION_SUPPORT_EMAIL,
      subject: `Conference Invoice ${document.document_number} – ACF Mombasa 2026`,
      html: invoiceEmailTemplate({
        name: participant.full_name,
        documentNumber: document.document_number,
        amount: document.amount,
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
    // Invoice already issued for this payment: resend the email so users who
    // did not receive it the first time still get their invoice.
    if (!skipEmail) {
      await sendInvoiceEmail({ participant, payment, document: existing });
    }
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
    await sendInvoiceEmail({ participant, payment, document, buffer });
  }

  return document;
}
