import type { MetadataRoute } from "next";
import { getVisibleProjects } from "@/lib/content";
import { getVisibleServices } from "@/lib/services-data";
import { getVisiblePages } from "@/lib/pages-data";
import { getSiteContent } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services, pages, seo] = await Promise.all([
    getVisibleProjects(),
    getVisibleServices(),
    getVisiblePages(),
    getSiteContent("seo"),
  ]);
  const base = seo.siteUrl.replace(/\/$/, "");
  const now = new Date();

  return [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/work`, lastModified: now, priority: 0.9 },
    { url: `${base}/services`, lastModified: now, priority: 0.8 },
    { url: `${base}/about`, lastModified: now, priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, priority: 0.7 },
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
    ...pages.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
