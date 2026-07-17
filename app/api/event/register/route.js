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

    if (!email?.trim() || !fullName?.trim()) {
      return Response.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    if (amount == null || Number.isNaN(Number(amount))) {
      return Response.json(
        { error: "Registration fee is missing. Please select phase and type." },
        { status: 400 }
      );
    }

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
      where: { email: email.trim(), event_id: event.event_id },
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
      const existingPayment = existingParticipant.payments?.[0];

      if (existingPayment) {
        // Re-issue (or resend) the invoice so users who never received the
        // email get it when they come back and register again.
        let invoiceNumber =
          existingParticipant.documents?.[0]?.document_number || null;

        if (existingPayment.status !== "SUCCESS") {
          try {
            const invoice = await issueRegistrationInvoice({
              participant: existingParticipant,
              payment: existingPayment,
              eventId: event.event_id,
            });
            invoiceNumber = invoice?.document_number || invoiceNumber;
          } catch (docError) {
            console.error(
              "Invoice re-issue failed:",
              docError?.message || docError
            );
          }
        }

        return Response.json(
          safeJson({
            participantId: existingParticipant.participant_id,
            paymentStatus: existingPayment.status,
            reference: existingPayment.payment_reference,
            invoiceNumber,
          })
        );
      }

      const resumedPayment = await prisma.payment_tbl.create({
        data: {
          participant_id: existingParticipant.participant_id,
          amount: Number(amount),
          method: phase === "LateOnsite" ? "ONSITE" : "PAYSTACK",
          status: "PENDING",
        },
      });

      let invoiceNumber = null;
      try {
        const invoice = await issueRegistrationInvoice({
          participant: existingParticipant,
          payment: resumedPayment,
          eventId: event.event_id,
        });
        invoiceNumber = invoice?.document_number || null;
  } catch (docError) {
    console.error(
      "Invoice generation failed:",
      docError?.message || docError,
      docError?.stack
    );
  }

      return Response.json(
        safeJson({
          participantId: existingParticipant.participant_id,
          paymentStatus: "PENDING",
          invoiceNumber,
        })
      );
    }

    const { participant, payment } = await prisma.$transaction(async (tx) => {
      const createdParticipant = await tx.participant_registration_tbl.create({
        data: {
          event_id: event.event_id,
          full_name: fullName.trim(),
          email: email.trim(),
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
            create: (accessibility || []).map((value) => ({ value })),
          },
          dietary: {
            create: (dietaryRestrictions || []).map((value) => ({ value })),
          },
        },
      });

      const createdPayment = await tx.payment_tbl.create({
        data: {
          participant_id: createdParticipant.participant_id,
          amount: Number(amount),
          method: phase === "LateOnsite" ? "ONSITE" : "PAYSTACK",
          status: "PENDING",
        },
      });

      return { participant: createdParticipant, payment: createdPayment };
    });

    let invoiceNumber = null;
    try {
      const invoice = await issueRegistrationInvoice({
        participant,
        payment,
        eventId: event.event_id,
      });
      invoiceNumber = invoice?.document_number || null;
    } catch (docError) {
      console.error(
        "Invoice generation failed:",
        docError?.message || docError,
        docError?.stack
      );
    }

    return Response.json(
      safeJson({
        participantId: participant.participant_id,
        paymentStatus: "PENDING",
        invoiceNumber,
      })
    );
  } catch (error) {
    console.error("Registration failed:", error);

    if (error.code === "P2002") {
      return Response.json(
        { error: "This email is already registered for the conference." },
        { status: 409 }
      );
    }

    return Response.json(
      { error: "Registration failed. Please try again or contact support." },
      { status: 500 }
    );
  }
}
