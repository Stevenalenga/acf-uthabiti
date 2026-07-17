import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const name = searchParams.get("name");
  const eventId = searchParams.get("eventId");
  const paymentStatus = searchParams.get("paymentStatus");
  const phase = searchParams.get("phase");
  const type = searchParams.get("type");

  const where = {
    ...(name && {
      full_name: { contains: name },
    }),
    ...(eventId && {
      event_id: BigInt(eventId),
    }),
    ...(phase && { phase }),
    ...(type && { type }),
  };

  const participants = await prisma.participant_registration_tbl.findMany({
    where,
    include: {
      event: true,
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      documents: {
        orderBy: { issued_at: "desc" },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const filtered = paymentStatus
    ? participants.filter(
        (p) => p.payments[0]?.status === paymentStatus
      )
    : participants;

  const total = await prisma.participant_registration_tbl.count({ where });

  return Response.json(
    safeJson({
      data: filtered,
      meta: {
        page,
        limit,
        total,
      },
    })
  );
}
