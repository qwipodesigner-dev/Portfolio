"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { Container } from "../layout/container";

export function ContactCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-40 border-t border-border overflow-hidden"
    >
      {/* Ambient gradient */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ y }}
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full blur-[120px] opacity-30 bg-accent" />
      </motion.div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
          className="flex flex-col items-center text-center gap-10"
        >
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            Let&apos;s work together
          </span>

          <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] text-balance max-w-5xl">
            Got a product worth <span className="italic text-accent">designing well?</span>
          </h2>

          <p className="max-w-xl text-fg-muted text-lg text-pretty">
            I take on a small number of freelance and consulting projects each year.
            Healthcare, B2B SaaS, logistics, and design-system work preferred.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-fg text-bg px-8 py-5 text-base font-medium hover:bg-accent hover:text-white transition-all hover:pr-10"
            >
              Start a conversation
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="mailto:vikasmittapalli@gmail.com"
              className="inline-flex items-center gap-2 text-fg-muted hover:text-fg transition-colors text-sm"
            >
              or drop a mail
              <span className="text-fg">vikasmittapalli@gmail.com</span>
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
