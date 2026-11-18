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

export type Language = {
  code: string;
  name: string;
  native: string;
};

/** Curated language list - English default + Indian regional + global majors. */
export const LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "zh-CN", name: "Chinese", native: "中文" },
  { code: "ar", name: "Arabic", native: "العربية" },
];

const INCLUDED_LANGUAGE_CODES = LANGUAGES.map((l) => l.code).join(",");

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
  /** Language code matching one of LANGUAGES[].code */
  language: string;
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
  language: "en",
};

const STORAGE_KEY = "vm-a11y-settings";
const REOPEN_FLAG = "vm-a11y-panel-reopen";
const RELOAD_GUARD = "vm-a11y-lang-reloads";
const MOBILE_FALLBACK = "vm-a11y-lang-fallback";

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

  // Load persisted settings + restore panel open state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      /* swallow - corrupted storage shouldn't break the page */
    }
    // If we just reloaded as part of an English-restore action, re-open
    // the panel so the user lands back where they were.
    try {
      if (sessionStorage.getItem(REOPEN_FLAG) === "1") {
        sessionStorage.removeItem(REOPEN_FLAG);
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist whenever settings change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage full or blocked - silently ignore */
    }
  }, [settings, hydrated]);

  // While a translation is active, force internal links to full page
  // loads. Google Translate rewrites the DOM in place, and Next.js's
  // client-side navigation then reconciles against nodes it no longer
  // owns and crashes ("This page could not load"). A hard navigation
  // sidesteps that entirely - the next page auto-translates from the
  // googtrans cookie, so the language carries over seamlessly.
  useEffect(() => {
    if (!hydrated) return;
    if (settings.language === "en") return;
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]");
      if (!anchor) return;
      if (anchor.getAttribute("target")) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/")) return; // internal links only
      e.preventDefault();
      e.stopPropagation();
      window.location.assign(href);
    };
    // Capture phase - runs before Next.js's Link click handler.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [settings.language, hydrated]);

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

  // Google Translate Element loader - load once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Define the init callback before loading the script (Google checks for
    // this function name on script execution).
    type GoogleTranslate = {
      translate: {
        TranslateElement: new (config: object, container: string) => unknown;
      };
    };
    const w = window as unknown as {
      google?: GoogleTranslate;
      googleTranslateElementInit?: () => void;
    };

    w.googleTranslateElementInit = () => {
      if (!w.google?.translate?.TranslateElement) return;
      new w.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: INCLUDED_LANGUAGE_CODES,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const existing = document.querySelector(
      'script[src*="translate.google.com/translate_a/element.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.setAttribute("data-a11y", "ignore");
    document.body.appendChild(script);
    // Don't remove on cleanup - keep the script across re-renders
  }, []);

  // Sync settings.language with Google Translate's hidden <select>
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;

    const apply = () => {
      const select =
        document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (!select) return false;

      // Restoring English. Preferred path: Google's own in-place
      // "Show original" button (inside its same-origin banner iframe)
      // restores the page seamlessly - no reload, panel stays open,
      // and Google clears its own cookies. Fallback path: clear the
      // googtrans cookie at every scope and reload.
      if (settings.language === "en") {
        const current = select.value;
        const isTranslated = !!current && current !== "" && current !== "en";

        // Google sets googtrans at several scopes: host-only AND the
        // registrable domain (e.g. .vikasmittapalli.space). A survivor at
        // any scope re-translates the page after reload, so expire it at
        // every ancestor scope the browser will let us touch. (On
        // *.vercel.app the parent scope is a public suffix and never
        // existed - this only bites on custom domains.)
        const clearCookies = () => {
          const expiry = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
          const parts = window.location.hostname.split(".");
          const scopes = [""]; // host-only cookie (no domain attribute)
          for (let i = 0; i < parts.length - 1; i++) {
            const d = parts.slice(i).join(".");
            scopes.push(`domain=${d}; `, `domain=.${d}; `);
          }
          for (const scope of scopes) {
            document.cookie = `googtrans=; path=/; ${scope}${expiry}`;
          }
        };

        // Loop guard: never reload more than twice per session - a stale
        // language beats a reload loop.
        const hardRestore = () => {
          clearCookies();
          let reloads = 0;
          try {
            reloads = Number(sessionStorage.getItem(RELOAD_GUARD) ?? "0");
            sessionStorage.setItem(RELOAD_GUARD, String(reloads + 1));
          } catch {
            /* ignore */
          }
          if (reloads < 2) {
            // Re-open the panel on the next mount so the user doesn't lose
            // their place when the reload happens.
            try {
              if (isOpen) sessionStorage.setItem(REOPEN_FLAG, "1");
            } catch {
              /* ignore */
            }
            window.location.reload();
          }
        };

        if (isTranslated) {
          let clickedRestore = false;
          try {
            for (const frame of Array.from(
              document.querySelectorAll<HTMLIFrameElement>(
                "iframe.skiptranslate",
              ),
            )) {
              const restoreBtn = frame.contentDocument?.querySelector<
                HTMLButtonElement
              >("button[id$='.restore']");
              if (restoreBtn) {
                restoreBtn.click();
                clickedRestore = true;
                break;
              }
            }
          } catch {
            /* cross-origin or markup change - use the fallback */
          }

          if (clickedRestore) {
            // Verify the in-place restore actually landed; if the page is
            // still translated after a beat, fall back to the reload.
            window.setTimeout(() => {
              const stillTranslated =
                document.documentElement.classList.contains(
                  "translated-ltr",
                ) ||
                document.documentElement.classList.contains("translated-rtl");
              if (stillTranslated) {
                hardRestore();
              } else {
                clearCookies();
              }
            }, 1200);
          } else {
            hardRestore();
          }
        } else {
          // English confirmed on screen - reset the guard for next time.
          try {
            sessionStorage.removeItem(RELOAD_GUARD);
          } catch {
            /* ignore */
          }
        }
        return true;
      }

      // Switching to a non-English language: dispatch through Google's
      // hidden select. On desktop this translates in place; on mobile
      // user agents Google often sets its cookie but skips the in-place
      // pass, so verify the DOM actually translated and reload once as
      // a fallback - the load path translates reliably from the cookie.
      if (select.value !== settings.language) {
        select.value = settings.language;
        select.dispatchEvent(new Event("change"));
        const lang = settings.language;
        window.setTimeout(() => {
          const translated =
            document.documentElement.classList.contains("translated-ltr") ||
            document.documentElement.classList.contains("translated-rtl");
          let alreadyTried = false;
          try {
            alreadyTried = sessionStorage.getItem(MOBILE_FALLBACK) === lang;
            if (!translated && !alreadyTried)
              sessionStorage.setItem(MOBILE_FALLBACK, lang);
          } catch {
            /* ignore */
          }
          if (!translated && !alreadyTried) window.location.reload();
        }, 2500);
      }
      return true;
    };

    if (apply()) return;

    // Google's select is injected async - poll briefly until it shows up
    let tries = 0;
    const interval = window.setInterval(() => {
      tries++;
      if (apply() || tries > 25) {
        window.clearInterval(interval);
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [settings.language, hydrated, isOpen]);

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
