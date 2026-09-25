import Link from "next/link";
import { brand } from "@/content/site";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <Logo />
        <div>
          <h2 className={styles.heading}>Social Media</h2>
          <a href={brand.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
        <div>
          <h2 className={styles.heading}>Rechtliches</h2>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </div>
      <p className={`container ${styles.copy}`}>
        © {new Date().getFullYear()} {brand.name}. Alle Rechte vorbehalten.
      </p>
    </footer>
  );
}
