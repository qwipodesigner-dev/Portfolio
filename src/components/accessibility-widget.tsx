"use client";

import Script from "next/script";

/**
 * UX4G Accessibility Widget v1.15 — NeGD / MeitY, India (free, MIT).
 *
 * The widget wires its button click handlers inside a DOMContentLoaded
 * listener. Because we load it lazily (after the page has long since
 * fired DOMContentLoaded), that listener would otherwise never run.
 * After the script loads we synthesize a DOMContentLoaded event so the
 * widget can attach its handlers and actually function.
 */
export function AccessibilityWidget() {
  return (
    <Script
      src="https://cdn.ux4g.gov.in/accessibility-beta-v1.15/accessibility-widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof document !== "undefined") {
          document.dispatchEvent(new Event("DOMContentLoaded"));
        }
      }}
    />
  );
}
