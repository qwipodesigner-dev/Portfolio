"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Reveal } from "../reveal";
import { PortraitImage } from "../portrait-image";
import type { AboutSnippetContent } from "@/lib/site";

export function AboutSnippet({
  content,
  resumeUrl,
}: {
  content: AboutSnippetContent;
  resumeUrl: string;
}) {
  return (
    <section
      id="about-snippet"
      className="relative py-24 md:py-32 border-t border-border"
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
          <div className="md:col-span-5">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
                {content.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <motion.div
                className="relative mt-8 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-[linear-gradient(160deg,#e85d2e_0%,#c94a20_45%,#1a0f0a_100%)]"
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.4 }}
              >
                <PortraitImage
                  sizes="(min-width: 768px) 384px, 100vw"
                  priority
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)",
                  }}
                />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="font-display text-white text-2xl">
                      {content.portraitName}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 mt-1">
                      {content.portraitLocation}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                    {content.portraitYear}
                  </span>
                </div>
              </motion.div>
            </Reveal>
          </div>

          <div className="md:col-span-7 flex flex-col gap-6">
            <Reveal delay={0.15}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-balance">
                {content.heading}{" "}
                <span className="italic text-accent">{content.headingEmphasis}</span>
              </h2>
            </Reveal>

            {content.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.25 + i * 0.1}>
                <p className="text-fg-muted text-lg md:text-xl leading-relaxed text-pretty">
                  {p}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.45}>
              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  href={content.storyCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors"
                >
                  {content.storyCta.label}
                  <span>→</span>
                </Link>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-fg-muted hover:text-fg transition-colors"
                >
                  {content.resumeLabel}
                  <span>↓</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
