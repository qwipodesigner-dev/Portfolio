import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { PasswordForm } from "./password-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <Link
        href="/admin"
        className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted hover:text-fg transition-colors"
      >
        ← All projects
      </Link>
      <h1 className="font-display text-4xl mt-3 mb-8">Settings</h1>
      <PasswordForm />
    </div>
  );
}
