import type { MetadataRoute } from "next";
import { getSiteContent, siteBaseUrl } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSiteContent("seo");
  const base = siteBaseUrl(seo.siteUrl);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
