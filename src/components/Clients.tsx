import Image from "next/image";
import { clients } from "@/content/site";
import { getClients } from "@/lib/content";
import { PlaceholderBadge } from "./PlaceholderBadge";
import styles from "./Clients.module.css";

const SIZE: Record<string, string> = {
  small: styles.small,
  wide: styles.wide,
  tall: styles.tall,
};

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
          {items.map((c) => {
            const empty = !c.logo && !c.photo;
            return (
              <li
                key={c.id}
                className={`${styles.tile} ${SIZE[c.size] ?? styles.small} ${empty ? "placeholder" : ""}`}
                tabIndex={0}
                style={{ "--logo-scale": c.scale / 100 } as React.CSSProperties}
              >
                <PlaceholderBadge show={empty} />
                {c.photo && (
                  <Image src={c.photo} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" className={styles.shot} />
                )}
                {/* Darkens the still so the logo reads; clears on hover to show the work. */}
                <span className={styles.veil} aria-hidden="true" />
                {c.logo ? (
                  <div className={styles.logoBox}>
                    <Image src={c.logo} alt={c.name} fill sizes="(max-width: 700px) 50vw, 25vw" className={styles.logo} />
                  </div>
                ) : (
                  <span className={styles.fallback}>{empty ? "Logo folgt" : c.name}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
