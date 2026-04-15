import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/reveal";
import { getProjectBySlug, projects } from "@/lib/projects";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      {/* Cover */}
      <section className="pt-12 md:pt-20">
        <Container size="md">
          <Reveal>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted hover:text-fg transition-colors"
            >
              <span>←</span> All work
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02] text-balance mt-8">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-xl md:text-2xl text-fg-muted max-w-2xl text-pretty">
              {project.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mb-2">
                  Client
                </dt>
                <dd className="text-fg">{project.client}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mb-2">
                  Role
                </dt>
                <dd className="text-fg">{project.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mb-2">
                  Year
                </dt>
                <dd className="text-fg">{project.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mb-2">
                  Tools
                </dt>
                <dd className="text-fg">{project.stack.slice(0, 2).join(", ")}</dd>
              </div>
            </dl>
          </Reveal>
        </Container>

        {/* Hero art */}
        <Container>
          <Reveal delay={0.4}>
            <div
              className="mt-16 aspect-[16/10] w-full rounded-3xl overflow-hidden border border-border relative"
              style={{
                background: `linear-gradient(135deg, ${project.accent}22 0%, transparent 60%), radial-gradient(circle at 70% 30%, ${project.accent}40, transparent 60%)`,
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="h-[60%] w-[60%] rounded-full opacity-70 blur-3xl"
                  style={{
                    background: `radial-gradient(circle at center, ${project.accent}, transparent 70%)`,
                  }}
                />
                <div
                  className="absolute h-40 w-40 md:h-56 md:w-56 rounded-3xl border border-fg/10 backdrop-blur-md"
                  style={{
                    background: `linear-gradient(135deg, ${project.accent}40, transparent)`,
                  }}
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Body — real case study content */}
      <section className="py-24 md:py-32">
        <Container size="sm">
          {project.sections.map((section, idx) => (
            <Reveal key={section.eyebrow} delay={idx * 0.08}>
              <div
                className={
                  idx === 0 ? "" : "mt-16 pt-16 border-t border-border"
                }
              >
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                  {section.eyebrow}
                </span>
                <h2 className="font-display text-3xl md:text-4xl mt-4 mb-6 text-balance">
                  {section.title}
                </h2>
                <p className="text-fg-muted text-lg leading-relaxed text-pretty">
                  {section.body}
                </p>
                {section.bullets && (
                  <ul className="mt-6 flex flex-col gap-3">
                    {section.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-4 text-fg-muted leading-relaxed"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.55em] h-1.5 w-1.5 rounded-full bg-accent flex-none"
                        />
                        <span className="text-pretty">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}

          {project.reflection && (
            <Reveal delay={0.4}>
              <blockquote className="mt-20 pt-16 border-t border-border">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                  Reflection
                </span>
                <p className="font-display text-2xl md:text-3xl mt-4 leading-snug text-balance italic">
                  &ldquo;{project.reflection}&rdquo;
                </p>
              </blockquote>
            </Reveal>
          )}

          <Reveal delay={0.5}>
            <div className="mt-20 pt-10 border-t border-border flex flex-wrap items-center justify-between gap-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle max-w-md">
                Want a walkthrough with real screens and metrics? Reach out — I&apos;m
                happy to share more under a short call.
              </p>
              <a
                href="mailto:vikasmittapalli@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm hover:bg-accent hover:text-white hover:border-accent transition-colors"
              >
                Request a walkthrough <span>→</span>
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Next project */}
      <section className="border-t border-border py-20">
        <Container>
          <Link
            href={`/work/${nextProject.slug}`}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-3xl border border-border bg-surface p-8 md:p-12 hover:border-fg transition-colors"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle">
                Next project
              </span>
              <h2 className="font-display text-3xl md:text-5xl mt-3 text-balance group-hover:text-accent transition-colors">
                {nextProject.title}
              </h2>
              <p className="mt-2 text-fg-muted max-w-lg">
                {nextProject.tagline}
              </p>
            </div>
            <span className="h-14 w-14 flex items-center justify-center rounded-full bg-fg text-bg text-lg group-hover:bg-accent group-hover:text-white transition-all group-hover:scale-110">
              →
            </span>
          </Link>
        </Container>
      </section>
    </>
  );
}
