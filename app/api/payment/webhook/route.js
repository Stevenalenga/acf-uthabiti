import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import { paymentFailedTemplate } from "@/lib/emailTemplate";
import { sendPaymentConfirmationEmail } from "@/lib/sendPaymentConfirmationEmail";
import { settleDinnerPayment } from "@/lib/dinner/settleDinnerPayment";
import { settleLivestreamPayment } from "@/lib/livestream/settleLivestreamPayment";
import { isDinnerPaymentReference } from "@/lib/dinner";

export async function POST(req) {

  const body = await req.text();

  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);

  const reference = event.data?.reference;

  if (!reference) {
    return new Response("No reference", { status: 200 });
  }

  if (isDinnerPaymentReference(reference)) {
    const outcome =
      event.event === "charge.success"
        ? "success"
        : event.event === "charge.failed"
          ? "failed"
          : null;
    if (outcome) {
      await settleDinnerPayment(reference, outcome);
    }
    return new Response("OK", { status: 200 });
  }

  if (String(reference).startsWith("LIVE-")) {
    const outcome =
      event.event === "charge.success"
        ? "success"
        : event.event === "charge.failed"
          ? "failed"
          : null;
    if (outcome) {
      await settleLivestreamPayment(reference, outcome);
    }
    return new Response("OK", { status: 200 });
  }

  const payment = await prisma.payment_tbl.findFirst({
    where: { payment_reference: reference },
    include: {
      registration: true,
    },
  });

  if (!payment) {
    return new Response("Payment not found", { status: 200 });
  }

  const participant = payment.registration;

  /* ---------------- SUCCESS ---------------- */

  if (event.event === "charge.success") {
    const alreadyConfirmed = payment.status === "SUCCESS";

    await prisma.$transaction([
      prisma.payment_tbl.update({
        where: { payment_id: payment.payment_id },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
        },
      }),

      prisma.participant_registration_tbl.update({
        where: { participant_id: payment.participant_id },
        data: { paid: true },
      }),
    ]);

    if (!alreadyConfirmed) {
      try {
        await sendPaymentConfirmationEmail({
          participant,
          payment: { ...payment, status: "SUCCESS", paidAt: new Date() },
          amount: payment.amount,
          reference,
          paidAt: new Date(),
        });
      } catch (emailError) {
        console.error("Payment confirmation email failed:", emailError);
      }
    }
  }

  /* ---------------- FAILED ---------------- */

  if (event.event === "charge.failed") {

    await prisma.payment_tbl.update({
      where: { payment_id: payment.payment_id },
      data: {
        status: "FAILED",
      },
    });

    await transporter.sendMail({
      from: `"Conference Team" <${process.env.EMAIL_USER}>`,
      to: participant.email,
      subject: "Payment Failed - Conference Registration",
      html: paymentFailedTemplate({
        name: participant.full_name,
        phase: participant.phase,
        type: participant.type,
        amount: payment.amount,
        reference,
      }),
    });
  }

  return new Response("OK", { status: 200 });
}