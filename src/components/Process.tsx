import Link from "next/link";
import { cta, process } from "@/content/site";
import styles from "./Process.module.css";

export function Process() {
  return (
    <section className="section" aria-labelledby="process-title">
      <div className="container">
        <span className="eyebrow">{process.eyebrow}</span>
        <h2 id="process-title">{process.title}</h2>
        <p className={`lead ${styles.text}`}>{process.text}</p>

        <div className={styles.progress} aria-hidden="true" />
        <ol className={styles.steps}>
          {process.steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.num}>{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>

        <Link href={cta.href} className={`button button-red ${styles.cta}`}>
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
