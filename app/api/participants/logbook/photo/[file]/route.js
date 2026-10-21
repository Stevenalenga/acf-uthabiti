import {
  isPublishedLogbookPhoto,
  photoContentType,
  readLogbookPhoto,
} from "@/lib/logbook";

export async function GET(_req, { params }) {
  const { file } = await params;
  if (!(await isPublishedLogbookPhoto(file))) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = await readLogbookPhoto(file);
  if (!buffer) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buffer, {
    headers: {
      "Content-Type": photoContentType(file),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
