import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllPagesAdmin } from "@/lib/pages-data";
import { AdminTabs } from "../ui";
import { PageList } from "./page-list";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const pages = await getAllPagesAdmin();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
        Admin · Portfolio
      </span>
      <h1 className="font-display text-4xl mt-2 mb-8">Custom pages</h1>
      <AdminTabs active="pages" />

      <p className="text-fg-muted text-sm mb-6 max-w-xl text-pretty">
        Create brand-new pages — landing pages, a speaking page, anything.
        They render at <span className="font-mono text-xs">/your-slug</span> with
        the site&apos;s standard design and the same block system as case
        studies, and can optionally appear in the navigation.
      </p>

      <PageList pages={pages} />
    </div>
  );
}
