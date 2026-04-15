import Link from "next/link";
import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-16">
          <div className="md:col-span-5">
            <p className="font-display text-3xl md:text-4xl text-balance leading-[1.05]">
              Have a project in mind?
              <br />
              <span className="text-fg-muted">Let&rsquo;s make it good.</span>
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-6 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors"
            >
              Start a conversation
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
              Sitemap
            </span>
            <Link className="text-fg-muted hover:text-fg transition-colors" href="/work">Work</Link>
            <Link className="text-fg-muted hover:text-fg transition-colors" href="/about">About</Link>
            <Link className="text-fg-muted hover:text-fg transition-colors" href="/contact">Contact</Link>
            <a className="text-fg-muted hover:text-fg transition-colors" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
              Elsewhere
            </span>
            <a
              className="text-fg-muted hover:text-fg transition-colors"
              href="https://www.linkedin.com/in/vikasmittapalli/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a
              className="text-fg-muted hover:text-fg transition-colors"
              href="https://www.behance.net/vikasmittapalli"
              target="_blank"
              rel="noopener noreferrer"
            >
              Behance ↗
            </a>
            <a
              className="text-fg-muted hover:text-fg transition-colors"
              href="mailto:vikasmittapalli@gmail.com"
            >
              vikasmittapalli@gmail.com
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center py-8 border-t border-border">
          <p className="font-mono text-xs text-fg-subtle">
            © {new Date().getFullYear()} Vikas Mittapalli. Designed and built in Hyderabad.
          </p>
          <p className="font-mono text-xs text-fg-subtle flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available for select freelance work
          </p>
        </div>
      </Container>
    </footer>
  );
}
