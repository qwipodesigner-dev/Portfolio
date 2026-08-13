import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllServicesAdmin } from "@/lib/services-data";
import type { Service } from "@/lib/services";
import { ServiceEditor } from "./service-editor";

export const dynamic = "force-dynamic";

const BLANK: Service = {
  slug: "",
  number: "07",
  title: "",
  summary: "",
  intro: "",
  approach: [],
  deliverables: [],
  methods: [],
  tools: [],
  next: "",
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;

  if (slug === "__new__") {
    return <ServiceEditor originalSlug="__new__" service={BLANK} visible={true} />;
  }

  const service = (await getAllServicesAdmin()).find((s) => s.slug === slug);
  if (!service) notFound();
  const { visible, sortOrder: _sortOrder, ...data } = service;
  return <ServiceEditor originalSlug={slug} service={data} visible={visible} />;
}
