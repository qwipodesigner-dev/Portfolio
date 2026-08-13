import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSiteContent("seo");
  const base = seo.siteUrl.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
