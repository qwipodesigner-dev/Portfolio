import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vikasmittapalli.com"),
  title: {
    default: "Vikas Mittapalli — Senior Product Designer",
    template: "%s · Vikas Mittapalli",
  },
  description:
    "Senior Product Designer with 6+ years of experience crafting scalable B2B, healthcare, and logistics products. Currently at Qwipo, previously AIG, KIMS, Continental, and Aster Hospitals.",
  keywords: [
    "Product Designer",
    "UI/UX Designer",
    "Healthcare Design",
    "Design Systems",
    "B2B SaaS",
    "Vikas Mittapalli",
    "Hyderabad",
  ],
  authors: [{ name: "Vikas Mittapalli" }],
  creator: "Vikas Mittapalli",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vikasmittapalli.com",
    title: "Vikas Mittapalli — Senior Product Designer",
    description:
      "6+ years designing scalable B2B, healthcare, and logistics products. Design systems, research, and end-to-end product design.",
    siteName: "Vikas Mittapalli",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vikas Mittapalli — Senior Product Designer",
    description:
      "6+ years designing scalable B2B, healthcare, and logistics products.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-fg font-sans">
        <Providers>
          <Nav />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
