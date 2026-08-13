"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { ManagedPage } from "@/lib/pages-data";
import { deletePageAction, togglePageVisibleAction } from "../actions";

export function PageList({ pages }: { pages: ManagedPage[] }) {
  const [items, setItems] = useState(pages);
  const [, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggle = (slug: string, visible: boolean) => {
    setItems((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, visible } : p)),
    );
    startTransition(() => togglePageVisibleAction(slug, visible));
  };

  const remove = (slug: string) => {
    setConfirmDelete(null);
    setItems((prev) => prev.filter((p) => p.slug !== slug));
    startTransition(() => deletePageAction(slug));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
          {items.length} pages · {items.filter((p) => p.visible).length} live
        </p>
        <Link
          href="/admin/pages/__new__"
          className="rounded-full bg-fg text-bg px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-white transition-colors"
        >
          + New page
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-fg-muted">
            No custom pages yet — create your first one.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((p) => (
            <li
              key={p.slug}
              className={`rounded-2xl border border-border bg-surface p-5 flex flex-wrap items-center gap-4 ${
                p.visible ? "" : "opacity-55"
              }`}
            >
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl">{p.title}</h2>
                  {p.showInNav && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border border-border text-fg-muted">
                      In nav
                    </span>
                  )}
                  {!p.visible && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-fg/10 text-fg-muted">
                      Hidden
                    </span>
                  )}
                  {p.draft && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border border-accent/40 text-accent">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-fg-muted mt-1">/{p.slug}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  role="switch"
                  aria-checked={p.visible}
                  aria-label={`${p.visible ? "Hide" : "Show"} ${p.title}`}
                  onClick={() => toggle(p.slug, !p.visible)}
                  className={`relative h-7 w-12 rounded-full border transition-colors ${
                    p.visible ? "bg-accent border-accent" : "bg-surface border-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-[22px] w-[22px] rounded-full bg-white shadow transition-all ${
                      p.visible ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>

                <Link
                  href={`/admin/pages/${p.slug}`}
                  className="rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors"
                >
                  Edit
                </Link>

                {confirmDelete === p.slug ? (
                  <span className="flex items-center gap-1">
                    <button
                      onClick={() => remove(p.slug)}
                      className="rounded-full bg-red-500 text-white px-3 py-2 text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="rounded-full border border-border px-3 py-2 text-sm"
                    >
                      Keep
                    </button>
                  </span>
                ) : (
                  <button
                    aria-label={`Delete ${p.title}`}
                    onClick={() => setConfirmDelete(p.slug)}
                    className="rounded-full border border-border px-3 py-2 text-sm text-fg-muted hover:border-red-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
