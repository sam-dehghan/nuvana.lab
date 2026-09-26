import Image from "next/image";
import { team } from "@/content/site";
import { GalleryMedia } from "./GalleryMedia";
import { PlaceholderBadge } from "./PlaceholderBadge";
import styles from "./Team.module.css";

function ReelRow() {
  // Rendered twice so the loop is seamless; the copy is hidden from assistive tech.
  const items = [...team.gallery.reels, ...team.gallery.reels];
  return (
    <div className={styles.row} aria-hidden="true">
      <ul className={styles.track}>
        {items.map((img, i) => (
          <li key={i} className={`${styles.reel} ${img.placeholder ? "placeholder" : ""}`}>
            {img.src || img.video ? (
              <GalleryMedia video={img.video} src={img.src} sizes="240px" />
            ) : (
              <PlaceholderBadge show />
            )}
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
      <div className={`container ${styles.tiles}`}>
        {team.gallery.tiles.map((tile) => (
          <div key={tile.label} className={`${styles.tile} ${tile.placeholder ? "placeholder" : ""}`}>
            {tile.src || tile.video ? (
              <GalleryMedia video={tile.video} src={tile.src} sizes="(max-width: 700px) 100vw, 33vw" />
            ) : (
              <PlaceholderBadge show />
            )}
            <span className={styles.tileLabel}>{tile.label}</span>
          </div>
        ))}
      </div>
      <p className={`container ${styles.reelsLabel}`}>{team.gallery.reelsLabel}</p>
      <div className={styles.gallery}>
        <ReelRow />
      </div>
    </section>
  );
}
