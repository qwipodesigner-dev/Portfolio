import { unstable_cache } from "next/cache";
import { getDb, ensureSchema } from "./db";
import type { CaseStudySection } from "./projects";

export const PAGES_TAG = "pages";

/** A custom page created from the admin — rendered at /<slug> with the
 *  site's standard hero + block sections, matching the design system. */
export type CustomPage = {
  slug: string;
  title: string;
  /** Meta description + card blurb */
  description: string;
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  sections: CaseStudySection[];
};

export type ManagedPage = CustomPage & {
  visible: boolean;
  showInNav: boolean;
  sortOrder: number;
  /** Unpublished edits, if any (admin reads only) */
  draft?: CustomPage | null;
};

type PageRow = {
  slug: string;
  data: CustomPage;
  visible: boolean;
  show_in_nav: boolean;
  sort_order: number;
  draft_data?: CustomPage | null;
};

async function fetchAll(withDrafts = false): Promise<ManagedPage[]> {
  const sql = getDb();
  if (!sql) return [];
  try {
    await ensureSchema(sql);
    const rows = (
      withDrafts
        ? await sql`
            SELECT slug, data, visible, show_in_nav, sort_order, draft_data
            FROM pages ORDER BY sort_order ASC, id ASC`
        : await sql`
            SELECT slug, data, visible, show_in_nav, sort_order
            FROM pages ORDER BY sort_order ASC, id ASC`
    ) as PageRow[];
    return rows.map((r) => ({
      ...r.data,
      slug: r.slug,
      visible: r.visible,
      showInNav: r.show_in_nav,
      sortOrder: r.sort_order,
      draft: r.draft_data ?? null,
    }));
  } catch (err) {
    console.error("[pages] DB read failed:", err);
    return [];
  }
}

const getAllCached = unstable_cache(async () => fetchAll(), ["all-pages"], {
  tags: [PAGES_TAG],
});

export async function getVisiblePages(): Promise<ManagedPage[]> {
  return (await getAllCached()).filter((p) => p.visible);
}

export async function getPageBySlug(
  slug: string,
): Promise<ManagedPage | undefined> {
  return (await getVisiblePages()).find((p) => p.slug === slug);
}

/** Custom pages the nav should show, appended after the standard links. */
export async function getNavPages(): Promise<ManagedPage[]> {
  return (await getVisiblePages()).filter((p) => p.showInNav);
}

export async function getAllPagesAdmin(): Promise<ManagedPage[]> {
  return fetchAll(true);
}
