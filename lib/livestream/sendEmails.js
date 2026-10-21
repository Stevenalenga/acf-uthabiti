import { transporter } from "@/lib/mailer";
import { logMail } from "@/lib/mailLog";
import {
  livestreamInvoiceEmailTemplate,
  livestreamAccessEmailTemplate,
} from "@/lib/emailTemplate";
import { REGISTRATION_SUPPORT_EMAIL } from "@/lib/sendPaymentConfirmationEmail";
import { livestreamWatchUrl } from "@/lib/livestream";
import { issueLivestreamInvoice } from "@/lib/livestream/issueInvoice";
import { prisma } from "@/lib/prisma";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendLivestreamPaidEmails(purchase, { force = false } = {}) {
  const issued = await issueLivestreamInvoice(purchase);
  const current = issued.purchase;
  const name = escapeHtml(current.full_name);
  const watchUrl = livestreamWatchUrl(current.access_token);

  if (force || !current.invoice_emailed_at) {
    try {
      const attachments =
        issued.buffer && issued.fileName
          ? [
              {
                filename: issued.fileName,
                content: issued.buffer,
                contentType: "application/pdf",
              },
            ]
          : [];

      await transporter.sendMail({
        from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
        to: current.email,
        replyTo: REGISTRATION_SUPPORT_EMAIL,
        subject: `Livestream invoice ${issued.invoiceNumber || ""} – ACF Mombasa 2026`.trim(),
        html: livestreamInvoiceEmailTemplate({
          name,
          invoiceNumber: issued.invoiceNumber,
          amountUsd: current.amount_usd,
          reference: current.payment_reference,
        }),
        attachments,
      });

      await prisma.livestream_purchase_tbl.update({
        where: { purchase_id: current.purchase_id },
        data: { invoice_emailed_at: new Date() },
      });

      await logMail({
        kind: "LIVESTREAM_INVOICE",
        to: current.email,
        document: issued.invoiceNumber,
        reference: current.payment_reference,
        status: "SENT",
      });
    } catch (error) {
      console.error("Livestream invoice email failed:", error);
      await logMail({
        kind: "LIVESTREAM_INVOICE",
        to: current.email,
        document: issued.invoiceNumber,
        reference: current.payment_reference,
        status: "FAILED",
        error: error?.message || String(error),
      });
    }
  }

  if (force || !current.link_emailed_at) {
    try {
      await transporter.sendMail({
        from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
        to: current.email,
        replyTo: REGISTRATION_SUPPORT_EMAIL,
        subject: "Your ACF Mombasa 2026 livestream access link",
        html: livestreamAccessEmailTemplate({
          name,
          watchUrl,
          invoiceNumber: issued.invoiceNumber,
          amountUsd: current.amount_usd,
        }),
      });

      await prisma.livestream_purchase_tbl.update({
        where: { purchase_id: current.purchase_id },
        data: { link_emailed_at: new Date() },
      });

      await logMail({
        kind: "LIVESTREAM_LINK",
        to: current.email,
        document: issued.invoiceNumber,
        reference: current.payment_reference,
        status: "SENT",
      });
    } catch (error) {
      console.error("Livestream access email failed:", error);
      await logMail({
        kind: "LIVESTREAM_LINK",
        to: current.email,
        document: issued.invoiceNumber,
        reference: current.payment_reference,
        status: "FAILED",
        error: error?.message || String(error),
      });
    }
  }

  return { watchUrl, invoiceNumber: issued.invoiceNumber };
}
