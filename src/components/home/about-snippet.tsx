"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Reveal } from "../reveal";

export function AboutSnippet() {
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
                About
              </span>
            </Reveal>

            {/* Stylized portrait block — replace with real photo later */}
            <Reveal delay={0.1}>
              <motion.div
                className="relative mt-8 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-border"
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(160deg, #e85d2e 0%, #c94a20 45%, #1a0f0a 100%)",
                  }}
                />
                <div className="absolute inset-0 opacity-20 mix-blend-overlay [background-image:radial-gradient(circle_at_30%_40%,white,transparent_50%)]" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="font-display text-white text-2xl">Vikas M.</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 mt-1">
                      Hyderabad, IN
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                    2026
                  </span>
                </div>
              </motion.div>
            </Reveal>
          </div>

          <div className="md:col-span-7 flex flex-col gap-6">
            <Reveal delay={0.15}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-balance">
                I treat interfaces as{" "}
                <span className="italic text-accent">conversations.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="text-fg-muted text-lg md:text-xl leading-relaxed text-pretty">
                I started as a 2D animator — then fell into product design and never
                left. Over six years I&apos;ve designed 40+ products for hospitals, SaaS
                platforms, and commerce marketplaces. The lesson that stuck: the space
                between two states is where a product earns its personality.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="text-fg-muted text-lg md:text-xl leading-relaxed text-pretty">
                Today I&apos;m at <span className="text-fg">Qwipo</span>, leading
                design on seller and logistics workflows. Before that, two years
                at Achala IT shipping healthcare UX for AIG, KIMS, Continental,
                Nephroplus, Kamineni, and Aster Hospitals — under ABHA and WCAG
                constraints that made the craft tighter.
              </p>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors"
                >
                  Read my full story
                  <span>→</span>
                </Link>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-fg-muted hover:text-fg transition-colors"
                >
                  Download resume
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
