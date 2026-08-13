import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllProjectsAdmin, isDbLive } from "@/lib/content";
import { logoutAction, seedAction } from "./actions";
import { ProjectList } from "./project-list";
import { AdminTabs } from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [projects, dbLive] = await Promise.all([
    getAllProjectsAdmin(),
    isDbLive(),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            Admin · Portfolio
          </span>
          <h1 className="font-display text-4xl mt-2">Projects</h1>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors"
          >
            View site ↗
          </Link>
          <form action={logoutAction}>
            <button className="rounded-full border border-border px-4 py-2 text-sm text-fg-muted hover:border-fg hover:text-fg transition-colors">
              Log out
            </button>
          </form>
        </nav>
      </header>

      <AdminTabs active="projects" />

      {!dbLive && (
        <div className="mb-8 rounded-2xl border border-accent/40 bg-accent-soft p-6">
          <h2 className="font-medium mb-1">One-time import needed</h2>
          <p className="text-fg-muted text-sm mb-4 text-pretty">
            Your live site is currently serving the content built into the
            code. Import it into the database once — after that, everything
            you edit here goes live instantly.
          </p>
          <form action={seedAction}>
            <button className="rounded-full bg-fg text-bg px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-white transition-colors">
              Import current content
            </button>
          </form>
        </div>
      )}

      <ProjectList projects={projects} dbLive={dbLive} />
    </div>
  );
}
