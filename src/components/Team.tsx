import Image from "next/image";
import { team } from "@/content/site";
import { PlaceholderBadge } from "./PlaceholderBadge";
import styles from "./Team.module.css";

function GalleryRow({ reverse }: { reverse?: boolean }) {
  // Rendered twice so the loop is seamless; the copy is hidden from assistive tech.
  const items = [...team.gallery, ...team.gallery];
  return (
    <div className={styles.row} aria-hidden="true">
      <ul className={`${styles.track} ${reverse ? styles.reverse : ""}`}>
        {items.map((img, i) => (
          <li key={i} className={`${styles.shot} ${img.placeholder ? "placeholder" : ""}`}>
            {img.src ? <Image src={img.src} alt="" fill sizes="320px" /> : <PlaceholderBadge show />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Team() {
  return (
    <section className="section" aria-labelledby="team-title">
      <div className="container">
        <h2 id="team-title">{team.title}</h2>
        <p className={`lead ${styles.intro}`}>{team.intro}</p>
        <ul className={styles.members}>
          {team.members.map((m) => (
            <li key={m.name} className={styles.member}>
              <div className={`${styles.photo} ${m.placeholder ? "placeholder" : ""}`}>
                {m.photo ? (
                  <Image src={m.photo} alt={m.name} fill sizes="(max-width: 700px) 100vw, 360px" />
                ) : (
                  <PlaceholderBadge show />
                )}
              </div>
              <div>
                <h3>{m.name}</h3>
                <p className={styles.role}>{m.role}</p>
                <p className={styles.bio}>{m.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.gallery}>
        <GalleryRow />
        <GalleryRow reverse />
      </div>
    </section>
  );
}
