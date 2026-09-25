import Link from "next/link";
import { logout } from "@/app/admin/login/actions";
import styles from "@/app/admin/admin.module.css";

export function AdminNav({ active }: { active: "blog" | "faq" }) {
  return (
    <header className={styles.topbar}>
      <strong>nuvana.lab Admin</strong>
      <nav className={styles.tabs} aria-label="Admin">
        <Link href="/admin/blog" aria-current={active === "blog" ? "page" : undefined}>
          Blog
        </Link>
        <Link href="/admin/faq" aria-current={active === "faq" ? "page" : undefined}>
          FAQ
        </Link>
      </nav>
      <div className={styles.topActions}>
        <Link href="/" target="_blank">
          Website ansehen
        </Link>
        <form action={logout}>
          <button className={styles.linkButton}>Abmelden</button>
        </form>
      </div>
    </header>
  );
}
