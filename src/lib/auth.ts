import "server-only";

import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { getDb, ensureSchema, type Sql } from "./db";

const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 30;
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MIN = 15;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
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

/** First-time setup — only works while no admin account exists. */
export async function createAdmin(email: string, password: string) {
  const sql = await db();
  if (await adminExists()) throw new Error("Admin account already exists");
  const hash = await bcrypt.hash(password, 12);
  await sql`INSERT INTO admin_users (email, password_hash) VALUES (${email.toLowerCase().trim()}, ${hash})`;
}

/** Too many recent failures → temporarily locked. */
export async function isRateLimited(): Promise<boolean> {
  const sql = await db();
  const rows = (await sql`
    SELECT count(*)::int AS n FROM login_attempts
    WHERE ok = false AND at > now() - make_interval(mins => ${ATTEMPT_WINDOW_MIN})
  `) as { n: number }[];
  return rows[0].n >= MAX_FAILED_ATTEMPTS;
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  const sql = await db();
  const rows = (await sql`
    SELECT password_hash FROM admin_users WHERE email = ${email.toLowerCase().trim()}
  `) as { password_hash: string }[];
  // Hash against a dummy when the email is unknown — keeps timing uniform
  const hash =
    rows[0]?.password_hash ??
    "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
  const ok = (await bcrypt.compare(password, hash)) && rows.length > 0;
  await sql`INSERT INTO login_attempts (ok) VALUES (${ok})`;
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

/** Guard for admin server actions — throws if not authenticated. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
