import Link from "next/link";
import { Container } from "./container";
import { getSiteContent } from "@/lib/site";

export async function Footer() {
  const [content, settings] = await Promise.all([
    getSiteContent("footer"),
    getSiteContent("settings"),
  ]);

  return (
    <footer className="border-t border-border mt-32">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-16">
          <div className="md:col-span-5">
            <p className="font-display text-3xl md:text-4xl text-balance leading-[1.05]">
              {content.headline}
              <br />
              <span className="text-fg-muted">{content.headlineMuted}</span>
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-6 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors"
            >
              {content.ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
              Sitemap
            </span>
            {content.sitemap.map((l) => (
              <Link
                key={l.href}
                className="text-fg-muted hover:text-fg transition-colors"
                href={l.href}
              >
                {l.label}
              </Link>
            ))}
            <a
              className="text-fg-muted hover:text-fg transition-colors"
              href={settings.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
              Elsewhere
            </span>
            {content.elsewhere.map((l) => (
              <a
                key={l.href}
                className="text-fg-muted hover:text-fg transition-colors"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
            ))}
            <a
              className="text-fg-muted hover:text-fg transition-colors"
              href={`mailto:${content.email}`}
            >
              {content.email}
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center py-8 border-t border-border">
          <p className="font-mono text-xs text-fg-subtle">
            © {new Date().getFullYear()} {content.copyrightName}.{" "}
            {content.copyrightSuffix}
          </p>
        </div>
      </Container>
    </footer>
  );
}
