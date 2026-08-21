import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/reveal";
import { PortraitImage } from "@/components/portrait-image";
import { ToolLogo } from "@/components/tool-logo";
import { getSiteContent } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Senior Product Designer based in Hyderabad. Six years of experience in healthcare, B2B SaaS, and logistics product design.",
};

export default async function AboutPage() {
  const [about, contact, settings] = await Promise.all([
    getSiteContent("about"),
    getSiteContent("contact"),
    getSiteContent("settings"),
  ]);

  return (
    <>
      <section className="pt-16 md:pt-24 pb-16">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              {about.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-balance mt-6">
              {about.heading}{" "}
              <span className="italic text-accent">{about.headingEmphasis}</span>
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24 border-t border-border">
        <Container size="md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl relative bg-[linear-gradient(160deg,#e85d2e_0%,#c94a20_45%,#1a0f0a_100%)]">
                  <PortraitImage
                    sizes="(min-width: 768px) 320px, 100vw"
                    priority
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.6) 100%)",
                    }}
                  />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-display text-white text-3xl">
                      {about.portraitName}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 mt-2">
                      {about.portraitMeta}
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="flex flex-col gap-3 mt-8">
                  <a
                    href={settings.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors"
                  >
                    Download resume <span>↓</span>
                  </a>
                  {contact.socials.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between rounded-full border border-border bg-surface px-5 py-3 text-sm text-fg-muted hover:text-fg transition-colors"
                    >
                      {s.label} <span>↗</span>
                    </a>
                  ))}
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center justify-between rounded-full border border-border bg-surface px-5 py-3 text-sm text-fg-muted hover:text-fg transition-colors"
                  >
                    Email <span>→</span>
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-8 flex flex-col gap-6">
              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <p
                    className={
                      i === 0
                        ? "text-xl md:text-2xl leading-relaxed text-pretty"
                        : "text-fg-muted text-lg leading-relaxed text-pretty"
                    }
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
              <Reveal delay={0.5}>
                <p className="text-fg-muted text-sm italic pt-2">
                  {about.hobbiesLine}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 border-t border-border">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              {about.valuesEyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl mt-6 mb-12 text-balance">
              {about.valuesHeading}
            </h2>
          </Reveal>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {about.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1} as="li" className="bg-bg p-8">
                <span className="font-mono text-xs text-fg-subtle tracking-[0.2em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl mt-4 mb-3 text-balance">
                  {v.title}
                </h3>
                <p className="text-fg-muted text-pretty">{v.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Experience timeline */}
      <section className="py-16 md:py-24 border-t border-border">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              {about.experienceEyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl mt-6 mb-12 text-balance">
              {about.experienceHeading}
            </h2>
          </Reveal>
          <ol className="relative border-l border-border pl-8 md:pl-12 flex flex-col gap-12">
            {about.experience.map((e, i) => (
              <Reveal key={`${e.company}-${i}`} delay={i * 0.08} as="li" className="relative">
                <span className="absolute -left-[35px] md:-left-[49px] top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-bg" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl md:text-2xl">
                    {e.role} · <span className="text-fg-muted">{e.company}</span>
                  </h3>
                  <span className="font-mono text-xs text-fg-subtle uppercase tracking-[0.18em]">
                    {e.period}
                  </span>
                </div>
                <p className="font-mono text-xs text-fg-subtle uppercase tracking-[0.18em] mt-1">
                  {e.location}
                </p>
                <p className="mt-4 text-fg-muted text-pretty leading-relaxed">
                  {e.highlight}
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Stack */}
      <section className="py-16 md:py-24 border-t border-border">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              {about.stackEyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl mt-6 mb-12 text-balance">
              {about.stackHeading}
            </h2>
          </Reveal>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {about.stack.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.05}
                as="li"
                className="rounded-2xl border border-border bg-surface px-5 py-4 hover:border-fg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ToolLogo name={s.label} size={26} />
                  <div className="min-w-0">
                    <p className="font-display text-lg">{s.label}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle mt-1">
                      {s.level}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
