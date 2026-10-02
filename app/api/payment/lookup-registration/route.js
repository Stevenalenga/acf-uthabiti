import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";
import {
  ORGANIZATION,
  TYPE_LABELS,
  PHASE_LABELS,
} from "@/lib/documents/constants";
import {
  invoiceNumberCandidates,
} from "@/lib/payment/invoiceNumber";

/**
 * Looks up an existing registration by invoice (registration) number and the
 * email used during registration, so the participant can complete payment
 * online via Paystack.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const rawInput = String(body.invoiceNumber || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const { normalized, candidates, seq } = invoiceNumberCandidates(rawInput);

    if (!normalized) {
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

    let doc = null;

    for (const candidate of candidates) {
      doc = await prisma.registration_document_tbl.findFirst({
        where: {
          type: "INVOICE",
          status: { not: "VOID" },
          document_number: candidate,
        },
        orderBy: { document_id: "desc" },
        include,
      });
      if (doc) break;
    }

    // Fallback: sequence-only contains match (handles odd formatting)
    if (!doc && seq) {
      doc = await prisma.registration_document_tbl.findFirst({
        where: {
          type: "INVOICE",
          status: { not: "VOID" },
          document_number: {
            startsWith: `${ORGANIZATION.eventCode}/`,
            contains: `/${seq}/`,
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
            "Invoice not found. Please enter the invoice number exactly as shown on your invoice (for example ACF2026/086/2026) and try again.",
        },
        { status: 404 }
      );
    }

    const participant = doc.participant;

    if (participant.email.trim().toLowerCase() !== email) {
      return Response.json(
        {
          error:
            "The email does not match this invoice. Please use the same email the invoice was sent to.",
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

    // Prefer the issued invoice amount/currency for display when available
    const amountDue =
      doc.currency === "KES" ? Number(doc.amount) : Number(payment.amount);
    const currency = doc.currency === "KES" ? "KES" : "USD";

    return Response.json(
      safeJson({
        participantId: participant.participant_id,
        fullName: participant.full_name,
        email: participant.email,
        organization: participant.organization,
        phase: PHASE_LABELS[participant.phase] || participant.phase,
        type: TYPE_LABELS[participant.type] || participant.type,
        amount: amountDue,
        currency,
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
