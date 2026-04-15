"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Container } from "../layout/container";

const Hero3D = dynamic(
  () => import("./hero-3d").then((m) => m.Hero3D),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,93,46,0.18),transparent_60%)]" />
    ),
  }
);

const TITLE_LINE_1 = "Senior Product";
const TITLE_LINE_2 = "Designer.";

const word = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.15 + i * 0.06,
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
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

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 md:pt-16 pb-24 md:pb-32">
      {/* 3D canvas — absolute on desktop, relative on mobile */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[45%] lg:w-[42%] md:h-full h-[45%] top-[55%] md:top-0 md:pr-4 lg:pr-8 pointer-events-auto opacity-90">
        <Hero3D />
      </div>

      {/* subtle grid texture */}
      <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,var(--color-fg)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-fg)_1px,transparent_1px)] [background-size:48px_48px]" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[78vh] md:min-h-[82vh] items-end md:items-center pt-12">
          {/* Copy */}
          <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-8">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-fg-muted flex items-center gap-3"
            >
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Available for select freelance work · Hyderabad, India
            </motion.span>

            <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] text-balance">
              <span className="block">
                <AnimatedWords text={TITLE_LINE_1} />
              </span>
              <span className="block text-accent italic">
                <AnimatedWords text={TITLE_LINE_2} base={TITLE_LINE_1.split(" ").length} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-lg md:text-xl text-fg-muted max-w-xl text-pretty leading-relaxed"
            >
              Six years. Forty-plus products shipped across healthcare, logistics,
              and B2B SaaS. One belief:{" "}
              <span className="text-fg italic font-display">
                good design is good business.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="flex flex-wrap items-center gap-3 pt-4"
            >
              <Link
                href="/work"
                className="group inline-flex items-center gap-3 rounded-full bg-fg text-bg px-6 py-4 text-sm font-medium hover:bg-accent hover:text-white transition-all hover:pr-8"
              >
                See selected work
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 backdrop-blur-sm px-6 py-4 text-sm font-medium hover:bg-surface hover:border-fg transition-colors"
              >
                Get in touch
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex flex-col gap-2 pt-10 font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle"
            >
              <span>Currently</span>
              <span className="text-fg-muted font-sans text-sm normal-case tracking-normal">
                Designing seller &amp; logistics platforms at{" "}
                <span className="text-fg">Qwipo</span>
              </span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-6 md:left-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          Scroll
        </motion.div>
      </Container>
    </section>
  );
}
