"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { SiteContentKey } from "@/lib/site";
import { saveSiteContentAction } from "../../actions";
import { AutoForm } from "../../ui";

export function SiteEditor({
  contentKey,
  title,
  initial,
}: {
  contentKey: SiteContentKey;
  title: string;
  initial: unknown;
}) {
  const [value, setValue] = useState<unknown>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      setError(null);
      const res = await saveSiteContentAction(contentKey, value);
      if (res.error) {
        setError(res.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-10">
        <div>
          <Link
            href="/admin/site"
            className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted hover:text-fg transition-colors"
          >
            ← Site content
          </Link>
          <h1 className="font-display text-4xl mt-3">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/history/site/${contentKey}`}
            className="rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors"
          >
            History
          </Link>
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

      <div className="rounded-2xl border border-border bg-surface p-6">
        <AutoForm value={value} onChange={setValue} />
      </div>

      <div className="mt-8 flex justify-end">
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
