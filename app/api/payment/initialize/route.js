import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";

export async function POST(req) {
  try {

    const body = await req.json();
    const { participantId } = body;

    if (!participantId) {
      return Response.json(
        { error: "participantId is required" },
        { status: 400 }
      );
    }

    const participant = await prisma.participant_registration_tbl.findUnique({
      where: {
        participant_id: BigInt(participantId),
      },
      include: {
        payments: true,
      },
    });

    if (!participant) {
      return Response.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    const payment = participant.payments?.[0];

    if (!payment) {
      return Response.json(
        { error: "Payment record missing" },
        { status: 400 }
      );
    }

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: participant.email,
          full_name: participant.full_name,
          amount: Number(payment.amount) * 129,
          currency: "KES",
          reference: payment.payment_reference,
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success`,
          metadata: {
            participant_id: participantId,
          },
        }),
      }
    );

    const data = await paystackRes.json();

    /* Paystack error handling */

    if (!data.status) {
      console.error("Paystack error:", data);

      return Response.json(
        { error: data.message || "Payment initialization failed" },
        { status: 400 }
      );
    }

    return Response.json(
      safeJson({
        authorization_url: data.data.authorization_url,
      })
    );

  } catch (error) {

    console.error("Payment init error:", error);

    return Response.json(
      { error: "Initialization failed" },
      { status: 500 }
    );
  }
}