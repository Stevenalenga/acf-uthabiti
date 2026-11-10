import { prisma } from "@/lib/prisma";
import { getBlogBySlug } from "@/lib/blog";

export const isValidSlug = (slug) => Boolean(getBlogBySlug(slug));
export const isValidVisitor = (id) => /^[a-zA-Z0-9-]{16,64}$/.test(String(id || ""));

export async function getLikeState(slug, visitorId) {
  const [count, mine] = await Promise.all([
    prisma.blog_like_tbl.count({ where: { blog_slug: slug } }),
    isValidVisitor(visitorId)
      ? prisma.blog_like_tbl.findUnique({
          where: { blog_slug_visitor_id: { blog_slug: slug, visitor_id: visitorId } },
        })
      : null,
  ]);
  return { count, liked: Boolean(mine) };
}

export async function getComments(slug) {
  const rows = await prisma.blog_comment_tbl.findMany({
    where: { blog_slug: slug },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return rows.map((r) => ({
    id: Number(r.comment_id),
    author: r.author,
    message: r.message,
    createdAt: r.createdAt.toISOString(),
  }));
}
