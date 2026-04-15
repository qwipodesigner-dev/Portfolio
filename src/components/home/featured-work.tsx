"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Container } from "../layout/container";
import { Reveal } from "../reveal";
import { SectionHeader } from "../layout/section";
import { getFeaturedProjects } from "@/lib/projects";

const projects = getFeaturedProjects();

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const isLarge = index === 0;

  return (
    <Link
      ref={ref}
      href={`/work/${project.slug}`}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-surface transition-colors hover:border-fg ${
        isLarge ? "md:col-span-2" : "md:col-span-1"
      }`}
    >
      {/* Image / Canvas area */}
      <div
        className={`relative overflow-hidden ${
          isLarge ? "aspect-[16/10]" : "aspect-[4/5]"
        }`}
        style={{
          background: `linear-gradient(135deg, ${project.accent}22 0%, transparent 60%), radial-gradient(circle at 70% 30%, ${project.accent}33, transparent 60%)`,
        }}
      >
        {/* placeholder art — animated abstract */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ y }}
        >
          <div
            className="h-[70%] w-[70%] rounded-full opacity-60 mix-blend-luminosity blur-2xl transition-all duration-700 group-hover:opacity-90 group-hover:blur-3xl"
            style={{
              background: `radial-gradient(circle at center, ${project.accent}, transparent 70%)`,
            }}
          />
          <div
            className="absolute h-32 w-32 rounded-2xl border border-fg/10 backdrop-blur-md transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
            style={{
              background: `linear-gradient(135deg, ${project.accent}30, transparent)`,
            }}
          />
        </motion.div>

        {/* Meta chip — top right */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-fg/10 bg-bg/60 backdrop-blur-md text-fg">
            {project.year}
          </span>
        </div>
        {/* Number */}
        <span className="absolute top-5 left-5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Hover CTA */}
        <div className="absolute bottom-5 right-5 h-12 w-12 rounded-full bg-fg text-bg flex items-center justify-center transition-all duration-500 group-hover:bg-accent group-hover:text-white group-hover:scale-110">
          <span className="text-lg transition-transform group-hover:rotate-[-45deg]">
            →
          </span>
        </div>
      </div>

      {/* Text area */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3 font-mono text-xs text-fg-subtle">
          <span>{project.client}</span>
          <span>·</span>
          <span>{project.role}</span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl leading-tight mb-2 text-balance">
          {project.title}
        </h3>
        <p className="text-fg-muted text-pretty line-clamp-2">
          {project.tagline}
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {project.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="text-xs px-3 py-1 rounded-full border border-border text-fg-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function FeaturedWork() {
  return (
    <section
      id="work"
      className="relative py-24 md:py-32 border-t border-border"
    >
      <Container>
        <div className="flex items-end justify-between gap-6 mb-12 md:mb-16">
          <SectionHeader
            eyebrow="Selected work · 2021 — Now"
            title="Systems that ship, interfaces that scale."
            description="A few recent projects across healthcare, B2B commerce, and enterprise design systems."
          />
          <Reveal delay={0.2}>
            <Link
              href="/work"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors whitespace-nowrap"
            >
              All work
              <span>→</span>
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
