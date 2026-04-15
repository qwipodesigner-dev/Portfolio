"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-8 w-14 items-center rounded-full border border-border bg-surface p-0.5 transition-colors hover:bg-accent-soft"
    >
      <span
        className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-bg text-fg shadow-sm transition-transform duration-300 ease-out"
        style={{
          transform: mounted && isDark ? "translateX(24px)" : "translateX(0)",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-fg"
        >
          {mounted && isDark ? (
            <path
              d="M11.5 8.5A4.5 4.5 0 0 1 5.5 2.5a5 5 0 1 0 6 6Z"
              fill="currentColor"
            />
          ) : (
            <>
              <circle cx="7" cy="7" r="2.75" fill="currentColor" />
              <path
                d="M7 1V2.5M7 11.5V13M13 7H11.5M2.5 7H1M11.24 11.24L10.18 10.18M3.82 3.82L2.76 2.76M11.24 2.76L10.18 3.82M3.82 10.18L2.76 11.24"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </span>
    </button>
  );
}
