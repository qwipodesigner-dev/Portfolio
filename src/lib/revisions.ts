import { getDb, ensureSchema, type Sql } from "./db";

/** What kind of content a revision belongs to. */
export type RevisionKind = "project" | "service" | "page" | "site";

export type Revision = {
  id: number;
  kind: RevisionKind;
  ref: string;
  data: unknown;
  created_at: string;
};

const KEEP = 20;

/**
 * Snapshot the current value of an item before it gets overwritten.
 * Called inside save actions; keeps the last KEEP versions per item.
 */
export async function snapshot(
  sql: Sql,
  kind: RevisionKind,
  ref: string,
  data: unknown,
) {
  if (data === undefined || data === null) return;
  await sql`
    INSERT INTO revisions (kind, ref, data)
    VALUES (${kind}, ${ref}, ${JSON.stringify(data)}::jsonb)
  `;
  await sql`
    DELETE FROM revisions
    WHERE kind = ${kind} AND ref = ${ref}
      AND id NOT IN (
        SELECT id FROM revisions
        WHERE kind = ${kind} AND ref = ${ref}
        ORDER BY id DESC LIMIT ${KEEP}
      )
  `;
}

export async function getRevisions(
  kind: RevisionKind,
  ref: string,
): Promise<Revision[]> {
  const sql = getDb();
  if (!sql) return [];
  await ensureSchema(sql);
  return (await sql`
    SELECT id, kind, ref, data, created_at::text
    FROM revisions
    WHERE kind = ${kind} AND ref = ${ref}
    ORDER BY id DESC
  `) as Revision[];
}

export async function getRevision(id: number): Promise<Revision | undefined> {
  const sql = getDb();
  if (!sql) return undefined;
  await ensureSchema(sql);
  const rows = (await sql`
    SELECT id, kind, ref, data, created_at::text FROM revisions WHERE id = ${id}
  `) as Revision[];
  return rows[0];
}
