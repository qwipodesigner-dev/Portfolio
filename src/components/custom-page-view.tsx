import { Container } from "./layout/container";
import { Reveal } from "./reveal";
import { CaseSections } from "./case-sections";
import type { CustomPage } from "@/lib/pages-data";

/** Shared renderer for admin-created custom pages — used by the public
 *  /[slug] route and the admin draft-preview route. */
export function CustomPageView({ page }: { page: CustomPage }) {
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
