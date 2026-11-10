import Link from "next/link";
import { notFound } from "next/navigation";
import Engagement from "./Engagement";
import { BLOG_BASE_PATH, getBlogBySlug, getBlogs } from "@/lib/blog";

// Re-evaluate publish schedule every minute (ISR)
export const revalidate = 60;

export function generateStaticParams() {
  return getBlogs().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  return {
    title: blog ? `${blog.title} | Africa Childcare Forum` : "Blog",
    description: blog?.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) notFound();

  const blogs = getBlogs();
  const idx = blogs.findIndex((b) => b.id === blog.id);
  const prev = blogs[idx - 1];
  const next = blogs[idx + 1];
  const [hero, ...inline] = blog.images;

  // Spread inline photos evenly through the article
  const step = Math.ceil(blog.paragraphs.length / (inline.length + 1));

  return (
    <main className="bg-stone-50 pb-20">
      <section className="relative h-[60vh] min-h-[420px] w-full">
        <img src={hero} alt={blog.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-end px-6 pb-12 text-white">
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-300">
            ACFMombasa2026 · Africa Childcare Forum
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">{blog.title}</h1>
          <p className="mt-4 text-sm text-stone-200">
            By {blog.author} · Uthabiti Africa · {blog.readMinutes} min read
          </p>
        </div>
      </section>

      <article className="mx-auto mt-12 max-w-3xl px-6">
        <Link href={BLOG_BASE_PATH} className="text-sm font-medium text-amber-700 hover:underline">
          ← All blogs
        </Link>

        <div className="mt-8 space-y-6 text-lg leading-8 text-stone-700">
          {blog.paragraphs.map((p, i) => {
            const imgIdx = i > 0 && i % step === 0 ? i / step - 1 : -1;
            return (
              <div key={i} className="space-y-6">
                {imgIdx >= 0 && inline[imgIdx] && (
                  <figure className="-mx-6 md:-mx-16">
                    <img
                      src={inline[imgIdx]}
                      alt={`ACF Mombasa 2026, 13 October`}
                      loading="lazy"
                      className="w-full rounded-2xl object-cover shadow-lg"
                    />
                    <figcaption className="mt-2 text-center text-xs text-stone-500">
                      Africa Childcare Forum · Mombasa, 13 October 2026
                    </figcaption>
                  </figure>
                )}
                <p className={i === 0 ? "text-xl font-medium text-stone-900" : ""}>{p}</p>
              </div>
            );
          })}
        </div>

        <Engagement slug={blog.slug} />

        <nav className="mt-16 grid gap-4 border-t border-stone-200 pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={`${BLOG_BASE_PATH}/${prev.slug}`} className="rounded-xl bg-white p-5 shadow hover:shadow-md">
              <span className="text-xs uppercase text-stone-500">← Previous</span>
              <p className="mt-1 font-semibold text-stone-900">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`${BLOG_BASE_PATH}/${next.slug}`} className="rounded-xl bg-white p-5 text-right shadow hover:shadow-md">
              <span className="text-xs uppercase text-stone-500">Next →</span>
              <p className="mt-1 font-semibold text-stone-900">{next.title}</p>
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
