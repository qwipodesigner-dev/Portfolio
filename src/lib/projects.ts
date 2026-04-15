export type CaseStudySection = {
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  year: string;
  client: string;
  stack: string[];
  cover: string;
  accent: string;
  featured: boolean;
  outcome?: string;
  // Case study body
  sections: CaseStudySection[];
  reflection?: string;
};

export const projects: Project[] = [
  {
    slug: "qwipo",
    title: "Qwipo",
    tagline: "Seller & logistics platform for modern B2B commerce",
    description:
      "Designing scalable seller and logistics workflows — onboarding, inventory, order management, and pricing systems — for a B2B2C commerce platform operating across India.",
    role: "Senior Product Designer",
    year: "2025 — Present",
    client: "Qwipo",
    stack: ["Figma", "Design System", "Research", "Prototyping"],
    cover: "/images/projects/qwipo-cover.jpg",
    accent: "#E85D2E",
    featured: true,
    outcome: "Shipping seller & logistics modules end-to-end",
    sections: [
      {
        eyebrow: "01 · Context",
        title: "B2B commerce isn't a consumer app with bigger cart values.",
        body: "Qwipo operates a B2B2C commerce platform that connects retailers, distributors, and brands across India. Every screen touches a seller's livelihood — pricing, inventory, order management — so the cost of a confusing flow isn't a lost sale, it's trust eroded across thousands of operators. I was brought in to take ownership of end-to-end design across seller-facing surfaces.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Translating PRDs, APIs, and stakeholder intent into user-ready flows.",
        body: "The product moves fast, and most specifications come through as PRDs and API documentation. I spend the first phase of every initiative translating those into user stories — sitting with stakeholders, product managers, and engineering leads to pressure-test assumptions before any pixel is drawn.",
        bullets: [
          "Stakeholder interviews to align design, PM, and engineering on success criteria",
          "PRD + API review to surface edge cases and state explosion early",
          "Workflow mapping across onboarding, inventory, order, and pricing touchpoints",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Systems-first, shipped in thin vertical slices.",
        body: "Rather than designing screens in isolation, I build each module against a shared set of tokens and patterns — so the seller onboarding, inventory manager, and pricing engine all feel like one product. Lo-fi flows validate the logic, then hi-fi compositions layer in density, empty states, and edge cases. Every feature ships with a prototype the team can click through before engineering commits.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "Seller and logistics flows shipping on a predictable cadence.",
        body: "Complex B2B workflows — previously distributed across spreadsheets and legacy tools — are now consolidated into scalable, interconnected modules. The design system is the throughline: new modules reach production faster because patterns, tokens, and behaviour are already defined.",
      },
    ],
    reflection:
      "Enterprise commerce design rewards restraint. Every extra click costs a real business real money, and the job is almost always to take features away, not add them.",
  },
  {
    slug: "aig-mitr",
    title: "AIG Mitr",
    tagline:
      "A patient-first mobile companion for one of India's leading hospitals",
    description:
      "End-to-end mobile app for AIG Hospitals: multi-profile login, medical record vault, real-time report tracking, appointment booking, and prescription management — designed under ABHA and WCAG compliance.",
    role: "Lead Product Designer",
    year: "2024",
    client: "AIG Hospitals",
    stack: ["Figma", "ABHA", "WCAG 2.1 AA", "iOS / Android"],
    cover: "/images/projects/aig-mitr-cover.jpg",
    accent: "#2E6BE8",
    featured: true,
    outcome:
      "Shipped to iOS + Android with ABHA compliance on launch",
    sections: [
      {
        eyebrow: "01 · Context",
        title: "Healthcare apps fail when they forget they're being used at 3am.",
        body: "AIG Hospitals needed a patient companion app that unified appointment booking, records, reports, and prescriptions into one place. The brief was deceptively simple — until you realised patients using it were often anxious, medicated, or managing records for elderly relatives. We had to design for a worst-case user context, not a best-case one.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Regulation as a forcing function for better design.",
        body: "ABHA (India's digital health framework) and WCAG 2.1 AA weren't checkboxes — they were the foundation. We mapped existing patient journeys across clinics, studied ABHA's consent architecture, and audited competitor apps for the mistakes to avoid.",
        bullets: [
          "Journey mapping across appointment booking, diagnostics, and post-visit care",
          "Multi-profile modelling for caregivers managing family records",
          "Accessibility audit with contrast, touch targets, and screen-reader paths defined upfront",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Big type. High contrast. Forgiving flows.",
        body: "The visual system leans on generous typography, strong contrast, and reduced chrome so information surfaces fast. Every destructive or irreversible action gets a confirm state. Multi-profile login was reframed as a 'household' — one account, multiple patients, explicit permission trails per record.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "Shipped on both stores, fully ABHA-compliant.",
        body: "The app launched on iOS and Android with ABHA integration complete at day one. Patient onboarding, record viewing, report tracking, and appointment management are all in production. Post-launch, the design system we built continued to serve additional AIG surfaces.",
      },
    ],
    reflection:
      "Working under healthcare constraints makes you a better designer in every other context. You stop decorating, you start engineering legibility.",
  },
  {
    slug: "healthcare-design-system",
    title: "Healthcare Design System",
    tagline: "An ABHA-certified design system powering 40+ applications",
    description:
      "Built a scalable design system tailored for healthcare — accessibility-first components, clinical data patterns, and ABHA-compliant flows — used across AIG, KIMS, Kamineni, Continental, Nephroplus, and Aster hospital groups.",
    role: "Design Systems Lead",
    year: "2023 — 2025",
    client: "Achala IT Solutions",
    stack: ["Figma Libraries", "Tokens", "ABHA", "Accessibility"],
    cover: "/images/projects/design-system-cover.jpg",
    accent: "#5C7F6A",
    featured: true,
    outcome: "40+ products shipped on a shared foundation",
    sections: [
      {
        eyebrow: "01 · Context",
        title: "Forty hospital apps, one team, zero margin for drift.",
        body: "Achala IT Solutions delivers enterprise software to some of India's most established hospital groups — AIG, KIMS, Kamineni, Continental, Nephroplus, Aster. Every product was being designed in isolation, which meant every regression had to be re-fought. I was brought in to lead a unified design system that would make scale possible without compromising the specificity clinical contexts demand.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Auditing every screen, then designing the rules.",
        body: "The first three months were ethnographic, not prescriptive — I audited existing products, interviewed engineers about what broke, and documented the component proliferation. We catalogued 200+ unique button variants before we wrote a single token.",
        bullets: [
          "Component inventory across 40+ live applications",
          "Engineering interviews to map pain points in handoff and drift",
          "Clinical workflow mapping — chart review, orders, notes, imaging",
          "Accessibility and ABHA requirement catalogue as non-negotiable foundations",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Tokens first. Components second. Patterns last.",
        body: "The system builds outward: a constrained palette of tokens (color, type, spacing, motion) that enforce accessibility by default, a library of primitive components (input, button, card, dialog) that compose predictably, and pattern libraries for clinical workflows (patient header, vitals card, orders table, consent dialog). Every pattern ships with dos/don'ts and real hospital examples.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "A shared foundation across seven hospital groups.",
        body: "The system now governs 40+ applications across AIG, KIMS, Kamineni, Continental, Nephroplus, and Aster. New products reach production meaningfully faster because foundational decisions are already made. Accessibility and ABHA compliance move from a per-project scramble to a default.",
      },
    ],
    reflection:
      "Design systems don't succeed because the tokens are perfect. They succeed because the people using them trust that someone thought about their edge case first.",
  },
  {
    slug: "flytta",
    title: "Flytta",
    tagline: "Brand and product design for a mobility startup",
    description:
      "Led UI/UX and brand design across mobile and web surfaces — from brand identity to production interfaces — while mentoring junior designers and establishing design guidelines.",
    role: "UI/UX & Brand Designer",
    year: "2021 — 2023",
    client: "Flytta Innovations",
    stack: ["Brand", "Mobile", "Web", "Mentorship"],
    cover: "/images/projects/flytta-cover.jpg",
    accent: "#C96E4C",
    featured: true,
    outcome:
      "Shipped brand identity and product across mobile and web",
    sections: [
      {
        eyebrow: "01 · Context",
        title: "A mobility startup finding its voice alongside its product.",
        body: "Flytta Innovations needed both a recognisable brand and a shippable product at the same time — a common startup dilemma where brand work and product work compete for the same airtime. I led both tracks, treating the brand as the operating system the product would live on.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Brand as product decision, not marketing decoration.",
        body: "The brand system — identity, tone, visual language — was designed as a set of decisions the product team could live with. We wrote brand guidelines that specified behaviour (how buttons animate, how errors sound) rather than just logos and colours.",
        bullets: [
          "Identity, type system, and illustration language",
          "Product UI on mobile and web, mapped to the brand foundation",
          "Design guidelines handbook for onboarding new designers",
          "Mentorship of junior designers to scale design throughput",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Ship the brand by shipping the product.",
        body: "Instead of a brand book that no one opens, we seeded the brand into the first set of screens and iterated from there. Every component was a brand decision in miniature. Junior designers were pulled into decisions early so ownership was shared, not handed down.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "Brand and product shipping in lockstep for two years.",
        body: "Over two years, the brand evolved with the product across mobile apps, web surfaces, and marketing collateral — held together by guidelines that other designers could extend without me in the room. The mentorship component meant design throughput scaled with team size, not designer size.",
      },
    ],
    reflection:
      "At a startup, brand is product and product is brand. Keep them on the same roadmap or both suffer.",
  },
];

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
