import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  LIVESTREAM,
  livestreamKesAmount,
} from "@/lib/livestream";
import { FAMILY_BANK_USD_TO_KES } from "@/lib/documents/constants";

export async function POST(req) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const organization = String(body.organization || "").trim();

    if (!fullName || !email.includes("@") || !phone) {
      return Response.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const amountUsd = LIVESTREAM.usd;
    const amountKes = livestreamKesAmount(amountUsd);
    const reference = `LIVE-${crypto.randomUUID()}`;
    const accessToken = crypto.randomBytes(24).toString("base64url");

    await prisma.livestream_purchase_tbl.create({
      data: {
        full_name: fullName,
        email,
        phone,
        organization: organization || null,
        amount_usd: amountUsd,
        amount_kes: amountKes,
        currency: "USD",
        status: "PENDING",
        payment_reference: reference,
        access_token: accessToken,
      },
    });

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amountKes * 100),
          currency: "KES",
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success`,
          channels: ["card", "mobile_money", "bank_transfer"],
          metadata: {
            system: "acf-mombasa-2026",
            kind: "livestream",
            custom_fields: [
              {
                display_name: "Activity",
                variable_name: "activity",
                value: LIVESTREAM.title,
              },
              {
                display_name: "Viewer",
                variable_name: "viewer",
                value: fullName,
              },
            ],
          },
        }),
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData?.data?.authorization_url) {
      return Response.json(
        { error: paystackData?.message || "Payment could not be started." },
        { status: 502 }
      );
    }

    return Response.json({
      authorization_url: paystackData.data.authorization_url,
      reference,
      amountUsd,
      amountKes,
      exchangeRate: FAMILY_BANK_USD_TO_KES,
    });
  } catch (error) {
    console.error("Livestream checkout failed:", error);
    return Response.json(
      { error: "Could not start the livestream payment. Please try again." },
      { status: 500 }
    );
  }
}
