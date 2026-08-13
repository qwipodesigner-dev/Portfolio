"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Container } from "../layout/container";
import type { HeroContent } from "@/lib/site";

const Hero3D = dynamic(
  () => import("./hero-3d").then((m) => m.Hero3D),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,93,46,0.18),transparent_60%)]" />
    ),
  }
);

const word = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.15 + i * 0.06,
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function AnimatedWords({ text, base = 0 }: { text: string; base?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-flex overflow-hidden mr-[0.25em]">
          <motion.span
            custom={base + i}
            variants={word}
            initial="hidden"
            animate="visible"
            className="inline-block will-change-transform"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative overflow-hidden pt-6 md:pt-16 pb-16 md:pb-32">
      {/* subtle grid texture — sits behind everything */}
      <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,var(--color-fg)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-fg)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* 3D canvas — desktop only: absolute on the right side, widened to
          give the cube real presence in the hero. Mobile renders a stacked
          instance below the copy (see further down). */}
      <div className="hidden md:block absolute inset-y-0 right-0 md:w-[52%] lg:w-[50%] md:h-full md:top-0 md:pr-4 lg:pr-8 pointer-events-auto opacity-95">
        <Hero3D />
      </div>

      {/* Container is pointer-events-none so the empty space on the right
          (outside the text column) passes pointer events through to the
          absolutely-positioned 3D canvas behind it. Interactive children
          (text column, mobile 3D block) re-enable pointer-events-auto. */}
      <Container className="relative z-10 pointer-events-none">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:gap-8 md:items-center md:min-h-[82vh] pt-6 md:pt-12">
          {/* Copy column */}
          <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-6 md:gap-8 pointer-events-auto">
            <h1 className="font-display text-[clamp(2.75rem,11vw,7.5rem)] leading-[0.95] text-balance">
              <span className="block">
                <AnimatedWords text={content.titleLine1} />
              </span>
              <span className="block text-accent italic">
                <AnimatedWords
                  text={content.titleLine2}
                  base={content.titleLine1.split(" ").length}
                />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-base md:text-xl text-fg-muted max-w-xl text-pretty leading-relaxed"
            >
              {content.subtitle}{" "}
              <span className="text-fg italic font-display">
                {content.subtitleEmphasis}
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2 md:pt-4"
            >
              <Link
                href={content.primaryCta.href}
                className="group inline-flex items-center justify-center sm:justify-start gap-3 rounded-full bg-fg text-bg px-6 py-4 text-sm font-medium hover:bg-accent hover:text-white transition-all hover:pr-8"
              >
                {content.primaryCta.label}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href={content.secondaryCta.href}
                className="inline-flex items-center justify-center sm:justify-start gap-2 rounded-full border border-border bg-surface/80 backdrop-blur-sm px-6 py-4 text-sm font-medium hover:bg-surface hover:border-fg transition-colors"
              >
                {content.secondaryCta.label}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex flex-col gap-2 pt-4 md:pt-10 font-mono text-[10px] md:text-xs uppercase tracking-[0.18em] text-fg-subtle"
            >
              <span>{content.currentlyLabel}</span>
              <span className="text-fg-muted font-sans text-sm normal-case tracking-normal">
                {content.currentlyText}{" "}
                <span className="text-fg">{content.currentlyHighlight}</span>
              </span>
            </motion.div>
          </div>

          {/* 3D canvas — mobile only: stacks below the copy, doesn't overlap */}
          <div className="md:hidden relative h-[320px] xs:h-[360px] sm:h-[420px] w-full pointer-events-auto opacity-90">
            <Hero3D />
          </div>
        </div>

      </Container>
    </section>
  );
}
