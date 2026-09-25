import Link from "next/link";
import { cta, hero } from "@/content/site";
import styles from "./Hero.module.css";

/** The diagonal band is lifted from the nuvana mark so the hero reads as the brand itself. */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {hero.video && (
        <video
          className={styles.video}
          src={hero.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}
      <svg className={styles.slash} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <path d="M120 0 H420 L1000 640 V1000 H880 L0 60 V0 Z" />
      </svg>
      <div className={`container ${styles.inner}`}>
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1 id="hero-title" className={styles.title}>
          {hero.title}
        </h1>
        <p className={styles.text}>{hero.text}</p>
        <div className={styles.actions}>
          <Link href={cta.href} className="button button-paper">
            {cta.label}
          </Link>
          <Link href={hero.secondary.href} className="button button-ghost">
            {hero.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
