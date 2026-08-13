"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Service } from "@/lib/services";
import { saveServiceAction } from "../../actions";
import { AutoForm } from "../../ui";

export function ServiceEditor({
  originalSlug,
  service: initial,
  visible: initialVisible,
}: {
  originalSlug: string;
  service: Service;
  visible: boolean;
}) {
  const router = useRouter();
  const [service, setService] = useState<Service>(initial);
  const [visible, setVisible] = useState(initialVisible);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const save = () => {
    setError(null);
    if (!service.title.trim()) return setError("Title is required.");
    startTransition(async () => {
      const res = await saveServiceAction(originalSlug, service, visible);
      if (res.error) {
        setError(res.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        if (originalSlug === "__new__") router.push("/admin/services");
        else if (res.slug && res.slug !== originalSlug)
          router.replace(`/admin/services/${res.slug}`);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-10">
        <div>
          <Link
            href="/admin/services"
            className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted hover:text-fg transition-colors"
          >
            ← All services
          </Link>
          <h1 className="font-display text-4xl mt-3">
            {originalSlug === "__new__" ? "New service" : `Edit · ${initial.title}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {originalSlug !== "__new__" && (
            <Link
              href={`/services/${originalSlug}`}
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
              Off = hidden from home grid, services page, and nav
            </span>
          </span>
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <AutoForm
          value={service}
          onChange={(next) => setService(next as Service)}
        />
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
