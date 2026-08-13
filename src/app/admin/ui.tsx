"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { CaseStudySection } from "@/lib/projects";
import { uploadImageAction } from "./actions";

export const inputCls =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent transition-colors";
export const labelCls =
  "font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mb-1.5 block";
export const chipCls =
  "rounded-full border border-border px-3 py-1.5 text-xs hover:border-fg transition-colors";

export function Field({
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
      <span className={labelCls}>{name}</span>
      {textarea ? (
        <textarea
          className={`${inputCls} min-h-24 resize-y`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputCls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AutoForm — renders an editor for any JSON content shape, driven by  */
/* the default value's structure. Strings → inputs/textareas,          */
/* string[] → line-separated textarea, object[] → repeatable cards,    */
/* nested objects → fieldsets. Future content types need no new UI.    */
/* ------------------------------------------------------------------ */

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function AutoForm({
  value,
  onChange,
  path = "",
}: {
  value: unknown;
  onChange: (next: unknown) => void;
  path?: string;
}) {
  if (typeof value === "string") {
    const long = value.length > 80 || value.includes("\n");
    return long ? (
      <textarea
        className={`${inputCls} min-h-24 resize-y`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--color-accent)]"
      />
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        className={inputCls}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }

  if (Array.isArray(value)) {
    // Array of strings → one per line
    if (value.every((v) => typeof v === "string")) {
      return (
        <div>
          <textarea
            className={`${inputCls} min-h-28 resize-y`}
            value={(value as string[]).join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n"))}
            onBlur={(e) =>
              onChange(e.target.value.split("\n").filter((l) => l.trim().length))
            }
          />
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg-subtle mt-1">
            One item per line
          </p>
        </div>
      );
    }
    // Array of objects → repeatable cards
    return (
      <div className="flex flex-col gap-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-bg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
                {i + 1}
              </span>
              <span className="flex gap-1">
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => {
                    const next = [...value];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}
                  className="h-6 w-6 rounded border border-border text-xs disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={i === value.length - 1}
                  onClick={() => {
                    const next = [...value];
                    [next[i], next[i + 1]] = [next[i + 1], next[i]];
                    onChange(next);
                  }}
                  className="h-6 w-6 rounded border border-border text-xs disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  className="h-6 w-6 rounded border border-border text-xs text-fg-muted hover:border-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              </span>
            </div>
            <AutoForm
              value={item}
              path={`${path}[${i}]`}
              onChange={(next) =>
                onChange(value.map((v, j) => (j === i ? next : v)))
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const template = isRecord(value[0])
              ? Object.fromEntries(
                  Object.entries(value[0]).map(([k, v]) => [
                    k,
                    typeof v === "string" ? "" : v,
                  ]),
                )
              : "";
            onChange([...value, template]);
          }}
          className={`${chipCls} self-start`}
        >
          + Add item
        </button>
      </div>
    );
  }

  if (isRecord(value)) {
    return (
      <div className="flex flex-col gap-4">
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <span className={labelCls}>{humanize(k)}</span>
            <AutoForm
              value={v}
              path={path ? `${path}.${k}` : k}
              onChange={(next) => onChange({ ...value, [k]: next })}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* SectionsEditor — block-based sections (text/image/video/embed),     */
/* shared by the project editor and the custom-page editor.            */
/* ------------------------------------------------------------------ */

export function SectionsEditor({
  sections,
  onChange,
}: {
  sections: CaseStudySection[];
  onChange: (next: CaseStudySection[]) => void;
}) {
  const setSection = (i: number, s: CaseStudySection) =>
    onChange(sections.map((cur, j) => (j === i ? s : cur)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const add = (type: "text" | "image" | "video" | "embed") =>
    onChange([
      ...sections,
      type === "text"
        ? { type, eyebrow: `0${sections.length + 1} · `, title: "", body: "" }
        : type === "embed"
          ? { type, url: "" }
          : { type, src: "" },
    ]);

  return (
    <div className="flex flex-col gap-4">
      {sections.map((s, i) => (
        <SectionCard
          key={i}
          section={s}
          index={i}
          total={sections.length}
          onChange={(next) => setSection(i, next)}
          onMove={(dir) => move(i, dir)}
          onDelete={() => onChange(sections.filter((_, j) => j !== i))}
        />
      ))}
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mr-1">
          Add block:
        </span>
        <button type="button" className={chipCls} onClick={() => add("text")}>
          + Text
        </button>
        <button type="button" className={chipCls} onClick={() => add("image")}>
          + Image
        </button>
        <button type="button" className={chipCls} onClick={() => add("video")}>
          + Video
        </button>
        <button type="button" className={chipCls} onClick={() => add("embed")}>
          + Embed
        </button>
      </div>
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
            type="button"
            aria-label="Move block up"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="h-7 w-7 rounded border border-border text-xs disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            aria-label="Move block down"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="h-7 w-7 rounded border border-border text-xs disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
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
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={chipCls}
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

/* ------------------------------------------------------------------ */
/* AdminTabs — shared header nav across admin pages                    */
/* ------------------------------------------------------------------ */

export function AdminTabs({ active }: { active: string }) {
  const tabs = [
    { key: "projects", label: "Projects", href: "/admin" },
    { key: "services", label: "Services", href: "/admin/services" },
    { key: "pages", label: "Pages", href: "/admin/pages" },
    { key: "site", label: "Site content", href: "/admin/site" },
    { key: "settings", label: "Settings", href: "/admin/settings" },
  ];
  return (
    <nav className="flex flex-wrap gap-1 mb-10 rounded-full border border-border bg-surface p-1 w-fit">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            active === t.key
              ? "bg-fg text-bg"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
