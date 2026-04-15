"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "../theme-toggle";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-bg/75 border-b border-border"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2 font-display text-lg tracking-tight"
        >
          <span className="relative inline-block h-2 w-2 rounded-full bg-accent">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-40" />
          </span>
          Vikas
          <span className="text-fg-muted font-sans text-sm group-hover:text-fg transition-colors">
            / Mittapalli
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    active ? "text-fg" : "text-fg-muted hover:text-fg"
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-surface border border-border -z-10" />
                  )}
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-2">
            <ThemeToggle />
          </li>
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
        >
          <span className="sr-only">Toggle menu</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-fg"
          >
            <path
              d={open ? "M3 3L13 13M13 3L3 13" : "M2 5H14M2 11H14"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-b border-border bg-bg/95 backdrop-blur-md transition-[max-height] duration-300",
          open ? "max-h-80" : "max-h-0 border-transparent"
        )}
      >
        <ul className="flex flex-col px-6 py-4 gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base text-fg hover:bg-surface transition-colors"
              >
                <span>{l.label}</span>
                <span className="text-fg-subtle">→</span>
              </Link>
            </li>
          ))}
          <li className="mt-2 flex items-center justify-between rounded-xl px-4 py-3">
            <span className="text-sm text-fg-muted">Theme</span>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </header>
  );
}
