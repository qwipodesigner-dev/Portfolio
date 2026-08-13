import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation about a product you want designed well.",
};

export default function ContactPage() {
  return (
    <section className="pt-16 md:pt-24 pb-24 md:pb-32">
      <Container size="md">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
            Contact
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-balance mt-6 max-w-3xl">
            Let&apos;s make something{" "}
            <span className="italic text-accent">good.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-fg-muted text-lg text-pretty">
            Tell me a bit about what you&apos;re working on — timeline,
            shape of the problem, and what success looks like. I read every
            message and typically respond within two business days.
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
                href="mailto:vikasmittapalli@gmail.com"
                className="block font-display text-xl hover:text-accent transition-colors"
              >
                vikasmittapalli@gmail.com
              </a>
              <a
                href="tel:+919703479995"
                className="block mt-2 text-fg-muted hover:text-fg transition-colors"
              >
                +91 97034 79995
              </a>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle mb-3 block">
                Elsewhere
              </span>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="https://www.linkedin.com/in/vikasmittapalli/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-fg-muted hover:text-fg transition-colors"
                  >
                    LinkedIn ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.behance.net/vikasmittapalli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-fg-muted hover:text-fg transition-colors"
                  >
                    Behance ↗
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle mb-3 block">
                Based in
              </span>
              <p className="text-fg-muted">
                Hyderabad, India
                <br />
                <span className="font-mono text-xs text-fg-subtle">IST · UTC+5:30</span>
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-subtle mb-3 block">
                Preferred work
              </span>
              <p className="text-sm text-fg-muted text-pretty">
                Healthcare, B2B SaaS, logistics and commerce platforms, and
                design-system engagements. Open to roles and consulting.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
