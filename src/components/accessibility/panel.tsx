"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import {
  AlignVerticalSpaceAround,
  BookOpen,
  Check,
  ChevronDown,
  Contrast,
  Eye,
  EyeOff,
  Focus,
  Languages,
  Link2,
  MousePointer2,
  Palette,
  Pause,
  RotateCcw,
  Type,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  DEFAULT_SETTINGS,
  LANGUAGES,
  useAccessibility,
  type AccessibilitySettings,
  type SaturationLevel,
} from "./context";

const SATURATION_CYCLE: SaturationLevel[] = [
  "normal",
  "low",
  "high",
  "grayscale",
];

const SATURATION_LABEL: Record<SaturationLevel, string> = {
  normal: "Normal",
  low: "Low saturation",
  high: "High saturation",
  grayscale: "Grayscale",
};

function isSettingActive(s: AccessibilitySettings, key: keyof AccessibilitySettings) {
  const v = s[key];
  const d = DEFAULT_SETTINGS[key];
  return v !== d;
}

export function AccessibilityWidget() {
  const { settings, set, reset, isOpen, setOpen, adhdY } = useAccessibility();
  const headingId = useId();

  // Detect platform for the keyboard shortcut display (⌘ on macOS, Ctrl elsewhere).
  // Defaults to mac for SSR; updates after hydration.
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    setIsMac(/Mac|iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  // Close on escape, open on Ctrl+/
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  const anyActive = (Object.keys(DEFAULT_SETTINGS) as Array<keyof AccessibilitySettings>)
    .some((k) => isSettingActive(settings, k));

  return (
    <div data-a11y="ignore">
      {/* Hidden mount point for Google Translate Element. Marked
          data-a11y="ignore" so none of our accessibility transforms
          apply to it. Off-screen so the user never sees its UI. */}
      <div
        id="google_translate_element"
        aria-hidden="true"
        className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none"
      />

      {/* Launcher button — universal access symbol, bold + clearly recognisable */}
      <motion.button
        type="button"
        onClick={() => setOpen(!isOpen)}
        aria-label="Open accessibility options"
        aria-expanded={isOpen}
        aria-controls={headingId}
        className={cn(
          "fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full",
          "bg-accent text-white shadow-[0_8px_24px_-6px_rgba(232,93,46,0.55)]",
          "ring-1 ring-white/20 transition-transform hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
        )}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
      >
        {/* Standard international universal access pictogram */}
        <svg
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="none"
          aria-hidden="true"
        >
          {/* head */}
          <circle cx="16" cy="6.5" r="2.6" fill="currentColor" />
          {/* arms */}
          <path
            d="M5.5 12 L26.5 12"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* torso */}
          <path
            d="M16 11.5 L16 19"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* legs */}
          <path
            d="M16 19 L11.5 27"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M16 19 L20.5 27"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
        {anyActive && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-bg" />
        )}
      </motion.button>

      {/* Backdrop + Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible backdrop — captures outside-clicks to close the panel,
                but stays transparent so the user sees their live preview
                applied to the page underneath. */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[95] bg-transparent"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              className={cn(
                "fixed top-0 right-0 z-[96] h-dvh w-full max-w-[420px]",
                "bg-bg border-l border-border flex flex-col"
              )}
            >
              {/* Header */}
              <header className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
                <div>
                  <h2
                    id={headingId}
                    className="font-display text-xl leading-none"
                  >
                    Accessibility
                  </h2>
                  <div
                    className="mt-3 inline-flex items-center gap-1.5"
                    aria-label={`Press ${
                      isMac ? "command" : "control"
                    } plus slash to toggle`}
                  >
                    <Kbd aria-hidden>{isMac ? "⌘" : "Ctrl"}</Kbd>
                    <span aria-hidden className="text-fg-subtle text-xs">
                      +
                    </span>
                    <Kbd aria-hidden>/</Kbd>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close accessibility options"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-fg-muted hover:text-fg hover:border-fg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              {/* Body — data-lenis-prevent stops Lenis smooth-scroll from
                  hijacking wheel events here so native scrolling works. */}
              <div
                className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
                data-lenis-prevent
              >
                {/* Language — full width with inline dropdown, at the top */}
                <LanguageTile />

                {/* Text size — full width stepper */}
                <div className="mt-2">
                  <Stepper
                    label="Text Size"
                    icon={<Type className="h-5 w-5" />}
                    value={settings.textSizeStep}
                    min={-1}
                    max={3}
                    format={(v) => `${100 + v * 10}%`}
                    onChange={(v) => set("textSizeStep", v)}
                  />
                </div>

                {/* Two-step rows */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <CycleTile
                    label="Text Spacing"
                    icon={<AlignVerticalSpaceAround className="h-5 w-5" />}
                    value={settings.textSpacingStep}
                    steps={4}
                    onChange={(v) => set("textSpacingStep", v)}
                  />
                  <CycleTile
                    label="Line Height"
                    icon={<AlignVerticalSpaceAround className="h-5 w-5 rotate-90" />}
                    value={settings.lineHeightStep}
                    steps={4}
                    onChange={(v) => set("lineHeightStep", v)}
                  />
                </div>

                {/* Saturation — multi-state */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <FeatureTile
                    label="Saturation"
                    sublabel={SATURATION_LABEL[settings.saturation]}
                    icon={<Palette className="h-5 w-5" />}
                    active={settings.saturation !== "normal"}
                    onClick={() => {
                      const idx = SATURATION_CYCLE.indexOf(settings.saturation);
                      const next = SATURATION_CYCLE[(idx + 1) % SATURATION_CYCLE.length];
                      set("saturation", next);
                    }}
                  />
                  <FeatureTile
                    label="Invert Colors"
                    icon={<Contrast className="h-5 w-5" />}
                    active={settings.invertColors}
                    onClick={() => set("invertColors", !settings.invertColors)}
                  />
                </div>

                {/* Cognitive */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <FeatureTile
                    label="Dyslexia Friendly"
                    icon={<BookOpen className="h-5 w-5" />}
                    active={settings.dyslexia}
                    onClick={() => set("dyslexia", !settings.dyslexia)}
                  />
                  <FeatureTile
                    label="ADHD Mode"
                    sublabel="Reading mask"
                    icon={<Focus className="h-5 w-5" />}
                    active={settings.adhdMode}
                    onClick={() => set("adhdMode", !settings.adhdMode)}
                  />
                </div>

                {/* Navigation */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <FeatureTile
                    label="Highlight Links"
                    icon={<Link2 className="h-5 w-5" />}
                    active={settings.highlightLinks}
                    onClick={() => set("highlightLinks", !settings.highlightLinks)}
                  />
                  <FeatureTile
                    label="Bigger Cursor"
                    icon={<MousePointer2 className="h-5 w-5" />}
                    active={settings.enhancedCursor}
                    onClick={() => set("enhancedCursor", !settings.enhancedCursor)}
                  />
                </div>

                {/* Media */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <FeatureTile
                    label="Pause Animation"
                    icon={<Pause className="h-5 w-5" />}
                    active={settings.pauseAnimation}
                    onClick={() => set("pauseAnimation", !settings.pauseAnimation)}
                  />
                  <FeatureTile
                    label="Hide Images"
                    icon={settings.hideImages ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    active={settings.hideImages}
                    onClick={() => set("hideImages", !settings.hideImages)}
                  />
                </div>

                {/* TTS — full width */}
                <div className="mt-2">
                  <FeatureTile
                    label="Read Aloud"
                    sublabel={settings.textToSpeech ? "Click any text to hear it" : "Text-to-speech"}
                    icon={<Volume2 className="h-5 w-5" />}
                    active={settings.textToSpeech}
                    onClick={() => set("textToSpeech", !settings.textToSpeech)}
                    fullWidth
                  />
                </div>
              </div>

              {/* Footer */}
              <footer className="border-t border-border px-4 py-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={reset}
                  disabled={!anyActive}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors",
                    anyActive
                      ? "bg-surface hover:bg-accent hover:text-white hover:border-accent text-fg"
                      : "bg-bg text-fg-subtle cursor-not-allowed"
                  )}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset all
                </button>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
                  Built by Vikas Mittapalli
                </p>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ADHD reading mask — two overlays around cursor Y */}
      <AnimatePresence>
        {settings.adhdMode && (
          <>
            <motion.div
              key="adhd-top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 right-0 top-0 pointer-events-none z-[80] bg-black/85"
              style={{ height: Math.max(0, adhdY - 70) }}
            />
            <motion.div
              key="adhd-bottom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 right-0 bottom-0 pointer-events-none z-[80] bg-black/85"
              style={{ top: adhdY + 70 }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   Keyboard-key chip — used in the header for the ⌘ + / hint
   ============================================================ */

function Kbd({ children, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      {...rest}
      className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md border border-border bg-bg px-1.5 font-mono text-[11px] font-medium text-fg-muted shadow-[inset_0_-1.5px_0_0_var(--color-border)]"
    >
      {children}
    </kbd>
  );
}

/* ============================================================
   Language tile — full width with inline dropdown
   ============================================================ */

function LanguageTile() {
  const { settings, set } = useAccessibility();
  const active = settings.language !== "en";
  const current = LANGUAGES.find((l) => l.code === settings.language);

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex items-center gap-4 transition-colors",
        active ? "border-accent bg-accent-soft" : "border-border bg-surface"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 flex-none items-center justify-center rounded-lg",
          active ? "bg-accent text-white" : "bg-bg text-fg-muted"
        )}
      >
        <Languages className="h-5 w-5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium leading-tight">Language</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle mt-1 truncate">
          {current?.name ?? "English"} · Google Translate
        </p>
      </div>
      <div className="relative flex-none">
        <select
          value={settings.language}
          onChange={(e) => set("language", e.target.value)}
          aria-label="Select page language"
          className={cn(
            "appearance-none bg-bg border border-border rounded-full pl-4 pr-8 py-2 text-sm font-medium cursor-pointer",
            "hover:border-fg/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          )}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted pointer-events-none" />
      </div>
    </div>
  );
}

/* ============================================================
   Tile primitives
   ============================================================ */

function FeatureTile({
  label,
  sublabel,
  icon,
  active,
  onClick,
  fullWidth,
}: {
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-accent bg-accent-soft text-fg"
          : "border-border bg-surface hover:border-fg/40 text-fg",
        fullWidth ? "w-full flex-row items-center gap-4" : ""
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          active ? "bg-accent text-white" : "bg-bg text-fg-muted"
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-sans text-sm font-medium leading-tight">{label}</p>
        {sublabel && (
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle mt-1 truncate">
            {sublabel}
          </p>
        )}
      </div>
      {active && !fullWidth && (
        <span className="absolute top-3 right-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function CycleTile({
  label,
  icon,
  value,
  steps,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  steps: number;
  onChange: (v: number) => void;
}) {
  const active = value > 0;
  return (
    <button
      type="button"
      onClick={() => onChange((value + 1) % steps)}
      aria-pressed={active}
      className={cn(
        "group relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-accent bg-accent-soft text-fg"
          : "border-border bg-surface hover:border-fg/40 text-fg"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          active ? "bg-accent text-white" : "bg-bg text-fg-muted"
        )}
      >
        {icon}
      </span>
      <p className="font-sans text-sm font-medium leading-tight">{label}</p>
      <div className="mt-1 flex items-center gap-1">
        {Array.from({ length: steps - 1 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 w-3 rounded-full transition-colors",
              i < value ? "bg-accent" : "bg-border"
            )}
          />
        ))}
      </div>
    </button>
  );
}

function Stepper({
  label,
  icon,
  value,
  min,
  max,
  format,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const active = value !== 0;
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex items-center gap-4",
        active ? "border-accent bg-accent-soft" : "border-border bg-surface"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 flex-none items-center justify-center rounded-lg",
          active ? "bg-accent text-white" : "bg-bg text-fg-muted"
        )}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium leading-tight">{label}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mt-1">
          {format(value)}
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-none">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className={cn(
            "h-9 w-9 rounded-full border border-border bg-bg text-fg font-mono text-lg leading-none flex items-center justify-center transition-colors",
            value > min ? "hover:bg-accent hover:text-white hover:border-accent" : "opacity-40 cursor-not-allowed"
          )}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className={cn(
            "h-9 w-9 rounded-full border border-border bg-bg text-fg font-mono text-lg leading-none flex items-center justify-center transition-colors",
            value < max ? "hover:bg-accent hover:text-white hover:border-accent" : "opacity-40 cursor-not-allowed"
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}
