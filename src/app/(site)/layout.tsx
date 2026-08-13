import { Providers } from "@/components/providers";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

/**
 * Public site chrome — nav, footer, lenis/theme/a11y providers.
 * Lives in a route group so the /admin portal renders outside it
 * and can never disturb the live site's look.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Nav />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </Providers>
  );
}
