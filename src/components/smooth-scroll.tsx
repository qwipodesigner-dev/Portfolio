"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Respect reduced-motion preference - skip Lenis entirely
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Lenis's built-in observer watches document.documentElement, whose
    // reported box doesn't reliably change when page content grows (fonts
    // loading, route changes, streamed content). Watch <body> instead -
    // its border box tracks real content height - and re-measure, or the
    // scroll limit goes stale and the page "refuses" to scroll further.
    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to the top whenever the route changes. Lenis tracks scroll
  // position internally and Next.js's default scroll restoration doesn't
  // travel through it cleanly, so we bypass with an immediate scrollTo(0).
  // Re-measure too - the new page's height differs from the old one's.
  // Skipped on the very first run (it would defeat the browser's own
  // scroll restoration on reload/back-forward) and when the URL carries
  // a #hash (it would snap away from the anchor the browser just hit).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      lenisRef.current?.resize();
      return;
    }
    if (window.location.hash) {
      lenisRef.current?.resize();
      return;
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
      lenisRef.current.resize();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
