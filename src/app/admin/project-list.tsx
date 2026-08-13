"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import type { ManagedProject } from "@/lib/content";
import {
  deleteProjectAction,
  reorderAction,
  toggleVisibleAction,
} from "./actions";

export function ProjectList({
  projects,
  dbLive,
}: {
  projects: ManagedProject[];
  dbLive: boolean;
}) {
  const [items, setItems] = useState(projects);
  const [optimistic, applyOptimistic] = useOptimistic(items);
  const [, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setItems(next);
    startTransition(() => reorderAction(next.map((p) => p.slug)));
  };

  const toggle = (slug: string, visible: boolean) => {
    startTransition(async () => {
      applyOptimistic((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, visible } : p)),
      );
      await toggleVisibleAction(slug, visible);
      setItems((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, visible } : p)),
      );
    });
  };

  const remove = (slug: string) => {
    setConfirmDelete(null);
    setItems((prev) => prev.filter((p) => p.slug !== slug));
    startTransition(() => deleteProjectAction(slug));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
          {optimistic.length} projects ·{" "}
          {optimistic.filter((p) => p.visible).length} visible
        </p>
        <Link
          href="/admin/projects/__new__"
          aria-disabled={!dbLive}
          className={`rounded-full bg-fg text-bg px-5 py-2.5 text-sm font-medium transition-colors ${
            dbLive
              ? "hover:bg-accent hover:text-white"
              : "opacity-40 pointer-events-none"
          }`}
        >
          + New project
        </Link>
      </div>

      <ul className="flex flex-col gap-3">
        {optimistic.map((p, i) => (
          <li
            key={p.slug}
            className={`rounded-2xl border border-border bg-surface p-5 flex flex-wrap items-center gap-4 transition-opacity ${
              p.visible ? "" : "opacity-55"
            }`}
          >
            {/* Reorder */}
            <div className="flex flex-col gap-1">
              <button
                aria-label={`Move ${p.title} up`}
                disabled={!dbLive || i === 0}
                onClick={() => move(i, i - 1)}
                className="h-6 w-6 rounded border border-border text-xs text-fg-muted hover:border-fg disabled:opacity-30"
              >
                ↑
              </button>
              <button
                aria-label={`Move ${p.title} down`}
                disabled={!dbLive || i === optimistic.length - 1}
                onClick={() => move(i, i + 1)}
                className="h-6 w-6 rounded border border-border text-xs text-fg-muted hover:border-fg disabled:opacity-30"
              >
                ↓
              </button>
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl">{p.title}</h2>
                {p.featured && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border border-border text-fg-muted">
                    Featured
                  </span>
                )}
                {!p.visible && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-fg/10 text-fg-muted">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-sm text-fg-muted mt-1">
                {p.client} · {p.year} · /work/{p.slug}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Visibility switch */}
              <button
                role="switch"
                aria-checked={p.visible}
                aria-label={`${p.visible ? "Hide" : "Show"} ${p.title}`}
                disabled={!dbLive}
                onClick={() => toggle(p.slug, !p.visible)}
                className={`relative h-7 w-12 rounded-full border transition-colors disabled:opacity-40 ${
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
                href={`/admin/projects/${p.slug}`}
                aria-disabled={!dbLive}
                className={`rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors ${
                  dbLive ? "" : "opacity-40 pointer-events-none"
                }`}
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
                  disabled={!dbLive}
                  onClick={() => setConfirmDelete(p.slug)}
                  className="rounded-full border border-border px-3 py-2 text-sm text-fg-muted hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-40"
                >
                  ✕
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mt-6">
        Changes publish to the live site immediately · Hidden projects stay
        editable but disappear from every public page
      </p>
    </div>
  );
}
