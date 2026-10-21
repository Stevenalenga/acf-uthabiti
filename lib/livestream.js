import { FAMILY_BANK_USD_TO_KES, convertUsdToKes } from "@/lib/documents/constants";

export const LIVESTREAM = {
  usd: 120,
  title: "ACF Mombasa 2026 livestream",
  lineItem:
    "Livestream access – Africa Childcare Forum 2026 (13–15 October, 1 viewer)",
  datesLabel: "13 – 15 October 2026",
  supportEmail: "acf@uthabitiafrica.org",
  checkoutPath: "/livestream",
};

export function livestreamKesAmount(usd = LIVESTREAM.usd) {
  return convertUsdToKes(usd, FAMILY_BANK_USD_TO_KES);
}

export function livestreamWatchPath(accessToken) {
  return `/livestream/watch/${encodeURIComponent(accessToken)}`;
}

export function livestreamWatchUrl(accessToken) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://acf.uthabitiafrica.org")
    .replace(/\/$/, "");
  return `${base}${livestreamWatchPath(accessToken)}`;
}

/** Public or private stream URL (YouTube, Zoom, etc.). Set LIVESTREAM_URL in env. */
export function getLivestreamStreamUrl() {
  return String(process.env.LIVESTREAM_URL || "").trim() || null;
}

export function youtubeEmbedSrc(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;

      const liveMatch = parsed.pathname.match(/\/live\/([^/?]+)/);
      if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}`;

      const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

export async function generateLivestreamInvoiceNumber(prisma) {
  const year = new Date().getFullYear();
  const prefix = "ACF2026/LS/";
  const suffix = `/${year}`;

  const latest = await prisma.livestream_purchase_tbl.findFirst({
    where: {
      invoice_number: { startsWith: prefix, endsWith: suffix },
    },
    orderBy: { purchase_id: "desc" },
    select: { invoice_number: true },
  });

  let nextSeq = 1;
  if (latest?.invoice_number) {
    const middle = latest.invoice_number.slice(
      prefix.length,
      latest.invoice_number.length - suffix.length
    );
    const parsed = parseInt(middle, 10);
    if (!Number.isNaN(parsed)) nextSeq = parsed + 1;
  }

  return `${prefix}${String(nextSeq).padStart(3, "0")}${suffix}`;
}
