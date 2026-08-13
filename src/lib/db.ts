import { neon } from "@neondatabase/serverless";

/**
 * Lazy Neon client. DATABASE_URL is absent in local dev until
 * `vercel env pull` — callers must handle `null` and fall back
 * to the static seed content so the public site never breaks.
 */
export function getDb() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) return null;
  return neon(url);
}

export type Sql = NonNullable<ReturnType<typeof getDb>>;

let schemaReady: Promise<void> | null = null;

/** Create tables on first use — idempotent, runs once per server instance. */
export function ensureSchema(sql: Sql) {
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id serial PRIMARY KEY,
        slug text UNIQUE NOT NULL,
        data jsonb NOT NULL,
        visible boolean NOT NULL DEFAULT true,
        sort_order integer NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id serial PRIMARY KEY,
        email text UNIQUE NOT NULL,
        password_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        token_hash text PRIMARY KEY,
        expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id serial PRIMARY KEY,
        at timestamptz NOT NULL DEFAULT now(),
        ok boolean NOT NULL
      )`;
  })();
  return schemaReady;
}
