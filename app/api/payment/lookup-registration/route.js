import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";
import {
  ORGANIZATION,
  TYPE_LABELS,
  PHASE_LABELS,
} from "@/lib/documents/constants";

/**
 * Looks up an existing registration by invoice (registration) number and the
 * email used during registration, so the participant can complete payment
 * online via Paystack.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const rawNumber = String(body.invoiceNumber || "").trim().toUpperCase();
    const email = String(body.email || "").trim().toLowerCase();

    if (!rawNumber) {
      return Response.json(
        { error: "Please enter your registration / invoice number." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return Response.json(
        { error: "Please enter the email used during registration." },
        { status: 400 }
      );
    }

    const include = {
      participant: {
        include: {
          payments: { orderBy: { payment_id: "desc" }, take: 1 },
        },
      },
    };

    // Exact invoice number match first (e.g. ACF2026/086/2026)
    let doc = await prisma.registration_document_tbl.findFirst({
      where: {
        type: "INVOICE",
        status: { not: "VOID" },
        document_number: rawNumber,
      },
      orderBy: { document_id: "desc" },
      include,
    });

    // Allow entering just the sequence number (e.g. "86" or "086")
    if (!doc && /^\d+$/.test(rawNumber)) {
      const padded = rawNumber.padStart(3, "0");
      doc = await prisma.registration_document_tbl.findFirst({
        where: {
          type: "INVOICE",
          status: { not: "VOID" },
          document_number: {
            startsWith: `${ORGANIZATION.eventCode}/`,
            contains: `/${padded}/`,
          },
        },
        orderBy: { document_id: "desc" },
        include,
      });
    }

    if (!doc || !doc.participant) {
      return Response.json(
        {
          error:
            "No registration was found for this invoice number. Please check the number on your invoice email and try again.",
        },
        { status: 404 }
      );
    }

    const participant = doc.participant;

    if (participant.email.trim().toLowerCase() !== email) {
      return Response.json(
        {
          error:
            "The email does not match this registration. Please use the same email from your original registration.",
        },
        { status: 400 }
      );
    }

    const payment = participant.payments?.[0];

    if (!payment) {
      return Response.json(
        {
          error:
            "No payment record was found for this registration. Please contact support.",
        },
        { status: 400 }
      );
    }

    if (participant.paid || payment.status === "SUCCESS") {
      return Response.json(
        {
          error:
            "This registration is already fully paid. If you believe this is an error, please contact support.",
        },
        { status: 400 }
      );
    }

    return Response.json(
      safeJson({
        participantId: participant.participant_id,
        fullName: participant.full_name,
        email: participant.email,
        organization: participant.organization,
        phase: PHASE_LABELS[participant.phase] || participant.phase,
        type: TYPE_LABELS[participant.type] || participant.type,
        amount: payment.amount,
        invoiceNumber: doc.document_number,
      })
    );
  } catch (error) {
    console.error("Registration lookup failed:", error);
    return Response.json(
      { error: "Lookup failed. Please try again or contact support." },
      { status: 500 }
    );
  }
}
