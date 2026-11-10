import Link from "next/link";
import { BLOG_BASE_PATH, getBlogs } from "@/lib/blog";

// Re-evaluate publish schedule every minute (ISR)
export const revalidate = 60;

export const metadata = {
  title: "Blog | Africa Childcare Forum",
  description:
    "Reflections on building stronger childcare systems across Africa, by Uthabiti Africa.",
};

export default function BlogIndexPage() {
  const blogs = getBlogs();
  // Newest first
  const [featured, ...rest] = [...blogs].sort(
    (a, b) => new Date(b.publishAt) - new Date(a.publishAt) || b.id - a.id
  );
  if (!featured) return null;

  return (
    <main className="bg-stone-50 pt-24 pb-20">
      <header className="mx-auto max-w-6xl px-6 py-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          ACFMombasa2026 · 13–15 October 2026 · Mombasa, Kenya
        </p>
        <h1 className="mt-4 text-4xl font-bold text-stone-900 md:text-6xl">
          Africa Childcare Forum Blog
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600">
          Reflections on building stronger childcare systems across Africa. New
          posts are published daily at 11:00 EAT.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-6">
        <Link
          href={`${BLOG_BASE_PATH}/${featured.slug}`}
          className="group grid overflow-hidden rounded-3xl bg-white shadow-lg md:grid-cols-2"
        >
          <img
            src={featured.images[0]}
            alt={featured.title}
            className="h-72 w-full object-cover md:h-full"
          />
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="text-sm font-semibold text-amber-700">Featured</span>
            <h2 className="mt-3 text-2xl font-bold text-stone-900 group-hover:text-amber-700 md:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-stone-600">{featured.excerpt}</p>
            <span className="mt-6 text-sm font-medium text-stone-500">
              {featured.author} · {featured.readMinutes} min read
            </span>
          </div>
        </Link>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((b) => (
            <Link
              key={b.slug}
              href={`${BLOG_BASE_PATH}/${b.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img src={b.images[0]} alt={b.title} className="h-52 w-full object-cover" />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700">
                  {b.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm text-stone-600">{b.excerpt}</p>
                <span className="mt-auto pt-4 text-xs text-stone-500">
                  {b.author} · {b.readMinutes} min read
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
