/**
 * Send CEO special invitation emails ($150 USD) to a list of recipients.
 *
 * Uses the running site's /api/ceo/invites endpoint so invite creation,
 * email sending, and mail logging all go through the same code path as
 * the CEO portal.
 *
 * Safe to re-run: recipients who already have an invite are skipped.
 *
 * Usage: node scripts/send-special-invites.js
 */

const fs = require("fs");
const path = require("path");

// ---- Configuration ---------------------------------------------------------

const AMOUNT_USD = 150;
const API_BASE = process.env.INVITE_API_BASE || "http://127.0.0.1:3005";

// One invite per unique email (the system allows one registration per email).
const RECIPIENTS = [
  { email: "andiakihima89@gmail.com", name: "Branice Kihima" },
  { email: "lendinghandsinitiative@gmail.com", name: "Hellen Adhiambo Okumu" },
  { email: "maureensharon051@gmail.com", name: "Maureen Sharon Awino" },
  { email: "jecintachelaa001@gmail.com", name: "Jecinta Chelang'at" },
  { email: "nelingoma52@gmail.com", name: "Nellie Nyangoma" },
  { email: "playboykomakuno@gmail.com", name: "Njowela Martin" },
  { email: "chiromboreuben@gmail.com", name: "" },
  { email: "musaiwabyton@gmail.com", name: "Byton Musaiwa" },
  { email: "mtetemisheck1@gmail.com", name: "Misheck Mtete" },
  { email: "lunnykhumalo17@gmail.com", name: "Lunesi Khumalo" },
  { email: "faramujane@gmail.com", name: "Lasten Billy Nkhoma" },
  { email: "wisemanbmwasomola@gmail.com", name: "Wiseman Mwambene" },
  { email: "chirwasteve896@gmail.com", name: "Steve Chirwa" },
  { email: "knmherb@gmail.com", name: "Hazel Chakalamba" },
  { email: "chatamani08@gmail.com", name: "Charity Amani Mulwa" },
];

// ---- Helpers ----------------------------------------------------------------

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, "").trim();
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const headers = {
    "Content-Type": "application/json",
    "x-ceo-email": env.CEO_EMAIL || "ceo@uthabitiafrica.org",
    "x-ceo-password": env.CEO_INVITE_PASSWORD || "",
  };

  // Fetch existing invites so re-runs don't create duplicates.
  const listRes = await fetch(`${API_BASE}/api/ceo/invites`, { headers });
  if (!listRes.ok) {
    const body = await listRes.text();
    throw new Error(`Could not list invites (${listRes.status}): ${body}`);
  }
  const existing = new Set(
    ((await listRes.json()).data || []).map((i) => i.email.toLowerCase())
  );

  // Deduplicate the recipient list by email, keeping the first name given.
  const seen = new Set();
  const recipients = RECIPIENTS.filter((r) => {
    const key = r.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const results = { sent: [], skipped: [], emailFailed: [], errors: [] };

  for (const recipient of recipients) {
    const email = recipient.email.toLowerCase();

    if (existing.has(email)) {
      results.skipped.push(email);
      console.log(`SKIP   ${email} (already has an invite)`);
      continue;
    }

    try {
      const res = await fetch(`${API_BASE}/api/ceo/invites`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email,
          name: recipient.name,
          amount: AMOUNT_USD,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        results.errors.push({ email, error: body.error });
        console.log(`ERROR  ${email}: ${body.error}`);
      } else if (body.emailSent) {
        results.sent.push(email);
        console.log(`SENT   ${email} ($${AMOUNT_USD}) -> ${body.inviteUrl}`);
      } else {
        results.emailFailed.push(email);
        console.log(
          `CREATED-BUT-EMAIL-FAILED ${email} — resend from the CEO portal. Link: ${body.inviteUrl}`
        );
      }
    } catch (err) {
      results.errors.push({ email, error: err.message });
      console.log(`ERROR  ${email}: ${err.message}`);
    }

    // Small pause between sends to be gentle on the SMTP server.
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log("\n===== Summary =====");
  console.log(`Sent:            ${results.sent.length}`);
  console.log(`Skipped (dupes): ${results.skipped.length}`);
  console.log(`Email failed:    ${results.emailFailed.length}`);
  console.log(`Errors:          ${results.errors.length}`);
  if (results.emailFailed.length) {
    console.log(
      "\nInvites created but email failed (use Resend on /ceo-invites):"
    );
    results.emailFailed.forEach((e) => console.log(`  - ${e}`));
  }
  if (results.errors.length) {
    console.log("\nErrors:");
    results.errors.forEach((e) => console.log(`  - ${e.email}: ${e.error}`));
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
