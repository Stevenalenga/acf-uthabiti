import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getComments, isValidSlug } from "@/lib/blog/engagement";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { slug } = await params;
  if (!isValidSlug(slug)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ comments: await getComments(slug) });
}

export async function POST(req, { params }) {
  const { slug } = await params;
  if (!isValidSlug(slug)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const author = String(body?.author || "").trim().slice(0, 80);
  const message = String(body?.message || "").trim();

  if (author.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (message.length < 2 || message.length > 2000) {
    return NextResponse.json(
      { error: "Comments must be between 2 and 2000 characters." },
      { status: 400 },
    );
  }

  // Simple flood guard: max 5 comments per post per minute across all visitors
  const recent = await prisma.blog_comment_tbl.count({
    where: { blog_slug: slug, createdAt: { gt: new Date(Date.now() - 60_000) } },
  });
  if (recent >= 5) {
    return NextResponse.json({ error: "Too many comments. Try again shortly." }, { status: 429 });
  }

  await prisma.blog_comment_tbl.create({ data: { blog_slug: slug, author, message } });
  return NextResponse.json({ comments: await getComments(slug) }, { status: 201 });
}
