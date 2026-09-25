"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cta, nav } from "@/content/site";
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
      <div className={`container ${styles.bar}`}>
        <Logo />
        <nav aria-label="Hauptnavigation" className={styles.nav}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>
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
        <nav aria-label="Mobile Navigation" className="container">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href={cta.href} className="button button-red" onClick={() => setOpen(false)}>
            {cta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
