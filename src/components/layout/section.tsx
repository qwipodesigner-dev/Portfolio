import { cn } from "@/lib/cn";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  label?: string;
};

export function Section({ children, className, id, label }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("relative py-24 md:py-32", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-12 md:mb-16 flex flex-col gap-4 max-w-2xl">
      {eyebrow && (
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-fg-muted text-lg max-w-xl text-pretty">
          {description}
        </p>
      )}
    </header>
  );
}
