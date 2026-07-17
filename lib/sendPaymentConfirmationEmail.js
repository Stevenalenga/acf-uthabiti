import { transporter } from "@/lib/mailer";
import { paymentSuccessTemplate } from "@/lib/emailTemplate";
import { issuePaymentReceipt } from "@/lib/documents/issueReceipt";

export const REGISTRATION_SUPPORT_EMAIL = "acf@uthabitiafrica.org";

export async function sendPaymentConfirmationEmail({
  participant,
  payment,
  amount,
  reference,
  paidAt = new Date(),
}) {
  const { buffer, fileName, receipt, invoice } = await issuePaymentReceipt({
    participant,
    payment,
    paymentReference: reference,
    paidAt,
  });

  const attachments = buffer
    ? [
        {
          filename: fileName,
          content: buffer,
          contentType: "application/pdf",
        },
      ]
    : [];

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

  return { receipt, invoice };
}
