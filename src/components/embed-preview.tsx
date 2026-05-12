"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./reveal";

type Props = {
  url: string;
  heading?: string;
  caption?: string;
  /** Width to render the iframe at — the embedded app sees this as its viewport
   *  width, so set high enough that the app renders its desktop layout. */
  desktopWidth?: number;
  /** Height to render the iframe at — sets the visible vertical area. */
  desktopHeight?: number;
};

/**
 * Embedded live-app preview.
 *
 * Renders the target URL inside an iframe at fixed desktop dimensions
 * (1440×900 by default) and uses CSS transform to scale the iframe down
 * to fit whatever container it's mounted in. The embedded app sees a
 * desktop-sized viewport and renders its full desktop layout — no
 * responsive / mobile fallbacks.
 *
 * A faux browser chrome sits above the iframe with traffic-light dots,
 * the URL, and an "open in new tab" affordance.
 */
export function EmbedPreview({
  url,
  heading,
  caption,
  desktopWidth = 1440,
  desktopHeight = 900,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const updateScale = () => {
      // Cap at 1 — don't upscale beyond native desktop size
      const next = Math.min(1, el.clientWidth / desktopWidth);
      setScale(next);
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [desktopWidth]);

  // Visible height is the scaled iframe height — keeps the container shrink-wrapped
  const visibleHeight = desktopHeight * scale;

  return (
    <Reveal delay={0.45}>
      <div>
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

          {/* Live iframe — rendered at desktop dimensions, scaled to fit */}
          <div
            ref={frameRef}
            className="relative bg-bg overflow-hidden"
            style={{ height: `${visibleHeight}px` }}
          >
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
              className="absolute top-0 left-0 border-0"
              style={{
                width: `${desktopWidth}px`,
                height: `${desktopHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              onLoad={() => setLoaded(true)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Live preview"
              allow="clipboard-write"
            />
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mt-4">
          Embedded live · Rendered at {desktopWidth}×{desktopHeight} desktop ·
          Click anywhere inside to interact
        </p>
      </div>
    </Reveal>
  );
}
