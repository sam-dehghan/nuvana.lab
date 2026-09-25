import { AdminNav } from "@/components/admin/AdminNav";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { FaqForm } from "@/components/admin/FaqForm";
import { getAllFaq } from "@/lib/content";
import { requireAdmin } from "@/lib/session";
import { deleteFaq, moveFaq } from "./actions";
import styles from "../admin.module.css";

export default async function AdminFaqPage() {
  await requireAdmin();
  const items = await getAllFaq();

  return (
    <>
      <AdminNav active="faq" />
      <div className={styles.page}>
        <h1 className={styles.h1}>FAQ</h1>

        <section className={styles.card}>
          <h2 className={styles.h2}>Neue Frage</h2>
          <FaqForm />
        </section>

        {items.length === 0 && <p className={styles.muted}>Noch keine Fragen. Füge oben die erste hinzu.</p>}

        <ol className={styles.list}>
          {items.map((item, i) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.muted}>Frage {i + 1}</span>
                <div className={styles.row}>
                  <form action={moveFaq}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button className={styles.iconButton} disabled={i === 0} aria-label="Nach oben">
                      ↑
                    </button>
                  </form>
                  <form action={moveFaq}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button className={styles.iconButton} disabled={i === items.length - 1} aria-label="Nach unten">
                      ↓
                    </button>
                  </form>
                  <form action={deleteFaq}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmButton message="Diese Frage wirklich löschen?">Löschen</ConfirmButton>
                  </form>
                </div>
              </div>
              <FaqForm id={item.id} question={item.question} answer={item.answer} />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
