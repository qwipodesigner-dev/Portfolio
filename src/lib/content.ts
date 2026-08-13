import { unstable_cache } from "next/cache";
import { getDb, ensureSchema } from "./db";
import { projects as seedProjects, type Project } from "./projects";

/** Row shape stored in Postgres — `data` holds the full Project object. */
type ProjectRow = {
  slug: string;
  data: Project;
  visible: boolean;
  sort_order: number;
};

export const PROJECTS_TAG = "projects";

/** Admin-facing shape: project plus its management flags. */
export type ManagedProject = Project & {
  visible: boolean;
  sortOrder: number;
  /** Unpublished edits, if any (admin reads only) */
  draft?: Project | null;
};

async function fetchAllFromDb(): Promise<ManagedProject[] | null> {
  const sql = getDb();
  if (!sql) return null;
  try {
    await ensureSchema(sql);
    const rows = (await sql`
      SELECT slug, data, visible, sort_order
      FROM projects
      ORDER BY sort_order ASC, id ASC
    `) as ProjectRow[];
    if (rows.length === 0) return null; // not seeded yet → fall back
    return rows.map((r) => ({
      ...r.data,
      slug: r.slug,
      visible: r.visible,
      sortOrder: r.sort_order,
    }));
  } catch (err) {
    console.error("[content] DB read failed, using static fallback:", err);
    return null;
  }
}

/**
 * Cached read of every project (including hidden ones — filtering
 * happens in the public helpers). Invalidated with revalidateTag
 * whenever the admin saves, so edits go live immediately.
 */
const getAllCached = unstable_cache(
  async (): Promise<ManagedProject[]> => {
    const fromDb = await fetchAllFromDb();
    if (fromDb) return fromDb;
    return seedProjects.map((p, i) => ({ ...p, visible: true, sortOrder: i }));
  },
  ["all-projects"],
  { tags: [PROJECTS_TAG] },
);

// ---------- Public site reads (visible projects only) ----------

export async function getVisibleProjects(): Promise<Project[]> {
  return (await getAllCached()).filter((p) => p.visible);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getVisibleProjects()).filter((p) => p.featured);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  return (await getVisibleProjects()).find((p) => p.slug === slug);
}

// ---------- Admin reads (everything, uncached) ----------

export async function getAllProjectsAdmin(): Promise<ManagedProject[]> {
  const sql = getDb();
  if (sql) {
    try {
      await ensureSchema(sql);
      const rows = (await sql`
        SELECT slug, data, visible, sort_order, draft_data
        FROM projects ORDER BY sort_order ASC, id ASC
      `) as (ProjectRow & { draft_data: Project | null })[];
      if (rows.length > 0)
        return rows.map((r) => ({
          ...r.data,
          slug: r.slug,
          visible: r.visible,
          sortOrder: r.sort_order,
          draft: r.draft_data,
        }));
    } catch (err) {
      console.error("[content] admin DB read failed:", err);
    }
  }
  return seedProjects.map((p, i) => ({ ...p, visible: true, sortOrder: i }));
}

/** True once the DB is reachable and holds seeded content. */
export async function isDbLive(): Promise<boolean> {
  return (await fetchAllFromDb()) !== null;
}

/** Copy the static seed content into the DB (no-op if already seeded). */
export async function seedDatabase(): Promise<{ seeded: number }> {
  const sql = getDb();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await ensureSchema(sql);
  const existing = (await sql`SELECT count(*)::int AS n FROM projects`) as {
    n: number;
  }[];
  if (existing[0].n > 0) return { seeded: 0 };
  for (let i = 0; i < seedProjects.length; i++) {
    const p = seedProjects[i];
    await sql`
      INSERT INTO projects (slug, data, visible, sort_order)
      VALUES (${p.slug}, ${JSON.stringify(p)}::jsonb, true, ${i})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  return { seeded: seedProjects.length };
}
