"use client";

import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Reveal } from "../reveal";
import { SectionHeader } from "../layout/section";

const services = [
  {
    no: "01",
    title: "Discovery & Research",
    body: "Stakeholder interviews, PRD and API review, and user research synthesis — the front-end of every product I ship.",
  },
  {
    no: "02",
    title: "UX Architecture & Wireframing",
    body: "User flows, IA, and low-fidelity structure that pressure-tests logic before pixels get expensive.",
  },
  {
    no: "03",
    title: "High-Fidelity UI Design",
    body: "Production-ready interfaces for complex B2B, healthcare, and logistics products — accessible (WCAG) and compliant (ABHA) by default.",
  },
  {
    no: "04",
    title: "Design Systems",
    body: "Scalable component libraries and tokens — currently governing systems across 40+ applications at enterprise scale.",
  },
  {
    no: "05",
    title: "Prototyping & Motion",
    body: "Interactive Figma prototypes and After Effects micro-interactions that communicate intent better than any spec doc.",
  },
  {
    no: "06",
    title: "Design-to-Code Collaboration",
    body: "Tokens, Tailwind, component APIs — I partner with front-end engineers so designs ship without translation loss.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32 border-t border-border">
      <Container>
        <SectionHeader
          eyebrow="Services · What I do"
          title="Six ways I help teams ship better products."
          description="I take ownership end-to-end — from the messy problem statement to the handoff that engineers can actually build from."
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {services.map((s, i) => (
            <Reveal
              key={s.no}
              delay={i * 0.05}
              as="li"
              className="group relative bg-bg p-8 md:p-10 transition-colors hover:bg-surface cursor-default"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-mono text-xs text-fg-subtle tracking-[0.2em]">
                  {s.no}
                </span>
                <motion.span
                  className="text-fg-subtle group-hover:text-accent transition-colors"
                  initial={{ rotate: -45, opacity: 0.4 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                >
                  →
                </motion.span>
              </div>
              <h3 className="font-display text-2xl md:text-[1.65rem] leading-tight mb-4 text-balance">
                {s.title}
              </h3>
              <p className="text-fg-muted text-pretty leading-relaxed">
                {s.body}
              </p>

              {/* Hover accent line */}
              <span className="absolute left-0 bottom-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-500" />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
