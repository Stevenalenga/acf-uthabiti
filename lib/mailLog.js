import fs from "fs/promises";
import path from "path";

const LOG_DIR =
  process.env.MAIL_LOG_DIR || path.join(process.cwd(), "var", "logs");
const LOG_FILE = path.join(LOG_DIR, "mail.log");

/**
 * Append a structured entry to var/logs/mail.log so email successes and
 * failures can be audited without access to the process manager's logs.
 * Never throws.
 */
export async function logMail(entry) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    const line = JSON.stringify({ at: new Date().toISOString(), ...entry });
    await fs.appendFile(LOG_FILE, line + "\n");
  } catch (err) {
    console.error("Mail log write failed:", err?.message || err);
  }
}
