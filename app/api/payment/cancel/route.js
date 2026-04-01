// /api/payment/cancel

import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { participantId } = await req.json();

    const payment = await prisma.payment_tbl.findFirst({
      where: { participant_id: BigInt(participantId) },
      orderBy: { payment_id: "desc" },
    });

    if (!payment) {
      return Response.json({ error: "Payment not found" }, { status: 404 });
    }

    await prisma.payment_tbl.update({
      where: { payment_id: payment.payment_id },
      data: { status: "FAILED" },
    });

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}