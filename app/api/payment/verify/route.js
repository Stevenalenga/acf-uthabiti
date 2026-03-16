import { prisma } from "@/lib/prisma";

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
    });

    if (!payment) {
      return Response.json({ error: "Payment not found" }, { status: 404 });
    }

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
        data: {
          paid: true,
        },
      }),
    ]);

    return Response.json({ success: true });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}