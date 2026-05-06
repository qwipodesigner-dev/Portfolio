"use client";

import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "./smooth-scroll";
import { CustomCursor } from "./custom-cursor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SmoothScroll>{children}</SmoothScroll>
      <CustomCursor />
    </ThemeProvider>
  );
}
