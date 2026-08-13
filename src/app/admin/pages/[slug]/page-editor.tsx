"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { CustomPage } from "@/lib/pages-data";
import { discardDraftAction, savePageAction } from "../../actions";
import { Field, SectionsEditor } from "../../ui";

export function PageEditor({
  originalSlug,
  page: initial,
  visible: initialVisible,
  showInNav: initialShowInNav,
  hasDraft: initialHasDraft,
}: {
  originalSlug: string;
  page: CustomPage;
  visible: boolean;
  showInNav: boolean;
  hasDraft: boolean;
}) {
  const router = useRouter();
  const [p, setP] = useState<CustomPage>(initial);
  const [visible, setVisible] = useState(initialVisible);
  const [showInNav, setShowInNav] = useState(initialShowInNav);
  const [hasDraft, setHasDraft] = useState(initialHasDraft);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<"published" | "drafted" | false>(false);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof CustomPage>(key: K, value: CustomPage[K]) =>
    setP((prev) => ({ ...prev, [key]: value }));

  const save = (mode: "publish" | "draft") => {
    setError(null);
    if (!p.title.trim()) return setError("Title is required.");
    const page = { ...p };
    if (!page.slug.trim())
      page.slug = page.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    startTransition(async () => {
      const res = await savePageAction(
        originalSlug,
        page,
        visible,
        showInNav,
        mode,
      );
      if (res.error) {
        setError(res.error);
      } else {
        setSaved(mode === "draft" ? "drafted" : "published");
        setHasDraft(mode === "draft");
        setTimeout(() => setSaved(false), 2500);
        if (originalSlug === "__new__") router.push("/admin/pages");
        else if (mode === "publish" && res.slug && res.slug !== originalSlug)
          router.replace(`/admin/pages/${res.slug}`);
      }
    });
  };

  const discard = () =>
    startTransition(async () => {
      await discardDraftAction("page", originalSlug);
      setHasDraft(false);
      router.refresh();
      window.location.reload();
    });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-10">
        <div>
          <Link
            href="/admin/pages"
            className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted hover:text-fg transition-colors"
          >
            ← All pages
          </Link>
          <h1 className="font-display text-4xl mt-3">
            {originalSlug === "__new__" ? "New page" : `Edit · ${initial.title}`}
            {hasDraft && (
              <span className="ml-3 align-middle font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-1 rounded-full border border-accent/40 text-accent">
                Draft pending
              </span>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {originalSlug !== "__new__" && (
            <>
              <Link
                href={`/admin/history/page/${originalSlug}`}
                className="rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors"
              >
                History
              </Link>
              <Link
                href={`/admin/preview/page/${originalSlug}`}
                target="_blank"
                className="rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors"
              >
                Preview ↗
              </Link>
              {hasDraft && (
                <button
                  onClick={discard}
                  disabled={pending}
                  className="rounded-full border border-border px-4 py-2 text-sm text-fg-muted hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  Discard draft
                </button>
              )}
              <button
                onClick={() => save("draft")}
                disabled={pending}
                className="rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors disabled:opacity-50"
              >
                {saved === "drafted" ? "Draft saved ✓" : "Save draft"}
              </button>
            </>
          )}
          <button
            onClick={() => save("publish")}
            disabled={pending}
            className="rounded-full bg-fg text-bg px-6 py-2.5 text-sm font-medium hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
          >
            {pending ? "Saving…" : saved === "published" ? "Published ✓" : "Publish"}
          </button>
        </div>
      </header>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-6 mb-10 rounded-2xl border border-border bg-surface p-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm">
            Live on site
            <span className="block text-xs text-fg-muted">
              Off = the URL 404s until you&apos;re ready
            </span>
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showInNav}
            onChange={(e) => setShowInNav(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm">
            Show in navigation
            <span className="block text-xs text-fg-muted">
              Adds this page to the top menu
            </span>
          </span>
        </label>
      </div>

      <section className="flex flex-col gap-4 mb-12">
        <h2 className="font-display text-2xl">Page basics</h2>
        <Field name="Title" value={p.title} onChange={(v) => set("title", v)} />
        <Field
          name="Slug (URL: /…)"
          value={p.slug}
          onChange={(v) => set("slug", v)}
        />
        <Field
          name="Eyebrow (small label above the heading, optional)"
          value={p.eyebrow}
          onChange={(v) => set("eyebrow", v)}
        />
        <Field name="Heading" value={p.heading} onChange={(v) => set("heading", v)} />
        <Field
          name="Heading emphasis (italic accent part, optional)"
          value={p.headingEmphasis}
          onChange={(v) => set("headingEmphasis", v)}
        />
        <Field
          name="Intro / description"
          textarea
          value={p.description}
          onChange={(v) => set("description", v)}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl">Page sections</h2>
        <SectionsEditor
          sections={p.sections}
          onChange={(sections) => set("sections", sections)}
        />
      </section>

      <div className="mt-12 pt-8 border-t border-border flex justify-end gap-2">
        {originalSlug !== "__new__" && (
          <button
            onClick={() => save("draft")}
            disabled={pending}
            className="rounded-full border border-border px-6 py-3.5 text-sm hover:border-fg transition-colors disabled:opacity-50"
          >
            {saved === "drafted" ? "Draft saved ✓" : "Save draft"}
          </button>
        )}
        <button
          onClick={() => save("publish")}
          disabled={pending}
          className="rounded-full bg-fg text-bg px-8 py-3.5 font-medium hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
        >
          {pending ? "Saving…" : saved === "published" ? "Published ✓" : "Publish"}
        </button>
      </div>
    </div>
  );
}
