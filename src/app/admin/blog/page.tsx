import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { getAllPosts } from "@/lib/content";
import { requireAdmin } from "@/lib/session";
import styles from "../admin.module.css";

const date = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" });

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await getAllPosts();

  return (
    <>
      <AdminNav active="blog" />
      <div className={styles.page}>
        <div className={styles.cardHead}>
          <h1 className={styles.h1}>Blog</h1>
          <Link href="/admin/blog/new" className="button button-red">
            Neuer Artikel
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className={styles.muted}>Noch keine Artikel. Schreib deinen ersten.</p>
        ) : (
          <ul className={styles.list}>
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/blog/${p.id}`} className={`${styles.card} ${styles.postRow}`}>
                  <span className={p.published ? styles.badgeLive : styles.badgeDraft}>
                    {p.published ? "Veröffentlicht" : "Entwurf"}
                  </span>
                  <strong>{p.title}</strong>
                  <span className={styles.muted}>Geändert am {date.format(p.updated_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
