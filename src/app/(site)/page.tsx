import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { FeaturedWork } from "@/components/home/featured-work";
import { AboutSnippet } from "@/components/home/about-snippet";
import { ContactCTA } from "@/components/home/contact-cta";
import { getFeaturedProjects } from "@/lib/content";

export default async function HomePage() {
  const featured = await getFeaturedProjects();
  return (
    <>
      <Hero />
      <Services />
      <FeaturedWork projects={featured} />
      <AboutSnippet />
      <ContactCTA />
    </>
  );
}
