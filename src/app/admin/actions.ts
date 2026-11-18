"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import {
  adminExists,
  changePassword,
  clientIpHash,
  createAdmin,
  createSession,
  destroySession,
  isRateLimited,
  requireAdmin,
  verifyCredentials,
} from "@/lib/auth";
import { getDb, ensureSchema } from "@/lib/db";
import { PROJECTS_TAG, seedDatabase } from "@/lib/content";
import { SERVICES_TAG, seedServicesDb } from "@/lib/services-data";
import { PAGES_TAG, type CustomPage } from "@/lib/pages-data";
import { SITE_TAG, type SiteContentKey } from "@/lib/site";
import { getRevision, snapshot, type RevisionKind } from "@/lib/revisions";
import type { Project } from "@/lib/projects";
import type { Service } from "@/lib/services";

export type FormState = { error?: string } | undefined;

/** Blow away every cached read of project content - edits go live instantly. */
function publish(slug?: string) {
  revalidateTag(PROJECTS_TAG, "max");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/sitemap.xml");
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
    return { error: "Admin account already exists - log in instead." };
  try {
    await createAdmin(
      email,
      password,
      String(formData.get("setupToken") ?? "") || undefined,
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Setup failed." };
  }
  await createSession();
  redirect("/admin");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ipHash = await clientIpHash();
  if (await isRateLimited(ipHash))
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const ok = await verifyCredentials(email, password, ipHash);
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

/** Full save of a project's content (called from the editor).
 *  mode "draft" stores to draft_data without touching the live site;
 *  mode "publish" snapshots the old version, goes live, clears the draft. */
export async function saveProjectAction(
  slug: string,
  project: Project,
  visible: boolean,
  mode: "publish" | "draft" = "publish",
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
    } else if (mode === "draft") {
      // Visibility is live state, not draft content - the editor promises
      // "off = hidden everywhere", so honor the toggle on draft saves too.
      const rows = (await sql`
        UPDATE projects SET draft_data = ${JSON.stringify(project)}::jsonb,
            visible = ${visible}, updated_at = now()
        WHERE slug = ${slug} RETURNING slug
      `) as unknown[];
      if (rows.length === 0) return { error: `Project "${slug}" not found.` };
      publish(slug);
      return { slug };
    } else {
      const current = (await sql`SELECT data FROM projects WHERE slug = ${slug}`) as { data: unknown }[];
      if (current.length === 0) return { error: `Project "${slug}" not found.` };
      await snapshot(sql, "project", slug, current[0].data);
      await sql`
        UPDATE projects
        SET slug = ${nextSlug}, data = ${JSON.stringify(project)}::jsonb,
            visible = ${visible}, draft_data = NULL, updated_at = now()
        WHERE slug = ${slug}
      `;
      // Keep revision history attached across slug renames.
      if (nextSlug !== slug)
        await sql`UPDATE revisions SET ref = ${nextSlug} WHERE kind = 'project' AND ref = ${slug}`;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed.";
    return { error: msg.includes("duplicate") ? `Slug "${nextSlug}" is already taken.` : msg };
  }
  publish(slug);
  publish(nextSlug);
  return { slug: nextSlug };
}

export async function discardDraftAction(
  kind: "project" | "page",
  slug: string,
) {
  await requireAdmin();
  const sql = await db();
  if (kind === "project") {
    await sql`UPDATE projects SET draft_data = NULL WHERE slug = ${slug}`;
  } else {
    await sql`UPDATE pages SET draft_data = NULL WHERE slug = ${slug}`;
  }
}

// ---------- Revisions ----------

export async function restoreRevisionAction(
  id: number,
): Promise<{ error?: string }> {
  await requireAdmin();
  const rev = await getRevision(id);
  if (!rev) return { error: "Revision not found." };
  const sql = await db();
  const kind = rev.kind as RevisionKind;
  const json = JSON.stringify(rev.data);
  if (kind === "project" || kind === "service" || kind === "page") {
    // Snapshot what's live now so the restore itself is undoable
    const current =
      kind === "project"
        ? ((await sql`SELECT data FROM projects WHERE slug = ${rev.ref}`) as { data: unknown }[])
        : kind === "service"
          ? ((await sql`SELECT data FROM services WHERE slug = ${rev.ref}`) as { data: unknown }[])
          : ((await sql`SELECT data FROM pages WHERE slug = ${rev.ref}`) as { data: unknown }[]);
    if (current.length === 0)
      return { error: `The ${kind} "${rev.ref}" no longer exists - restore isn't possible.` };
    await snapshot(sql, kind, rev.ref, current[0].data);
    if (kind === "project") {
      await sql`UPDATE projects SET data = ${json}::jsonb, updated_at = now() WHERE slug = ${rev.ref}`;
      publish(rev.ref);
    } else if (kind === "service") {
      await sql`UPDATE services SET data = ${json}::jsonb, updated_at = now() WHERE slug = ${rev.ref}`;
      publishServices(rev.ref);
    } else {
      await sql`UPDATE pages SET data = ${json}::jsonb, updated_at = now() WHERE slug = ${rev.ref}`;
      publishPages(rev.ref);
    }
  } else {
    const current = (await sql`SELECT data FROM site_content WHERE key = ${rev.ref}`) as { data: unknown }[];
    if (current.length > 0) await snapshot(sql, "site", rev.ref, current[0].data);
    await sql`
      INSERT INTO site_content (key, data) VALUES (${rev.ref}, ${json}::jsonb)
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
    publishSite();
  }
  return {};
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
  // A later item reusing this slug must not inherit the dead item's history.
  await sql`DELETE FROM revisions WHERE kind = 'project' AND ref = ${slug}`;
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

// ---------- Site content ----------

/** Everything-invalidate helper for site-wide surfaces. */
function publishSite() {
  revalidateTag(SITE_TAG, "max");
  revalidatePath("/", "layout"); // nav/footer render on every page
  // Metadata routes cache their output separately from pages - without
  // these, a Site Url change leaves sitemap/robots on the old domain.
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
}

export async function saveSiteContentAction(
  key: SiteContentKey,
  data: unknown,
): Promise<{ error?: string }> {
  await requireAdmin();
  const sql = await db();
  try {
    const current = (await sql`SELECT data FROM site_content WHERE key = ${key}`) as { data: unknown }[];
    if (current.length > 0) await snapshot(sql, "site", key, current[0].data);
    await sql`
      INSERT INTO site_content (key, data)
      VALUES (${key}, ${JSON.stringify(data)}::jsonb)
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Save failed." };
  }
  publishSite();
  return {};
}

// ---------- Services ----------

function publishServices(slug?: string) {
  revalidateTag(SERVICES_TAG, "max");
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/services/${slug}`);
}

export async function seedServicesAction() {
  await requireAdmin();
  await seedServicesDb();
  publishServices();
  redirect("/admin/services");
}

export async function saveServiceAction(
  slug: string,
  service: Service,
  visible: boolean,
): Promise<{ error?: string; slug?: string }> {
  await requireAdmin();
  const sql = await db();
  const nextSlug = service.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  if (!nextSlug) return { error: "Slug can't be empty." };
  service.slug = nextSlug;
  try {
    if (slug === "__new__") {
      const max = (await sql`SELECT coalesce(max(sort_order), -1)::int AS m FROM services`) as { m: number }[];
      await sql`
        INSERT INTO services (slug, data, visible, sort_order)
        VALUES (${nextSlug}, ${JSON.stringify(service)}::jsonb, ${visible}, ${max[0].m + 1})
      `;
    } else {
      const current = (await sql`SELECT data FROM services WHERE slug = ${slug}`) as { data: unknown }[];
      if (current.length === 0) return { error: `Service "${slug}" not found.` };
      await snapshot(sql, "service", slug, current[0].data);
      await sql`
        UPDATE services
        SET slug = ${nextSlug}, data = ${JSON.stringify(service)}::jsonb,
            visible = ${visible}, updated_at = now()
        WHERE slug = ${slug}
      `;
      if (nextSlug !== slug) {
        // Keep history attached and repair other services' "next" pointers.
        await sql`UPDATE revisions SET ref = ${nextSlug} WHERE kind = 'service' AND ref = ${slug}`;
        await sql`
          UPDATE services
          SET data = jsonb_set(data, '{next}', to_jsonb(${nextSlug}::text))
          WHERE data->>'next' = ${slug}
        `;
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed.";
    return { error: msg.includes("duplicate") ? `Slug "${nextSlug}" is already taken.` : msg };
  }
  publishServices(slug);
  publishServices(nextSlug);
  return { slug: nextSlug };
}

export async function toggleServiceVisibleAction(slug: string, visible: boolean) {
  await requireAdmin();
  const sql = await db();
  await sql`UPDATE services SET visible = ${visible}, updated_at = now() WHERE slug = ${slug}`;
  publishServices(slug);
}

export async function deleteServiceAction(slug: string) {
  await requireAdmin();
  const sql = await db();
  await sql`DELETE FROM services WHERE slug = ${slug}`;
  await sql`DELETE FROM revisions WHERE kind = 'service' AND ref = ${slug}`;
  publishServices(slug);
}

export async function reorderServicesAction(slugs: string[]) {
  await requireAdmin();
  const sql = await db();
  for (let i = 0; i < slugs.length; i++) {
    await sql`UPDATE services SET sort_order = ${i} WHERE slug = ${slugs[i]}`;
  }
  publishServices();
}

// ---------- Custom pages ----------

function publishPages(slug?: string) {
  revalidateTag(PAGES_TAG, "max");
  revalidatePath("/", "layout"); // nav may list custom pages
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/${slug}`);
}

const RESERVED_SLUGS = new Set([
  "work",
  "services",
  "about",
  "contact",
  "admin",
  "api",
]);

export async function savePageAction(
  slug: string,
  page: CustomPage,
  visible: boolean,
  showInNav: boolean,
  mode: "publish" | "draft" = "publish",
): Promise<{ error?: string; slug?: string }> {
  await requireAdmin();
  const sql = await db();
  const nextSlug = page.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  if (!nextSlug) return { error: "Slug can't be empty." };
  if (RESERVED_SLUGS.has(nextSlug))
    return { error: `"/${nextSlug}" is a built-in route - pick another slug.` };
  page.slug = nextSlug;
  try {
    if (slug === "__new__") {
      const max = (await sql`SELECT coalesce(max(sort_order), -1)::int AS m FROM pages`) as { m: number }[];
      await sql`
        INSERT INTO pages (slug, data, visible, show_in_nav, sort_order)
        VALUES (${nextSlug}, ${JSON.stringify(page)}::jsonb, ${visible}, ${showInNav}, ${max[0].m + 1})
      `;
    } else if (mode === "draft") {
      // Visibility and nav placement are live state - honor the toggles
      // on draft saves too, as the editor copy promises.
      const rows = (await sql`
        UPDATE pages SET draft_data = ${JSON.stringify(page)}::jsonb,
            visible = ${visible}, show_in_nav = ${showInNav}, updated_at = now()
        WHERE slug = ${slug} RETURNING slug
      `) as unknown[];
      if (rows.length === 0) return { error: `Page "${slug}" not found.` };
      publishPages(slug);
      return { slug };
    } else {
      const current = (await sql`SELECT data FROM pages WHERE slug = ${slug}`) as { data: unknown }[];
      if (current.length === 0) return { error: `Page "${slug}" not found.` };
      await snapshot(sql, "page", slug, current[0].data);
      await sql`
        UPDATE pages
        SET slug = ${nextSlug}, data = ${JSON.stringify(page)}::jsonb,
            visible = ${visible}, show_in_nav = ${showInNav}, draft_data = NULL,
            updated_at = now()
        WHERE slug = ${slug}
      `;
      if (nextSlug !== slug)
        await sql`UPDATE revisions SET ref = ${nextSlug} WHERE kind = 'page' AND ref = ${slug}`;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed.";
    return { error: msg.includes("duplicate") ? `Slug "${nextSlug}" is already taken.` : msg };
  }
  publishPages(slug);
  publishPages(nextSlug);
  return { slug: nextSlug };
}

export async function togglePageVisibleAction(slug: string, visible: boolean) {
  await requireAdmin();
  const sql = await db();
  await sql`UPDATE pages SET visible = ${visible}, updated_at = now() WHERE slug = ${slug}`;
  publishPages(slug);
}

export async function deletePageAction(slug: string) {
  await requireAdmin();
  const sql = await db();
  await sql`DELETE FROM pages WHERE slug = ${slug}`;
  await sql`DELETE FROM revisions WHERE kind = 'page' AND ref = ${slug}`;
  publishPages(slug);
}

// ---------- Inbox ----------

export async function markMessageHandledAction(id: number, handled: boolean) {
  await requireAdmin();
  const sql = await db();
  await sql`UPDATE messages SET handled = ${handled} WHERE id = ${id}`;
}

export async function deleteMessageAction(id: number) {
  await requireAdmin();
  const sql = await db();
  await sql`DELETE FROM messages WHERE id = ${id}`;
}

// ---------- Resume ----------

export async function uploadResumeAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { error: "No file selected." };
  if (file.size > 15 * 1024 * 1024) return { error: "Max file size is 15MB." };
  // Verify the actual bytes are a PDF (%PDF), not just the claimed type.
  const pdfHead = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  if (!(pdfHead[0] === 0x25 && pdfHead[1] === 0x50 && pdfHead[2] === 0x44 && pdfHead[3] === 0x46))
    return { error: "Resume must be a PDF." };
  try {
    const blob = await put(`portfolio/resume-${Date.now()}.pdf`, file, {
      access: "public",
    });
    const sql = await db();
    await sql`
      INSERT INTO site_content (key, data)
      VALUES ('settings', ${JSON.stringify({ resumeUrl: blob.url })}::jsonb)
      ON CONFLICT (key) DO UPDATE
      SET data = site_content.data || ${JSON.stringify({ resumeUrl: blob.url })}::jsonb,
          updated_at = now()
    `;
    publishSite();
    return { url: blob.url };
  } catch {
    return { error: "Upload failed - is the Blob store connected?" };
  }
}

// ---------- Media ----------

/** Magic-byte sniffing - trust the file's actual bytes, not the
 *  client-supplied MIME type. Notably rejects SVG (scriptable). */
function sniffMediaType(bytes: Uint8Array): { ext: string } | null {
  const startsWith = (sig: number[], offset = 0) =>
    sig.every((b, i) => bytes[offset + i] === b);
  if (startsWith([0xff, 0xd8, 0xff])) return { ext: "jpg" };
  if (startsWith([0x89, 0x50, 0x4e, 0x47])) return { ext: "png" };
  if (startsWith([0x47, 0x49, 0x46, 0x38])) return { ext: "gif" };
  // RIFF....WEBP
  if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8))
    return { ext: "webp" };
  // ....ftyp (mp4/mov family)
  if (startsWith([0x66, 0x74, 0x79, 0x70], 4)) return { ext: "mp4" };
  // EBML (webm/mkv)
  if (startsWith([0x1a, 0x45, 0xdf, 0xa3])) return { ext: "webm" };
  return null;
}

export async function uploadImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { error: "No file selected." };
  if (file.size > 15 * 1024 * 1024) return { error: "Max file size is 15MB." };
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const sniffed = sniffMediaType(head);
  if (!sniffed)
    return {
      error: "Only JPG, PNG, GIF, WebP, MP4, or WebM files (SVG not allowed).",
    };
  try {
    // Random name + sniffed extension - the client filename never
    // reaches the blob path.
    const name = `portfolio/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${sniffed.ext}`;
    const blob = await put(name, file, { access: "public" });
    return { url: blob.url };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("token")
          ? "Blob store not connected - link portfolio-media to the project in Vercel."
          : "Upload failed.",
    };
  }
}
