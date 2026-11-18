import "server-only";

import { cookies, headers } from "next/headers";
import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { getDb, ensureSchema, type Sql } from "./db";

const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 30;
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MIN = 15;

/** The only email allowed to claim the first-run admin account. It is
 *  public anyway (it's on the contact page); pinning it means a race
 *  on a fresh database can only ever create the owner's own account
 *  identity, and pairing it with ADMIN_SETUP_TOKEN (when set in the
 *  environment) closes the race entirely. */
const OWNER_EMAIL = "vikasmittapalli@gmail.com";

// A real, valid bcrypt hash of a throwaway string. Comparing against it
// takes the same full bcrypt cost as a real comparison, so "email not
// found" and "wrong password" are indistinguishable by response time.
const TIMING_DUMMY_HASH =
  "$2b$12$VEZmLEe.Drt0pbk6rTC9Wu2pTRkDpU5LAlwSyKuTyL1Ee9kRKj7H2";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** Privacy-preserving identifier for the caller - hashed client IP. */
export async function clientIpHash(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "unknown";
  const ip = fwd.split(",")[0].trim();
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

async function db(): Promise<Sql> {
  const sql = getDb();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await ensureSchema(sql);
  return sql;
}

/** Does an admin account exist yet? Drives the first-time setup flow. */
export async function adminExists(): Promise<boolean> {
  const sql = await db();
  const rows = (await sql`SELECT count(*)::int AS n FROM admin_users`) as {
    n: number;
  }[];
  return rows[0].n > 0;
}

/** First-time setup - only while no admin exists, only for the owner's
 *  email, and (when ADMIN_SETUP_TOKEN is configured) only with the token. */
export async function createAdmin(
  email: string,
  password: string,
  setupToken?: string,
) {
  const sql = await db();
  if (await adminExists()) throw new Error("Admin account already exists");
  const normalized = email.toLowerCase().trim();
  if (normalized !== OWNER_EMAIL)
    throw new Error("Setup is reserved for the site owner's email.");
  const required = process.env.ADMIN_SETUP_TOKEN;
  if (required && setupToken !== required)
    throw new Error("Invalid setup token.");
  const hash = await bcrypt.hash(password, 12);
  await sql`INSERT INTO admin_users (email, password_hash) VALUES (${normalized}, ${hash})`;
}

/** Too many recent failures from this caller → temporarily locked.
 *  Scoped per IP hash so an attacker spamming bad logins locks only
 *  themselves out, not the real admin. */
export async function isRateLimited(ipHash: string): Promise<boolean> {
  const sql = await db();
  const rows = (await sql`
    SELECT count(*)::int AS n FROM login_attempts
    WHERE ok = false
      AND ip_hash = ${ipHash}
      AND at > now() - make_interval(mins => ${ATTEMPT_WINDOW_MIN})
  `) as { n: number }[];
  return rows[0].n >= MAX_FAILED_ATTEMPTS;
}

export async function verifyCredentials(
  email: string,
  password: string,
  ipHash: string,
): Promise<boolean> {
  const sql = await db();
  const rows = (await sql`
    SELECT password_hash FROM admin_users WHERE email = ${email.toLowerCase().trim()}
  `) as { password_hash: string }[];
  // Always run a full-cost bcrypt compare - see TIMING_DUMMY_HASH.
  const hash = rows[0]?.password_hash ?? TIMING_DUMMY_HASH;
  const ok = (await bcrypt.compare(password, hash)) && rows.length > 0;
  await sql`INSERT INTO login_attempts (ok, ip_hash) VALUES (${ok}, ${ipHash})`;
  // Opportunistic pruning - keeps the rate-limit table small and fast.
  await sql`DELETE FROM login_attempts WHERE at < now() - interval '2 days'`;
  return ok;
}

export async function changePassword(current: string, next: string) {
  const sql = await db();
  const rows =
    (await sql`SELECT id, email, password_hash FROM admin_users LIMIT 1`) as {
      id: number;
      email: string;
      password_hash: string;
    }[];
  if (rows.length === 0) throw new Error("No admin account");
  const ok = await bcrypt.compare(current, rows[0].password_hash);
  if (!ok) throw new Error("Current password is incorrect");
  const hash = await bcrypt.hash(next, 12);
  await sql`UPDATE admin_users SET password_hash = ${hash} WHERE id = ${rows[0].id}`;
  // Invalidate every other session on password change
  await sql`DELETE FROM admin_sessions`;
}

// ---------- Sessions ----------

export async function createSession() {
  const sql = await db();
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`
    INSERT INTO admin_sessions (token_hash, expires_at)
    VALUES (${hashToken(token)}, ${expires.toISOString()})
  `;
  // Opportunistic pruning of expired sessions.
  await sql`DELETE FROM admin_sessions WHERE expires_at < now()`;
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const sql = await db();
    await sql`DELETE FROM admin_sessions WHERE token_hash = ${hashToken(token)}`;
  }
  store.delete(SESSION_COOKIE);
}

/** Is the current request an authenticated admin? */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    const sql = await db();
    const rows = (await sql`
      SELECT 1 FROM admin_sessions
      WHERE token_hash = ${hashToken(token)} AND expires_at > now()
    `) as unknown[];
    return rows.length > 0;
  } catch {
    return false;
  }
}

/** Guard for admin server actions - throws if not authenticated. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
