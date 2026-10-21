import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmationEmail } from "@/lib/sendPaymentConfirmationEmail";
import { settleDinnerPayment } from "@/lib/dinner/settleDinnerPayment";
import { settleLivestreamPayment } from "@/lib/livestream/settleLivestreamPayment";
import { isDinnerPaymentReference } from "@/lib/dinner";

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

    if (isDinnerPaymentReference(reference)) {
      const settled = await settleDinnerPayment(reference, "success");
      if (!settled.found) {
        return Response.json({ error: "Payment not found" }, { status: 404 });
      }
      return Response.json({
        success: true,
        kind: settled.kind === "partnership" ? "partnership-dinner" : "dinner",
      });
    }

    if (String(reference).startsWith("LIVE-")) {
      const settled = await settleLivestreamPayment(reference, "success");
      if (!settled.found) {
        return Response.json({ error: "Payment not found" }, { status: 404 });
      }
      return Response.json({ success: true, kind: "livestream" });
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
