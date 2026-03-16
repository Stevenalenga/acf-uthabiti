import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import crypto from "crypto";
import { conferenceRegistrationTemplate } from "@/lib/emailTemplate";
import { safeJson } from "@/lib/json";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      organization,
      country,
      profession,
      otherProfession,
      visaInfo,
      phase,
      type,
      accessibility,
      dietaryRestrictions,
      otherAccessibility,
      requiredTranslation,
      otherDietaryRestrictions,
      mediaConsent,
      reportConsent,
      emergencyContact,
      amount,
    } = body;

    const reference = `CONF-${crypto.randomUUID()}`;

    const participant = await prisma.participant_registration_tbl.create({
      data: {
        full_name: fullName,
        email,
        phone,
        organization,
        country,
        profession,
        other_profession: otherProfession,
        visa_info: visaInfo,
        phase,
        type,
        other_accessibility: otherAccessibility,
        required_translation: requiredTranslation,
        other_dietary_restrictions: otherDietaryRestrictions,
        media_consent: mediaConsent,
        report_consent: reportConsent,
        emergency_contact: emergencyContact,
        payment_reference: reference,

        accessibility: {
          create: accessibility.map((value) => ({
            value,
          })),
        },

        dietary: {
          create: dietaryRestrictions.map((value) => ({
            value,
          })),
        },
      },
    });

    // Create payment record
    await prisma.payment_tbl.create({
      data: {
        participant_id: participant.participant_id,
        amount: amount,
        method: phase === "LateOnsite" ? "ONSITE" : "PAYSTACK",
        status: "PENDING",
        payment_reference: reference,
      },
    });

    // Send confirmation email
    await transporter.sendMail({
      from: `"Conference Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Conference Registration Confirmation",
      html: conferenceRegistrationTemplate({
        name: fullName,
        phase,
        type,
        amount,
        paymentStatus: "PENDING",
      }),
    });

    return Response.json(
        safeJson({
        participantId: participant.participant_id,
      })
    );

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}