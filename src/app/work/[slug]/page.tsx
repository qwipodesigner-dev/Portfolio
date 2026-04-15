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

      {/* Body — placeholder case study */}
      <section className="py-24 md:py-32">
        <Container size="sm">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              01 · Context
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-4 mb-6 text-balance">
              The problem we needed to solve.
            </h2>
            <p className="text-fg-muted text-lg leading-relaxed text-pretty">
              {project.description}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-16 pt-16 border-t border-border">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                02 · Discovery & research
              </span>
              <h2 className="font-display text-3xl md:text-4xl mt-4 mb-6 text-balance">
                What we learned before designing.
              </h2>
              <p className="text-fg-muted text-lg leading-relaxed text-pretty">
                Stakeholder interviews, PRD reviews, and competitive audits
                mapped the problem space. A detailed walkthrough of research
                artifacts — personas, journey maps, and key quotes — is being
                documented for this case study.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-16 pt-16 border-t border-border">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                03 · Approach
              </span>
              <h2 className="font-display text-3xl md:text-4xl mt-4 mb-6 text-balance">
                From wireframes to shipped interface.
              </h2>
              <p className="text-fg-muted text-lg leading-relaxed text-pretty">
                Designed in Figma with a token-driven design system. Iterated
                weekly with engineering and product to keep scope honest and
                the build predictable.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-16 pt-16 border-t border-border">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                04 · Outcomes
              </span>
              <h2 className="font-display text-3xl md:text-4xl mt-4 mb-6 text-balance">
                What shipped, and what changed.
              </h2>
              <p className="text-fg-muted text-lg leading-relaxed text-pretty">
                {project.outcome ??
                  "Outcome metrics and reflections are being finalized for this case study. Reach out if you'd like to walk through the project in more detail."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-20 pt-10 border-t border-border flex flex-wrap items-center justify-between gap-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle">
                A longer form of this case study is in the works.
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
