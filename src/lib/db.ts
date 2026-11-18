import { neon } from "@neondatabase/serverless";

/**
 * Lazy Neon client. DATABASE_URL is absent in local dev until
 * `vercel env pull` - callers must handle `null` and fall back
 * to the static seed content so the public site never breaks.
 */
export function getDb() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) return null;
  return neon(url);
}

export type Sql = NonNullable<ReturnType<typeof getDb>>;

let schemaReady: Promise<void> | null = null;

/**
 * Ensure the schema exists. Cheap sentinel probe first: when the newest
 * migration is already in place (the common case for every request after
 * initial setup), no DDL runs at all - full bootstrap only executes on a
 * genuinely fresh or partially-migrated database. This keeps DDL out of
 * the hot request path (it previously ran ~14 statements on every cold
 * start, an easy cost-amplification target via the public contact action).
 */
export function ensureSchema(sql: Sql) {
  // A rejected bootstrap must not poison the instance forever - clear the
  // memo on failure so the next request retries.
  schemaReady ??= run(sql).catch((err) => {
    schemaReady = null;
    throw err;
  });
  return schemaReady;
}

async function run(sql: Sql) {
  await (async () => {
    try {
      // Probes the newest parts of the schema: messages.ip_hash and
      // login_attempts.ip_hash are the latest additions - if both exist,
      // everything older does too.
      await sql`SELECT ip_hash FROM messages LIMIT 0`;
      await sql`SELECT ip_hash FROM login_attempts LIMIT 0`;
      return;
    } catch {
      /* missing table or column - run the full bootstrap below */
    }
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
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        key text PRIMARY KEY,
        data jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id serial PRIMARY KEY,
        slug text UNIQUE NOT NULL,
        data jsonb NOT NULL,
        visible boolean NOT NULL DEFAULT true,
        sort_order integer NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id serial PRIMARY KEY,
        slug text UNIQUE NOT NULL,
        data jsonb NOT NULL,
        visible boolean NOT NULL DEFAULT true,
        show_in_nav boolean NOT NULL DEFAULT false,
        sort_order integer NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id serial PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL,
        message text NOT NULL,
        handled boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS revisions (
        id serial PRIMARY KEY,
        kind text NOT NULL,
        ref text NOT NULL,
        data jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
    await sql`CREATE INDEX IF NOT EXISTS revisions_kind_ref ON revisions (kind, ref, id DESC)`;
    // Draft support - pending edits live here until published
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS draft_data jsonb`;
    await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS draft_data jsonb`;
    await sql`ALTER TABLE pages ADD COLUMN IF NOT EXISTS draft_data jsonb`;
    // Per-caller rate limiting + fast pruning
    await sql`ALTER TABLE login_attempts ADD COLUMN IF NOT EXISTS ip_hash text`;
    await sql`CREATE INDEX IF NOT EXISTS login_attempts_ip_at ON login_attempts (ip_hash, at DESC)`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS ip_hash text`;
    await sql`CREATE INDEX IF NOT EXISTS messages_created ON messages (created_at DESC)`;
  })();
}
