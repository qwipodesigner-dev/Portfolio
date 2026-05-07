export type Method = {
  name: string;
  note: string;
};

export type Service = {
  slug: string;
  number: string;
  title: string;
  /** One-line summary used on the home page services grid */
  summary: string;
  /** Longer paragraph used on the service detail hero */
  intro: string;
  /** Paragraphs describing how I approach this work */
  approach: string[];
  /** What ships at the end of an engagement */
  deliverables: string[];
  /** Industry-standard methods, frameworks, and references */
  methods: Method[];
  /** Tools I commonly reach for */
  tools: string[];
  /** Slug of the next service in sequence */
  next: string;
};

export const services: Service[] = [
  {
    slug: "discovery-research",
    number: "01",
    title: "Discovery & Research",
    summary:
      "Stakeholder interviews, PRD and API review, and user research synthesis — the front-end of every product I ship.",
    intro:
      "Discovery is the work that determines whether the product you build is the right one. Before any pixel gets drawn, the goal is to align stakeholders on the problem, surface the constraints, and translate fuzzy intent into a clear set of decisions and user stories engineering can build against.",
    approach: [
      "I start every engagement with a kickoff workshop that aligns design, product, and engineering on the problem statement, success criteria, and known constraints. Without alignment at the start, every later decision becomes a debate.",
      "Stakeholder interviews follow — PMs, engineers, ops, sales, customer success — to surface the operational and political reality behind the brief. The brief is rarely the whole picture.",
      "User research is sized to the question, not the budget. Five to eight depth interviews typically saturate a problem space; surveys and diary studies fill in scale. Existing PRDs, API docs, support tickets, and analytics get audited in parallel so research builds on signal that already exists.",
      "Synthesis happens out loud: a shared workshop where themes, journeys, and JTBD frames get pinned to the wall (FigJam or Miro). Outputs are an insights deck, an opportunity map, and a research repository the team can return to long after I'm gone.",
    ],
    deliverables: [
      "Stakeholder alignment workshop and aligned problem statement",
      "User research plan with recruitment criteria",
      "Depth interviews (5–8 typical) with transcripts and tagged quotes",
      "Synthesis: themes, insights, JTBD frames, journey maps",
      "Opportunity map with prioritisation rationale",
      "Research repository in Dovetail, Notion, or Confluence",
    ],
    methods: [
      {
        name: "Jobs-to-be-Done (Christensen, Klement)",
        note: "Frames research around the progress users are trying to make, not the features they ask for.",
      },
      {
        name: "Double Diamond (Design Council)",
        note: "Discover → Define → Develop → Deliver. Keeps divergent and convergent thinking in their lanes.",
      },
      {
        name: "Contextual inquiry (Beyer & Holtzblatt)",
        note: "Watching real users do real work in their real environment — the highest-signal research method.",
      },
      {
        name: "Top-task analysis (Gerry McGovern)",
        note: "Prioritising what matters most to users before designing the interface around it.",
      },
      {
        name: "Heuristic evaluation (Nielsen 10)",
        note: "A fast usability sweep against established heuristics to surface obvious problems early.",
      },
      {
        name: "Tree testing & first-click testing",
        note: "Quantitative validation for navigation and IA decisions.",
      },
    ],
    tools: [
      "Dovetail",
      "Notion",
      "Confluence",
      "Maze",
      "UserTesting",
      "Lookback",
      "FigJam",
      "Miro",
      "Airtable",
    ],
    next: "ux-architecture",
  },
  {
    slug: "ux-architecture",
    number: "02",
    title: "UX Architecture & Wireframing",
    summary:
      "User flows, IA, and lo-fi structure that pressure-tests logic before pixels get expensive.",
    intro:
      "Architecture is where research becomes shape. Before any visual design happens, the information architecture, user flows, and lo-fi wireframes establish whether the product's logic actually holds up — and where it falls apart. The cheap fixes happen here.",
    approach: [
      "I start with the user's tasks, not the screens. Task flows come first, then IA, then screen-level structure. Reversing this is how products end up with beautiful interfaces nobody can navigate.",
      "Sketches happen on paper or whiteboard before they go digital. The bar to throw work away has to be low — a low-fidelity sketch is easier to abandon than a polished frame.",
      "IA gets pressure-tested when stakes are high: card sorting, tree testing, and first-click testing using tools like Optimal Workshop. Quantitative validation early is cheaper than a rebuild later.",
      "Every flow gets state coverage — empty, loading, error, partial, offline, success — not just the happy path. Engineering reviews wireframes before hi-fi work begins so architectural mismatches surface early.",
    ],
    deliverables: [
      "Information architecture and sitemap",
      "User flows for primary and secondary tasks",
      "Lo-fi wireframes across web, mobile, and responsive breakpoints",
      "State coverage maps (empty, loading, error, partial, success)",
      "Annotated wireframes for engineering review",
      "Card sort or tree test results, where applicable",
    ],
    methods: [
      {
        name: "Elements of UX (Jesse James Garrett)",
        note: "Strategy → scope → structure → skeleton → surface. The classic mental model for layered UX work.",
      },
      {
        name: "Object-Oriented UX (Sophia Prater)",
        note: "Designing around the system's nouns and their relationships before the verbs (interactions).",
      },
      {
        name: "Card sorting (open / closed)",
        note: "Lets real users group content the way they think about it, not the way the org chart does.",
      },
      {
        name: "Tree testing",
        note: "Validates that users can find things in your IA without the visual design helping or hurting.",
      },
      {
        name: "Crazy 8s",
        note: "Eight rough ideas in eight minutes. Forces breadth before depth in early ideation.",
      },
      {
        name: "Build-Measure-Learn (Lean UX)",
        note: "Iterative validation cycles when the problem space is uncertain.",
      },
    ],
    tools: [
      "Figma",
      "FigJam",
      "Whimsical",
      "Optimal Workshop",
      "Maze",
      "Lucidchart",
    ],
    next: "ui-design",
  },
  {
    slug: "ui-design",
    number: "03",
    title: "High-Fidelity UI Design",
    summary:
      "Production-ready interfaces for complex B2B, healthcare, and logistics products — accessible (WCAG) and compliant (ABDM) by default.",
    intro:
      "Hi-fi UI is the visible face of the product, and the visible face has to do a lot more than look good. It has to be legible at 3am, accessible for screen readers, performant on a 4G connection, and consistent across the next ten releases. The polish is the easy part — the consistency is the work.",
    approach: [
      "Hi-fi work begins with the design system, not a blank canvas. New components go into the system — not bolted onto a single screen — so the rest of the product benefits from every decision.",
      "Visual hierarchy is established before screens get composed: type scale, color tokens, spacing scale, motion language. Once these are stable, screens compose quickly and consistently.",
      "Every design accounts for the worst-case user context — low contrast environments, slow networks, distracted attention, screen readers, larger text settings. The demo is not the user.",
      "Accessibility is a default, not a phase. WCAG 2.1 AA is the baseline; 2.2 where the brief allows. Healthcare projects also align with ABDM and ABHA requirements as system-level decisions, not per-screen scrambles.",
    ],
    deliverables: [
      "Hi-fi screen designs across breakpoints (web + mobile)",
      "All states: empty, loading, error, partial, success",
      "Component-level documentation in Figma",
      "Accessibility annotations and WCAG conformance notes",
      "Cross-platform variants (iOS HIG, Material 3, Web) where applicable",
      "Design tokens documented and ready for Dev Mode handoff",
    ],
    methods: [
      {
        name: "Atomic Design (Brad Frost)",
        note: "Atoms → molecules → organisms → templates → pages. The mental model that keeps hi-fi work systemic.",
      },
      {
        name: "WCAG 2.1 / 2.2 AA",
        note: "Contrast ratios, focus indicators, motion sensitivity, semantic structure — all treated as defaults.",
      },
      {
        name: "Apple HIG and Material 3",
        note: "Platform conventions for iOS and Android — followed when they help users, broken when they don't.",
      },
      {
        name: "8pt grid systems",
        note: "Consistent spatial rhythm across components, surfaces, and screens.",
      },
      {
        name: "Modular type scale",
        note: "A predictable scale that scales across breakpoints without ad-hoc font sizes.",
      },
      {
        name: "ABDM / ABHA compliance",
        note: "India's digital health framework — treated as system-level requirement on healthcare projects.",
      },
    ],
    tools: [
      "Figma",
      "Adobe Illustrator",
      "Stark",
      "Able",
      "WebAIM Contrast Checker",
      "Polypane",
    ],
    next: "design-systems",
  },
  {
    slug: "design-systems",
    number: "04",
    title: "Design Systems",
    summary:
      "Scalable component libraries and tokens — currently governing systems across 40+ applications at enterprise scale.",
    intro:
      "A design system isn't a Figma library. It's an agreement between design, engineering, and product about how the product should behave. The library is just the artefact. Done well, a system makes the next product cheaper, more consistent, and faster to ship; done poorly, it's a Figma file nobody opens.",
    approach: [
      "Audit before you architect. The first phase is ethnographic — three months of inventory across existing products, interviews with engineers about what breaks at handoff, and a catalogue of every variant in the wild before any tokens get written.",
      "Tokens are the contract. Color, typography, spacing, motion, elevation — these get defined first because everything composable depends on them. Engineering gets tokens via a sync pipeline (Tokens Studio → Style Dictionary → CSS variables / Tailwind config) so the source of truth is one file, not two.",
      "Components ship with documentation, accessibility specs, and dos/don'ts. Patterns are scoped to real product workflows — a healthcare system's patient header looks nothing like a commerce platform's product card, and the system has to recognise that.",
      "Governance matters more than aesthetics. Without a contribution process, RFC review, deprecation path, and versioning strategy, the system drifts. The system that lasts is the one with rituals around it.",
    ],
    deliverables: [
      "Design tokens (color, type, spacing, motion, radius, elevation)",
      "Primitive components (input, button, dialog, card, table, nav, etc.)",
      "Pattern libraries scoped to real product workflows",
      "Documentation site (Zeroheight, Storybook, or in-house)",
      "Governance model — contribution guide, RFC process, deprecation path",
      "Token sync pipeline from Figma to engineering",
    ],
    methods: [
      {
        name: "Atomic Design (Brad Frost)",
        note: "The foundational hierarchy for thinking about reusable components and patterns.",
      },
      {
        name: "Material 3, Polaris, Carbon, Lightning",
        note: "Major industry systems studied as references for governance, scale, and documentation patterns.",
      },
      {
        name: "W3C Design Tokens spec (DTCG)",
        note: "The emerging community standard for token interchange between design tools and code.",
      },
      {
        name: "Component-Driven Development",
        note: "Storybook-led workflows where components are built and reviewed in isolation before composition.",
      },
      {
        name: "Versioning strategy (semver for design)",
        note: "Treat the system like a package: breaking changes get major bumps, additions get minor, fixes get patch.",
      },
      {
        name: "RFC process for system contributions",
        note: "Lightweight written proposals so changes are reviewed in writing, not in a meeting.",
      },
    ],
    tools: [
      "Figma + Variables",
      "Tokens Studio",
      "Style Dictionary",
      "Storybook",
      "Ladle",
      "Zeroheight",
      "Supernova",
      "Specify",
      "GitHub",
    ],
    next: "prototyping-motion",
  },
  {
    slug: "prototyping-motion",
    number: "05",
    title: "Prototyping & Motion",
    summary:
      "Interactive Figma prototypes and After Effects micro-interactions that communicate intent better than any spec doc.",
    intro:
      "Prototyping isn't decoration — it's compression. A clickable prototype with the right motion communicates what would otherwise need pages of spec, and saves engineering from interpreting ambiguous descriptions. The job of a prototype is to make the right behaviour obvious.",
    approach: [
      "Match the prototype's fidelity to the question being asked. Validating a flow only needs lo-fi clickable; testing a motion sequence needs the real interaction. Higher fidelity is more expensive — only spend it where it pays.",
      "Motion is information, not flair. Timing, easing, and choreography signal hierarchy, status, and causality. A 200ms ease-out tells users 'this happened'; a 600ms spring tells them 'this is significant'. Restraint is the discipline that separates mature motion from gimmicky motion.",
      "Edge cases get prototyped too — what happens when the network fails, when a state is missing, when input is wrong. These are the moments where the product earns or loses trust, and they deserve the same prototyping rigor as the happy path.",
      "Where it accelerates the conversation, motion specs get built in code (Framer Motion, GSAP) so designers and engineers share a vocabulary. A coded prototype removes ambiguity in a way no Figma file can.",
    ],
    deliverables: [
      "Clickable Figma prototypes for happy path + key error states",
      "Motion specs (Lottie, video, or coded micro-interactions)",
      "Interaction documentation: timing, easing, choreography",
      "After Effects motion explorations for hero moments",
      "Coded motion components for design-to-code engagements",
      "Prototype testing reports where validation is needed",
    ],
    methods: [
      {
        name: "Disney's 12 Principles of Animation",
        note: "Applied selectively to UI: anticipation, follow-through, easing, staging — earn the principles, don't quote them.",
      },
      {
        name: "Material Motion (Google)",
        note: "Choreography, easing curves, and shared-element transitions for cross-surface consistency.",
      },
      {
        name: "IBM Motion Principles",
        note: "Focus, expression, and attention as the three jobs motion does in enterprise UI.",
      },
      {
        name: "Restraint as a design principle",
        note: "Most products need less motion, not more. Every animation has to justify its frame budget.",
      },
      {
        name: "Prototype testing with Maze / in-person",
        note: "Validating prototypes with real users before committing engineering time.",
      },
    ],
    tools: [
      "Figma prototyping",
      "ProtoPie",
      "Framer",
      "After Effects",
      "Lottie",
      "Rive",
      "Framer Motion",
      "GSAP",
    ],
    next: "design-to-code",
  },
  {
    slug: "design-to-code",
    number: "06",
    title: "Design-to-Code Collaboration",
    summary:
      "Tokens, Tailwind, component APIs — I partner with front-end engineers so designs ship without translation loss.",
    intro:
      "Designs that don't survive engineering aren't designs — they're suggestions. The work doesn't end at handoff; it ends when the product behaves the way the prototype promised. The design-to-code phase is where good intent gets turned into shipped reality, or quietly compromised.",
    approach: [
      "Design with the implementation in mind. A layout that requires three nested grids and four absolute positions will break in production. The best designers know which decisions are easy in code and which are expensive — and design accordingly.",
      "Speak engineering's vocabulary. Tokens, component props, breakpoints, states, props vs. children, prop drilling. Spec'ing in those terms removes ambiguity and makes design reviews actionable.",
      "Use Figma Dev Mode and code-linked tokens so the gap between source-of-truth and production is small. Tokens Studio + Style Dictionary keeps Figma values and code values from drifting.",
      "Sit with engineering during build. Design QA isn't a phase at the end; it's a habit during. Where it accelerates the work, I'll prototype directly in code (Tailwind + Framer Motion) so the decision moves from debate to demo.",
    ],
    deliverables: [
      "Annotated Figma files with Dev Mode-ready specs",
      "Token export (CSS variables, Tailwind config, JSON)",
      "Component API specifications shared with engineering",
      "Design QA reports during build cycles",
      "Coded prototypes for key flows where helpful",
      "Migration guides for legacy → new system rollouts",
    ],
    methods: [
      {
        name: "W3C Design Tokens spec",
        note: "Standard format for token interchange — keeps Figma and code on the same vocabulary.",
      },
      {
        name: "Component-Driven Development",
        note: "Storybook-led workflows where components are reviewed in isolation before composition.",
      },
      {
        name: "Atomic + tokens layered approach",
        note: "Tokens at the base, primitive components above, patterns above that — a clear contract for both sides.",
      },
      {
        name: "Figma Dev Mode + linked variables",
        note: "Engineering reads variable names directly, not hex codes — drift goes to zero.",
      },
      {
        name: "Inline design review on PRs",
        note: "Design QA happens in pull requests, not in retrospective meetings.",
      },
    ],
    tools: [
      "Figma Dev Mode",
      "Tailwind CSS",
      "Tokens Studio",
      "Style Dictionary",
      "Storybook",
      "Ladle",
      "Chromatic",
      "GitHub",
      "VS Code",
    ],
    next: "discovery-research",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
