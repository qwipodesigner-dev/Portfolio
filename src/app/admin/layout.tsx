import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Minimal admin chrome — deliberately separate from the public site's
 * header/footer/lenis stack so editing never disturbs the live design.
 * Auth is enforced per-page and per-action, not here.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-bg text-fg">{children}</div>;
}
