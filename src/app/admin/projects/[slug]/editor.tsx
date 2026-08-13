"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { CaseStudySection, Project } from "@/lib/projects";
import { saveProjectAction, uploadImageAction } from "../../actions";

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

const input =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent transition-colors";
const label =
  "font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mb-1.5 block";
const chip =
  "rounded-full border border-border px-3 py-1.5 text-xs hover:border-fg transition-colors";

function Field({
  name,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <span className={label}>{name}</span>
      {textarea ? (
        <textarea
          className={`${input} min-h-24 resize-y`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={input}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function SectionCard({
  section,
  index,
  total,
  onChange,
  onMove,
  onDelete,
}: {
  section: CaseStudySection;
  index: number;
  total: number;
  onChange: (s: CaseStudySection) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const type = section.type ?? "text";

  const upload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadImageAction(fd);
    setUploading(false);
    if (res.url && (type === "image" || type === "video")) {
      onChange({ ...section, src: res.url } as CaseStudySection);
    } else if (res.error) {
      alert(res.error);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
          {index + 1} · {type} block
        </span>
        <span className="flex gap-1">
          <button
            aria-label="Move block up"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="h-7 w-7 rounded border border-border text-xs disabled:opacity-30"
          >
            ↑
          </button>
          <button
            aria-label="Move block down"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="h-7 w-7 rounded border border-border text-xs disabled:opacity-30"
          >
            ↓
          </button>
          <button
            aria-label="Delete block"
            onClick={onDelete}
            className="h-7 w-7 rounded border border-border text-xs text-fg-muted hover:border-red-400 hover:text-red-500"
          >
            ✕
          </button>
        </span>
      </div>

      {type === "text" && "eyebrow" in section && (
        <div className="flex flex-col gap-3">
          <Field
            name="Eyebrow"
            value={section.eyebrow}
            placeholder="01 · Context"
            onChange={(v) => onChange({ ...section, eyebrow: v })}
          />
          <Field
            name="Heading"
            value={section.title}
            onChange={(v) => onChange({ ...section, title: v })}
          />
          <Field
            name="Body"
            textarea
            value={section.body}
            onChange={(v) => onChange({ ...section, body: v })}
          />
          <Field
            name="Bullets (one per line, optional)"
            textarea
            value={(section.bullets ?? []).join("\n")}
            onChange={(v) =>
              onChange({
                ...section,
                bullets: v.split("\n").filter((b) => b.trim().length > 0),
              })
            }
          />
        </div>
      )}

      {(type === "image" || type === "video") && "src" in section && (
        <div className="flex flex-col gap-3">
          <Field
            name={type === "image" ? "Image URL" : "Video URL (file or YouTube/Vimeo)"}
            value={section.src}
            placeholder="https://…"
            onChange={(v) => onChange({ ...section, src: v })}
          />
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept={type === "image" ? "image/*" : "video/*"}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={chip}
            >
              {uploading ? "Uploading…" : "Upload file"}
            </button>
            {section.src && type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={section.src}
                alt=""
                className="h-14 w-20 object-cover rounded-lg border border-border"
              />
            )}
          </div>
          {type === "image" && (
            <Field
              name="Alt text"
              value={("alt" in section && section.alt) || ""}
              onChange={(v) =>
                onChange({ ...section, alt: v } as CaseStudySection)
              }
            />
          )}
          <Field
            name="Caption (optional)"
            value={section.caption ?? ""}
            onChange={(v) => onChange({ ...section, caption: v })}
          />
        </div>
      )}

      {type === "embed" && "url" in section && (
        <div className="flex flex-col gap-3">
          <Field
            name="Embed URL"
            value={section.url}
            placeholder="https://… (Figma prototype, live site)"
            onChange={(v) => onChange({ ...section, url: v })}
          />
          <Field
            name="Caption (optional)"
            value={section.caption ?? ""}
            onChange={(v) => onChange({ ...section, caption: v })}
          />
        </div>
      )}
    </div>
  );
}

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

  const setSection = (i: number, s: CaseStudySection) =>
    setP((prev) => {
      const sections = [...prev.sections];
      sections[i] = s;
      return { ...prev, sections };
    });

  const moveSection = (i: number, dir: -1 | 1) =>
    setP((prev) => {
      const sections = [...prev.sections];
      const j = i + dir;
      if (j < 0 || j >= sections.length) return prev;
      [sections[i], sections[j]] = [sections[j], sections[i]];
      return { ...prev, sections };
    });

  const addSection = (type: "text" | "image" | "video" | "embed") =>
    setP((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        type === "text"
          ? { type, eyebrow: `0${prev.sections.length + 1} · `, title: "", body: "" }
          : type === "embed"
            ? { type, url: "" }
            : { type, src: "" },
      ],
    }));

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
        {p.sections.map((s, i) => (
          <SectionCard
            key={i}
            section={s}
            index={i}
            total={p.sections.length}
            onChange={(next) => setSection(i, next)}
            onMove={(dir) => moveSection(i, dir)}
            onDelete={() =>
              setP((prev) => ({
                ...prev,
                sections: prev.sections.filter((_, j) => j !== i),
              }))
            }
          />
        ))}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mr-1">
            Add block:
          </span>
          <button className={chip} onClick={() => addSection("text")}>
            + Text
          </button>
          <button className={chip} onClick={() => addSection("image")}>
            + Image
          </button>
          <button className={chip} onClick={() => addSection("video")}>
            + Video
          </button>
          <button className={chip} onClick={() => addSection("embed")}>
            + Embed
          </button>
        </div>
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
