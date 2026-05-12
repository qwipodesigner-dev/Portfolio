"use client";

import { useState } from "react";
import { Reveal } from "./reveal";

type Props = {
  url: string;
  heading?: string;
  caption?: string;
};

/**
 * Embedded live-app preview with a faux browser chrome on top and the
 * target URL rendered inside an iframe. The whole tile is interactive —
 * users can click into the embedded app — and a top-right action opens
 * the URL in a new tab for full-screen exploration.
 */
export function EmbedPreview({ url, heading, caption }: Props) {
  const [loaded, setLoaded] = useState(false);
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <Reveal delay={0.45}>
      <div className="mt-20 pt-16 border-t border-border">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="flex-1 min-w-0">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              Live preview
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-3 text-balance">
              {heading ?? "Try it yourself."}
            </h2>
            {caption && (
              <p className="text-fg-muted mt-3 text-pretty max-w-xl">{caption}</p>
            )}
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors whitespace-nowrap"
          >
            Open in new tab <span>↗</span>
          </a>
        </div>

        {/* Browser frame */}
        <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]">
          {/* Faux browser chrome */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg/60">
            <div className="flex gap-1.5 flex-none">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-400/70" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="px-3 py-1.5 rounded-md bg-bg border border-border text-xs font-mono text-fg-muted truncate">
                {displayUrl}
              </div>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-fg transition-colors flex-none"
              aria-label="Open in new tab"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M5 1H1V13H13V9M9 1H13V5M13 1L7 7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </div>

          {/* Live iframe */}
          <div className="relative aspect-[16/10] bg-bg">
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-6 w-6 rounded-full border-2 border-fg-subtle border-t-accent animate-spin" />
                  <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                    Loading live preview…
                  </span>
                </div>
              </div>
            )}
            <iframe
              src={url}
              className="absolute inset-0 w-full h-full"
              onLoad={() => setLoaded(true)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Live preview"
              allow="clipboard-write"
            />
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mt-4">
          Embedded live · Click anywhere inside to interact
        </p>
      </div>
    </Reveal>
  );
}
