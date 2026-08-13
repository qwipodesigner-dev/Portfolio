import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomPageView } from "@/components/custom-page-view";
import { getPageBySlug, getVisiblePages } from "@/lib/pages-data";

type Params = { slug: string };

// Custom pages are created at runtime from the admin — render on demand.
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getVisiblePages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return <CustomPageView page={page} />;
}
