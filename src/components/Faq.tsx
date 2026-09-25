import { faq } from "@/content/site";
import type { Faq as FaqItem } from "@/lib/content";
import styles from "./Faq.module.css";

export function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className={`section ${styles.section}`} aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <h2 id="faq-title">{faq.title}</h2>
        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.id} className={styles.item}>
              <summary>
                <h3 className={styles.q}>{item.question}</h3>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <p className={styles.a}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
