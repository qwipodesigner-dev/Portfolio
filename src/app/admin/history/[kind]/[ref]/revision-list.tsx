"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Revision } from "@/lib/revisions";
import { restoreRevisionAction } from "../../../actions";

export function RevisionList({ revisions }: { revisions: Revision[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (revisions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-fg-muted">
          No snapshots yet — they appear after your next publish.
        </p>
      </div>
    );
  }

  const restore = (id: number) => {
    setConfirming(null);
    startTransition(async () => {
      setError(null);
      const res = await restoreRevisionAction(id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  };

  return (
    <div>
      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      )}
      <ol className="flex flex-col gap-3">
        {revisions.map((r, i) => (
          <li key={r.id} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-display text-lg">
                  {i === 0 ? "Latest snapshot" : `Version −${i + 1}`}
                </span>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle mt-1">
                  {new Date(r.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors"
                >
                  {expanded === r.id ? "Hide" : "View"}
                </button>
                {confirming === r.id ? (
                  <span className="flex items-center gap-1">
                    <button
                      onClick={() => restore(r.id)}
                      disabled={pending}
                      className="rounded-full bg-fg text-bg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
                    >
                      {pending ? "Restoring…" : "Confirm restore"}
                    </button>
                    <button
                      onClick={() => setConfirming(null)}
                      className="rounded-full border border-border px-3 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirming(r.id)}
                    disabled={pending}
                    className="rounded-full border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
            {expanded === r.id && (
              <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-bg border border-border p-4 text-xs text-fg-muted whitespace-pre-wrap">
                {JSON.stringify(r.data, null, 2)}
              </pre>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
