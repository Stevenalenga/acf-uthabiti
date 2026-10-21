import { safeJson } from "@/lib/json";
import { addFromRegistration } from "@/lib/logbook";

export async function POST(_req, { params }) {
  try {
    const { id } = await params;
    const result = await addFromRegistration({ participantId: id });
    return Response.json(
      safeJson({
        success: true,
        alreadyAdded: result.alreadyAdded,
        message: result.alreadyAdded
          ? "Already in the participants logbook"
          : "Added to the participants logbook",
      })
    );
  } catch (error) {
    console.error("Add to logbook failed:", error);
    return Response.json(
      { error: error.message || "Unable to add to the logbook" },
      { status: 400 }
    );
  }
}
