import { NextResponse } from "next/server";
import {
  GALLERY_ACCESS_CODE,
  getGalleryItems,
  saveGalleryFiles,
} from "@/lib/mombasaGallery";

export async function GET() {
  const items = await getGalleryItems();
  return NextResponse.json({ items });
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const code = String(formData.get("code") || "");
    const uploadedBy = String(formData.get("uploadedBy") || "guest");
    const files = Array.from(formData.getAll("files")).filter(
      (file) => file instanceof File && file.size > 0,
    );

    if (code !== GALLERY_ACCESS_CODE) {
      return NextResponse.json(
        { error: "Invalid access code." },
        { status: 403 },
      );
    }

    if (!files.length) {
      return NextResponse.json(
        { error: "Please select at least one JPG, JPEG, PNG, GIF, WEBP, BMP, or ZIP file." },
        { status: 400 },
      );
    }

    const savedItems = await saveGalleryFiles(files, uploadedBy);
    return NextResponse.json({ items: savedItems }, { status: 201 });
  } catch (error) {
    console.error("ACF Mombasa gallery upload failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to upload gallery files.",
      },
      { status: 400 },
    );
  }
}
