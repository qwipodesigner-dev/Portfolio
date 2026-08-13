import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { getSiteContent } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation about a product you want designed well.",
};

export default async function ContactPage() {
  const contact = await getSiteContent("contact");

  return (
    <section className="pt-16 md:pt-24 pb-24 md:pb-32">
      <Container size="md">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            {contact.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-balance mt-6 max-w-3xl">
            {contact.heading}{" "}
            <span className="italic text-accent">{contact.headingEmphasis}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-fg-muted text-lg text-pretty">
            {contact.blurb}
          </p>
        </Reveal>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <Reveal delay={0.3} className="md:col-span-7">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.4} className="md:col-span-5 flex flex-col gap-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle mb-3 block">
                Direct
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="block font-display text-xl hover:text-accent transition-colors"
              >
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="block mt-2 text-fg-muted hover:text-fg transition-colors"
              >
                {contact.phone}
              </a>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle mb-3 block">
                Elsewhere
              </span>
              <ul className="flex flex-col gap-2">
                {contact.socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-fg-muted hover:text-fg transition-colors"
                    >
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle mb-3 block">
                Based in
              </span>
              <p className="text-fg-muted">
                {contact.basedIn}
                <br />
                <span className="font-mono text-xs text-fg-subtle">
                  {contact.timezone}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle mb-3 block">
                {contact.preferredHeading}
              </span>
              <p className="text-sm text-fg-muted text-pretty">
                {contact.preferredText}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
