import blogs from "./blogs.json";

export const BLOG_BASE_PATH = "/blog";

// Each post has a `publishAt` timestamp (ISO, +03:00 EAT); it stays hidden
// everywhere until that moment passes.
export const getBlogs = () => {
  const now = Date.now();
  return blogs.filter((b) => new Date(b.publishAt).getTime() <= now);
};
export const getBlogBySlug = (slug) => getBlogs().find((b) => b.slug === slug) || null;
