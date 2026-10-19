import { AdminNav } from "@/components/admin/AdminNav";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { TestimonialVideoForm } from "@/components/admin/TestimonialVideoForm";
import { getAllTestimonialVideos } from "@/lib/content";
import { requireAdmin } from "@/lib/session";
import { storageConfigured } from "@/lib/storage";
import { addVideo, deleteVideo, moveVideo } from "./actions";
import styles from "../admin.module.css";

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  const items = await getAllTestimonialVideos();

  return (
    <>
      <AdminNav active="testimonials" />
      <div className={styles.page}>
        <div className={styles.cardHead}>
          <h1 className={styles.h1}>Kundenstimmen</h1>
          <form action={addVideo}>
            <button className="button button-red">Hinzufügen</button>
          </form>
        </div>
        <p className={styles.muted}>
          Die Videos unter &quot;Das sagen unsere Kunden&quot;. Besucher sehen das Vorschaubild und öffnen das Video in
          einem Fenster.
        </p>

        {!storageConfigured && (
          <p className={styles.error} role="alert">
            Speicher ist nicht eingerichtet. Ohne die SUPABASE_S3_* Variablen lassen sich keine Dateien hochladen.
          </p>
        )}

        {items.length === 0 && <p className={styles.muted}>Noch keine Videos. Füge oben das erste hinzu.</p>}

        <ol className={styles.list}>
          {items.map((item, i) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.muted}>Video {i + 1}</span>
                <div className={styles.row}>
                  <form action={moveVideo}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button className={styles.iconButton} disabled={i === 0} aria-label="Nach oben">
                      ↑
                    </button>
                  </form>
                  <form action={moveVideo}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button className={styles.iconButton} disabled={i === items.length - 1} aria-label="Nach unten">
                      ↓
                    </button>
                  </form>
                  <form action={deleteVideo}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmButton message="Dieses Video wirklich löschen?">Löschen</ConfirmButton>
                  </form>
                </div>
              </div>
              <TestimonialVideoForm item={item} />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
