import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmationEmail } from "@/lib/sendPaymentConfirmationEmail";

export async function POST(req) {
  try {
    const { reference } = await req.json();

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    if (!data.status || data.data.status !== "success") {
      return Response.json({ success: false }, { status: 400 });
    }

    const payment = await prisma.payment_tbl.findFirst({
      where: { payment_reference: reference },
      include: {
        registration: true,
      },
    });

    if (!payment) {
      return Response.json({ error: "Payment not found" }, { status: 404 });
    }

    const alreadyConfirmed = payment.status === "SUCCESS";
    const paidAt = new Date();

    await prisma.$transaction([
      prisma.payment_tbl.update({
        where: { payment_id: payment.payment_id },
        data: {
          status: "SUCCESS",
          paidAt,
        },
      }),

      prisma.participant_registration_tbl.update({
        where: { participant_id: payment.participant_id },
        data: {
          paid: true,
        },
      }),
    ]);

    if (!alreadyConfirmed) {
      try {
        await sendPaymentConfirmationEmail({
          participant: payment.registration,
          payment: { ...payment, status: "SUCCESS", paidAt },
          amount: payment.amount,
          reference,
          paidAt,
        });
      } catch (emailError) {
        // Payment is already marked SUCCESS; do not fail the request because
        // the confirmation email could not be sent. The webhook retries later.
        console.error("Payment confirmation email failed:", emailError);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
