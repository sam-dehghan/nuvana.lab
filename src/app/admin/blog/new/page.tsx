import { AdminNav } from "@/components/admin/AdminNav";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/session";
import styles from "../../admin.module.css";

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <AdminNav active="blog" />
      <div className={styles.page}>
        <h1 className={styles.h1}>Neuer Artikel</h1>
        <PostEditor />
      </div>
    </>
  );
}
