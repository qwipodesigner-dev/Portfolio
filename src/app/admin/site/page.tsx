import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminTabs } from "../ui";

export const dynamic = "force-dynamic";

const SURFACES = [
  {
    key: "home",
    title: "Home / landing",
    blurb: "Hero title, subtitle, CTAs, section headers, about snippet, contact banner.",
  },
  {
    key: "about",
    title: "About page",
    blurb: "Story paragraphs, values, experience timeline, tool stack.",
  },
  {
    key: "contact",
    title: "Contact page & details",
    blurb: "Email, phone, socials, location, preferred-work card.",
  },
  {
    key: "workPage",
    title: "Work page header",
    blurb: "Heading, blurb, and footer note on the work archive.",
  },
  {
    key: "servicesPage",
    title: "Services page header",
    blurb: "Heading and blurb on the services index.",
  },
  {
    key: "nav",
    title: "Navigation",
    blurb: "Brand name and menu links.",
  },
  {
    key: "footer",
    title: "Footer",
    blurb: "Headline, sitemap, social links, email, copyright.",
  },
  {
    key: "seo",
    title: "SEO & sharing",
    blurb: "Site title, meta description, keywords, social-share image.",
  },
];

export default async function SiteContentHub() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
        Admin · Portfolio
      </span>
      <h1 className="font-display text-4xl mt-2 mb-8">Site content</h1>
      <AdminTabs active="site" />

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SURFACES.map((s) => (
          <li key={s.key}>
            <Link
              href={`/admin/site/${s.key}`}
              className="group flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 h-full hover:border-fg transition-colors"
            >
              <h2 className="font-display text-xl group-hover:text-accent transition-colors">
                {s.title}
              </h2>
              <p className="text-sm text-fg-muted text-pretty">{s.blurb}</p>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mt-auto pt-3">
                Edit →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle mt-8">
        Every field publishes to the live site the moment you save
      </p>
    </div>
  );
}
