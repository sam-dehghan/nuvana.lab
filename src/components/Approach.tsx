import { approach } from "@/content/site";
import { PlaceholderBadge } from "./PlaceholderBadge";
import styles from "./Approach.module.css";

export function Approach() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="approach-title">
      <div className={`container ${styles.layout}`}>
        <div>
          <h2 id="approach-title">{approach.title}</h2>
          <p className={styles.text}>{approach.text}</p>
        </div>
        <div className={styles.phone}>
          <div className={`${styles.screen} ${approach.video ? "" : "placeholder"}`}>
            {approach.video ? (
              <video src={approach.video} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
            ) : (
              <>
                <PlaceholderBadge show />
                <span>Reel folgt</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
