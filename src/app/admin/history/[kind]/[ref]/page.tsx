import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getRevisions, type RevisionKind } from "@/lib/revisions";
import { RevisionList } from "./revision-list";

export const dynamic = "force-dynamic";

const KINDS: Record<RevisionKind, { label: string; back: string }> = {
  project: { label: "Project", back: "/admin" },
  service: { label: "Service", back: "/admin/services" },
  page: { label: "Page", back: "/admin/pages" },
  site: { label: "Site content", back: "/admin/site" },
};

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ kind: string; ref: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { kind, ref } = await params;
  if (!(kind in KINDS)) notFound();
  const typedKind = kind as RevisionKind;
  const revisions = await getRevisions(typedKind, ref);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href={KINDS[typedKind].back}
        className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted hover:text-fg transition-colors"
      >
        ← Back
      </Link>
      <h1 className="font-display text-4xl mt-3 mb-2">
        History · {ref}
      </h1>
      <p className="text-fg-muted text-sm mb-10">
        Every publish keeps a snapshot of what it replaced — the last 20 are
        kept. Restoring is itself undoable.
      </p>
      <RevisionList revisions={revisions} />
    </div>
  );
}
