"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Reveal } from "../reveal";
import { SectionHeader } from "../layout/section";
import type { Service } from "@/lib/services";
import type { SectionHeaderContent } from "@/lib/site";

export function Services({
  header,
  services,
}: {
  header: SectionHeaderContent;
  services: Service[];
}) {
  return (
    <section
      id="services"
      className="relative py-24 md:py-32 border-t border-border"
    >
      <Container>
        <SectionHeader
          eyebrow={header.eyebrow}
          title={header.title}
          description={header.description}
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05} as="li">
              <Link
                href={`/services/${s.slug}`}
                className="group relative flex flex-col h-full bg-bg p-8 md:p-10 transition-colors hover:bg-surface"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono text-xs text-fg-subtle tracking-[0.2em]">
                    {s.number}
                  </span>
                  <motion.span
                    className="text-fg-subtle group-hover:text-accent transition-colors"
                    initial={{ rotate: -45, opacity: 0.4 }}
                    whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                  >
                    ↗
                  </motion.span>
                </div>
                <h3 className="font-display text-2xl md:text-[1.65rem] leading-tight mb-4 text-balance group-hover:text-accent transition-colors">
                  {s.title}
                </h3>
                <p className="text-fg-muted text-pretty leading-relaxed mb-6 flex-1">
                  {s.summary}
                </p>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle group-hover:text-fg transition-colors">
                  Read process →
                </span>

                {/* Hover accent line */}
                <span className="absolute left-0 bottom-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-500" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
