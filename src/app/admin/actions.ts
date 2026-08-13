"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import {
  adminExists,
  changePassword,
  createAdmin,
  createSession,
  destroySession,
  isRateLimited,
  requireAdmin,
  verifyCredentials,
} from "@/lib/auth";
import { getDb, ensureSchema } from "@/lib/db";
import { PROJECTS_TAG, seedDatabase } from "@/lib/content";
import type { Project } from "@/lib/projects";

export type FormState = { error?: string } | undefined;

/** Blow away every cached read of project content — edits go live instantly. */
function publish(slug?: string) {
  revalidateTag(PROJECTS_TAG, "max");
  revalidatePath("/");
  revalidatePath("/work");
  if (slug) revalidatePath(`/work/${slug}`);
}

// ---------- Auth ----------

export async function setupAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!email.includes("@")) return { error: "Enter a valid email address." };
  if (password.length < 10)
    return { error: "Password must be at least 10 characters." };
  if (password !== confirm) return { error: "Passwords don't match." };
  if (await adminExists())
    return { error: "Admin account already exists — log in instead." };
  await createAdmin(email, password);
  await createSession();
  redirect("/admin");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (await isRateLimited())
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const ok = await verifyCredentials(email, password);
  if (!ok) return { error: "Wrong email or password." };
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (next.length < 10)
    return { error: "New password must be at least 10 characters." };
  if (next !== confirm) return { error: "New passwords don't match." };
  try {
    await changePassword(current, next);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to change password." };
  }
  await createSession(); // keep this browser logged in
  redirect("/admin?saved=password");
}

// ---------- Projects ----------

export async function seedAction() {
  await requireAdmin();
  await seedDatabase();
  publish();
  redirect("/admin");
}

async function db() {
  const sql = getDb();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await ensureSchema(sql);
  return sql;
}

/** Full save of a project's content (called from the editor). */
export async function saveProjectAction(
  slug: string,
  project: Project,
  visible: boolean,
): Promise<{ error?: string; slug?: string }> {
  await requireAdmin();
  const sql = await db();
  const nextSlug = project.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  if (!nextSlug) return { error: "Slug can't be empty." };
  project.slug = nextSlug;
  try {
    if (slug === "__new__") {
      const max = (await sql`SELECT coalesce(max(sort_order), -1)::int AS m FROM projects`) as { m: number }[];
      await sql`
        INSERT INTO projects (slug, data, visible, sort_order)
        VALUES (${nextSlug}, ${JSON.stringify(project)}::jsonb, ${visible}, ${max[0].m + 1})
      `;
    } else {
      const rows = (await sql`
        UPDATE projects
        SET slug = ${nextSlug}, data = ${JSON.stringify(project)}::jsonb,
            visible = ${visible}, updated_at = now()
        WHERE slug = ${slug}
        RETURNING slug
      `) as unknown[];
      if (rows.length === 0) return { error: `Project "${slug}" not found.` };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed.";
    return { error: msg.includes("duplicate") ? `Slug "${nextSlug}" is already taken.` : msg };
  }
  publish(slug);
  publish(nextSlug);
  return { slug: nextSlug };
}

export async function toggleVisibleAction(slug: string, visible: boolean) {
  await requireAdmin();
  const sql = await db();
  await sql`UPDATE projects SET visible = ${visible}, updated_at = now() WHERE slug = ${slug}`;
  publish(slug);
}

export async function deleteProjectAction(slug: string) {
  await requireAdmin();
  const sql = await db();
  await sql`DELETE FROM projects WHERE slug = ${slug}`;
  publish(slug);
}

export async function reorderAction(slugs: string[]) {
  await requireAdmin();
  const sql = await db();
  for (let i = 0; i < slugs.length; i++) {
    await sql`UPDATE projects SET sort_order = ${i} WHERE slug = ${slugs[i]}`;
  }
  publish();
}

// ---------- Media ----------

export async function uploadImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { error: "No file selected." };
  if (file.size > 15 * 1024 * 1024) return { error: "Max file size is 15MB." };
  if (!/^(image|video)\//.test(file.type))
    return { error: "Only image or video files." };
  try {
    const blob = await put(`portfolio/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return { url: blob.url };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("token")
          ? "Blob store not connected — link portfolio-media to the project in Vercel."
          : "Upload failed.",
    };
  }
}
