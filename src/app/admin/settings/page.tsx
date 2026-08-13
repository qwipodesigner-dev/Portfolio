import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSiteContentAdmin } from "@/lib/site";
import { AdminTabs } from "../ui";
import { PasswordForm } from "./password-form";
import { ResumeUpload } from "./resume-upload";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const settings = await getSiteContentAdmin("settings");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
        Admin · Portfolio
      </span>
      <h1 className="font-display text-4xl mt-2 mb-8">Settings</h1>
      <AdminTabs active="settings" />

      <div className="flex flex-col gap-8 max-w-md">
        <ResumeUpload currentUrl={settings.resumeUrl} />
        <div className="rounded-2xl border border-border bg-surface p-6">
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
