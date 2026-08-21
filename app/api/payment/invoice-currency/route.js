import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";
import {
  FAMILY_BANK_USD_TO_KES,
  convertUsdToKes,
  formatInvoiceAmount,
} from "@/lib/documents/constants";
import { issueRegistrationInvoice } from "@/lib/documents/issueInvoice";

export async function POST(req) {
  try {
    const body = await req.json();
    const { participantId, currency } = body || {};

    if (!participantId) {
      return Response.json(
        { error: "participantId is required" },
        { status: 400 }
      );
    }

    const invoiceCurrency =
      String(currency || "").toUpperCase() === "KES" ? "KES" : "USD";

    const participant = await prisma.participant_registration_tbl.findUnique({
      where: { participant_id: BigInt(participantId) },
    });

    if (!participant) {
      return Response.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    const payment = await prisma.payment_tbl.findFirst({
      where: { participant_id: BigInt(participantId) },
      orderBy: { createdAt: "desc" },
    });

    if (!payment) {
      return Response.json(
        { error: "Payment record missing" },
        { status: 400 }
      );
    }

    if (payment.status === "SUCCESS") {
      return Response.json(
        { error: "Payment already completed" },
        { status: 400 }
      );
    }

    const document = await issueRegistrationInvoice({
      participant,
      payment,
      eventId: participant.event_id,
      currency: invoiceCurrency,
      forceNew: false,
      skipEmail: false,
    });

    const usdAmount = Number(payment.amount);
    const kesAmount = convertUsdToKes(usdAmount);

    return Response.json(
      safeJson({
        ok: true,
        invoiceNumber: document.document_number,
        currency: document.currency,
        amount: document.amount,
        amountLabel: formatInvoiceAmount(document.amount, document.currency),
        usdAmount,
        kesAmount,
        exchangeRate: FAMILY_BANK_USD_TO_KES,
        emailedTo: participant.email,
      })
    );
  } catch (error) {
    console.error("Invoice currency request failed:", error);
    return Response.json(
      { error: error?.message || "Could not issue invoice" },
      { status: 500 }
    );
  }
}
