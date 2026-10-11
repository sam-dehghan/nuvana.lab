import Image from "next/image";
import { clients } from "@/content/site";
import { getClients } from "@/lib/content";
import { PlaceholderBadge } from "./PlaceholderBadge";
import styles from "./Clients.module.css";

export async function Clients() {
  const items = await getClients();

  return (
    <section className="section" aria-labelledby="clients-title">
      <div className="container">
        <h2 id="clients-title" className={styles.title}>
          {clients.title}
        </h2>
        <p className="lead">{clients.text}</p>
        <ul className={styles.grid}>
          {items.map((c) => (
            <li
              key={c.id}
              className={`${styles.tile} ${!c.logo && !c.photo ? "placeholder" : ""}`}
              tabIndex={0}
              // Each mark gets its own size, so wide wordmarks and square marks can both sit right.
              style={{ "--logo-scale": c.scale / 100 } as React.CSSProperties}
            >
              <PlaceholderBadge show={!c.logo && !c.photo} />
              <div className={styles.face}>
                {c.logo ? (
                  <div className={styles.logoBox}>
                    <Image src={c.logo} alt={c.name} fill sizes="(max-width: 700px) 50vw, 25vw" className={styles.logo} />
                  </div>
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
