import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/reveal";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six ways I help product teams ship better software — discovery, architecture, UI, design systems, prototyping, and design-to-code collaboration.",
};

export default function ServicesIndexPage() {
  return (
    <>
      <section className="pt-16 md:pt-24 pb-12 md:pb-16">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              Services · How I work
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-balance mt-6">
              Six ways I help teams ship{" "}
              <span className="italic text-accent">better products.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-fg-muted text-lg text-pretty">
              I take ownership end-to-end — from the messy problem statement to
              the handoff that engineers can actually build from. Click any of
              the six below for an honest walk-through of how I run that part of
              the work, what ships at the end, and the methods, frameworks, and
              tools I reach for.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-24 md:pb-32">
        <Container>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.05} as="li">
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative flex flex-col bg-bg p-8 md:p-10 transition-colors hover:bg-surface h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-mono text-xs text-fg-subtle tracking-[0.2em]">
                      {s.number}
                    </span>
                    <span className="text-fg-subtle group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                      ↗
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-[1.65rem] leading-tight mb-4 text-balance group-hover:text-accent transition-colors">
                    {s.title}
                  </h2>
                  <p className="text-fg-muted text-pretty leading-relaxed mb-6 flex-1">
                    {s.summary}
                  </p>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle group-hover:text-fg transition-colors">
                    Read process →
                  </span>
                  <span className="absolute left-0 bottom-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-500" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
