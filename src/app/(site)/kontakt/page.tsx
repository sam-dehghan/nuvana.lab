import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { brand, finalCta, process } from "@/content/site";

export const metadata: Metadata = {
  title: "Kostenloses Erstgespräch",
  description: "Vereinbare ein kostenloses Erstgespräch mit nuvana.lab zu Branding und Personal Branding.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <>
      <PageHero title="Kostenloses Erstgespräch" text={finalCta.text} />
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gap: "2rem", maxWidth: "760px" }}>
          <ol style={{ display: "grid", gap: "1rem", paddingLeft: "1.25rem" }}>
            {process.steps.map((s) => (
              <li key={s.title}>
                <strong>{s.title}:</strong> {s.text}
              </li>
            ))}
          </ol>
          <p className="lead">Schreib uns eine Nachricht, wir melden uns persönlich bei dir.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
            {brand.email && (
              <a className="button button-red" href={`mailto:${brand.email}`}>
                E-Mail schreiben
              </a>
            )}
            <a className="button button-red" href={brand.instagram} target="_blank" rel="noopener noreferrer">
              Nachricht auf Instagram
            </a>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
