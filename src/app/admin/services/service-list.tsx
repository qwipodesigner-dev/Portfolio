"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { ManagedService } from "@/lib/services-data";
import {
  deleteServiceAction,
  reorderServicesAction,
  toggleServiceVisibleAction,
} from "../actions";

export function ServiceList({
  services,
  dbLive,
}: {
  services: ManagedService[];
  dbLive: boolean;
}) {
  const [items, setItems] = useState(services);
  const [, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setItems(next);
    startTransition(() => reorderServicesAction(next.map((s) => s.slug)));
  };

  const toggle = (slug: string, visible: boolean) => {
    setItems((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, visible } : s)),
    );
    startTransition(() => toggleServiceVisibleAction(slug, visible));
  };

  const remove = (slug: string) => {
    setConfirmDelete(null);
    setItems((prev) => prev.filter((s) => s.slug !== slug));
    startTransition(() => deleteServiceAction(slug));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
          {items.length} services · {items.filter((s) => s.visible).length} visible
        </p>
        <Link
          href="/admin/services/__new__"
          aria-disabled={!dbLive}
          className={`rounded-full bg-fg text-bg px-5 py-2.5 text-sm font-medium transition-colors ${
            dbLive ? "hover:bg-accent hover:text-white" : "opacity-40 pointer-events-none"
          }`}
        >
          + New service
        </Link>
      </div>

      <ul className="flex flex-col gap-3">
        {items.map((s, i) => (
          <li
            key={s.slug}
            className={`rounded-2xl border border-border bg-surface p-5 flex flex-wrap items-center gap-4 ${
              s.visible ? "" : "opacity-55"
            }`}
          >
            <div className="flex flex-col gap-1">
              <button
                aria-label={`Move ${s.title} up`}
                disabled={!dbLive || i === 0}
                onClick={() => move(i, i - 1)}
                className="h-6 w-6 rounded border border-border text-xs text-fg-muted hover:border-fg disabled:opacity-30"
              >
                ↑
              </button>
              <button
                aria-label={`Move ${s.title} down`}
                disabled={!dbLive || i === items.length - 1}
                onClick={() => move(i, i + 1)}
                className="h-6 w-6 rounded border border-border text-xs text-fg-muted hover:border-fg disabled:opacity-30"
              >
                ↓
              </button>
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-fg-subtle">{s.number}</span>
                <h2 className="font-display text-xl">{s.title}</h2>
                {!s.visible && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-fg/10 text-fg-muted">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-sm text-fg-muted mt-1">/services/{s.slug}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                role="switch"
                aria-checked={s.visible}
                aria-label={`${s.visible ? "Hide" : "Show"} ${s.title}`}
                disabled={!dbLive}
                onClick={() => toggle(s.slug, !s.visible)}
                className={`relative h-7 w-12 rounded-full border transition-colors disabled:opacity-40 ${
                  s.visible ? "bg-accent border-accent" : "bg-surface border-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-[22px] w-[22px] rounded-full bg-white shadow transition-all ${
                    s.visible ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>

              <Link
                href={`/admin/services/${s.slug}`}
                aria-disabled={!dbLive}
                className={`rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors ${
                  dbLive ? "" : "opacity-40 pointer-events-none"
                }`}
              >
                Edit
              </Link>

              {confirmDelete === s.slug ? (
                <span className="flex items-center gap-1">
                  <button
                    onClick={() => remove(s.slug)}
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
                  aria-label={`Delete ${s.title}`}
                  disabled={!dbLive}
                  onClick={() => setConfirmDelete(s.slug)}
                  className="rounded-full border border-border px-3 py-2 text-sm text-fg-muted hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-40"
                >
                  ✕
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
