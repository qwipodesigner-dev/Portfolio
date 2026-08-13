import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllPagesAdmin, type CustomPage } from "@/lib/pages-data";
import { PageEditor } from "./page-editor";

export const dynamic = "force-dynamic";

const BLANK: CustomPage = {
  slug: "",
  title: "",
  description: "",
  eyebrow: "",
  heading: "",
  headingEmphasis: "",
  sections: [{ type: "text", eyebrow: "01", title: "", body: "" }],
};

export default async function EditCustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;

  if (slug === "__new__") {
    return (
      <PageEditor
        originalSlug="__new__"
        page={BLANK}
        visible={true}
        showInNav={false}
        hasDraft={false}
      />
    );
  }

  const page = (await getAllPagesAdmin()).find((p) => p.slug === slug);
  if (!page) notFound();
  const { visible, showInNav, sortOrder: _sortOrder, draft, ...data } = page;
  return (
    <PageEditor
      originalSlug={slug}
      page={draft ?? data}
      visible={visible}
      showInNav={showInNav}
      hasDraft={!!draft}
    />
  );
}
