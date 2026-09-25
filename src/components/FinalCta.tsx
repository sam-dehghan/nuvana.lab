import Link from "next/link";
import { cta, finalCta } from "@/content/site";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  return (
    <section className={styles.section} aria-labelledby="final-title">
      <div className="container">
        <div className={styles.box}>
        <span className="eyebrow">{finalCta.eyebrow}</span>
        <h2 id="final-title">{finalCta.title}</h2>
        <p className={styles.text}>{finalCta.text}</p>
        <Link href={cta.href} className="button button-paper">
          {cta.label}
        </Link>
        </div>
      </div>
    </section>
  );
}
