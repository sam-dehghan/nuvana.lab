import { AdminNav } from "@/components/admin/AdminNav";
import { ClientForm } from "@/components/admin/ClientForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { getAllClients } from "@/lib/content";
import { requireAdmin } from "@/lib/session";
import { storageConfigured } from "@/lib/storage";
import { addClient, deleteClient, moveClient } from "./actions";
import styles from "../admin.module.css";

export default async function AdminClientsPage() {
  await requireAdmin();
  const items = await getAllClients();

  return (
    <>
      <AdminNav active="clients" />
      <div className={styles.page}>
        <div className={styles.cardHead}>
          <h1 className={styles.h1}>Kunden</h1>
          <form action={addClient}>
            <button className="button button-red">Hinzufügen</button>
          </form>
        </div>
        <p className={styles.muted}>
          Die Kacheln unter &quot;Marken, mit denen wir arbeiten&quot;. Vorne das Logo, beim Daraufzeigen das Projektfoto.
        </p>

        {!storageConfigured && (
          <p className={styles.error} role="alert">
            Speicher ist nicht eingerichtet. Ohne die SUPABASE_S3_* Variablen lassen sich keine Dateien hochladen.
          </p>
        )}

        {items.length === 0 && <p className={styles.muted}>Noch keine Kunden. Füge oben den ersten hinzu.</p>}

        <ol className={styles.list}>
          {items.map((item, i) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.muted}>Kachel {i + 1}</span>
                <div className={styles.row}>
                  <form action={moveClient}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button className={styles.iconButton} disabled={i === 0} aria-label="Nach oben">
                      ↑
                    </button>
                  </form>
                  <form action={moveClient}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button className={styles.iconButton} disabled={i === items.length - 1} aria-label="Nach unten">
                      ↓
                    </button>
                  </form>
                  <form action={deleteClient}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmButton message="Diese Kachel wirklich löschen?">Löschen</ConfirmButton>
                  </form>
                </div>
              </div>
              <ClientForm item={item} />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
