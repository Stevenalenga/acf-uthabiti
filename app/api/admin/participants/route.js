import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 15)));

    const name = searchParams.get("name")?.trim();
    const eventId = searchParams.get("eventId")?.trim();
    const paymentStatus = searchParams.get("paymentStatus")?.trim();
    const phase = searchParams.get("phase")?.trim();
    const type = searchParams.get("type")?.trim();

    const where = {
      ...(name && {
        OR: [
          { full_name: { contains: name } },
          { email: { contains: name } },
          { organization: { contains: name } },
          { phone: { contains: name } },
        ],
      }),
      ...(eventId && {
        event_id: BigInt(eventId),
      }),
      ...(phase && { phase }),
      ...(type && { type }),
      ...(paymentStatus && {
        payments: {
          some: { status: paymentStatus },
        },
      }),
    };

    const [participants, total, statsRows] = await Promise.all([
      prisma.participant_registration_tbl.findMany({
        where,
        include: {
          event: true,
          accessibility: true,
          dietary: true,
          payments: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          documents: {
            orderBy: { issued_at: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.participant_registration_tbl.count({ where }),
      prisma.participant_registration_tbl.findMany({
        select: {
          paid: true,
          payments: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { status: true },
          },
        },
      }),
    ]);

    const stats = statsRows.reduce(
      (acc, row) => {
        acc.total += 1;
        if (row.paid) acc.paid += 1;
        const status = row.payments[0]?.status;
        if (status === "PENDING") acc.pending += 1;
        if (status === "FAILED") acc.failed += 1;
        return acc;
      },
      { total: 0, paid: 0, pending: 0, failed: 0 }
    );

    return Response.json(
      safeJson({
        data: participants,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
        stats,
      })
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Unable to fetch participants" },
      { status: 500 }
    );
  }
}
