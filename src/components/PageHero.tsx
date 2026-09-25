import styles from "./PageHero.module.css";

export function PageHero({ title, text }: { title: string; text?: string }) {
  return (
    <section className={styles.hero}>
      <div className="container">
        <h1>{title}</h1>
        {text && <p className={styles.text}>{text}</p>}
      </div>
    </section>
  );
}
