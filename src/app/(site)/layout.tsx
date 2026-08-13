import { Providers } from "@/components/providers";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { getSiteContent } from "@/lib/site";
import { getNavPages } from "@/lib/pages-data";

/**
 * Public site chrome — nav, footer, lenis/theme/a11y providers.
 * Lives in a route group so the /admin portal renders outside it
 * and can never disturb the live site's look.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nav, navPages] = await Promise.all([
    getSiteContent("nav"),
    getNavPages(),
  ]);
  const links = [
    ...nav.links,
    ...navPages.map((p) => ({ label: p.title, href: `/${p.slug}` })),
  ];

  return (
    <Providers>
      <Nav brandName={nav.brandName} links={links} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </Providers>
  );
}
