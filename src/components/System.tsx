"use client";

import { useEffect, useRef, useState } from "react";
import { system } from "@/content/site";
import styles from "./System.module.css";

/** Ring sizes as inset percentages, from the core outwards. */
const RING_INSET = ["27%", "14%", "1%"];

export function System() {
  const [active, setActive] = useState<number | null>(null);
  const blockRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      // A block counts as "current" while it crosses the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blockRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="system" className={`section ${styles.system}`} aria-labelledby="system-title">
      <div className="container">
        <h2 id="system-title" className={styles.title}>
          {system.title}
        </h2>
        <p className={styles.intro}>{system.text}</p>

        <div className={styles.layout}>
          <div className={styles.diagram} aria-hidden="true">
            {system.layers.map((layer, i) => (
              <div
                key={layer.name}
                className={styles.ring}
                data-active={active === i}
                style={{ inset: RING_INSET[i] }}
              >
                <span className={styles.ringLabel}>{layer.name}</span>
              </div>
            ))}
            <span className={styles.core}>{system.center}</span>
          </div>

          <ol className={styles.blocks}>
            {system.layers.map((layer, i) => (
              <li
                key={layer.name}
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                data-index={i}
                data-active={active === i}
                className={styles.block}
              >
                <span className={styles.layerName}>{layer.name}</span>
                <h3>{layer.title}</h3>
                <p>{layer.text}</p>
                <ul className={styles.tags} aria-label={`Leistungen: ${layer.name}`}>
                  {layer.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
