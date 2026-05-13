"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";

export type SaturationLevel = "normal" | "low" | "high" | "grayscale";

export type AccessibilitySettings = {
  /** -1 = 90 %, 0 = 100 %, 1 = 110 %, 2 = 120 %, 3 = 130 % */
  textSizeStep: number;
  /** 0 = off, 1 = small, 2 = medium, 3 = large */
  textSpacingStep: number;
  /** 0 = off, 1 = 1.6, 2 = 2.0, 3 = 2.5 */
  lineHeightStep: number;
  dyslexia: boolean;
  adhdMode: boolean;
  saturation: SaturationLevel;
  invertColors: boolean;
  highlightLinks: boolean;
  textToSpeech: boolean;
  enhancedCursor: boolean;
  pauseAnimation: boolean;
  hideImages: boolean;
};

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSizeStep: 0,
  textSpacingStep: 0,
  lineHeightStep: 0,
  dyslexia: false,
  adhdMode: false,
  saturation: "normal",
  invertColors: false,
  highlightLinks: false,
  textToSpeech: false,
  enhancedCursor: false,
  pauseAnimation: false,
  hideImages: false,
};

const STORAGE_KEY = "vm-a11y-settings";

type Ctx = {
  settings: AccessibilitySettings;
  set: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  reset: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  adhdY: number;
};

const AccessibilityContext = createContext<Ctx | null>(null);

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error(
      "useAccessibility must be used inside <AccessibilityProvider />"
    );
  }
  return ctx;
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [adhdY, setAdhdY] = useState(0);

  // Load persisted settings on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      /* swallow — corrupted storage shouldn't break the page */
    }
    setHydrated(true);
  }, []);

  // Persist whenever settings change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage full or blocked — silently ignore */
    }
  }, [settings, hydrated]);

  // Apply settings to <html> as classes
  useEffect(() => {
    if (!hydrated) return;
    const html = document.documentElement;

    // text size
    html.classList.remove(
      "a11y-text-down",
      "a11y-text-1",
      "a11y-text-2",
      "a11y-text-3"
    );
    if (settings.textSizeStep < 0) html.classList.add("a11y-text-down");
    else if (settings.textSizeStep === 1) html.classList.add("a11y-text-1");
    else if (settings.textSizeStep === 2) html.classList.add("a11y-text-2");
    else if (settings.textSizeStep >= 3) html.classList.add("a11y-text-3");

    // spacing & line-height step classes
    html.classList.remove("a11y-spacing-1", "a11y-spacing-2", "a11y-spacing-3");
    if (settings.textSpacingStep > 0) {
      html.classList.add(`a11y-spacing-${Math.min(3, settings.textSpacingStep)}`);
    }

    html.classList.remove("a11y-line-1", "a11y-line-2", "a11y-line-3");
    if (settings.lineHeightStep > 0) {
      html.classList.add(`a11y-line-${Math.min(3, settings.lineHeightStep)}`);
    }

    // saturation
    html.classList.remove("a11y-sat-low", "a11y-sat-high", "a11y-sat-gray");
    if (settings.saturation === "low") html.classList.add("a11y-sat-low");
    else if (settings.saturation === "high") html.classList.add("a11y-sat-high");
    else if (settings.saturation === "grayscale")
      html.classList.add("a11y-sat-gray");

    // simple boolean toggles
    html.classList.toggle("a11y-dyslexia", settings.dyslexia);
    html.classList.toggle("a11y-adhd", settings.adhdMode);
    html.classList.toggle("a11y-invert", settings.invertColors);
    html.classList.toggle("a11y-highlight-links", settings.highlightLinks);
    html.classList.toggle("a11y-cursor", settings.enhancedCursor);
    html.classList.toggle("a11y-pause", settings.pauseAnimation);
    html.classList.toggle("a11y-hide-images", settings.hideImages);
    html.classList.toggle("a11y-tts", settings.textToSpeech);
  }, [settings, hydrated]);

  // ADHD reading-mask: track cursor Y while active
  useEffect(() => {
    if (!settings.adhdMode) return;
    const onMove = (e: MouseEvent) => setAdhdY(e.clientY);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [settings.adhdMode]);

  // Text-to-speech: click any element to read it aloud
  useEffect(() => {
    if (!settings.textToSpeech) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      // never read the widget itself
      if (target.closest('[data-a11y="ignore"]')) return;
      const text = (target as HTMLElement).innerText?.trim();
      if (!text) return;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text.slice(0, 2000));
      utter.rate = 1;
      utter.pitch = 1;
      synth.speak(utter);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      synth.cancel();
    };
  }, [settings.textToSpeech]);

  const set = useCallback(
    <K extends keyof AccessibilitySettings>(
      key: K,
      value: AccessibilitySettings[K]
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  return (
    <AccessibilityContext.Provider
      value={{ settings, set, reset, isOpen, setOpen, adhdY }}
    >
      <MotionConfig
        reducedMotion={settings.pauseAnimation ? "always" : "never"}
      >
        {children}
      </MotionConfig>
    </AccessibilityContext.Provider>
  );
}
