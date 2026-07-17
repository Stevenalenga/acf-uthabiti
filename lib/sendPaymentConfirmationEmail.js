import { transporter } from "@/lib/mailer";
import { paymentSuccessTemplate } from "@/lib/emailTemplate";
import { issuePaymentReceipt } from "@/lib/documents/issueReceipt";
import { readDocumentFile } from "@/lib/documents/storage";
import { prisma } from "@/lib/prisma";
import { logMail } from "@/lib/mailLog";

export const REGISTRATION_SUPPORT_EMAIL = "acf@uthabitiafrica.org";

export async function sendPaymentConfirmationEmail({
  participant,
  payment,
  amount,
  reference,
  paidAt = new Date(),
}) {
  const result = await issuePaymentReceipt({
    participant,
    payment,
    paymentReference: reference,
    paidAt,
  });

  let { buffer, fileName, receipt, invoice } = result;

  // If the receipt already existed, the buffer is not returned: read the PDF
  // from disk so the email still carries the attachment.
  if (!buffer && receipt?.file_path) {
    try {
      buffer = await readDocumentFile(receipt.file_path);
      fileName = receipt.file_name;
    } catch (readError) {
      console.error("Receipt PDF read failed:", readError?.message);
    }
  }

  if (!invoice) {
    invoice = await prisma.registration_document_tbl.findFirst({
      where: {
        payment_id: payment.payment_id,
        type: "INVOICE",
        status: { not: "VOID" },
      },
    });
  }

  const attachments = buffer
    ? [
        {
          filename: fileName,
          content: buffer,
          contentType: "application/pdf",
        },
      ]
    : [];

  try {
    await transporter.sendMail({
      from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
      to: participant.email,
      replyTo: REGISTRATION_SUPPORT_EMAIL,
      subject: "Registration Confirmed – ACF Mombasa 2026",
      html: paymentSuccessTemplate({
        name: participant.full_name,
        phase: participant.phase,
        type: participant.type,
        amount,
        reference,
        invoiceNumber: invoice?.document_number,
        receiptNumber: receipt?.document_number,
      }),
      attachments,
    });

    await logMail({
      kind: "RECEIPT",
      to: participant.email,
      document: receipt?.document_number,
      reference,
      status: "SENT",
    });
  } catch (emailError) {
    console.error("Receipt email failed:", emailError);
    await logMail({
      kind: "RECEIPT",
      to: participant.email,
      document: receipt?.document_number,
      reference,
      status: "FAILED",
      error: emailError?.message || String(emailError),
    });
    throw emailError;
  }

  return { receipt, invoice };
}
