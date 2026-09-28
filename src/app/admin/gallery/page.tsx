import { AdminNav } from "@/components/admin/AdminNav";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { GalleryItemForm } from "@/components/admin/GalleryItemForm";
import { getAllGallery, type GalleryItem } from "@/lib/content";
import { requireAdmin } from "@/lib/session";
import { storageConfigured } from "@/lib/storage";
import { addItem, deleteItem, moveItem } from "./actions";
import styles from "../admin.module.css";

function Group({ kind, title, hint, items }: { kind: "tile" | "reel"; title: string; hint: string; items: GalleryItem[] }) {
  return (
    <section>
      <div className={styles.cardHead}>
        <h2 className={styles.h2}>{title}</h2>
        <form action={addItem}>
          <input type="hidden" name="kind" value={kind} />
          <button className="button button-red">Hinzufügen</button>
        </form>
      </div>
      <p className={styles.muted}>{hint}</p>

      {items.length === 0 && <p className={styles.muted}>Noch nichts angelegt.</p>}

      <ol className={styles.list}>
        {items.map((item, i) => (
          <li key={item.id} className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.muted}>
                {kind === "tile" ? "Kachel" : "Reel"} {i + 1}
              </span>
              <div className={styles.row}>
                <form action={moveItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button className={styles.iconButton} disabled={i === 0} aria-label="Nach oben">
                    ↑
                  </button>
                </form>
                <form action={moveItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button className={styles.iconButton} disabled={i === items.length - 1} aria-label="Nach unten">
                    ↓
                  </button>
                </form>
                <form action={deleteItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmButton message="Diesen Eintrag wirklich löschen?">Löschen</ConfirmButton>
                </form>
              </div>
            </div>
            <GalleryItemForm item={item} />
          </li>
        ))}
      </ol>
    </section>
  );
}

export default async function AdminGalleryPage() {
  await requireAdmin();
  const items = await getAllGallery();

  return (
    <>
      <AdminNav active="gallery" />
      <div className={styles.page}>
        <h1 className={styles.h1}>Galerie</h1>

        {!storageConfigured && (
          <p className={styles.error} role="alert">
            Speicher ist nicht eingerichtet. Ohne SUPABASE_S3_ENDPOINT, _REGION, _BUCKET, _ACCESS_KEY_ID und
            _SECRET_ACCESS_KEY lassen sich keine Dateien hochladen.
          </p>
        )}

        <Group
          kind="tile"
          title="Kacheln"
          hint="Die drei Felder über der Reihe. Quer, 16:9."
          items={items.filter((i) => i.kind === "tile")}
        />
        <Group
          kind="reel"
          title="Reels"
          hint="Die laufende Reihe. Hochkant, 9:16."
          items={items.filter((i) => i.kind === "reel")}
        />
      </div>
    </>
  );
}
