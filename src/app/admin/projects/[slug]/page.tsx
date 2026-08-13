import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllProjectsAdmin } from "@/lib/content";
import type { Project } from "@/lib/projects";
import { ProjectEditor } from "./editor";

export const dynamic = "force-dynamic";

const BLANK: Project = {
  slug: "",
  title: "",
  tagline: "",
  description: "",
  role: "Senior Product Designer",
  year: String(new Date().getFullYear()),
  client: "",
  stack: [],
  cover: "",
  accent: "#E85D2E",
  featured: false,
  sections: [
    { type: "text", eyebrow: "01 · Context", title: "", body: "" },
    { type: "text", eyebrow: "02 · Discovery & Research", title: "", body: "" },
    { type: "text", eyebrow: "03 · Approach", title: "", body: "" },
    { type: "text", eyebrow: "04 · Outcome", title: "", body: "" },
  ],
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;

  if (slug === "__new__") {
    return <ProjectEditor originalSlug="__new__" project={BLANK} visible={true} />;
  }

  const project = (await getAllProjectsAdmin()).find((p) => p.slug === slug);
  if (!project) notFound();
  const { visible, sortOrder: _sortOrder, ...data } = project;
  return <ProjectEditor originalSlug={slug} project={data} visible={visible} />;
}
