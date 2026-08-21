/**
 * Brand marks for the tools listed in the About stack and service
 * tool lists. Known tools get their real logo (inline SVG — no
 * external requests); Adobe apps use Adobe's own two-letter tile
 * branding; anything unrecognised falls back to a tidy monogram
 * tile, so tools added later from the admin still get an icon.
 */

type Mark = {
  match: RegExp;
  render: (size: number) => React.ReactNode;
};

/** Adobe-style two-letter app tile (their actual branding format). */
function adobeTile(letters: string, bg: string, fg: string) {
  return function AdobeTile(size: number) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="4.5" fill={bg} />
        <rect
          x="0.75"
          y="0.75"
          width="22.5"
          height="22.5"
          rx="4"
          fill="none"
          stroke={fg}
          strokeOpacity="0.9"
          strokeWidth="1.2"
        />
        <text
          x="12"
          y="16.2"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="700"
          fontSize="10.5"
          fill={fg}
        >
          {letters}
        </text>
      </svg>
    );
  };
}

/** Neutral monogram tile for tools without a drawn mark. */
function monogramTile(name: string, size: number) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect
        width="24"
        height="24"
        rx="4.5"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth="1"
      />
      <text
        x="12"
        y="16.4"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="600"
        fontSize="11"
        fill="var(--color-fg-muted)"
      >
        {letter}
      </text>
    </svg>
  );
}

const MARKS: Mark[] = [
  {
    // Figma, FigJam, Figma Dev Mode, Figma prototyping, Figma + Variables
    match: /figma|figjam/i,
    render: (size) => (
      <svg
        width={(size * 38) / 57}
        height={size}
        viewBox="0 0 38 57"
        aria-hidden
      >
        <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
        <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
        <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
        <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
        <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" />
      </svg>
    ),
  },
  { match: /illustrator/i, render: adobeTile("Ai", "#330000", "#FF9A00") },
  { match: /photoshop/i, render: adobeTile("Ps", "#001E36", "#31A8FF") },
  { match: /\bxd\b|adobe xd/i, render: adobeTile("Xd", "#470137", "#FF61F6") },
  { match: /after ?effects/i, render: adobeTile("Ae", "#00005B", "#9999FF") },
  {
    match: /react/i,
    render: (size) => (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="2.1" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="1.1" fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </g>
      </svg>
    ),
  },
  {
    match: /tailwind/i,
    render: (size) => (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#38bdf8"
          d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z"
        />
      </svg>
    ),
  },
  {
    match: /framer/i,
    render: (size) => (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M5 1h14v7.33h-7L5 1zm0 7.33h7l7 7.34H5V8.33zm0 7.34h7V23l-7-7.33z"
        />
      </svg>
    ),
  },
  {
    match: /blender/i,
    render: adobeTile("B", "#1e2226", "#EA7600"),
  },
  {
    match: /storybook/i,
    render: adobeTile("S", "#FF4785", "#ffffff"),
  },
  {
    match: /notion/i,
    render: (size) => monogramTile("N", size),
  },
];

export function ToolLogo({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const marks = MARKS.filter((m) => m.match.test(name)).slice(0, 2);
  return (
    <span
      className={`inline-flex items-center gap-1.5 flex-none ${className ?? ""}`}
      aria-hidden
    >
      {marks.length > 0
        ? marks.map((m, i) => <span key={i}>{m.render(size)}</span>)
        : monogramTile(name, size)}
    </span>
  );
}
