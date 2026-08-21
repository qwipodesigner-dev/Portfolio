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
    // "Front-end" cards show the React + Tailwind pair
    match: /react|front-?end/i,
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
    match: /tailwind|front-?end/i,
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
    // Official Blender mark (Simple Icons path, brand orange)
    match: /blender/i,
    render: (size) => (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#E87D0D"
          d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.028 2.005.045.823-.285 1.586-.865 2.153a3.389 3.389 0 0 1-2.374.938 3.393 3.393 0 0 1-2.376-.938c-.58-.567-.91-1.33-.865-2.152M7.35 14.831c.006.314.106.922.256 1.398a7.372 7.372 0 0 0 1.593 2.757 8.227 8.227 0 0 0 2.787 2.001 8.947 8.947 0 0 0 3.66.76 8.964 8.964 0 0 0 3.657-.772 8.285 8.285 0 0 0 2.785-2.01 7.428 7.428 0 0 0 1.592-2.762 6.964 6.964 0 0 0 .25-3.074 7.123 7.123 0 0 0-1.016-2.779 7.764 7.764 0 0 0-1.852-2.043h.002L13.566 2.55l-.02-.015c-.492-.378-1.319-.376-1.86.002-.547.382-.609 1.015-.123 1.415l-.001.001 3.126 2.543-9.53.01h-.013c-.788.001-1.545.518-1.695 1.172-.154.665.38 1.217 1.2 1.22V8.9l4.83-.01-8.62 6.617-.034.025c-.813.622-1.075 1.658-.563 2.313.52.667 1.625.668 2.447.004L7.414 14s-.069.52-.063.831zm12.09 1.741c-.97.988-2.326 1.548-3.795 1.55-1.47.004-2.827-.552-3.797-1.538a4.51 4.51 0 0 1-1.036-1.622 4.282 4.282 0 0 1 .282-3.519 4.702 4.702 0 0 1 1.153-1.371c.942-.768 2.141-1.183 3.396-1.185 1.256-.002 2.455.41 3.398 1.175.48.391.87.854 1.152 1.367a4.28 4.28 0 0 1 .522 1.706 4.236 4.236 0 0 1-.239 1.811 4.54 4.54 0 0 1-1.035 1.626"
        />
      </svg>
    ),
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
