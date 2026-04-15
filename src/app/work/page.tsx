import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects from six years designing products across healthcare, logistics, and B2B SaaS.",
};

export default function WorkPage() {
  return (
    <>
      <section className="pt-16 md:pt-24 pb-12 md:pb-16">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              Work · 2021 — Now
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-balance mt-6">
              A working archive of{" "}
              <span className="italic text-accent">what I&apos;ve shipped.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-fg-muted text-lg text-pretty">
              Selected projects spanning healthcare, B2B commerce, logistics, and
              design systems. Each case study walks through context, process, and
              what shipped — with the honest bits still attached.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-24 md:pb-32">
        <Container>
          <ul className="flex flex-col">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05} as="li">
                <Link
                  href={`/work/${p.slug}`}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-start py-10 md:py-14 border-t border-border hover:bg-surface/50 transition-colors -mx-6 px-6 md:-mx-10 md:px-10"
                >
                  <span className="md:col-span-1 font-mono text-xs text-fg-subtle uppercase tracking-[0.2em] pt-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="md:col-span-6 flex flex-col gap-3">
                    <h2 className="font-display text-3xl md:text-5xl leading-[1.02] text-balance group-hover:text-accent transition-colors">
                      {p.title}
                    </h2>
                    <p className="text-fg-muted text-lg max-w-xl text-pretty">
                      {p.tagline}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-3 py-1 rounded-full border border-border text-fg-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-3 flex flex-col gap-2 font-mono text-xs text-fg-muted uppercase tracking-[0.18em]">
                    <span>{p.client}</span>
                    <span>{p.role}</span>
                    <span>{p.year}</span>
                  </div>

                  <div className="md:col-span-2 flex md:justify-end items-start pt-2">
                    <span
                      className="h-14 w-14 rounded-full border border-border flex items-center justify-center text-fg-muted group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all group-hover:scale-110"
                      style={{ transitionDuration: "400ms" }}
                    >
                      <span className="transition-transform group-hover:rotate-[-45deg]">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
            <li className="border-t border-border py-16 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle">
                More on the way · Case studies for Qwipo and Flytta coming soon
              </p>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
}
