import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

// Legally required in Germany. Stays noindex until the real text is in.
export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <>
      <PageHero title="Impressum" />
      <section className="section">
        <div className="container">
          <p className="lead">Platzhalter: Dieser Text wird vor dem Livegang ergänzt.</p>
        </div>
      </section>
    </>
  );
}
