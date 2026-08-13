"use client";

import { useState, useTransition } from "react";
import type { ContactMessage } from "@/lib/messages";
import { deleteMessageAction, markMessageHandledAction } from "../actions";

export function MessageList({ messages }: { messages: ContactMessage[] }) {
  const [items, setItems] = useState(messages);
  const [, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const setHandled = (id: number, handled: boolean) => {
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, handled } : m)),
    );
    startTransition(() => markMessageHandledAction(id, handled));
  };

  const remove = (id: number) => {
    setConfirmDelete(null);
    setItems((prev) => prev.filter((m) => m.id !== id));
    startTransition(() => deleteMessageAction(id));
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-fg-muted">
          No messages yet. When someone writes through the contact form, it
          lands here.
        </p>
      </div>
    );
  }

  const unhandled = items.filter((m) => !m.handled).length;

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mb-4">
        {items.length} messages · {unhandled} new
      </p>
      <ul className="flex flex-col gap-3">
        {items.map((m) => (
          <li
            key={m.id}
            className={`rounded-2xl border bg-surface p-5 ${
              m.handled ? "border-border opacity-60" : "border-accent/40"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg">{m.name}</span>
                <a
                  href={`mailto:${m.email}`}
                  className="text-sm text-fg-muted hover:text-accent transition-colors"
                >
                  {m.email}
                </a>
                {!m.handled && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-accent text-white">
                    New
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                {new Date(m.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <p className="text-fg-muted text-pretty whitespace-pre-wrap leading-relaxed">
              {m.message}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message on vikasmittapalli.com")}`}
                className="rounded-full bg-fg text-bg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-white transition-colors"
              >
                Reply ↗
              </a>
              <button
                onClick={() => setHandled(m.id, !m.handled)}
                className="rounded-full border border-border px-4 py-2 text-sm hover:border-fg transition-colors"
              >
                {m.handled ? "Mark as new" : "Mark handled"}
              </button>
              {confirmDelete === m.id ? (
                <span className="flex items-center gap-1">
                  <button
                    onClick={() => remove(m.id)}
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
                  onClick={() => setConfirmDelete(m.id)}
                  className="rounded-full border border-border px-3 py-2 text-sm text-fg-muted hover:border-red-400 hover:text-red-500 transition-colors"
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
