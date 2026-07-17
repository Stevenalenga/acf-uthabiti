import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentStatus = searchParams.get("paymentStatus");
    const type = searchParams.get("type");

    let documents = await prisma.registration_document_tbl.findMany({
      where: {
        ...(type && { type }),
      },
      include: {
        participant: {
          select: {
            full_name: true,
            email: true,
            phone: true,
          },
        },
        payment: {
          select: {
            status: true,
            payment_reference: true,
            amount: true,
          },
        },
      },
      orderBy: { issued_at: "desc" },
    });

    if (paymentStatus) {
      documents = documents.filter(
        (doc) => doc.payment?.status === paymentStatus
      );
    }

    return Response.json(safeJson({ data: documents }));
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to fetch documents" }, { status: 500 });
  }
}
