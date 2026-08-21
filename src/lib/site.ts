import { unstable_cache } from "next/cache";
import { getDb, ensureSchema } from "./db";

/* ------------------------------------------------------------------ */
/* Types — one shape per editable surface                              */
/* ------------------------------------------------------------------ */

export type LinkItem = { label: string; href: string };

export type HeroContent = {
  titleLine1: string;
  /** Rendered italic in the accent color, exactly like today */
  titleLine2: string;
  subtitle: string;
  /** Trailing italic emphasis appended to the subtitle */
  subtitleEmphasis: string;
  primaryCta: LinkItem;
  secondaryCta: LinkItem;
  currentlyLabel: string;
  currentlyText: string;
  currentlyHighlight: string;
};

export type SectionHeaderContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type AboutSnippetContent = {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  paragraphs: string[];
  portraitName: string;
  portraitLocation: string;
  portraitYear: string;
  storyCta: LinkItem;
  resumeLabel: string;
};

export type ContactCtaContent = {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  body: string;
  ctaLabel: string;
  emailPrompt: string;
};

export type HomeContent = {
  hero: HeroContent;
  servicesHeader: SectionHeaderContent;
  workHeader: SectionHeaderContent;
  aboutSnippet: AboutSnippetContent;
  contactCta: ContactCtaContent;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  highlight: string;
};

export type StackItem = { label: string; level: string };
export type ValueItem = { title: string; body: string };

export type AboutPageContent = {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  portraitName: string;
  portraitMeta: string;
  paragraphs: string[];
  hobbiesLine: string;
  valuesEyebrow: string;
  valuesHeading: string;
  values: ValueItem[];
  experienceEyebrow: string;
  experienceHeading: string;
  experience: ExperienceItem[];
  stackEyebrow: string;
  stackHeading: string;
  stack: StackItem[];
};

export type ContactPageContent = {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  blurb: string;
  email: string;
  phone: string;
  socials: LinkItem[];
  basedIn: string;
  timezone: string;
  preferredHeading: string;
  preferredText: string;
};

export type NavContent = {
  brandName: string;
  links: LinkItem[];
};

export type FooterContent = {
  headline: string;
  headlineMuted: string;
  ctaLabel: string;
  sitemap: LinkItem[];
  elsewhere: LinkItem[];
  email: string;
  copyrightName: string;
  copyrightSuffix: string;
};

export type SiteSettings = {
  /** Where every "Download resume" link points — updated via admin upload */
  resumeUrl: string;
};

export type SeoContent = {
  /** Base site title (browser tab, search results) */
  siteTitle: string;
  /** Template for inner pages — %s is replaced by the page title */
  titleTemplate: string;
  description: string;
  keywords: string[];
  /** Absolute URL of the social-share (Open Graph) image, optional */
  ogImage: string;
  siteUrl: string;
};

export type WorkPageContent = {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  blurb: string;
  footerNote: string;
};

export type ServicesPageContent = {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  blurb: string;
};

/* ------------------------------------------------------------------ */
/* Defaults — extracted verbatim from the shipped components.          */
/* The live site renders these until the DB row overrides them, so     */
/* appearance never changes as a side-effect of adding the CMS.        */
/* ------------------------------------------------------------------ */

export const siteDefaults = {
  home: {
    hero: {
      titleLine1: "Senior Product",
      titleLine2: "Designer.",
      subtitle:
        "Six years. Forty-plus products shipped across healthcare, logistics, and B2B SaaS. One belief:",
      subtitleEmphasis: "good design is good business.",
      primaryCta: { label: "See selected work", href: "/work" },
      secondaryCta: { label: "Get in touch", href: "/contact" },
      currentlyLabel: "Currently",
      currentlyText: "Designing seller & logistics platforms at",
      currentlyHighlight: "Qwipo",
    },
    servicesHeader: {
      eyebrow: "Services · What I do",
      title: "Six ways I help teams ship better products.",
      description:
        "I take ownership end-to-end — from the messy problem statement to the handoff engineering can actually build from. Click any service for the process, deliverables, methods, and tools.",
    },
    workHeader: {
      eyebrow: "Selected work · 2021 — Now",
      title: "Systems that ship, interfaces that scale.",
      description:
        "A few recent projects across healthcare, B2B commerce, and enterprise design systems.",
    },
    aboutSnippet: {
      eyebrow: "About",
      heading: "I treat interfaces as",
      headingEmphasis: "conversations.",
      paragraphs: [
        "I started as a 2D animator — then fell into product design and never left. Over six years I've designed 40+ products for hospitals, SaaS platforms, and commerce marketplaces. The lesson that stuck: the space between two states is where a product earns its personality.",
        "Today I'm at Qwipo, leading design on seller and logistics workflows. Before that, two years at Achala IT shipping healthcare UX for AIG, KIMS, Continental, Nephroplus, Kamineni, and Aster Hospitals — under ABHA and WCAG constraints that made the craft tighter.",
      ],
      portraitName: "Vikas M.",
      portraitLocation: "Hyderabad, IN",
      portraitYear: "2026",
      storyCta: { label: "Read my full story", href: "/about" },
      resumeLabel: "Download resume",
    },
    contactCta: {
      eyebrow: "Let's work together",
      heading: "Got a product worth",
      headingEmphasis: "designing well?",
      body: "I take on a small number of freelance and consulting projects each year. Healthcare, B2B SaaS, logistics, and design-system work preferred.",
      ctaLabel: "Start a conversation",
      emailPrompt: "or drop a mail",
    },
  } satisfies HomeContent,

  about: {
    eyebrow: "About · Vikas Mittapalli",
    heading: "A senior product designer who treats interfaces as",
    headingEmphasis: "conversations.",
    portraitName: "Vikas.",
    portraitMeta: "Hyderabad, India · 2026",
    paragraphs: [
      "I'm Vikas — a Senior Product Designer based in Hyderabad with six years of experience designing complex B2B, healthcare, and logistics products.",
      "I'm currently at Qwipo, where I lead end-to-end design for seller and logistics applications: onboarding, inventory, pricing systems — the kind of workflows where every extra click costs a real business real money. Before this, two years at Achala IT Solutions designing 40+ healthcare applications for AIG, KIMS, Kamineni, Continental, Nephroplus, and Aster — work governed by ABHA and WCAG compliance, where getting design wrong has consequences beyond bounce rate.",
      "I didn't start in product design. I have a Bachelor of Fine Arts in Animation from JNAFAU, and my first job was as a 2D animator on a Cartoon Network series at Cosmos Maya. That origin still shapes how I work: I treat interfaces as sequences, I care about timing, and I believe the space between two states is where a product earns its personality.",
      "What I care about now: design systems that scale past their first release, research that reaches the engineers who build the thing, and the slow, unfashionable work of making business software feel humane.",
    ],
    hobbiesLine:
      "Outside of work — long travel, photography, cooking, and mural painting.",
    valuesEyebrow: "How I work",
    valuesHeading: "Three things I keep coming back to.",
    values: [
      {
        title: "Systems over screens.",
        body: "Every component, token, and flow earns its place by how well it scales past its first release.",
      },
      {
        title: "Research reaches engineering.",
        body: "The story of why something matters travels to the people who build it, or the design didn't do its job.",
      },
      {
        title: "Business software deserves humanity.",
        body: "Enterprise tools take up most of people's working lives. That's reason enough to make them feel good.",
      },
    ],
    experienceEyebrow: "Where I've been",
    experienceHeading: "Six years, five rooms.",
    experience: [
      {
        role: "Senior Product Designer",
        company: "Qwipo",
        period: "Dec 2025 — Present",
        location: "Hybrid · Hyderabad",
        highlight:
          "B2B/B2C logistics and seller applications — onboarding, inventory, order management, and pricing systems.",
      },
      {
        role: "Senior Product Designer",
        company: "Achala IT Solutions",
        period: "Dec 2023 — Oct 2025",
        location: "Hyderabad",
        highlight:
          "40+ healthcare and enterprise applications for AIG, KIMS, Kamineni, Continental, Nephroplus, and Aster Hospitals — ABHA and WCAG compliant.",
      },
      {
        role: "UI/UX & Brand Designer",
        company: "Flytta Innovations",
        period: "Aug 2021 — Nov 2023",
        location: "Hyderabad",
        highlight:
          "Led brand + product design across digital platforms. Mentored juniors and established design guidelines.",
      },
      {
        role: "Visual Designer",
        company: "Granddad Communications",
        period: "Jun 2020 — Aug 2021",
        location: "Hyderabad",
        highlight:
          "Brand identity, environmental branding, and animated social content.",
      },
      {
        role: "2D Animator — Intern",
        company: "Cosmos Maya",
        period: "Mar 2020 — Jun 2020",
        location: "Hyderabad",
        highlight:
          "Worked on multiple episodes of a Cartoon Network animated series — timing, spacing, character motion.",
      },
    ],
    stackEyebrow: "Stack",
    stackHeading: "Tools I reach for.",
    stack: [
      { label: "Figma", level: "Expert" },
      { label: "Illustrator", level: "Expert" },
      { label: "Photoshop", level: "Proficient" },
      { label: "Adobe XD", level: "Proficient" },
      { label: "After Effects", level: "Proficient" },
      { label: "Blender", level: "Learning" },
      { label: "Front-end", level: "Learning" },
    ],
  } satisfies AboutPageContent,

  contact: {
    eyebrow: "Contact",
    heading: "Let's make something",
    headingEmphasis: "good.",
    blurb:
      "Tell me a bit about what you're working on — timeline, shape of the problem, and what success looks like. I read every message and typically respond within two business days.",
    email: "vikasmittapalli@gmail.com",
    phone: "+91 97034 79995",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/vikasmittapalli/" },
      { label: "Behance", href: "https://www.behance.net/vikasmittapalli" },
    ],
    basedIn: "Hyderabad, India",
    timezone: "IST · UTC+5:30",
    preferredHeading: "Preferred work",
    preferredText:
      "Healthcare, B2B SaaS, logistics and commerce platforms, and design-system engagements. Open to roles and consulting.",
  } satisfies ContactPageContent,

  nav: {
    brandName: "Vikas Mittapalli",
    links: [
      { label: "Work", href: "/work" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  } satisfies NavContent,

  footer: {
    headline: "Have a project in mind?",
    headlineMuted: "Let's make it good.",
    ctaLabel: "Start a conversation",
    sitemap: [
      { label: "Work", href: "/work" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    elsewhere: [
      { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/vikasmittapalli/" },
      { label: "Behance ↗", href: "https://www.behance.net/vikasmittapalli" },
    ],
    email: "vikasmittapalli@gmail.com",
    copyrightName: "Vikas Mittapalli",
    copyrightSuffix: "Designed and built in Hyderabad.",
  } satisfies FooterContent,

  settings: {
    resumeUrl: "/resume.pdf",
  } satisfies SiteSettings,

  seo: {
    siteTitle: "Vikas Mittapalli — Senior Product Designer",
    titleTemplate: "%s · Vikas Mittapalli",
    description:
      "Senior Product Designer with 6+ years of experience crafting scalable B2B, healthcare, and logistics products. Currently at Qwipo, previously AIG, KIMS, Continental, and Aster Hospitals.",
    keywords: [
      "Product Designer",
      "UI/UX Designer",
      "Healthcare Design",
      "Design Systems",
      "B2B SaaS",
      "Vikas Mittapalli",
      "Hyderabad",
    ],
    ogImage: "",
    siteUrl: "https://vikasmittapalli.com",
  } satisfies SeoContent,

  workPage: {
    eyebrow: "Work · 2021 — Now",
    heading: "A working archive of",
    headingEmphasis: "what I've shipped.",
    blurb:
      "Selected projects spanning healthcare, B2B commerce, and design systems. Each case study walks through context, process, and what shipped — with the honest bits still attached.",
    footerNote: "More on the way · Case studies for Qwipo and Flytta coming soon",
  } satisfies WorkPageContent,

  servicesPage: {
    eyebrow: "Services · How I work",
    heading: "Six ways I help teams ship",
    headingEmphasis: "better products.",
    blurb:
      "I take ownership end-to-end — from the messy problem statement to the handoff that engineers can actually build from. Click any of the six below for an honest walk-through of how I run that part of the work, what ships at the end, and the methods, frameworks, and tools I reach for.",
  } satisfies ServicesPageContent,
};

export type SiteContentKey = keyof typeof siteDefaults;
export const SITE_TAG = "site";

/* ------------------------------------------------------------------ */
/* Reads — DB row wins over default, deep-merged per top-level field   */
/* so newly added fields fall back gracefully.                         */
/* ------------------------------------------------------------------ */

function merge<T>(base: T, override: unknown): T {
  if (!override || typeof override !== "object") return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
    const cur = out[k];
    if (
      cur &&
      v &&
      typeof cur === "object" &&
      typeof v === "object" &&
      !Array.isArray(cur) &&
      !Array.isArray(v)
    ) {
      out[k] = merge(cur, v);
    } else if (v !== undefined && v !== null) {
      out[k] = v;
    }
  }
  return out as T;
}

const getAllSiteContent = unstable_cache(
  async (): Promise<Partial<Record<SiteContentKey, unknown>>> => {
    const sql = getDb();
    if (!sql) return {};
    try {
      await ensureSchema(sql);
      const rows = (await sql`SELECT key, data FROM site_content`) as {
        key: string;
        data: unknown;
      }[];
      return Object.fromEntries(rows.map((r) => [r.key, r.data]));
    } catch (err) {
      console.error("[site] DB read failed, using defaults:", err);
      return {};
    }
  },
  ["site-content"],
  { tags: [SITE_TAG] },
);

export async function getSiteContent<K extends SiteContentKey>(
  key: K,
): Promise<(typeof siteDefaults)[K]> {
  const all = await getAllSiteContent();
  return merge(siteDefaults[key], all[key]);
}

/** Uncached variant for the admin editors. */
export async function getSiteContentAdmin<K extends SiteContentKey>(
  key: K,
): Promise<(typeof siteDefaults)[K]> {
  const sql = getDb();
  if (!sql) return siteDefaults[key];
  try {
    await ensureSchema(sql);
    const rows = (await sql`
      SELECT data FROM site_content WHERE key = ${key}
    `) as { data: unknown }[];
    return merge(siteDefaults[key], rows[0]?.data);
  } catch {
    return siteDefaults[key];
  }
}
