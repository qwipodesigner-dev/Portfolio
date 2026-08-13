import { unstable_cache } from "next/cache";
import { getDb, ensureSchema } from "./db";
import { services as seedServices, type Service } from "./services";

export const SERVICES_TAG = "services";

export type ManagedService = Service & {
  visible: boolean;
  sortOrder: number;
};

type ServiceRow = {
  slug: string;
  data: Service;
  visible: boolean;
  sort_order: number;
};

async function fetchAllFromDb(): Promise<ManagedService[] | null> {
  const sql = getDb();
  if (!sql) return null;
  try {
    await ensureSchema(sql);
    const rows = (await sql`
      SELECT slug, data, visible, sort_order
      FROM services ORDER BY sort_order ASC, id ASC
    `) as ServiceRow[];
    if (rows.length === 0) return null;
    return rows.map((r) => ({
      ...r.data,
      slug: r.slug,
      visible: r.visible,
      sortOrder: r.sort_order,
    }));
  } catch (err) {
    console.error("[services] DB read failed, using static fallback:", err);
    return null;
  }
}

const getAllCached = unstable_cache(
  async (): Promise<ManagedService[]> => {
    const fromDb = await fetchAllFromDb();
    if (fromDb) return fromDb;
    return seedServices.map((s, i) => ({ ...s, visible: true, sortOrder: i }));
  },
  ["all-services"],
  { tags: [SERVICES_TAG] },
);

export async function getVisibleServices(): Promise<Service[]> {
  return (await getAllCached()).filter((s) => s.visible);
}

export async function getServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  return (await getVisibleServices()).find((s) => s.slug === slug);
}

export async function getAllServicesAdmin(): Promise<ManagedService[]> {
  const fromDb = await fetchAllFromDb();
  if (fromDb) return fromDb;
  return seedServices.map((s, i) => ({ ...s, visible: true, sortOrder: i }));
}

export async function isServicesDbLive(): Promise<boolean> {
  return (await fetchAllFromDb()) !== null;
}

export async function seedServicesDb(): Promise<{ seeded: number }> {
  const sql = getDb();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await ensureSchema(sql);
  const existing = (await sql`SELECT count(*)::int AS n FROM services`) as {
    n: number;
  }[];
  if (existing[0].n > 0) return { seeded: 0 };
  for (let i = 0; i < seedServices.length; i++) {
    const s = seedServices[i];
    await sql`
      INSERT INTO services (slug, data, visible, sort_order)
      VALUES (${s.slug}, ${JSON.stringify(s)}::jsonb, true, ${i})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  return { seeded: seedServices.length };
}
