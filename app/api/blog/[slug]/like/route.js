import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLikeState, isValidSlug, isValidVisitor } from "@/lib/blog/engagement";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const { slug } = await params;
  if (!isValidSlug(slug)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const visitor = new URL(req.url).searchParams.get("visitor");
  return NextResponse.json(await getLikeState(slug, visitor));
}

// Toggles the like for this visitor
export async function POST(req, { params }) {
  const { slug } = await params;
  if (!isValidSlug(slug)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const visitor = body?.visitorId;
  if (!isValidVisitor(visitor)) {
    return NextResponse.json({ error: "Invalid visitor." }, { status: 400 });
  }
  const key = { blog_slug: slug, visitor_id: visitor };
  const existing = await prisma.blog_like_tbl.findUnique({ where: { blog_slug_visitor_id: key } });
  if (existing) {
    await prisma.blog_like_tbl.delete({ where: { blog_slug_visitor_id: key } }).catch(() => {});
  } else {
    await prisma.blog_like_tbl.create({ data: key }).catch(() => {});
  }
  return NextResponse.json(await getLikeState(slug, visitor));
}
