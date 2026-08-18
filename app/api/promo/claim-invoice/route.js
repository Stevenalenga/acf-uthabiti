import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";
import {
  issueRegistrationInvoice,
  sendInvoiceEmail,
} from "@/lib/documents/issueInvoice";
import {
  TYPE_LABELS,
  formatPromoEndDate,
  getPromoClaimFee,
  isPromoActive,
  isValidPromoClaimCode,
} from "@/lib/documents/constants";

export async function POST(req) {
  try {
    if (!isPromoActive()) {
      return Response.json(
        {
          error: `This discount offer ended on ${formatPromoEndDate()}.`,
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const code = String(body.code || "").trim();

    if (!email || !email.includes("@")) {
      return Response.json(
        { error: "Please enter the email used during registration." },
        { status: 400 }
      );
    }

    if (!isValidPromoClaimCode(code)) {
      return Response.json(
        { error: "Invalid discount code. Please check and try again." },
        { status: 400 }
      );
    }

    const event = await prisma.event_tbl.findFirst({
      where: { isActive: true },
    });

    if (!event) {
      return Response.json(
        { error: "No active conference event is configured." },
        { status: 503 }
      );
    }

    const participant = await prisma.participant_registration_tbl.findFirst({
      where: {
        event_id: event.event_id,
        email: {
          equals: email,
        },
      },
      include: {
        payments: {
          orderBy: { payment_id: "desc" },
          take: 1,
        },
      },
    });

    if (!participant) {
      // Fallback for case-sensitive MySQL collations
      const allForEvent = await prisma.participant_registration_tbl.findMany({
        where: { event_id: event.event_id },
        include: {
          payments: {
            orderBy: { payment_id: "desc" },
            take: 1,
          },
        },
      });
      const matched = allForEvent.find(
        (row) => row.email.trim().toLowerCase() === email
      );

      if (!matched) {
        return Response.json(
          {
            error:
              "No registration was found for this email. Please use the same email from your original registration.",
          },
          { status: 404 }
        );
      }

      return applyPromoToParticipant(matched, event.event_id);
    }

    return applyPromoToParticipant(participant, event.event_id);
  } catch (error) {
    console.error("Promo claim failed:", error);
    return Response.json(
      { error: "Could not update your invoice. Please try again or contact support." },
      { status: 500 }
    );
  }
}

async function applyPromoToParticipant(participant, eventId) {
  const payment = participant.payments?.[0];

  if (!payment) {
    return Response.json(
      { error: "No payment record was found for this registration." },
      { status: 400 }
    );
  }

  if (participant.paid || payment.status === "SUCCESS") {
    return Response.json(
      {
        error:
          "This registration is already marked as paid, so the discount invoice cannot be issued.",
      },
      { status: 400 }
    );
  }

  const promoAmount = getPromoClaimFee(participant.type);
  if (promoAmount == null) {
    return Response.json(
      {
        error:
          "This discount applies to East Africa and International registrations only.",
      },
      { status: 400 }
    );
  }

  if (Number(payment.amount) < promoAmount) {
    return Response.json(
      {
        error: `Your current unpaid amount ($${payment.amount}) is already lower than the discount rate.`,
      },
      { status: 400 }
    );
  }

  const updatedPayment = await prisma.$transaction(async (tx) => {
    await tx.registration_document_tbl.updateMany({
      where: {
        participant_id: participant.participant_id,
        payment_id: payment.payment_id,
        type: "INVOICE",
        status: { not: "VOID" },
      },
      data: { status: "VOID" },
    });

    return tx.payment_tbl.update({
      where: { payment_id: payment.payment_id },
      data: {
        amount: promoAmount,
        status: "PENDING",
      },
    });
  });

  const invoice = await issueRegistrationInvoice({
    participant,
    payment: updatedPayment,
    eventId,
    skipEmail: true,
  });

  const sent = await sendInvoiceEmail({
    participant,
    payment: updatedPayment,
    document: invoice,
  });

  if (!sent) {
    return Response.json(
      {
        error: `Your fee was updated to $${promoAmount}, but the invoice email failed to send. Please contact support.`,
        amount: promoAmount,
        invoiceNumber: invoice.document_number,
      },
      { status: 502 }
    );
  }

  return Response.json(
    safeJson({
      success: true,
      message: `A new invoice for $${promoAmount} USD has been emailed to ${participant.email}.`,
      amount: promoAmount,
      type: TYPE_LABELS[participant.type] || participant.type,
      invoiceNumber: invoice.document_number,
      email: participant.email,
      fullName: participant.full_name,
    })
  );
}
