import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/reveal";
import { ServiceImage } from "@/components/service-image";
import { getServiceBySlug, getVisibleServices } from "@/lib/services-data";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getVisibleServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const nextService = await getServiceBySlug(service.next);

  return (
    <>
      {/* Hero */}
      <section className="pt-12 md:pt-20">
        <Container size="md">
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted hover:text-fg transition-colors"
            >
              <span>←</span> All services
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle mt-10 block">
              {service.number} · Service
            </span>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] text-balance mt-4">
              {service.title}
            </h1>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-8 text-xl md:text-2xl text-fg-muted max-w-2xl text-pretty leading-relaxed">
              {service.intro}
            </p>
          </Reveal>
        </Container>

        <Container size="lg">
          <Reveal delay={0.35}>
            <ServiceImage
              src={`/images/services/${service.slug}-hero.jpg`}
              alt={`${service.title} — hero image`}
              caption={`${service.number} · ${service.title}`}
              aspectRatio="16/9"
            />
          </Reveal>
        </Container>
      </section>

      {/* Approach */}
      <section className="py-16 md:py-24">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              How I approach this
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl mt-6 mb-12 text-balance leading-[1.05]">
              The work, one phase at a time.
            </h2>
          </Reveal>

          <div className="flex flex-col gap-8">
            {service.approach.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="text-lg md:text-xl text-fg-muted leading-relaxed text-pretty">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>

        <Container size="lg">
          <Reveal delay={0.2}>
            <ServiceImage
              src={`/images/services/${service.slug}-process.jpg`}
              alt={`${service.title} — process image`}
              caption="Process · in practice"
              aspectRatio="16/9"
            />
          </Reveal>
        </Container>
      </section>

      {/* Deliverables */}
      <section className="py-16 md:py-24 border-t border-border">
        <Container size="md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
                  What I deliver
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-3xl md:text-4xl mt-4 text-balance leading-[1.05]">
                  Tangible outputs from this engagement.
                </h2>
              </Reveal>
            </div>

            <ul className="md:col-span-8 flex flex-col">
              {service.deliverables.map((d, i) => (
                <Reveal key={i} delay={i * 0.05} as="li">
                  <div className="flex items-start gap-5 py-5 border-t border-border first:border-t-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle pt-1 w-8 flex-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-fg-muted text-lg text-pretty leading-relaxed">
                      {d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Methods */}
      <section className="py-16 md:py-24 border-t border-border">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              Methods &amp; frameworks
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl mt-4 mb-12 text-balance leading-[1.05]">
              The shoulders I stand on.
            </h2>
          </Reveal>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {service.methods.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05} as="li">
                <div className="bg-bg p-6 md:p-8 h-full">
                  <h3 className="font-display text-lg md:text-xl mb-2 text-balance">
                    {m.name}
                  </h3>
                  <p className="text-fg-muted text-pretty leading-relaxed">
                    {m.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>

        <Container size="lg">
          <Reveal delay={0.2}>
            <ServiceImage
              src={`/images/services/${service.slug}-detail.jpg`}
              alt={`${service.title} — detail image`}
              caption="Artefacts · what the work looks like"
              aspectRatio="16/9"
            />
          </Reveal>
        </Container>
      </section>

      {/* Tools */}
      <section className="py-16 md:py-24 border-t border-border">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              Tools I reach for
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl mt-4 mb-10 text-balance leading-[1.05]">
              The stack, not the religion.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="flex flex-wrap gap-3">
              {service.tools.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-border bg-surface px-5 py-2 text-sm text-fg-muted hover:text-fg hover:border-fg transition-colors"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Next + Contact CTA */}
      <section className="border-t border-border py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nextService && (
              <Link
                href={`/services/${nextService.slug}`}
                className="group flex flex-col gap-4 rounded-3xl border border-border bg-surface p-8 md:p-10 hover:border-fg transition-colors"
              >
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle">
                  Next service · {nextService.number}
                </span>
                <h3 className="font-display text-2xl md:text-4xl text-balance group-hover:text-accent transition-colors">
                  {nextService.title}
                </h3>
                <p className="text-fg-muted text-pretty">
                  {nextService.summary}
                </p>
                <span className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle group-hover:text-fg transition-colors">
                  Read process →
                </span>
              </Link>
            )}

            <Link
              href="/contact"
              className="group flex flex-col gap-4 rounded-3xl border border-border bg-bg p-8 md:p-10 hover:border-accent transition-colors"
            >
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle">
                Start a project
              </span>
              <h3 className="font-display text-2xl md:text-4xl text-balance">
                Want to start a{" "}
                <span className="italic text-accent">
                  {service.title.toLowerCase()}
                </span>{" "}
                engagement?
              </h3>
              <p className="text-fg-muted text-pretty">
                Tell me about the problem and the timeline. I&apos;ll come back
                with a scoped proposal within two business days.
              </p>
              <span className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle group-hover:text-fg transition-colors">
                Get in touch →
              </span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
