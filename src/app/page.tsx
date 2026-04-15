import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { FeaturedWork } from "@/components/home/featured-work";
import { AboutSnippet } from "@/components/home/about-snippet";
import { ContactCTA } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedWork />
      <AboutSnippet />
      <ContactCTA />
    </>
  );
}
