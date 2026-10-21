import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import {
  dinnerAmountKes,
  TAMARIND_DINNER,
  PARTNERSHIP_DINNER,
  partnershipDinnerAmountKes,
  partnershipDinnerAmountUsd,
  formatPartnershipDinnerAmount,
} from "@/lib/dinner";
import {
  saveDinnerParticipant,
  saveTamarindDinnerParticipant,
  notifyAcfDinnerRegistration,
  emailTamarindRequestToGuest,
  ACF_EMAIL,
} from "@/lib/dinner/saveTamarindRequest";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://acf.uthabitiafrica.org";
}

async function startPaystack({
  email,
  amount,
  currency,
  reference,
  kind,
  fullName,
  extraMetadata,
}) {
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
        amount: Math.round(Number(amount) * 100),
        currency,
        reference,
        callback_url: `${siteUrl()}/payment-success`,
        channels:
          currency === "USD"
            ? ["card"]
            : ["card", "mobile_money", "bank_transfer"],
        metadata: {
          system: "acf-mombasa-2026",
          kind,
          custom_fields: [
            {
              display_name: "Guest",
              variable_name: "guest",
              value: fullName,
            },
            ...(extraMetadata || []),
          ],
        },
      }),
    }
  );

  const paystackData = await paystackRes.json();

  if (!paystackRes.ok || !paystackData?.data?.authorization_url) {
    const error = new Error(
      paystackData?.message || "Payment could not be started."
    );
    error.status = 502;
    throw error;
  }

  return paystackData.data.authorization_url;
}

async function sendPartnershipBankEmail({ booking, amountLabel, accountNumber }) {
  const paybill = PARTNERSHIP_DINNER.mpesa.paybill;
  try {
    await transporter.sendMail({
      from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      bcc: ACF_EMAIL,
      replyTo: ACF_EMAIL,
      subject: `${PARTNERSHIP_DINNER.title} booking – pay ${amountLabel} via M-Pesa Paybill ${paybill}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border:1px solid #e5e5e5; border-radius:8px;">
            <div style="background:#ea580c; padding:24px; color:white;">
              <h1 style="margin:0; font-size:22px;">${PARTNERSHIP_DINNER.title}</h1>
            </div>
            <div style="padding:30px; font-size:15px; line-height:1.6; color:#1f2937;">
              <p>Dear <strong>${booking.full_name}</strong>,</p>
              <p>Your place at the ACF Mombasa 2026 Dinner Cruise has been reserved. Please complete payment by M-Pesa using the details below.</p>
              <p>
                Venue: <strong>${PARTNERSHIP_DINNER.venue}</strong><br/>
                ${PARTNERSHIP_DINNER.venueDetail}<br/>
                Date: <strong>${PARTNERSHIP_DINNER.dateLabel}</strong><br/>
                Time: <strong>${PARTNERSHIP_DINNER.timeLabel}</strong><br/>
                Guests: <strong>${booking.adults}</strong><br/>
                Amount: <strong>${amountLabel}</strong>
              </p>
              <p>
                Paybill: <strong>${paybill}</strong><br/>
                Account number: <strong>${accountNumber}</strong><br/>
                You may use your name or ID number as the account number.
              </p>
              <p>Warm regards,<br/><strong>ACF Mombasa 2026 Secretariat</strong></p>
            </div>
          </div>
        </div>`,
    });
  } catch (error) {
    console.error("Partnership dinner bank email failed:", error);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const organization = String(body.organization || "").trim();
    const kind =
      String(body.kind || "tamarind").toLowerCase() === "partnership"
        ? "partnership"
        : "tamarind";
    const currency =
      String(body.currency || "KES").toUpperCase() === "USD" ? "USD" : "KES";

    if (!fullName || !email.includes("@") || !phone) {
      return Response.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    if (kind === "partnership") {
      const guests = Number(body.guests ?? body.adults);
      const idNumber = String(body.idNumber || "").trim();
      const dietary = String(body.notes || "").trim();
      const notes = [idNumber ? `ID: ${idNumber}` : null, dietary || null]
        .filter(Boolean)
        .join("\n") || null;

      if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
        return Response.json(
          { error: "Enter the number of guests (1–20)." },
          { status: 400 }
        );
      }

      const amountKes = partnershipDinnerAmountKes(guests);
      const amountUsd = partnershipDinnerAmountUsd(guests);
      const amountLabel = formatPartnershipDinnerAmount(guests, currency);
      const reference = `PARTNER-${crypto.randomUUID()}`;
      const accountNumber = idNumber || fullName;

      const booking = await prisma.dinner_booking_tbl.create({
        data: {
          full_name: fullName,
          email,
          phone,
          organization: organization || null,
          adults: guests,
          children: 0,
          amount_kes: amountKes,
          kind: "partnership",
          currency,
          notes,
          status: "PENDING",
          payment_reference: reference,
        },
      });

      await saveDinnerParticipant({
        kind: "partnership",
        fullName,
        email,
        phone,
        organization,
        adults: guests,
        children: 0,
        extraNote: `Paybill ${PARTNERSHIP_DINNER.mpesa.paybill}; account ${accountNumber}`,
      });

      await notifyAcfDinnerRegistration({
        kind: "partnership",
        fullName,
        email,
        phone,
        organization,
        adults: guests,
        children: 0,
        amountLabel,
        reference,
        extra: `Account number: ${accountNumber}`,
      });
      await sendPartnershipBankEmail({ booking, amountLabel, accountNumber });
      return Response.json({
        paymentMethod: "mpesa",
        currency,
        reference,
        amountKes,
        amountUsd,
        amountLabel,
        feeKes: PARTNERSHIP_DINNER.feeKes,
        feeUsd: PARTNERSHIP_DINNER.feeUsd,
        guests,
        accountNumber,
        mpesa: PARTNERSHIP_DINNER.mpesa,
      });
    }

    const existingReference = String(body.reference || "").trim();
    if (existingReference.startsWith("DHOW-") && Boolean(body.payNow)) {
      const existing = await prisma.dinner_booking_tbl.findUnique({
        where: { payment_reference: existingReference },
      });
      if (!existing || existing.kind !== "tamarind") {
        return Response.json(
          { error: "Dinner booking not found." },
          { status: 404 }
        );
      }
      const authorizationUrl = await startPaystack({
        email: existing.email,
        amount: existing.amount_kes,
        currency: "KES",
        reference: existingReference,
        kind: "tamarind-dinner",
        fullName: existing.full_name,
        extraMetadata: [
          {
            display_name: "Activity",
            variable_name: "activity",
            value: "Tamarind Dhow dinner cruise",
          },
        ],
      });
      return Response.json({
        registered: true,
        authorization_url: authorizationUrl,
        reference: existingReference,
        amountKes: existing.amount_kes,
        adultKes: TAMARIND_DINNER.adultKes,
        childKes: TAMARIND_DINNER.childKes,
      });
    }

    const adults = Number(body.adults);
    const children = Number(body.children || 0);

    if (
      !Number.isInteger(adults) ||
      !Number.isInteger(children) ||
      adults < 0 ||
      children < 0 ||
      adults > 20 ||
      children > 20 ||
      adults + children < 1
    ) {
      return Response.json(
        { error: "Enter the number of adults and children to pay for." },
        { status: 400 }
      );
    }

    const amountKes = dinnerAmountKes(adults, children);
    const reference = `DHOW-${crypto.randomUUID()}`;
    const payNow = Boolean(body.payNow);

    await prisma.dinner_booking_tbl.create({
      data: {
        full_name: fullName,
        email,
        phone,
        organization: organization || null,
        adults,
        children,
        amount_kes: amountKes,
        kind: "tamarind",
        currency: "KES",
        status: "PENDING",
        payment_reference: reference,
      },
    });

    await saveTamarindDinnerParticipant({
      fullName,
      email,
      phone,
      organization,
      adults,
      children,
    });

    await notifyAcfDinnerRegistration({
      kind: "tamarind",
      fullName,
      email,
      phone,
      organization,
      adults,
      children,
      reference,
    });
    await emailTamarindRequestToGuest({
      fullName,
      email,
      adults,
      children,
      reference,
    });

    if (!payNow) {
      return Response.json({
        registered: true,
        reference,
        amountKes,
        adultKes: TAMARIND_DINNER.adultKes,
        childKes: TAMARIND_DINNER.childKes,
      });
    }

    const authorizationUrl = await startPaystack({
      email,
      amount: amountKes,
      currency: "KES",
      reference,
      kind: "tamarind-dinner",
      fullName,
      extraMetadata: [
        {
          display_name: "Activity",
          variable_name: "activity",
          value: "Tamarind Dhow dinner cruise",
        },
      ],
    });

    return Response.json({
      registered: true,
      authorization_url: authorizationUrl,
      reference,
      amountKes,
      adultKes: TAMARIND_DINNER.adultKes,
      childKes: TAMARIND_DINNER.childKes,
    });
  } catch (error) {
    console.error("Dinner booking failed:", error);
    const status = error.status || 500;
    return Response.json(
      {
        error:
          status === 502
            ? error.message
            : "Could not start the dinner payment. Please try again.",
      },
      { status }
    );
  }
}
