import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllProjectsAdmin } from "@/lib/content";
import { getAllPagesAdmin } from "@/lib/pages-data";
import { CaseStudyView } from "@/components/case-study-view";
import { CustomPageView } from "@/components/custom-page-view";

export const dynamic = "force-dynamic";

/**
 * Admin-only draft preview — renders the draft version (falling back
 * to the published version) using the exact same view components as
 * the public routes, so what you see is what will ship.
 */
export default async function DraftPreviewPage({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { kind, slug } = await params;

  let body: React.ReactNode;
  let hasDraft = false;
  let editHref: string;

  if (kind === "project") {
    const project = (await getAllProjectsAdmin()).find((p) => p.slug === slug);
    if (!project) notFound();
    hasDraft = !!project.draft;
    editHref = `/admin/projects/${slug}`;
    const { draft, visible: _v, sortOrder: _s, ...published } = project;
    body = <CaseStudyView project={draft ?? published} />;
  } else if (kind === "page") {
    const page = (await getAllPagesAdmin()).find((p) => p.slug === slug);
    if (!page) notFound();
    hasDraft = !!page.draft;
    editHref = `/admin/pages/${slug}`;
    const { draft, visible: _v, showInNav: _n, sortOrder: _s, ...published } = page;
    body = <CustomPageView page={draft ?? published} />;
  } else {
    notFound();
  }

  return (
    <>
      {/* Draft banner */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-4 border-b border-accent/40 bg-accent-soft px-6 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          {hasDraft ? "Draft preview — not live" : "Preview — published version"}
        </span>
        <Link
          href={editHref}
          className="rounded-full border border-accent/40 px-4 py-1.5 text-xs text-accent hover:bg-accent hover:text-white transition-colors"
        >
          Back to editor
        </Link>
      </div>
      <main className="pt-4">{body}</main>
    </>
  );
}
