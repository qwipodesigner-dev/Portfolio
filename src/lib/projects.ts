/** Classic text section — the pattern every existing case study uses. */
export type TextSection = {
  /** Discriminator; omitted in legacy seed data, treated as "text". */
  type?: "text";
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
};

/** Full-width image block (uploaded to Blob or external URL). */
export type ImageSection = {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
};

/** Video block — direct file URL or YouTube/Vimeo embed URL. */
export type VideoSection = {
  type: "video";
  src: string;
  caption?: string;
};

/** Embedded external page (Figma prototype, live site, etc.). */
export type EmbedSection = {
  type: "embed";
  url: string;
  caption?: string;
  height?: number;
};

export type CaseStudySection =
  | TextSection
  | ImageSection
  | VideoSection
  | EmbedSection;

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
  sections: CaseStudySection[];
  reflection?: string;
  /** Optional live URL for the project — embedded as an iframe preview below the reflection */
  liveUrl?: string;
  /** Optional heading for the live preview block — falls back to a generic one */
  liveHeading?: string;
  /** Optional caption for the live preview block — falls back to a generic one */
  liveCaption?: string;
};

export const projects: Project[] = [
  {
    slug: "qwipo-seller-store",
    title: "Qwipo Seller Store",
    tagline:
      "An ONDC-compliant B2B seller ecosystem for distributors, wholesalers, brands, and retailers",
    description:
      "Designing scalable seller and operations workflows for an ONDC-aligned B2B platform — multi-marketplace listings, hierarchical user roles, inventory and pricing systems — used by distributors and DMS companies across India.",
    role: "Senior Product Designer",
    year: "2025 — Present",
    client: "Qwipo",
    stack: ["Figma", "Design System", "ONDC", "Multi-user Hierarchy"],
    cover: "/images/projects/qwipo-seller-cover.jpg",
    accent: "#E85D2E",
    featured: true,
    outcome:
      "ONDC-aligned seller platform powering distributor and DMS operations",
    liveUrl: "https://seller-store-nine.vercel.app/login",
    liveHeading: "See it in production.",
    liveCaption:
      "The live seller platform rendered at desktop dimensions — try the flows, poke at the screens. Open in a new tab for full-screen interaction.",
    sections: [
      {
        eyebrow: "01 · Context",
        title:
          "B2B selling runs on Excel and habit. The brief was to build something they'd actually switch to.",
        body: "Qwipo Seller Store is an ONDC-compliant platform for distributors, wholesalers, D2R brands, retailers, and enterprise distribution management systems. It lets independent sellers and large organisations centrally manage product catalogs, pricing, operations, and order workflows across ONDC, Amazon, Flipkart, and other marketplaces. Most of these users live across spreadsheets, WhatsApp, and a stack of brand-specific tools — the bar wasn't 'modern UI', it was 'worth retraining a team for'.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Operational research with people who don't have time for operational research.",
        body: "I worked with distributors, wholesalers, DMS users, and independent sellers to map the workflows that actually consume their day — not the ones that look good on a feature list. Digital literacy varied widely; the same screen had to work for a 22-year-old marketplace manager and a 55-year-old distribution lead.",
        bullets: [
          "Behavioural studies of seller routines, peak-hour bottlenecks, and abandoned tasks",
          "Mapping high-frequency actions (search, compare, list, price-update) for fast-path treatment",
          "Role-hierarchy and permission modelling across distributors, branches, and franchise teams",
          "Integration paths for ONDC, Amazon, Flipkart, and direct-to-marketplace flows",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Workflow optimisation first. UI second.",
        body: "We led with operational thinking: which actions happen 50 times a day, and how do we make those one tap? Cognitive load on enterprise dashboards was reduced by promoting a small set of recurring tasks and demoting everything else into searchable inventory. The design system was scoped from the start to support multi-user hierarchies, marketplace integrations, and bulk-edit patterns — so growth wouldn't mean rebuilding.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "A scalable seller layer that other commerce ecosystems plug into.",
        body: "The platform now manages product catalogs, pricing, and order workflows across ONDC and major marketplaces, with multi-user operations under a single account. The design system has become the throughline — new modules ship faster because the patterns and tokens are already defined, and operational teams adopt the platform without long retraining cycles.",
      },
    ],
    reflection:
      "When you design for users with low digital literacy at enterprise scale, every click you remove is multiplied by thousands.",
  },
  {
    slug: "aig-mitra",
    title: "AIG Mitra App",
    tagline:
      "A patient-first mobile companion for one of India's leading hospitals",
    description:
      "End-to-end mobile app for AIG Hospitals: appointment booking, doctor discovery, health packages, prescriptions, FAQs, and a chatbot triage layer — designed under ABHA and WCAG compliance.",
    role: "Lead Product Designer",
    year: "2024",
    client: "AIG Hospitals",
    stack: ["Figma", "ABHA / ABDM", "WCAG 2.1 AA", "iOS / Android"],
    cover: "/images/projects/aig-mitra-cover.jpg",
    accent: "#2E6BE8",
    featured: true,
    outcome:
      "Shipped to iOS + Android with ABHA compliance from day one",
    sections: [
      {
        eyebrow: "01 · Context",
        title: "Hospitals are big places. The companion app should make them feel small.",
        body: "AIG Mitra is the patient companion app for AIG Hospitals — appointment booking, doctor discovery, health packages, prescriptions, FAQs, and a chatbot that handles the questions humans get tired of answering. Patients arrive anxious; the app's job is to lower the anxiety, not add to it.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Designing for stress, not for the showcase.",
        body: "Patient research focused on the actual moments people open a hospital app: needing an appointment, looking for a doctor, trying to understand a package, or asking a question they couldn't get answered at the front desk. Multi-profile login was reframed as a 'household' — caregivers managing records for elderly relatives are first-class users, not edge cases.",
        bullets: [
          "Patient journey mapping across booking, visits, diagnostics, and follow-up",
          "Multi-profile / household modelling with explicit consent trails",
          "Accessibility audit — contrast, type sizing, and screen-reader paths set as defaults",
          "Chatbot scope-setting: what it answers, what it routes to a human team",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Big type. High contrast. Forgiving flows.",
        body: "Information surfaces fast: clear typography, generous spacing, and minimal chrome. Destructive or irreversible actions get a confirm state. The chatbot acts as a triage layer — handling FAQs and routing edge cases to the right human team, never pretending to be one.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "Shipped on iOS and Android, ABDM-compliant from day one.",
        body: "The app launched with appointment booking, doctor discovery, health packages, and prescription access live. Post-launch, the design system that came out of this work continues to power additional AIG surfaces.",
      },
    ],
    reflection:
      "Working under healthcare constraints makes you a better designer in every other context. You stop decorating, you start engineering legibility.",
  },
  {
    slug: "abdm-platforms",
    title: "ABDM Platforms · Achala Health Services",
    tagline:
      "An ABDM-aligned hospital ecosystem — patient, clinical, claims, and AI modules on one design foundation",
    description:
      "Led design across an ABDM-aligned platform suite at Achala Health Services — patient and doctor modules, claims and insurance management, AI radiology, DICOM viewer, AI discharge summaries, IoT patient tracking, and the multi-level CRM tying them together.",
    role: "Senior Product Designer · Design Systems Lead",
    year: "2023 — 2025",
    client: "Achala Health Services",
    stack: ["Figma", "Design System", "ABDM", "AI / Healthcare"],
    cover: "/images/projects/abdm-cover.jpg",
    accent: "#5C7F6A",
    featured: true,
    outcome:
      "ABDM-aligned platform suite running across AIG, KIMS, Kamineni, Continental, Nephroplus, and Aster",
    sections: [
      {
        eyebrow: "01 · Context",
        title: "Hospital software is allowed to be slow. It's not allowed to be confusing.",
        body: "At Achala Health Services I led design across an ABDM-aligned ecosystem powering hospitals across India — patient modules, doctor modules, claims and insurance management, AI radiology, DICOM viewer, AI-assisted discharge summaries, IoT patient tracking, bed management, and the multi-level CRM that ties them together. The brief was scale: hundreds of staff, thousands of patients, dozens of operational roles, all running through the same platform.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "One platform, many shifts of users — none of them tolerant of friction.",
        body: "Discovery meant sitting with hospital ops teams, branch admins, claims processors, doctors, radiologists, and patients to understand what their day actually looks like. Operational dependencies were the hardest part — a delay in one role's screen cascades into ten others'.",
        bullets: [
          "Stakeholder mapping across facility admin, branch admin, doctor, staff, and patient roles",
          "Workflow analysis for claims, insurance, discharge, and AI-assisted clinical touchpoints",
          "ABDM compliance audit — consent flows, ABHA-linked records, data exchange patterns",
          "Multi-level facility, branch, and department hierarchy modelling",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Role-specific UX. Shared design foundation.",
        body: "Each role got a workspace tuned to its day — but they all spoke the same visual language. AI assistants were designed as collaborators, not magic boxes: every AI output (radiology suggestions, discharge summaries) was paired with a clear human-review pattern. Compliance with ABDM was treated as a default of the design system, not a per-screen scramble.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "An ABDM-aligned hospital ecosystem running across multiple groups.",
        body: "The platform now serves hospitals like AIG, KIMS, Kamineni, Continental, Nephroplus, and Aster — supporting patient, clinical, claims, and AI-assisted workflows on a single foundation. The design system has become the contract: new modules ship on it, older ones converge to it, and accessibility and ABDM compliance move from per-project scrambles into defaults.",
      },
    ],
    reflection:
      "Healthcare design rewards the unfashionable virtues — patience, clarity, and a refusal to confuse anyone, ever.",
  },
  {
    slug: "qwipo-buyer-app",
    title: "Qwipo Buyer App",
    tagline:
      "The ONDC-powered buying app for retailers — the demand side of the entire Qwipo ecosystem",
    description:
      "An ONDC-supported B2B commerce app where retailers buy from authorised distributors, wholesalers, and local vendors in one place — multi-seller carts, order tracking, credit, and reorder flows. Everything sellers and vendors publish upstream lands here, making this the surface that drives the whole business.",
    role: "Senior Product Designer",
    year: "Dec 2025 — Present",
    client: "Qwipo",
    stack: ["Figma", "Mobile-first", "ONDC", "B2B Commerce"],
    cover: "/images/projects/qwipo-buyer-cover.jpg",
    accent: "#F39B5A",
    featured: true,
    outcome:
      "The retailer-facing core of the Qwipo ecosystem — ONDC-powered, in active build",
    liveUrl: "https://qwipo-buyer-app.vercel.app/",
    liveHeading: "Walk the screens yourself.",
    liveCaption:
      "The full mobile flow — 33 screens across auth, browse, shop, cart, orders, and account — rendered in a live gallery. Pick a screen from the list and explore.",
    sections: [
      {
        eyebrow: "01 · Context",
        title:
          "Where the whole ecosystem converges: the app retailers actually buy from.",
        body: "Qwipo Buyer is the retailer-facing side of the Qwipo platform — an ONDC-supported (DigiDukaan) commerce app where retailers buy from authorised distributors, wholesalers, and local vendors. Everything the ecosystem produces flows into it: catalogs and pricing published through Qwipo Seller Store, supply onboarded through the vendor management platform. If sellers are the supply, this is the demand — the surface that drives the entire business. Retailers shouldn't need fifteen apps to buy from fifteen distributors; this is the one app that replaces the stack.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Designing for one-handed mobile use under time pressure.",
        body: "Retailers don't browse — they buy. The mobile context is busy: a counter, a customer waiting, a phone in one hand. Research focused on the moments retailers actually open the app — morning restocks, mid-day urgent orders, end-of-day reconciliation — and on how buying differs between an authorised distributor relationship and an open wholesaler or local vendor.",
        bullets: [
          "Retailer purchasing-cycle interviews across geographies and store formats",
          "Friction audits on existing distributor apps to identify recurring pain points",
          "Authorised-distributor vs wholesaler vs local-vendor buying behaviours mapped separately",
          "Schemes, offers, credit, and trust signals that actually drive purchase decisions",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Compress every flow into the smallest number of taps that still feels safe.",
        body: "The app is organised the way a retailer thinks: authorised distributor storefronts for routine supply, wholesaler and local-vendor catalogs for everything else, global search across all of it. A multi-seller cart lets retailers stack orders from different sellers in one checkout, with offers and coupons applied at summary. Reorder turns last week's purchase into this week's two-tap task. Trust is baked in — KYC-gated onboarding, transparent pricing, delivery tracking, and Qwipo Credit visible inside the buying flow, not bolted on after it.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "The demand-side core of the platform, in active build.",
        body: "Thirty-plus screens are designed and prototyped end to end — auth and KYC, distributor and wholesaler browsing, multi-seller cart and checkout, order tracking, credit, invoices, and a full account layer with language and notification preferences. The buyer side plugs directly into the seller and vendor platforms upstream, so every catalog published there is immediately buyable here. It's the screen where the whole ecosystem becomes revenue.",
      },
    ],
    reflection:
      "When one app is the revenue surface for an entire ecosystem, every design decision is a business decision. Speed wins, decoration loses.",
  },
  {
    slug: "nephroplus-guest",
    title: "NephroPlus Guest App",
    tagline:
      "A long-term care companion for dialysis patients across India and the Philippines",
    description:
      "Patient-focused mobile app for nephrology and dialysis patients — appointment booking, rewards, education, food and exercise guidance, blogs, and a moderated community timeline. Designed for the recurring rhythm of long-term care.",
    role: "Senior Product Designer",
    year: "2024",
    client: "NephroPlus",
    stack: ["Figma", "Mobile", "Healthcare", "International"],
    cover: "/images/projects/nephroplus-cover.jpg",
    accent: "#4A8B7C",
    featured: false,
    outcome:
      "Live across India and the Philippines for dialysis patient communities",
    sections: [
      {
        eyebrow: "01 · Context",
        title: "A healthcare app that doesn't feel like a healthcare app.",
        body: "NephroPlus Guest is the patient companion for nephrology and dialysis patients across India and the Philippines — appointments, rewards, education, food and exercise guidance, and a moderated community timeline. These are people who interact with the healthcare system on a recurring schedule, often for years. The product has to be useful and emotionally tolerable — not just functional.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Designing for long-term care, not single transactions.",
        body: "Most healthcare apps are built around the visit. Dialysis patients live around the visit — three sessions a week, every week. Research focused on the emotional pattern of recurring care: what the app should do on a tough day, what it should do on a good one, and what it should never do.",
        bullets: [
          "Patient interviews across age bands and disease severity",
          "Behavioural patterns around adherence, motivation, and burnout",
          "Reward and engagement systems that don't feel patronising",
          "Community moderation and safety considerations for the social timeline",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Calm interface. Supportive structure. Optional engagement.",
        body: "Visual treatment is intentionally low-arousal — soft typography, breathable spacing, no urgent reds. Engagement features (rewards, social, education) are opt-in and never block care features. Booking and clinical functions are always one tap away, no matter where you are in the app.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "An international care companion for a population that needed one.",
        body: "The app now supports patients across India and the Philippines, with appointment, rewards, education, and community modules in production. The design system has been extended to additional NephroPlus surfaces.",
      },
    ],
    reflection:
      "Long-term healthcare design isn't about adding features. It's about subtracting friction one day at a time, for years.",
  },
  {
    slug: "picc-mobile",
    title: "PICC Mobile Application",
    tagline:
      "Turning a desktop community platform into something useful in the room",
    description:
      "Reimagined the PICC community platform for mobile — digital voting, board-member elections, QR-driven event surveys, member engagement, and live community interaction designed for short-attention contexts at events.",
    role: "Senior Product Designer",
    year: "2024",
    client: "PICC",
    stack: ["Figma", "Mobile", "Civic / Community"],
    cover: "/images/projects/picc-cover.jpg",
    accent: "#6B5BD9",
    featured: false,
    sections: [
      {
        eyebrow: "01 · Context",
        title: "Turning a desktop platform into something useful at an event.",
        body: "PICC operates a community platform for organisational engagement, board-member elections, event participation, and digital voting. The web platform worked; the mobile experience didn't exist. The brief was to take a desktop-first system and make it useful in the room — at an event, on a phone, mid-conversation.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Mobile isn't 'web on a phone'. Especially during a live event.",
        body: "Research focused on what people actually do at events: voting between sessions, participating in surveys via QR codes, checking schedules, finding people. Attention is short, hands are full, and patience for confusing UI is zero.",
        bullets: [
          "Live-event interaction patterns across age bands",
          "QR-driven participation flows for surveys and votes",
          "Voting interaction design — confirmation, transparency, error handling",
          "Notification and timing patterns aligned with event schedules",
        ],
      },
      {
        eyebrow: "03 · Approach",
        title: "Fast paths for the moment. Discoverable depth for the rest of the day.",
        body: "Voting, QR participation, and event schedules are surfaced as ambient primary actions — visible the moment the app opens, not three taps deep. Member directory, history, and admin features sit one layer below, accessible but never in the way of the live moment.",
      },
      {
        eyebrow: "04 · Outcome",
        title: "Higher engagement during events, lower friction across them.",
        body: "Members now participate in elections, surveys, and event flows from their phones in seconds, not minutes. Voting and survey completion rates rose, and the desktop platform became a backstage tool while mobile became the live face of the organisation.",
      },
    ],
    reflection:
      "Mobile design at events is a study in attention economics. You get one sliver of someone's focus — make it count.",
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
    featured: false,
    outcome:
      "Shipped brand identity and product across mobile and web for two years",
    sections: [
      {
        eyebrow: "01 · Context",
        title: "A mobility startup finding its voice alongside its product.",
        body: "Flytta Innovations needed both a recognisable brand and a shippable product at the same time — the common startup dilemma where brand work and product work compete for the same airtime. I led both tracks, treating the brand as the operating system the product would live on.",
      },
      {
        eyebrow: "02 · Discovery & Research",
        title: "Brand as product decision, not marketing decoration.",
        body: "The brand system — identity, tone, visual language — was designed as a set of decisions the product team could live with. Brand guidelines specified behaviour (how buttons animate, how errors sound), not just logos and colours.",
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
        body: "Over two years the brand evolved with the product across mobile apps, web surfaces, and marketing collateral — held together by guidelines that other designers could extend without me in the room. The mentorship component meant design throughput scaled with team size, not designer size.",
      },
    ],
    reflection:
      "At a startup, brand is product and product is brand. Keep them on the same roadmap or both suffer.",
  },
];

// NOTE: this file is now the *seed / fallback* content source.
// Live content is served from the database via src/lib/content.ts;
// these static entries are used to seed the DB and as a fallback
// when the DB is unreachable, so the public site never breaks.
