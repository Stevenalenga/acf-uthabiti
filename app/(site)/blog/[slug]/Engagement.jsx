"use client";

import { useEffect, useState } from "react";

function getVisitorId() {
  let id = localStorage.getItem("acf-blog-visitor");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("acf-blog-visitor", id);
  }
  return id;
}

export default function Engagement({ slug }) {
  const [visitor, setVisitor] = useState("");
  const [likes, setLikes] = useState({ count: 0, liked: false });
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const v = getVisitorId();
    setVisitor(v);
    fetch(`/api/blog/${slug}/like?visitor=${v}`).then((r) => r.json()).then(setLikes).catch(() => {});
    fetch(`/api/blog/${slug}/comments`).then((r) => r.json()).then((d) => setComments(d.comments || [])).catch(() => {});
  }, [slug]);

  async function toggleLike() {
    if (!visitor) return;
    setLikes((l) => ({ liked: !l.liked, count: l.count + (l.liked ? -1 : 1) }));
    const res = await fetch(`/api/blog/${slug}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: visitor }),
    });
    if (res.ok) setLikes(await res.json());
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not post comment.");
      setComments(data.comments);
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-14 border-t border-stone-200 pt-8">
      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={likes.liked}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition ${
          likes.liked
            ? "border-rose-500 bg-rose-500 text-white"
            : "border-stone-300 bg-white text-stone-700 hover:border-rose-400"
        }`}
      >
        <span aria-hidden>{likes.liked ? "♥" : "♡"}</span>
        {likes.liked ? "Liked" : "Like"} · {likes.count}
      </button>

      <h2 className="mt-10 text-2xl font-bold text-stone-900">
        Comments ({comments.length})
      </h2>

      <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl bg-white p-5 shadow">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={80}
          placeholder="Your name"
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Share your thoughts…"
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="rounded-lg bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {busy ? "Posting…" : "Post comment"}
        </button>
      </form>

      <ul className="mt-6 space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-stone-900">{c.author}</span>
              <time className="text-xs text-stone-500">
                {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-stone-700">{c.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
