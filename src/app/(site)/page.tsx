import { Approach } from "@/components/Approach";
import { Clients } from "@/components/Clients";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { System } from "@/components/System";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";
import { BlogTeaser } from "@/components/BlogTeaser";
import { brand, hero } from "@/content/site";
import { getFaq, getPublishedPosts, type Faq as FaqItem } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

function buildJsonLd(faq: FaqItem[]) {
  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#organization`,
      name: brand.name,
      url: siteUrl,
      logo: `${siteUrl}/brand/nuvana-mark.jpg`,
      description: hero.text,
      areaServed: "DE",
      address: { "@type": "PostalAddress", addressLocality: "Düsseldorf", addressCountry: "DE" },
      sameAs: [brand.instagram],
      knowsAbout: ["Branding", "Personal Branding", "Markenidentität", "Content-Strategie"],
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
  };
}

export default async function Home() {
  const [faq, posts] = await Promise.all([getFaq(), getPublishedPosts(3)]);
  const jsonLd = buildJsonLd(faq);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Clients />
      <System />
      <Team />
      <Testimonials />
      <CtaBand />
      <Approach />
      <Process />
      <Faq items={faq} />
      <BlogTeaser posts={posts} />
      <FinalCta />
    </>
  );
}
