import { safeJson } from "@/lib/json";
import {
  addFromRegistration,
  buildLogbookRows,
  isValidLogbookToken,
  saveLogbookPhoto,
  searchRegistrationsForLogbook,
  setLogbookListingStatus,
  upsertLogbookEntry,
} from "@/lib/logbook";

function splitLogbookRows(rows) {
  return {
    data: rows.filter((row) => row.status === "PUBLISHED"),
    pending: rows.filter((row) => row.status === "PENDING"),
  };
}

function unauthorized() {
  return Response.json({ error: "Not found" }, { status: 404 });
}

export async function GET(req, { params }) {
  try {
    const { token } = await params;
    if (!isValidLogbookToken(token)) return unauthorized();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const rows = await buildLogbookRows();
    const matches = await searchRegistrationsForLogbook(q);
    const split = splitLogbookRows(rows);
    return Response.json(
      safeJson({
        data: split.data,
        pending: split.pending,
        matches,
        total: split.data.length,
        pendingCount: split.pending.length,
        registered: split.data.filter((row) => row.source === "registration").length,
        logbookOnly: split.data.filter((row) => row.source === "logbook").length,
      })
    );
  } catch (error) {
    console.error("Logbook GET failed:", error);
    return Response.json({ error: "Unable to load logbook" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { token } = await params;
    if (!isValidLogbookToken(token)) return unauthorized();

    const contentType = req.headers.get("content-type") || "";
    let payload;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const photo = form.get("photo");
      payload = {
        logbookId: form.get("logbookId"),
        fullName: form.get("fullName"),
        email: form.get("email"),
        phone: form.get("phone"),
        organization: form.get("organization"),
        country: form.get("country"),
        role: form.get("role"),
        isSpeaker: form.get("isSpeaker"),
        bio: form.get("bio"),
        emergencyContact: form.get("emergencyContact"),
      };
      const photoFile = await saveLogbookPhoto(photo);
      if (photoFile) payload.photoFile = photoFile;
    } else {
      payload = await req.json();
    }

    if (payload?.action === "setStatus") {
      await setLogbookListingStatus({
        logbookId: payload.logbookId,
        status: payload.status,
      });
      const rows = await buildLogbookRows();
      const split = splitLogbookRows(rows);
      return Response.json(
        safeJson({
          success: true,
          data: split.data,
          pending: split.pending,
          total: split.data.length,
        })
      );
    }

    if (
      payload?.action === "addFromRegistration" ||
      payload?.addFromEmail ||
      payload?.addFromParticipantId
    ) {
      const result = await addFromRegistration({
        email: payload.addFromEmail || payload.email,
        participantId: payload.addFromParticipantId || payload.participantId,
        role: payload.role,
        isSpeaker: payload.isSpeaker,
      });
      const rows = await buildLogbookRows();
      const split = splitLogbookRows(rows);
      return Response.json(
        safeJson({
          success: true,
          alreadyAdded: result.alreadyAdded,
          confirmed: result.confirmed,
          data: split.data,
          pending: split.pending,
          total: split.data.length,
        })
      );
    }

    await upsertLogbookEntry(payload);
    const rows = await buildLogbookRows();
    const split = splitLogbookRows(rows);
    return Response.json(
      safeJson({
        success: true,
        data: split.data,
        pending: split.pending,
        total: split.data.length,
      })
    );
  } catch (error) {
    console.error("Logbook POST failed:", error);
    return Response.json(
      { error: error.message || "Unable to save logbook entry" },
      { status: 400 }
    );
  }
}
