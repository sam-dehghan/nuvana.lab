import Image from "next/image";
import { team } from "@/content/site";
import { getGallery, type GalleryItem } from "@/lib/content";
import { GalleryMedia } from "./GalleryMedia";
import { PlaceholderBadge } from "./PlaceholderBadge";
import styles from "./Team.module.css";

function ReelRow({ reels }: { reels: GalleryItem[] }) {
  // Rendered twice so the loop is seamless; the copy is hidden from assistive tech.
  const items = [...reels, ...reels];
  return (
    <div className={styles.row} aria-hidden="true">
      <ul className={styles.track}>
        {items.map((img, i) => (
          <li key={i} className={`${styles.reel} ${!img.src && !img.video ? "placeholder" : ""}`}>
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

export async function Team() {
  const gallery = await getGallery();
  const tiles = gallery.filter((g) => g.kind === "tile");
  const reels = gallery.filter((g) => g.kind === "reel");
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
        {tiles.map((tile) => (
          <div key={tile.id} className={`${styles.tile} ${!tile.src && !tile.video ? "placeholder" : ""}`}>
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
        <ReelRow reels={reels} />
      </div>
    </section>
  );
}
