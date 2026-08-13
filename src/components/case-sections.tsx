import { Reveal } from "./reveal";
import type { CaseStudySection } from "@/lib/projects";

/**
 * Shared renderer for block-based content sections — used by case
 * studies and admin-created custom pages so both follow the same
 * design language. Text sections render exactly as the original
 * case-study markup; media blocks are figures.
 */
export function CaseSections({ sections }: { sections: CaseStudySection[] }) {
  return (
    <>
      {sections.map((section, idx) => (
        <Reveal key={idx} delay={idx * 0.08}>
          {!section.type || section.type === "text" ? (
            <div className={idx === 0 ? "" : "mt-16 pt-16 border-t border-border"}>
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
                    <li key={i} className="flex gap-4 text-fg-muted leading-relaxed">
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
          ) : (
            <figure className="mt-12">
              {section.type === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={section.src}
                  alt={section.alt ?? ""}
                  className="w-full rounded-2xl border border-border"
                  loading="lazy"
                />
              )}
              {section.type === "video" &&
                (/youtube\.com|youtu\.be|vimeo\.com/.test(section.src) ? (
                  <iframe
                    src={section.src}
                    className="w-full aspect-video rounded-2xl border border-border"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={section.caption ?? "Video"}
                  />
                ) : (
                  <video
                    src={section.src}
                    controls
                    playsInline
                    className="w-full rounded-2xl border border-border"
                  />
                ))}
              {section.type === "embed" && (
                <iframe
                  src={section.url}
                  className="w-full rounded-2xl border border-border"
                  style={{ height: section.height ?? 480 }}
                  title={section.caption ?? "Embedded content"}
                />
              )}
              {"caption" in section && section.caption && (
                <figcaption className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mt-3">
                  {section.caption}
                </figcaption>
              )}
            </figure>
          )}
        </Reveal>
      ))}
    </>
  );
}
