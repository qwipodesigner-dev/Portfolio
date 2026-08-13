import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSiteContentAdmin, siteDefaults, type SiteContentKey } from "@/lib/site";
import { SiteEditor } from "./site-editor";

export const dynamic = "force-dynamic";

const TITLES: Record<SiteContentKey, string> = {
  home: "Home / landing",
  about: "About page",
  contact: "Contact page & details",
  nav: "Navigation",
  footer: "Footer",
  settings: "Settings",
  seo: "SEO & sharing",
  workPage: "Work page header",
  servicesPage: "Services page header",
};

export default async function EditSiteContentPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { key } = await params;
  if (!(key in siteDefaults)) notFound();
  const typedKey = key as SiteContentKey;
  const value = await getSiteContentAdmin(typedKey);

  return (
    <SiteEditor
      contentKey={typedKey}
      title={TITLES[typedKey]}
      initial={value}
    />
  );
}
