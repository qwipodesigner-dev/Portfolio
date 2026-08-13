import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { adminExists, isAdmin } from "@/lib/auth";
import { AuthForm } from "./auth-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (!getDb()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl mb-4">Database not connected</h1>
          <p className="text-fg-muted text-pretty">
            The admin portal needs the Neon Postgres integration linked to this
            Vercel project (DATABASE_URL). Connect it in the Vercel dashboard
            under Storage, then reload.
          </p>
        </div>
      </div>
    );
  }
  if (await isAdmin()) redirect("/admin");
  const firstRun = !(await adminExists());
  return <AuthForm mode={firstRun ? "setup" : "login"} />;
}
