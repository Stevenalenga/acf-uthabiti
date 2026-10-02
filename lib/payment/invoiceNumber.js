import { ORGANIZATION } from "@/lib/documents/constants";

/**
 * Normalize user-entered invoice numbers into the canonical form
 * ACF2026/086/2026. Accepts dashes, spaces, lowercase, and bare sequence numbers.
 */
export function normalizeInvoiceNumber(raw) {
  let value = String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[\u2013\u2014]/g, "-") // en/em dash
    .replace(/\s+/g, "");

  // Convert dash form used in filenames / some copies: ACF2026-086-2026
  value = value.replace(/-/g, "/");

  // Collapse duplicate slashes
  value = value.replace(/\/+/g, "/");

  return value;
}

export function extractSequence(normalized) {
  // Bare digits: "86" or "086"
  if (/^\d{1,4}$/.test(normalized)) {
    return normalized.padStart(3, "0");
  }

  // ACF2026/086/2026 → 086
  const match = normalized.match(
    new RegExp(`^${ORGANIZATION.eventCode}/(\\d{1,4})(?:/\\d{4})?$`)
  );
  if (match) {
    return match[1].padStart(3, "0");
  }

  return null;
}

/** Build candidate document_number values from raw user input. */
export function invoiceNumberCandidates(raw) {
  const normalized = normalizeInvoiceNumber(raw);
  const candidates = new Set();

  if (!normalized) return { normalized: "", candidates: [], seq: null };

  candidates.add(normalized);

  const seq = extractSequence(normalized);
  if (seq) {
    const year = new Date().getFullYear();
    candidates.add(`${ORGANIZATION.eventCode}/${seq}/${year}`);
    candidates.add(`${ORGANIZATION.eventCode}/${seq}/2026`);
  }

  return { normalized, candidates: [...candidates], seq };
}
