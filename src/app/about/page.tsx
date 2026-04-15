import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Senior Product Designer based in Hyderabad. Six years of experience in healthcare, B2B SaaS, and logistics product design.",
};

const experience = [
  {
    role: "Senior Product Designer",
    company: "Qwipo",
    period: "Dec 2025 — Present",
    location: "Hybrid · Hyderabad",
    highlight:
      "B2B/B2C logistics and seller applications — onboarding, inventory, order management, and pricing systems.",
  },
  {
    role: "Senior Product Designer",
    company: "Achala IT Solutions",
    period: "Dec 2023 — Oct 2025",
    location: "Hyderabad",
    highlight:
      "40+ healthcare and enterprise applications for AIG, KIMS, Kamineni, Continental, Nephroplus, and Aster Hospitals — ABHA and WCAG compliant.",
  },
  {
    role: "UI/UX & Brand Designer",
    company: "Flytta Innovations",
    period: "Aug 2021 — Nov 2023",
    location: "Hyderabad",
    highlight:
      "Led brand + product design across digital platforms. Mentored juniors and established design guidelines.",
  },
  {
    role: "Visual Designer",
    company: "Granddad Communications",
    period: "Jun 2020 — Aug 2021",
    location: "Hyderabad",
    highlight:
      "Brand identity, environmental branding, and animated social content.",
  },
  {
    role: "2D Animator — Intern",
    company: "Cosmos Maya",
    period: "Mar 2020 — Jun 2020",
    location: "Hyderabad",
    highlight:
      "Worked on multiple episodes of a Cartoon Network animated series — timing, spacing, character motion.",
  },
];

const stack = [
  { label: "Figma", level: "Expert" },
  { label: "Illustrator", level: "Expert" },
  { label: "Photoshop", level: "Proficient" },
  { label: "Adobe XD", level: "Proficient" },
  { label: "After Effects", level: "Proficient" },
  { label: "Blender", level: "Learning" },
  { label: "Front-end (React / Tailwind)", level: "Learning" },
];

const values = [
  {
    title: "Systems over screens.",
    body: "Every component, token, and flow earns its place by how well it scales past its first release.",
  },
  {
    title: "Research reaches engineering.",
    body: "The story of why something matters travels to the people who build it, or the design didn't do its job.",
  },
  {
    title: "Business software deserves humanity.",
    body: "Enterprise tools take up most of people's working lives. That's reason enough to make them feel good.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-16 md:pt-24 pb-16">
        <Container size="md">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              About · Vikas Mittapalli
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-balance mt-6">
              A senior product designer who treats interfaces as{" "}
              <span className="italic text-accent">conversations.</span>
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24 border-t border-border">
        <Container size="md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl relative">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(160deg, #e85d2e 0%, #c94a20 45%, #1a0f0a 100%)",
                    }}
                  />
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay [background-image:radial-gradient(circle_at_30%_40%,white,transparent_50%)]" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-display text-white text-3xl">Vikas.</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 mt-2">
                      Hyderabad, India · 2026
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="flex flex-col gap-3 mt-8">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium hover:bg-accent hover:text-white hover:border-accent transition-colors"
                  >
                    Download resume <span>↓</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/vikasmittapalli/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-full border border-border bg-surface px-5 py-3 text-sm text-fg-muted hover:text-fg transition-colors"
                  >
                    LinkedIn <span>↗</span>
                  </a>
                  <a
                    href="https://www.behance.net/vikasmittapalli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-full border border-border bg-surface px-5 py-3 text-sm text-fg-muted hover:text-fg transition-colors"
                  >
                    Behance <span>↗</span>
                  </a>
                  <a
                    href="mailto:vikasmittapalli@gmail.com"
                    className="inline-flex items-center justify-between rounded-full border border-border bg-surface px-5 py-3 text-sm text-fg-muted hover:text-fg transition-colors"
                  >
                    Email <span>→</span>
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-8 flex flex-col gap-6">
              <Reveal delay={0.1}>
                <p className="text-xl md:text-2xl leading-relaxed text-pretty">
                  I&apos;m Vikas — a Senior Product Designer based in Hyderabad
                  with six years of experience designing complex B2B, healthcare,
                  and logistics products.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-fg-muted text-lg leading-relaxed text-pretty">
                  I&apos;m currently at{" "}
                  <span className="text-fg">Qwipo</span>, where I lead
                  end-to-end design for seller and logistics applications:
                  onboarding, inventory, pricing systems — the kind of workflows
                  where every extra click costs a real business real money.
                  Before this, two years at{" "}
                  <span className="text-fg">Achala IT Solutions</span>{" "}
                  designing 40+ healthcare applications for AIG, KIMS,
                  Kamineni, Continental, Nephroplus, and Aster — work governed
                  by ABHA and WCAG compliance, where getting design wrong has
                  consequences beyond bounce rate.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-fg-muted text-lg leading-relaxed text-pretty">
                  I didn&apos;t start in product design. I have a Bachelor of
                  Fine Arts in Animation from JNAFAU, and my first job was as a
                  2D animator on a Cartoon Network series at Cosmos Maya. That
                  origin still shapes how I work: I treat interfaces as
                  sequences, I care about timing, and I believe the space
                  between two states is where a product earns its personality.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-fg-muted text-lg leading-relaxed text-pretty">
                  What I care about now: design systems that scale past their
                  first release, research that reaches the engineers who build
                  the thing, and the slow, unfashionable work of making
                  business software feel humane.
                </p>
              </Reveal>
              <Reveal delay={0.5}>
                <p className="text-fg-muted text-sm italic pt-2">
                  Outside of work — long travel, photography, cooking, and
                  mural painting.
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
              How I work
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl mt-6 mb-12 text-balance">
              Three things I keep coming back to.
            </h2>
          </Reveal>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {values.map((v, i) => (
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
              Where I&apos;ve been
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl mt-6 mb-12 text-balance">
              Six years, five rooms.
            </h2>
          </Reveal>
          <ol className="relative border-l border-border pl-8 md:pl-12 flex flex-col gap-12">
            {experience.map((e, i) => (
              <Reveal key={e.company} delay={i * 0.08} as="li" className="relative">
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
              Stack
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl mt-6 mb-12 text-balance">
              Tools I reach for.
            </h2>
          </Reveal>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stack.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.05}
                as="li"
                className="rounded-2xl border border-border bg-surface px-5 py-4 hover:border-fg transition-colors"
              >
                <p className="font-display text-lg">{s.label}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle mt-1">
                  {s.level}
                </p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
