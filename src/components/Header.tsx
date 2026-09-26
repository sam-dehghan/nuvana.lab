"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { admin, cta, nav } from "@/content/site";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className={`${styles.header} ${solid ? styles.solid : ""}`}>
      <a href="#inhalt" className="sr-only">
        Zum Inhalt springen
      </a>
      <div className={styles.bar}>
        <Logo />
        <nav aria-label="Hauptnavigation" className={styles.nav}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={admin.href} className={styles.adminLink} aria-label="Admin-Bereich" rel="nofollow">
          <LockIcon />
        </Link>
        <Link href={cta.href} className={`button ${solid ? "button-red" : "button-paper"} ${styles.cta}`}>
          {cta.label}
        </Link>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Menü schließen" : "Menü öffnen"}</span>
          <span className={styles.burger} data-open={open} aria-hidden="true" />
        </button>
      </div>
      <div id="mobile-menu" className={styles.mobile} hidden={!open}>
        <nav aria-label="Mobile Navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href={cta.href} className="button button-red" onClick={() => setOpen(false)}>
            {cta.label}
          </Link>
          <Link
            href={admin.href}
            className={styles.adminMobile}
            rel="nofollow"
            onClick={() => setOpen(false)}
          >
            <LockIcon />
            {admin.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Small padlock, inherits the header's current colour so it flips with the solid state. */
function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
