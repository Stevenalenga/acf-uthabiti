import fs from "fs/promises";
import path from "path";
import JSZip from "jszip";
import { NextResponse } from "next/server";
import { MOMBASA_GALLERY_DIR, getGalleryItems } from "@/lib/mombasaGallery";

export async function GET() {
  try {
    const items = await getGalleryItems();

    if (!items.length) {
      return NextResponse.json(
        { error: "No photos available for download." },
        { status: 404 },
      );
    }

    const zip = new JSZip();

    for (const item of items) {
      const filePath = path.join(MOMBASA_GALLERY_DIR, item.stored_name);
      try {
        const buffer = await fs.readFile(filePath);
        zip.file(item.original_name || item.stored_name, buffer);
      } catch {
        // Skip unreadable files so the remaining archive can still download.
      }
    }

    const archiveBuffer = await zip.generateAsync({ type: "nodebuffer" });
    if (!archiveBuffer.length) {
      return NextResponse.json(
        { error: "No readable photos found for download." },
        { status: 500 },
      );
    }

    return new Response(archiveBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="acf-mombasa-2026-gallery.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Gallery bulk download failed:", error);
    return NextResponse.json(
      { error: "Could not prepare the gallery download." },
      { status: 500 },
    );
  }
}
