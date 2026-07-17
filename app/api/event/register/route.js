import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";
import { issueRegistrationInvoice } from "@/lib/documents/issueInvoice";

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

    const event = await prisma.event_tbl.findFirst({
      where: { isActive: true },
    });

    if (!event) {
      return Response.json(
        { error: "No active conference event is configured. Please contact support." },
        { status: 503 }
      );
    }

    const existingParticipant = await prisma.participant_registration_tbl.findFirst({
      where: { email, event_id: event.event_id },
      include: {
        payments: {
          orderBy: { payment_id: "desc" },
          take: 1,
        },
        documents: {
          where: { type: "INVOICE", status: { not: "VOID" } },
          orderBy: { document_id: "desc" },
          take: 1,
        },
      },
    });

    if (existingParticipant) {
      const payment = existingParticipant.payments?.[0];

      if (payment) {
        return Response.json(
          safeJson({
            participantId: existingParticipant.participant_id,
            paymentStatus: payment.status,
            reference: payment.payment_reference,
            invoiceNumber: existingParticipant.documents?.[0]?.document_number || null,
          })
        );
      }
    }

    const participant = await prisma.participant_registration_tbl.create({
      data: {
        event_id: event.event_id,
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

        accessibility: {
          create: accessibility.map((value) => ({ value })),
        },

        dietary: {
          create: dietaryRestrictions.map((value) => ({ value })),
        },
      },
    });

    const payment = await prisma.payment_tbl.create({
      data: {
        participant_id: participant.participant_id,
        amount: amount,
        method: phase === "LateOnsite" ? "ONSITE" : "PAYSTACK",
        status: "PENDING",
      },
    });

    let invoice;
    try {
      invoice = await issueRegistrationInvoice({
        participant,
        payment,
        eventId: event.event_id,
      });
    } catch (docError) {
      console.error("Invoice generation failed:", docError);
    }

    return Response.json(
      safeJson({
        participantId: participant.participant_id,
        paymentStatus: "PENDING",
        invoiceNumber: invoice?.document_number || null,
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
