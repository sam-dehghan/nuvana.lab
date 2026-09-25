import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.css";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`${styles.logo} ${className}`} aria-label="nuvana.lab Startseite">
      <Image src="/brand/nuvana-mark.jpg" alt="" width={40} height={40} className={styles.mark} />
      <span className={styles.word}>nuvana.lab</span>
    </Link>
  );
}
