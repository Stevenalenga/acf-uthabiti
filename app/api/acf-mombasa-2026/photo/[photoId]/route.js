import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { MOMBASA_GALLERY_DIR, getGalleryPhotoById } from "@/lib/mombasaGallery";

export async function GET(_request, { params }) {
  try {
    const { photoId } = await params;
    const item = await getGalleryPhotoById(photoId);

    if (!item) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    const filePath = path.join(MOMBASA_GALLERY_DIR, item.stored_name);
    const buffer = await fs.readFile(filePath);
    const safeName = String(item.original_name || item.stored_name || `photo-${photoId}.jpg`).replace(/"/g, "");

    return new Response(buffer, {
      headers: {
        "Content-Type": item.mime_type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Gallery photo read failed:", error);
    return NextResponse.json({ error: "Image could not be loaded." }, { status: 500 });
  }
}
