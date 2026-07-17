import { readDocumentFile } from "@/lib/documents/storage";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const document = await prisma.registration_document_tbl.findUnique({
      where: { document_id: BigInt(id) },
    });

    if (!document) {
      return Response.json({ error: "Document not found" }, { status: 404 });
    }

    const fileBuffer = await readDocumentFile(document.file_path);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${document.file_name}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to load document" }, { status: 500 });
  }
}
