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
  },
  {
    slug: "aig-mitr",
    title: "AIG Mitr",
    tagline: "A patient-first mobile companion for one of India's leading hospitals",
    description:
      "End-to-end mobile app for AIG Hospitals: multi-profile login, medical record vault, real-time report tracking, appointment booking, and prescription management — designed under ABHA and WCAG compliance.",
    role: "Lead Product Designer",
    year: "2024",
    client: "AIG Hospitals",
    stack: ["Figma", "ABHA", "WCAG 2.1 AA", "iOS / Android"],
    cover: "/images/projects/aig-mitr-cover.jpg",
    accent: "#2E6BE8",
    featured: true,
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
  },
];

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
