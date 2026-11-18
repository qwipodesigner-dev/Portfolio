"use server";

import { getDb, ensureSchema } from "@/lib/db";
import { clientIpHash } from "@/lib/auth";

/**
 * Public contact-form submission - the one server action that runs
 * unauthenticated. Validates, rate-limits durably (per-IP and global
 * counters live in Postgres, so parallel lambda instances and cold
 * starts share the same limits), and stores the message for the
 * admin Inbox.
 */

const PER_IP_PER_HOUR = 5;
const GLOBAL_PER_HOUR = 40;

export async function submitMessageAction(input: {
  name: string;
  email: string;
  message: string;
  /** Honeypot - real users never fill this */
  company?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const name = String(input.name ?? "").trim().slice(0, 200);
  const email = String(input.email ?? "").trim().slice(0, 320);
  const message = String(input.message ?? "").trim().slice(0, 5000);

  // Honeypot filled → pretend success, store nothing
  if (input.company) return { ok: true };

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 12)
    return { ok: false, error: "Please check the form fields." };

  const sql = getDb();
  if (!sql) return { ok: false, error: "Message service is unavailable." };
  try {
    await ensureSchema(sql);
    const ipHash = await clientIpHash();
    const counts = (await sql`
      SELECT
        count(*) FILTER (WHERE ip_hash = ${ipHash})::int AS mine,
        count(*)::int AS total
      FROM messages
      WHERE created_at > now() - interval '1 hour'
    `) as { mine: number; total: number }[];
    if (counts[0].mine >= PER_IP_PER_HOUR || counts[0].total >= GLOBAL_PER_HOUR)
      return {
        ok: false,
        error: "Too many messages right now - please email me directly.",
      };
    await sql`
      INSERT INTO messages (name, email, message, ip_hash)
      VALUES (${name}, ${email}, ${message}, ${ipHash})
    `;
    return { ok: true };
  } catch (err) {
    console.error("[contact] failed to store message:", err);
    return { ok: false, error: "Something went wrong - please email me directly." };
  }
}
