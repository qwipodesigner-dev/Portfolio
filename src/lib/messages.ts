import { getDb, ensureSchema } from "./db";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  handled: boolean;
  created_at: string;
};

export async function getMessages(): Promise<ContactMessage[]> {
  const sql = getDb();
  if (!sql) return [];
  await ensureSchema(sql);
  // Capped so a spam flood can never make the inbox page unrenderable.
  return (await sql`
    SELECT id, name, email, message, handled, created_at::text
    FROM messages ORDER BY handled ASC, id DESC
    LIMIT 300
  `) as ContactMessage[];
}

export async function getUnhandledCount(): Promise<number> {
  const sql = getDb();
  if (!sql) return 0;
  try {
    await ensureSchema(sql);
    const rows = (await sql`
      SELECT count(*)::int AS n FROM messages WHERE handled = false
    `) as { n: number }[];
    return rows[0].n;
  } catch {
    return 0;
  }
}
