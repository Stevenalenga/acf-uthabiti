import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import { paymentFailedTemplate } from "@/lib/emailTemplate";
import { sendPaymentConfirmationEmail } from "@/lib/sendPaymentConfirmationEmail";

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

  const payment = await prisma.payment_tbl.findFirst({
    where: { payment_reference: reference },
    include: {
      participant: true,
    },
  });

  if (!payment) {
    return new Response("Payment not found", { status: 200 });
  }

  const participant = payment.participant;

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
      await sendPaymentConfirmationEmail({
        participant,
        payment: { ...payment, status: "SUCCESS", paidAt: new Date() },
        amount: payment.amount,
        reference,
        paidAt: new Date(),
      });
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