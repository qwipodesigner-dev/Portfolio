"use server";

import { getDb, ensureSchema } from "@/lib/db";

/**
 * Public contact-form submission — the one server action that runs
 * unauthenticated. Validates, rate-limits per instance, and stores
 * the message for the admin Inbox.
 */

// Per-instance token bucket — enough to blunt drive-by spam without
// external services. Serious volume would need a real rate limiter.
let recent: number[] = [];

export async function submitMessageAction(input: {
  name: string;
  email: string;
  message: string;
  /** Honeypot — real users never fill this */
  company?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const name = String(input.name ?? "").trim().slice(0, 200);
  const email = String(input.email ?? "").trim().slice(0, 320);
  const message = String(input.message ?? "").trim().slice(0, 5000);

  // Honeypot filled → pretend success, store nothing
  if (input.company) return { ok: true };

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 12)
    return { ok: false, error: "Please check the form fields." };

  const now = Date.now();
  recent = recent.filter((t) => now - t < 60_000);
  if (recent.length >= 5)
    return { ok: false, error: "Too many messages — try again in a minute." };
  recent.push(now);

  const sql = getDb();
  if (!sql) return { ok: false, error: "Message service is unavailable." };
  try {
    await ensureSchema(sql);
    await sql`
      INSERT INTO messages (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;
    return { ok: true };
  } catch (err) {
    console.error("[contact] failed to store message:", err);
    return { ok: false, error: "Something went wrong — please email me directly." };
  }
}
