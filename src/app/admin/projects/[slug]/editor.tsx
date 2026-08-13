"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { CaseStudySection, Project } from "@/lib/projects";
import { saveProjectAction } from "../../actions";
import { Field, SectionsEditor, labelCls as label } from "../../ui";

/* Accent options mirror the palette already used across the site,
   so new projects automatically follow the existing guidelines. */
const ACCENTS = [
  "#E85D2E",
  "#F39B5A",
  "#C96E4C",
  "#2E6BE8",
  "#5C7F6A",
  "#4A8B7C",
  "#6B5BD9",
];

export function ProjectEditor({
  originalSlug,
  project: initial,
  visible: initialVisible,
}: {
  originalSlug: string;
  project: Project;
  visible: boolean;
}) {
  const router = useRouter();
  const [p, setP] = useState<Project>(initial);
  const [visible, setVisible] = useState(initialVisible);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    setP((prev) => ({ ...prev, [key]: value }));

  const setSections = (sections: CaseStudySection[]) =>
    setP((prev) => ({ ...prev, sections }));

  const save = () => {
    setError(null);
    if (!p.title.trim()) return setError("Title is required.");
    if (!p.slug.trim() && originalSlug === "__new__")
      set("slug", p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    startTransition(async () => {
      const res = await saveProjectAction(originalSlug, p, visible);
      if (res.error) {
        setError(res.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        if (originalSlug === "__new__") router.push("/admin");
        else if (res.slug && res.slug !== originalSlug)
          router.replace(`/admin/projects/${res.slug}`);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-10">
        <div>
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted hover:text-fg transition-colors"
          >
            ← All projects
          </Link>
          <h1 className="font-display text-4xl mt-3">
            {originalSlug === "__new__" ? "New project" : `Edit · ${initial.title}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {originalSlug !== "__new__" && (
            <Link
              href={`/work/${originalSlug}`}
              target="_blank"
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors"
            >
              Preview ↗
            </Link>
          )}
          <button
            onClick={save}
            disabled={pending}
            className="rounded-full bg-fg text-bg px-6 py-2.5 text-sm font-medium hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
          >
            {pending ? "Publishing…" : saved ? "Published ✓" : "Save & publish"}
          </button>
        </div>
      </header>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Visibility + featured */}
      <div className="flex flex-wrap gap-6 mb-10 rounded-2xl border border-border bg-surface p-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm">
            Visible on site
            <span className="block text-xs text-fg-muted">
              Off = hidden everywhere, still editable here
            </span>
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={p.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm">
            Featured on homepage
            <span className="block text-xs text-fg-muted">
              Shows in the Selected Work grid
            </span>
          </span>
        </label>
      </div>

      {/* Meta */}
      <section className="flex flex-col gap-4 mb-12">
        <h2 className="font-display text-2xl">Basics</h2>
        <Field name="Title" value={p.title} onChange={(v) => set("title", v)} />
        <Field
          name="Slug (URL: /work/…)"
          value={p.slug}
          onChange={(v) => set("slug", v)}
        />
        <Field
          name="Tagline (shown under the title)"
          textarea
          value={p.tagline}
          onChange={(v) => set("tagline", v)}
        />
        <Field
          name="Description (cards + SEO)"
          textarea
          value={p.description}
          onChange={(v) => set("description", v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field name="Client" value={p.client} onChange={(v) => set("client", v)} />
          <Field name="Year" value={p.year} onChange={(v) => set("year", v)} />
          <Field name="Role" value={p.role} onChange={(v) => set("role", v)} />
          <Field
            name="Stack / tags (comma-separated)"
            value={p.stack.join(", ")}
            onChange={(v) =>
              set(
                "stack",
                v.split(",").map((s) => s.trim()).filter(Boolean),
              )
            }
          />
        </div>
        <Field
          name="Outcome (one-liner, optional)"
          value={p.outcome ?? ""}
          onChange={(v) => set("outcome", v || undefined)}
        />
        <Field
          name="Reflection quote (optional)"
          textarea
          value={p.reflection ?? ""}
          onChange={(v) => set("reflection", v || undefined)}
        />

        <div>
          <span className={label}>Accent color (site palette)</span>
          <div className="flex items-center gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a}
                aria-label={`Accent ${a}`}
                onClick={() => set("accent", a)}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  p.accent === a ? "border-fg scale-110" : "border-transparent"
                }`}
                style={{ background: a }}
              />
            ))}
            <input
              type="color"
              aria-label="Custom accent"
              value={p.accent}
              onChange={(e) => set("accent", e.target.value)}
              className="h-8 w-8 rounded-full border border-border bg-surface cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Live preview embed */}
      <section className="flex flex-col gap-4 mb-12">
        <h2 className="font-display text-2xl">Live preview window</h2>
        <p className="text-sm text-fg-muted -mt-2">
          Optional — embeds a browser window at the end of the case study.
        </p>
        <Field
          name="Live URL"
          value={p.liveUrl ?? ""}
          placeholder="https://…"
          onChange={(v) => set("liveUrl", v || undefined)}
        />
        <Field
          name="Heading"
          value={p.liveHeading ?? ""}
          placeholder="See it in production."
          onChange={(v) => set("liveHeading", v || undefined)}
        />
        <Field
          name="Caption"
          textarea
          value={p.liveCaption ?? ""}
          onChange={(v) => set("liveCaption", v || undefined)}
        />
      </section>

      {/* Sections */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl">Case study sections</h2>
        <SectionsEditor sections={p.sections} onChange={setSections} />
      </section>

      <div className="mt-12 pt-8 border-t border-border flex justify-end">
        <button
          onClick={save}
          disabled={pending}
          className="rounded-full bg-fg text-bg px-8 py-3.5 font-medium hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
        >
          {pending ? "Publishing…" : saved ? "Published ✓" : "Save & publish"}
        </button>
      </div>
    </div>
  );
}
