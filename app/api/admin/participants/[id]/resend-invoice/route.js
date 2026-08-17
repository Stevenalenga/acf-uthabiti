import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";
import {
  issueRegistrationInvoice,
  sendInvoiceEmail,
} from "@/lib/documents/issueInvoice";

export async function POST(_req, { params }) {
  try {
    const { id } = await params;
    const participantId = BigInt(id);

    const participant = await prisma.participant_registration_tbl.findUnique({
      where: { participant_id: participantId },
    });

    if (!participant) {
      return Response.json({ error: "Participant not found" }, { status: 404 });
    }

    const payment = await prisma.payment_tbl.findFirst({
      where: { participant_id: participantId },
      orderBy: { payment_id: "desc" },
    });

    if (!payment) {
      return Response.json(
        { error: "No payment record found for this registration." },
        { status: 400 }
      );
    }

    // Create invoice if missing; skip email here so we can report send status.
    const invoice = await issueRegistrationInvoice({
      participant,
      payment,
      eventId: participant.event_id,
      skipEmail: true,
    });

    const sent = await sendInvoiceEmail({
      participant,
      payment,
      document: invoice,
    });

    if (!sent) {
      return Response.json(
        {
          error: `Invoice ${invoice.document_number} is ready, but the email to ${participant.email} failed to send.`,
        },
        { status: 502 }
      );
    }

    return Response.json(
      safeJson({
        success: true,
        message: `Invoice ${invoice.document_number} emailed to ${participant.email}`,
        invoiceNumber: invoice.document_number,
        email: participant.email,
      })
    );
  } catch (error) {
    console.error("Resend invoice failed:", error);
    return Response.json(
      { error: "Failed to resend invoice email. Please try again." },
      { status: 500 }
    );
  }
}
