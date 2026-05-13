"use client";

import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "./smooth-scroll";
import { CustomCursor } from "./custom-cursor";
import { AccessibilityProvider } from "./accessibility/context";
import { AccessibilityWidget } from "./accessibility/panel";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AccessibilityProvider>
        <SmoothScroll>{children}</SmoothScroll>
        <CustomCursor />
        <AccessibilityWidget />
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
