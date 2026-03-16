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

          amount: Number(payment.amount) * 129 * 100, // Paystack expects kobo/cents
          currency: "KES",

          reference: payment.payment_reference,

          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success`,

          /* FORCE CARD ONLY */

          payment_options: "card",
          channels: ["card"],

          /* IMPORTANT FOR MULTI-SITE WEBHOOK */

          metadata: {
            system: "acf-mombasa-2026",
            participant_id: participantId,

            custom_fields: [
              {
                display_name: "Conference",
                variable_name: "conference",
                value: "ACF Mombasa 2026",
              },
              {
                display_name: "Participant",
                variable_name: "participant",
                value: participant.full_name,
              },
            ],
          },
        }),
      }
    );

    const data = await paystackRes.json();

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