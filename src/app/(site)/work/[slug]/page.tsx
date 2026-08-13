import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { CaseStudyView } from "@/components/case-study-view";
import { getProjectBySlug, getVisibleProjects } from "@/lib/content";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getVisibleProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
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
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projects = await getVisibleProjects();
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <CaseStudyView project={project} />

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
