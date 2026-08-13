import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/reveal";
import { CaseSections } from "@/components/case-sections";
import { getPageBySlug, getVisiblePages } from "@/lib/pages-data";

type Params = { slug: string };

// Custom pages are created at runtime from the admin — render on demand.
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getVisiblePages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <section className="pt-16 md:pt-24 pb-12 md:pb-16">
        <Container size="md">
          {page.eyebrow && (
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                {page.eyebrow}
              </span>
            </Reveal>
          )}
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-balance mt-6">
              {page.heading}{" "}
              {page.headingEmphasis && (
                <span className="italic text-accent">{page.headingEmphasis}</span>
              )}
            </h1>
          </Reveal>
          {page.description && (
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-2xl text-fg-muted text-lg text-pretty">
                {page.description}
              </p>
            </Reveal>
          )}
        </Container>
      </section>

      <section className="pb-24 md:pb-32">
        <Container size="sm">
          <CaseSections sections={page.sections} />
        </Container>
      </section>
    </>
  );
}
