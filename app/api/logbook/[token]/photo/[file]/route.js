import {
  isValidLogbookToken,
  photoContentType,
  readLogbookPhoto,
} from "@/lib/logbook";

export async function GET(_req, { params }) {
  const { token, file } = await params;
  if (!isValidLogbookToken(token)) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = await readLogbookPhoto(file);
  if (!buffer) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buffer, {
    headers: {
      "Content-Type": photoContentType(file),
      "Cache-Control": "private, max-age=86400",
    },
  });
}
