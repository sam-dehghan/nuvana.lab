import Image from "next/image";
import { clients } from "@/content/site";
import { PlaceholderBadge } from "./PlaceholderBadge";
import styles from "./Clients.module.css";

export function Clients() {
  return (
    <section className="section" aria-labelledby="clients-title">
      <div className="container">
        <h2 id="clients-title" className={styles.title}>
          {clients.title}
        </h2>
        <p className="lead">{clients.text}</p>
        <ul className={styles.grid}>
          {clients.items.map((c) => (
            <li key={c.name} className={`${styles.tile} ${c.placeholder ? "placeholder" : ""}`} tabIndex={0}>
              <PlaceholderBadge show={c.placeholder} />
              <div className={styles.face}>
                {c.logo ? (
                  <Image src={c.logo} alt={c.name} width={200} height={100} className={styles.logo} />
                ) : (
                  <span>Logo folgt</span>
                )}
              </div>
              <div className={`${styles.face} ${styles.back}`}>
                {c.photo ? (
                  <Image src={c.photo} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" />
                ) : (
                  <span>Projektfoto folgt</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
