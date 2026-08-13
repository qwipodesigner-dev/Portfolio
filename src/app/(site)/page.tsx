import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { FeaturedWork } from "@/components/home/featured-work";
import { AboutSnippet } from "@/components/home/about-snippet";
import { ContactCTA } from "@/components/home/contact-cta";
import { getFeaturedProjects } from "@/lib/content";
import { getVisibleServices } from "@/lib/services-data";
import { getSiteContent } from "@/lib/site";

export default async function HomePage() {
  const [featured, services, home, contact, settings] = await Promise.all([
    getFeaturedProjects(),
    getVisibleServices(),
    getSiteContent("home"),
    getSiteContent("contact"),
    getSiteContent("settings"),
  ]);

  return (
    <>
      <Hero content={home.hero} />
      <Services header={home.servicesHeader} services={services} />
      <FeaturedWork projects={featured} header={home.workHeader} />
      <AboutSnippet content={home.aboutSnippet} resumeUrl={settings.resumeUrl} />
      <ContactCTA content={home.contactCta} email={contact.email} />
    </>
  );
}
