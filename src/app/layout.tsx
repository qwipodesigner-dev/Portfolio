import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono, Lexend } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { getSiteContent } from "@/lib/site";

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

// Loaded but not applied by default — only kicks in when the
// accessibility widget enables Dyslexia Friendly mode.
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteContent("seo");
  return {
    metadataBase: new URL(seo.siteUrl),
    title: {
      default: seo.siteTitle,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "Vikas Mittapalli" }],
    creator: "Vikas Mittapalli",
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: seo.siteUrl,
      title: seo.siteTitle,
      description: seo.description,
      siteName: "Vikas Mittapalli",
      ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteTitle,
      description: seo.description,
      ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
    },
  };
}

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
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} ${lexend.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-fg font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
