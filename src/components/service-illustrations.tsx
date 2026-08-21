/**
 * Concept illustrations for the six service detail pages — bespoke
 * SVG diagrams drawn with the site's design tokens so they read as
 * part of the system in both themes. Three variants per service:
 * "concept" (hero), "process", and "artefacts".
 */

const T = {
  border: "var(--color-border)",
  subtle: "var(--color-fg-subtle)",
  muted: "var(--color-fg-muted)",
  fg: "var(--color-fg)",
  surface: "var(--color-surface)",
  accent: "var(--color-accent)",
};

const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace";

function Label({
  x,
  y,
  children,
  fill = T.subtle,
  anchor = "start",
  size = 10,
}: {
  x: number;
  y: number;
  children: string;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={MONO}
      fontSize={size}
      letterSpacing="1.5"
      fill={fill}
      textAnchor={anchor}
      style={{ textTransform: "uppercase" }}
    >
      {children}
    </text>
  );
}

function Box({
  x,
  y,
  w,
  h,
  r = 8,
  fill = T.surface,
  stroke = T.border,
  dash,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  fill?: string;
  stroke?: string;
  dash?: string;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill={fill}
      stroke={stroke}
      strokeWidth="1"
      strokeDasharray={dash}
    />
  );
}

/** Thin text-placeholder lines inside a wireframe box */
function TextLines({
  x,
  y,
  w,
  n,
  gap = 9,
}: {
  x: number;
  y: number;
  w: number;
  n: number;
  gap?: number;
}) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * gap}
          width={i === n - 1 ? w * 0.6 : w}
          height="3"
          rx="1.5"
          fill={T.border}
        />
      ))}
    </g>
  );
}

function Arrow({ d, id }: { d: string; id: string }) {
  return (
    <g>
      <defs>
        <marker
          id={id}
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0.5L7.5 4L0 7.5" fill="none" stroke={T.subtle} strokeWidth="1.2" />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={T.subtle} strokeWidth="1.2" markerEnd={`url(#${id})`} />
    </g>
  );
}

/* ================= Discovery & Research ================= */

function DiscoveryConcept() {
  const notes = [
    // cluster 1 — interviews
    [70, 110, 0], [122, 96, -4], [96, 158, 3], [150, 148, -2],
    // cluster 2 — signals
    [320, 90, 2], [372, 104, -3], [340, 152, 4],
  ] as const;
  return (
    <g>
      <Label x={64} y={70}>01 · Interviews</Label>
      <Label x={314} y={62}>02 · Themes</Label>
      <Label x={588} y={98}>03 · Insight</Label>
      {notes.map(([x, y, rot], i) => (
        <g key={i} transform={`rotate(${rot} ${x + 22} ${y + 22})`}>
          <rect x={x} y={y} width="46" height="46" rx="4" fill={i < 4 ? T.surface : "transparent"} stroke={i < 4 ? T.border : T.accent} strokeWidth="1" />
          <rect x={x + 8} y={y + 12} width="30" height="2.5" rx="1" fill={i < 4 ? T.border : T.accent} opacity={i < 4 ? 1 : 0.7} />
          <rect x={x + 8} y={y + 20} width="22" height="2.5" rx="1" fill={i < 4 ? T.border : T.accent} opacity={i < 4 ? 1 : 0.7} />
        </g>
      ))}
      <Arrow id="dc1" d="M215 140 C 250 130, 265 125, 296 120" />
      <Arrow id="dc2" d="M430 128 C 480 138, 510 160, 552 176" />
      {/* insight card */}
      <Box x={560} y={128} w={176} h={110} r={12} />
      <rect x={560} y={128} width="176" height="34" rx="12" fill={T.accent} opacity="0.14" />
      <Label x={576} y={150} fill={T.accent}>Insight</Label>
      <TextLines x={576} y={178} w={144} n={4} gap={12} />
      {/* journey line under clusters */}
      <path d="M64 300 C 180 250, 260 330, 380 290 S 620 250, 736 292" fill="none" stroke={T.border} strokeWidth="1.5" />
      {[64, 214, 380, 560, 736].map((x, i) => {
        const ys = [300, 281, 290, 267, 292];
        return <circle key={i} cx={x} cy={ys[i]} r="5" fill={i === 3 ? T.accent : T.surface} stroke={i === 3 ? T.accent : T.subtle} strokeWidth="1.2" />;
      })}
      <Label x={64} y={336}>User journey · emotion over time</Label>
      <Label x={736} y={336} anchor="end">Opportunity ↑</Label>
    </g>
  );
}

function DiscoveryProcess() {
  // Double diamond
  return (
    <g>
      <path d="M120 195 L 240 90 L 360 195 L 240 300 Z" fill="none" stroke={T.subtle} strokeWidth="1.3" />
      <path d="M400 195 L 520 90 L 640 195 L 520 300 Z" fill="none" stroke={T.subtle} strokeWidth="1.3" />
      <path d="M120 195 L 240 90 L 360 195" fill={T.accent} opacity="0.08" />
      <circle cx={120} cy={195} r="5" fill={T.accent} />
      <circle cx={360} cy={195} r="5" fill={T.surface} stroke={T.subtle} strokeWidth="1.2" />
      <circle cx={640} cy={195} r="5" fill={T.accent} />
      <Label x={180} y={130} anchor="middle">Discover</Label>
      <Label x={300} y={130} anchor="middle">Define</Label>
      <Label x={460} y={130} anchor="middle">Develop</Label>
      <Label x={580} y={130} anchor="middle">Deliver</Label>
      <Label x={120} y={340} anchor="middle">Problem</Label>
      <Label x={360} y={340} anchor="middle">Brief</Label>
      <Label x={640} y={340} anchor="middle">Solution</Label>
      <Label x={240} y={70} anchor="middle" fill={T.muted}>Diverge</Label>
      <Label x={520} y={70} anchor="middle" fill={T.muted}>Converge</Label>
    </g>
  );
}

function DiscoveryArtefacts() {
  return (
    <g>
      {/* journey map artefact */}
      <Box x={64} y={70} w={672} h={250} r={16} />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={64 + 134.4 * (i + 0)} y1={110} x2={64 + 134.4 * i} y2={320} stroke={i === 0 ? "transparent" : T.border} strokeWidth="1" />
      ))}
      <Label x={88} y={98}>Aware</Label>
      <Label x={222} y={98}>Consider</Label>
      <Label x={356} y={98}>Order</Label>
      <Label x={491} y={98}>Deliver</Label>
      <Label x={625} y={98}>Retain</Label>
      <path d="M96 220 C 160 170, 230 260, 330 210 S 500 150, 560 220 S 680 260, 712 200" fill="none" stroke={T.accent} strokeWidth="2" />
      {[[96, 220], [330, 210], [560, 220], [712, 200]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={T.accent} />
      ))}
      <TextLines x={88} y={280} w={90} n={2} gap={9} />
      <TextLines x={222} y={280} w={90} n={2} gap={9} />
      <TextLines x={356} y={280} w={90} n={2} gap={9} />
      <TextLines x={491} y={280} w={90} n={2} gap={9} />
      <TextLines x={625} y={280} w={90} n={2} gap={9} />
      <Label x={64} y={350}>Journey map · touchpoints and emotion curve</Label>
    </g>
  );
}

/* ================= UX Architecture ================= */

function UxConcept() {
  const child = (x: number, y: number, active = false) => (
    <g>
      <Box x={x} y={y} w={96} h={64} r={8} stroke={active ? T.accent : T.border} />
      <rect x={x} y={y} width="96" height="14" rx="8" fill={active ? T.accent : T.border} opacity={active ? 0.25 : 0.5} />
      <TextLines x={x + 10} y={y + 26} w={76} n={3} gap={9} />
    </g>
  );
  return (
    <g>
      {/* root */}
      <Box x={352} y={56} w={96} h={54} r={8} stroke={T.accent} />
      <rect x={352} y={56} width="96" height="14" rx="8" fill={T.accent} opacity="0.25" />
      <TextLines x={362} y={82} w={76} n={2} gap={9} />
      <Label x={400} y={44} anchor="middle">Home</Label>
      {/* connectors */}
      <path d="M400 110 V 140 M400 140 H 148 M400 140 H 652 M148 140 V 168 M316 140 V 168 M484 140 V 168 M652 140 V 168" stroke={T.border} strokeWidth="1.2" fill="none" />
      {child(100, 168)}
      {child(268, 168, true)}
      {child(436, 168)}
      {child(604, 168)}
      {/* grandchildren under active */}
      <path d="M316 232 V 258 M316 258 H 232 M316 258 H 400 M232 258 V 284 M400 258 V 284" stroke={T.border} strokeWidth="1.2" fill="none" />
      {child(184, 284, true)}
      {child(352, 284)}
      <Label x={64} y={370}>Information architecture · the shortest path to the task</Label>
      <Label x={736} y={370} anchor="end" fill={T.accent}>Critical flow</Label>
    </g>
  );
}

function UxProcess() {
  return (
    <g>
      {/* user flow: start -> screen -> decision -> two ends */}
      <circle cx={110} cy={195} r="18" fill="none" stroke={T.subtle} strokeWidth="1.3" />
      <Label x={110} y={240} anchor="middle">Entry</Label>
      <Arrow id="ux1" d="M132 195 H 186" />
      <Box x={190} y={160} w={110} h={70} r={10} />
      <TextLines x={204} y={180} w={82} n={3} gap={10} />
      <Label x={245} y={252} anchor="middle">Screen</Label>
      <Arrow id="ux2" d="M304 195 H 358" />
      <path d="M420 145 L 480 195 L 420 245 L 360 195 Z" fill={T.surface} stroke={T.accent} strokeWidth="1.2" />
      <Label x={420} y={199} anchor="middle" fill={T.accent} size={9}>Choice</Label>
      <Arrow id="ux3" d="M480 195 H 546" />
      <Arrow id="ux4" d="M420 249 V 300 H 546" />
      <Box x={550} y={160} w={110} h={70} r={10} />
      <TextLines x={564} y={180} w={82} n={3} gap={10} />
      <Label x={605} y={252} anchor="middle">Happy path</Label>
      <Box x={550} y={272} w={110} h={56} r={10} dash="4 4" />
      <TextLines x={564} y={290} w={82} n={2} gap={10} />
      <Label x={672} y={304}>Recovery</Label>
    </g>
  );
}

function UxArtefacts() {
  const wf = (x: number, y: number, w: number, h: number) => (
    <g>
      <Box x={x} y={y} w={w} h={h} r={10} />
      <rect x={x + 10} y={y + 10} width={w - 20} height="10" rx="3" fill={T.border} />
      <rect x={x + 10} y={y + 28} width={(w - 20) * 0.55} height="26" rx="4" fill={T.border} opacity="0.55" />
      <rect x={x + 10 + (w - 20) * 0.62} y={y + 28} width={(w - 20) * 0.38} height="26" rx="4" fill={T.accent} opacity="0.3" />
      <TextLines x={x + 10} y={y + 66} w={w - 20} n={Math.floor((h - 76) / 10)} gap={10} />
    </g>
  );
  return (
    <g>
      {wf(64, 80, 200, 240)}
      {wf(300, 80, 200, 240)}
      {wf(536, 80, 200, 240)}
      <Label x={64} y={350}>Lo-fi wireframes · structure before pixels</Label>
    </g>
  );
}

/* ================= High-Fidelity UI ================= */

function UiConcept() {
  return (
    <g>
      {/* desktop frame */}
      <Box x={80} y={64} w={420} h={270} r={14} />
      <line x1={80} y1={96} x2={500} y2={96} stroke={T.border} strokeWidth="1" />
      <circle cx={100} cy={80} r="3.5" fill={T.border} />
      <circle cx={114} cy={80} r="3.5" fill={T.border} />
      <circle cx={128} cy={80} r="3.5" fill={T.border} />
      {/* nav + hero */}
      <rect x={100} y={112} width="120" height="8" rx="3" fill={T.fg} opacity="0.7" />
      <rect x={360} y={108} width="120" height="16" rx="8" fill={T.accent} />
      <rect x={100} y={148} width="220" height="14" rx="4" fill={T.fg} opacity="0.85" />
      <rect x={100} y={170} width="170" height="14" rx="4" fill={T.fg} opacity="0.85" />
      <TextLines x={100} y={200} w={200} n={2} gap={10} />
      <rect x={100} y={236} width="96" height="24" rx="12" fill={T.accent} />
      {/* cards */}
      <Box x={340} y={148} w={140} h={76} r={10} />
      <TextLines x={352} y={164} w={116} n={4} gap={11} />
      <Box x={340} y={238} w={140} h={76} r={10} />
      <TextLines x={352} y={254} w={116} n={4} gap={11} />
      {/* phone frame */}
      <Box x={560} y={56} w={150} h={300} r={22} />
      <rect x={612} y={68} width="46" height="6" rx="3" fill={T.border} />
      <rect x={578} y={92} width="80" height="10" rx="3" fill={T.fg} opacity="0.85" />
      <TextLines x={578} y={116} w={114} n={2} gap={10} />
      <Box x={578} y={146} w={114} h={64} r={10} />
      <rect x={578} y={146} width="114" height="20" rx="10" fill={T.accent} opacity="0.2" />
      <TextLines x={588} y={178} w={94} n={2} gap={10} />
      <Box x={578} y={222} w={114} h={64} r={10} />
      <TextLines x={588} y={238} w={94} n={3} gap={10} />
      <rect x={578} y={306} width="114" height="26" rx="13" fill={T.accent} />
      <Label x={80} y={366}>One design language · every breakpoint</Label>
    </g>
  );
}

function UiProcess() {
  const frame = (x: number, opacity: number, hifi = false) => (
    <g>
      <Box x={x} y={90} w={180} h={220} r={12} />
      <rect x={x + 14} y={104} width="80" height="9" rx="3" fill={hifi ? T.fg : T.border} opacity={hifi ? 0.85 : 1} />
      <rect x={x + 14} y={126} width="152" height="60" rx="8" fill={hifi ? T.accent : T.border} opacity={hifi ? 0.28 : opacity} />
      <TextLines x={x + 14} y={200} w={152} n={4} gap={11} />
      <rect x={x + 14} y={258} width="70" height="22" rx="11" fill={hifi ? T.accent : T.border} opacity={hifi ? 1 : opacity} />
    </g>
  );
  return (
    <g>
      {frame(70, 0.35)}
      <Arrow id="ui1" d="M262 200 H 300" />
      {frame(310, 0.55)}
      <Arrow id="ui2" d="M502 200 H 540" />
      {frame(550, 1, true)}
      <Label x={160} y={340} anchor="middle">Wireframe</Label>
      <Label x={400} y={340} anchor="middle">Grayscale</Label>
      <Label x={640} y={340} anchor="middle" fill={T.accent}>Production UI</Label>
    </g>
  );
}

function UiArtefacts() {
  return (
    <g>
      {/* type scale */}
      <text x={70} y={140} fontFamily="var(--font-fraunces), serif" fontSize="52" fill={T.fg}>Aa</text>
      <text x={70} y={188} fontFamily="var(--font-fraunces), serif" fontSize="30" fill={T.fg} opacity="0.8">Aa</text>
      <text x={70} y={224} fontFamily="var(--font-fraunces), serif" fontSize="18" fill={T.fg} opacity="0.6">Aa</text>
      <Label x={70} y={260}>Type scale</Label>
      {/* color ramps */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={250 + i * 44} y={100} width="36" height="36" rx="8" fill={T.accent} opacity={1 - i * 0.19} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={250 + i * 44} y={148} width="36" height="36" rx="8" fill={T.fg} opacity={0.9 - i * 0.19} />
      ))}
      <Label x={250} y={214}>Color ramps</Label>
      {/* contrast check */}
      <Box x={250} y={240} w={214} h={70} r={12} />
      <rect x={266} y={258} width="34" height="34" rx="8" fill={T.accent} />
      <text x={283} y={281} fontFamily={MONO} fontSize="13" fill="#fff" textAnchor="middle">A</text>
      <Label x={314} y={272} fill={T.muted}>Contrast 7.2 : 1</Label>
      <Label x={314} y={292} fill={T.accent}>WCAG AAA ✓</Label>
      {/* spacing grid */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={540} y={100 + i * 46} width={180} height="34" rx="6" fill="none" stroke={T.border} strokeWidth="1" />
      ))}
      {[8, 16, 24, 32].map((s, i) => (
        <g key={i}>
          <rect x={546} y={106 + i * 46} width={s * 2} height="22" rx="4" fill={T.accent} opacity="0.25" />
          <Label x={726} y={121 + i * 46} anchor="end" size={9}>{`${s} px`}</Label>
        </g>
      ))}
      <Label x={540} y={296}>Spacing system</Label>
    </g>
  );
}

/* ================= Design Systems ================= */

function DsConcept() {
  return (
    <g>
      {/* tokens */}
      <Label x={70} y={84}>Tokens</Label>
      <rect x={70} y={100} width="28" height="28" rx="7" fill={T.accent} />
      <rect x={106} y={100} width="28" height="28" rx="7" fill={T.accent} opacity="0.55" />
      <rect x={142} y={100} width="28" height="28" rx="7" fill={T.fg} opacity="0.75" />
      <text x={70} y={162} fontFamily="var(--font-fraunces), serif" fontSize="26" fill={T.fg}>Aa</text>
      <Label x={112} y={156} size={9}>16 / 24</Label>
      <rect x={70} y={180} width="48" height="10" rx="3" fill={T.border} />
      <Label x={128} y={189} size={9}>Space · 8</Label>
      {/* arrow */}
      <Arrow id="ds1" d="M212 150 H 268" />
      {/* components */}
      <Label x={286} y={84}>Components</Label>
      <rect x={286} y={100} width="92" height="28" rx="14" fill={T.accent} />
      <rect x={286} y={140} width="130" height="34" rx="8" fill="none" stroke={T.border} strokeWidth="1.2" />
      <rect x={296} y={152} width="70" height="9" rx="3" fill={T.border} />
      <Box x={286} y={186} w={130} h={64} r={10} />
      <TextLines x={296} y={200} w={110} n={3} gap={11} />
      {/* arrow */}
      <Arrow id="ds2" d="M448 175 H 504" />
      {/* screens */}
      <Label x={522} y={84}>Product</Label>
      {[0, 1].map((r) =>
        [0, 1].map((c) => (
          <g key={`${r}${c}`}>
            <Box x={522 + c * 110} y={100 + r * 104} w={96} h={90} r={10} />
            <rect x={532 + c * 110} y={110 + r * 104} width={40} height="7" rx="3" fill={T.border} />
            <rect x={532 + c * 110} y={124 + r * 104} width={76} height="26" rx="5" fill={T.accent} opacity={r === 0 && c === 0 ? 0.3 : 0.12} />
            <TextLines x={532 + c * 110} y={160 + r * 104} w={76} n={2} gap={9} />
          </g>
        )),
      )}
      <Label x={70} y={350}>Decide once · ship everywhere</Label>
    </g>
  );
}

function DsProcess() {
  return (
    <g>
      {/* button anatomy with rulers */}
      <rect x={280} y={160} width="240" height="72" rx="36" fill={T.accent} />
      <text x={400} y={203} fontFamily={MONO} fontSize="16" fill="#fff" textAnchor="middle" letterSpacing="2">BUTTON</text>
      {/* padding rulers */}
      <path d="M280 250 V 262 M520 250 V 262 M280 256 H 520" stroke={T.subtle} strokeWidth="1" fill="none" />
      <Label x={400} y={280} anchor="middle" size={9}>Width · hug + 32</Label>
      <path d="M540 160 H 552 M540 232 H 552 M546 160 V 232" stroke={T.subtle} strokeWidth="1" fill="none" />
      <Label x={560} y={200} size={9}>56</Label>
      <path d="M280 140 V 128 M340 140 V 128 M280 134 H 340" stroke={T.subtle} strokeWidth="1" fill="none" />
      <Label x={286} y={118} size={9}>Radius · full</Label>
      {/* states row */}
      {["Default", "Hover", "Focus", "Disabled"].map((s, i) => (
        <g key={s}>
          <rect x={92 + i * 165} y={310 } width="120" height="34" rx="17" fill={T.accent} opacity={[1, 0.85, 1, 0.35][i]} stroke={i === 2 ? T.fg : "none"} strokeWidth={i === 2 ? 2 : 0} />
          <Label x={152 + i * 165} y={368} anchor="middle" size={9}>{s}</Label>
        </g>
      ))}
      <Label x={92} y={84}>Component anatomy · one source of truth</Label>
    </g>
  );
}

function DsArtefacts() {
  return (
    <g>
      {/* component library grid */}
      <Box x={64} y={70} w={672} h={260} r={16} />
      <line x1={232} y1={70} x2={232} y2={330} stroke={T.border} strokeWidth="1" />
      <Label x={84} y={100}>Library</Label>
      {["Buttons", "Inputs", "Cards", "Nav", "Tables", "Tokens"].map((s, i) => (
        <g key={s}>
          <rect x={84} y={116 + i * 32} width={s === "Cards" ? 8 : 0} height="0" fill="none" />
          <circle cx={92} cy={124 + i * 32} r="3" fill={i === 2 ? T.accent : T.border} />
          <Label x={106} y={128 + i * 32} size={9} fill={i === 2 ? T.accent : T.subtle}>{s}</Label>
        </g>
      ))}
      {/* canvas: card component variants */}
      {[0, 1, 2].map((c) => (
        <g key={c}>
          <Box x={264 + c * 152} y={104} w={132} h={92} r={10} />
          <rect x={276 + c * 152} y={116} width={c === 0 ? 108 : 54} height="22" rx="5" fill={T.accent} opacity={0.2 + c * 0.15} />
          <TextLines x={276 + c * 152} y={150} w={108} n={3} gap={11} />
        </g>
      ))}
      {[0, 1, 2].map((c) => (
        <g key={c}>
          <Box x={264 + c * 152} y={212} w={132} h={92} r={10} dash={c === 2 ? "4 4" : undefined} />
          <rect x={276 + c * 152} y={224} width="72" height="9" rx="3" fill={T.border} />
          <TextLines x={276 + c * 152} y={246} w={108} n={3} gap={11} />
        </g>
      ))}
      <Label x={64} y={356}>40+ apps on the same shelf of parts</Label>
    </g>
  );
}

/* ================= Prototyping & Motion ================= */

function MotionConcept() {
  return (
    <g>
      {/* easing curve editor */}
      <Box x={90} y={70} w={380} h={260} r={16} />
      {[1, 2, 3].map((i) => (
        <g key={i}>
          <line x1={90 + i * 95} y1={70} x2={90 + i * 95} y2={330} stroke={T.border} strokeWidth="0.6" />
          <line x1={90} y1={70 + i * 65} x2={470} y2={70 + i * 65} stroke={T.border} strokeWidth="0.6" />
        </g>
      ))}
      <path d="M120 300 C 220 300, 210 100, 440 100" fill="none" stroke={T.accent} strokeWidth="2.5" />
      <line x1={120} y1={300} x2={220} y2={300} stroke={T.subtle} strokeWidth="1" strokeDasharray="3 3" />
      <line x1={440} y1={100} x2={340} y2={100} stroke={T.subtle} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={120} cy={300} r="5" fill={T.surface} stroke={T.accent} strokeWidth="2" />
      <circle cx={440} cy={100} r="5" fill={T.surface} stroke={T.accent} strokeWidth="2" />
      <circle cx={220} cy={300} r="4" fill={T.fg} />
      <circle cx={340} cy={100} r="4" fill={T.fg} />
      <Label x={110} y={356}>cubic-bezier(0.22, 1, 0.36, 1)</Label>
      {/* animated dots preview */}
      <Label x={540} y={92}>The in-between states</Label>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={556 + Math.pow(i / 4, 0.45) * 160}
          cy={130 + i * 44}
          r={9}
          fill={T.accent}
          opacity={0.25 + (i / 4) * 0.75}
        />
      ))}
      <Arrow id="mo1" d="M548 342 H 724" />
      <Label x={548} y={368}>Time</Label>
    </g>
  );
}

function MotionProcess() {
  return (
    <g>
      {/* timeline with tracks */}
      <Box x={64} y={80} w={672} h={240} r={14} />
      <line x1={190} y1={80} x2={190} y2={320} stroke={T.border} strokeWidth="1" />
      {["Card", "Title", "Fade", "Spring"].map((s, i) => (
        <Label key={s} x={84} y={132 + i * 50} size={9}>{s}</Label>
      ))}
      {[
        [210, 300, 0], [260, 380, 1], [240, 480, 2], [330, 560, 3],
      ].map(([a, b, i]) => (
        <g key={i}>
          <rect x={a} y={116 + i * 50} width={b - a} height="18" rx="9" fill={T.accent} opacity={0.25 + i * 0.15} />
          <circle cx={a} cy={125 + i * 50} r="3.5" fill={T.accent} />
          <circle cx={b} cy={125 + i * 50} r="3.5" fill={T.accent} />
        </g>
      ))}
      {/* playhead */}
      <line x1={420} y1={80} x2={420} y2={320} stroke={T.fg} strokeWidth="1.4" />
      <path d="M412 80 H 428 L 420 92 Z" fill={T.fg} />
      <Label x={64} y={350}>Choreography · what moves, when, and why</Label>
      <Label x={736} y={350} anchor="end" size={9}>60 fps</Label>
    </g>
  );
}

function MotionArtefacts() {
  return (
    <g>
      {/* phone with motion arcs */}
      <Box x={120} y={56} w={170} h={300} r={24} />
      <rect x={178} y={68} width="54" height="6" rx="3" fill={T.border} />
      <Box x={140} y={92} w={130} h={70} r={12} />
      <TextLines x={152} y={108} w={106} n={3} gap={11} />
      <Box x={140} y={260} w={130} h={70} r={12} stroke={T.accent} />
      <rect x={140} y={260} width="130" height="20" rx="10" fill={T.accent} opacity="0.2" />
      <TextLines x={152} y={292} w={106} n={2} gap={11} />
      <path d="M275 296 C 350 280, 350 140, 274 122" fill="none" stroke={T.accent} strokeWidth="1.5" strokeDasharray="5 5" />
      <path d="M283 132 L 274 122 L 287 119" fill="none" stroke={T.accent} strokeWidth="1.5" />
      {/* spring curve */}
      <Box x={420} y={92} w={316} h={200} r={14} />
      <path
        d="M440 240 C 470 120, 500 120, 520 180 S 560 230, 585 195 S 625 185, 645 200 S 690 205, 716 200"
        fill="none"
        stroke={T.accent}
        strokeWidth="2"
      />
      <line x1={440} y1={200} x2={716} y2={200} stroke={T.border} strokeWidth="1" strokeDasharray="3 3" />
      <Label x={440} y={322}>Spring · stiffness 320 · damping 24</Label>
      <Label x={420} y={78}>Prototype · felt before it is built</Label>
    </g>
  );
}

/* ================= Design to Code ================= */

function CodeConcept() {
  return (
    <g>
      {/* design side */}
      <Box x={70} y={80} w={280} h={240} r={14} />
      <rect x={90} y={100} width="90" height="10" rx="3" fill={T.fg} opacity="0.8" />
      <rect x={90} y={126} width="240" height="56" rx="10" fill={T.accent} opacity="0.22" />
      <TextLines x={90} y={200} w={240} n={3} gap={12} />
      <rect x={90} y={252} width="96" height="28" rx="14" fill={T.accent} />
      <Label x={70} y={350}>Design</Label>
      {/* handoff arrows */}
      <Arrow id="c1" d="M360 160 H 428" />
      <Arrow id="c2" d="M428 240 H 360" />
      <Label x={394} y={144} anchor="middle" size={9}>Specs</Label>
      <Label x={394} y={266} anchor="middle" size={9}>Feedback</Label>
      {/* code side */}
      <Box x={440} y={80} w={296} h={240} r={14} fill={T.fg} />
      <circle cx={460} cy={100} r="3.5" fill={T.accent} />
      <circle cx={474} cy={100} r="3.5" fill={T.border} />
      <circle cx={488} cy={100} r="3.5" fill={T.border} />
      {[
        [0, 120, 0.9], [16, 90, 0.5], [32, 150, 0.5], [48, 120, 0.5], [64, 60, 0.9], [80, 170, 0.5], [96, 130, 0.5], [112, 80, 0.9],
      ].map(([dy, w, o], i) => (
        <rect key={i} x={464 + (i % 2 === 0 ? 0 : 18)} y={124 + (dy as number)} width={w} height="7" rx="3" fill={i % 4 === 0 ? T.accent : T.surface} opacity={o as number} />
      ))}
      <Label x={440} y={350}>Code</Label>
    </g>
  );
}

function CodeProcess() {
  return (
    <g>
      {/* token pipeline */}
      <rect x={80} y={150} width="150" height="80" rx="12" fill={T.surface} stroke={T.border} />
      <rect x={96} y={166} width="28" height="28" rx="7" fill={T.accent} />
      <Label x={134} y={178} size={9}>accent</Label>
      <Label x={96} y={214} size={9} fill={T.muted}>#E85D2E</Label>
      <Arrow id="cp1" d="M234 190 H 296" />
      <rect x={300} y={150} width="200" height="80" rx="12" fill={T.fg} />
      <text x={316} y={184} fontFamily={MONO} fontSize="11" fill={T.accent}>--color-accent</text>
      <text x={316} y={206} fontFamily={MONO} fontSize="11" fill={T.surface} opacity="0.8">: #E85D2E;</text>
      <Arrow id="cp2" d="M504 190 H 566" />
      <rect x={570} y={150} width="150" height="80" rx="12" fill={T.surface} stroke={T.border} />
      <rect x={586} y={172} width="118" height="34" rx="17" fill={T.accent} />
      <Label x={80} y={130}>Design token</Label>
      <Label x={300} y={130}>CSS variable</Label>
      <Label x={570} y={130}>Shipped UI</Label>
      <Label x={80} y={300}>Same value in Figma, the codebase, and production</Label>
    </g>
  );
}

function CodeArtefacts() {
  return (
    <g>
      {/* storybook-ish component workbench */}
      <Box x={64} y={64} w={672} h={272} r={16} />
      <line x1={220} y1={64} x2={220} y2={336} stroke={T.border} strokeWidth="1" />
      <Label x={84} y={94}>Stories</Label>
      {["Button", "Input", "Card", "Modal", "Table"].map((s, i) => (
        <g key={s}>
          <circle cx={92} cy={116 + i * 30} r="3" fill={i === 0 ? T.accent : T.border} />
          <Label x={106} y={120 + i * 30} size={9} fill={i === 0 ? T.accent : T.subtle}>{s}</Label>
        </g>
      ))}
      {/* preview area */}
      <rect x={252} y={96} width="300" height="140" rx="12" fill="none" stroke={T.border} strokeWidth="1" strokeDasharray="5 5" />
      <rect x={340} y={148} width="124" height="36" rx="18" fill={T.accent} />
      {/* controls */}
      <Box x={584} y={96} w={128} h={140} r={10} />
      <Label x={596} y={118} size={9}>Controls</Label>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={596} y={130 + i * 30} width="60" height="7" rx="3" fill={T.border} />
          <rect x={664} y={126 + i * 30} width="36" height="16" rx="8" fill={i === 0 ? T.accent : T.border} opacity={i === 0 ? 1 : 0.6} />
        </g>
      ))}
      {/* docs strip */}
      <rect x={252} y={252} width="460" height="60" rx="10" fill={T.fg} />
      <text x={268} y={278} fontFamily={MONO} fontSize="10" fill={T.accent}>{`<Button variant="primary" size="lg" />`}</text>
      <text x={268} y={298} fontFamily={MONO} fontSize="10" fill={T.surface} opacity="0.75">tokens: accent · radius-full · space-16</text>
      <Label x={64} y={362}>The workbench · designed and engineered in the same room</Label>
    </g>
  );
}

/* ================= Registry + component ================= */

const ILLUSTRATIONS: Record<
  string,
  Record<"concept" | "process" | "artefacts", () => React.ReactNode>
> = {
  "discovery-research": {
    concept: DiscoveryConcept,
    process: DiscoveryProcess,
    artefacts: DiscoveryArtefacts,
  },
  "ux-architecture": {
    concept: UxConcept,
    process: UxProcess,
    artefacts: UxArtefacts,
  },
  "ui-design": {
    concept: UiConcept,
    process: UiProcess,
    artefacts: UiArtefacts,
  },
  "design-systems": {
    concept: DsConcept,
    process: DsProcess,
    artefacts: DsArtefacts,
  },
  "prototyping-motion": {
    concept: MotionConcept,
    process: MotionProcess,
    artefacts: MotionArtefacts,
  },
  "design-to-code": {
    concept: CodeConcept,
    process: CodeProcess,
    artefacts: CodeArtefacts,
  },
};

export function ServiceIllustration({
  slug,
  variant,
  caption,
  aspectRatio = "16/9",
}: {
  slug: string;
  variant: "concept" | "process" | "artefacts";
  caption?: string;
  aspectRatio?: string;
}) {
  const Draw = ILLUSTRATIONS[slug]?.[variant];

  return (
    <figure className="my-12 md:my-16">
      <div
        className="relative overflow-hidden rounded-3xl border border-border w-full bg-surface"
        style={{
          aspectRatio,
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, transparent 55%), var(--color-surface)",
        }}
      >
        {Draw ? (
          <svg
            viewBox="0 0 800 400"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={caption}
          >
            {Draw()}
          </svg>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-3xl border border-fg/10 bg-accent/20" />
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
