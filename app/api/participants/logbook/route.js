import { safeJson } from "@/lib/json";
import {
  buildPublishedLogbookRows,
  requestLogbookListing,
  saveLogbookPhoto,
} from "@/lib/logbook";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await buildPublishedLogbookRows();
    return Response.json(
      safeJson({
        data,
        total: data.length,
        speakers: data.filter((row) => row.isSpeaker).length,
      })
    );
  } catch (error) {
    console.error("Public logbook GET failed:", error);
    return Response.json({ error: "Unable to load logbook" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let payload;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const photo = form.get("photo");
      payload = {
        fullName: form.get("fullName"),
        email: form.get("email"),
        phone: form.get("phone"),
        organization: form.get("organization"),
        country: form.get("country"),
        role: form.get("role"),
        bio: form.get("bio"),
      };
      const photoFile = await saveLogbookPhoto(photo);
      if (photoFile) payload.photoFile = photoFile;
    } else {
      payload = await req.json();
    }

    await requestLogbookListing(payload);
    return Response.json({
      success: true,
      message:
        "Your request has been sent. It will appear after the ACF team confirms it.",
    });
  } catch (error) {
    console.error("Public logbook request failed:", error);
    return Response.json(
      { error: error.message || "Unable to submit listing request" },
      { status: 400 }
    );
  }
}
