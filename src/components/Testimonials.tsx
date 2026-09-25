import { testimonials } from "@/content/site";
import { PlaceholderBadge } from "./PlaceholderBadge";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  return (
    <section id="kundenstimmen" className={`section ${styles.section}`} aria-labelledby="testimonials-title">
      <div className="container">
        <h2 id="testimonials-title">{testimonials.title}</h2>
        <p className="lead">{testimonials.text}</p>

        <div className={styles.videos}>
          {testimonials.videos.map((v, i) => (
            <div key={i} className={`${styles.video} ${v.placeholder ? "placeholder" : ""}`}>
              <PlaceholderBadge show={v.placeholder} />
              {v.src ? (
                <video src={v.src} controls playsInline preload="metadata" />
              ) : (
                <span>Video-Testimonial folgt</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <ul className={styles.quotes} aria-label="Kundenstimmen">
        {testimonials.quotes.map((t) => (
          <li key={t.name} className={`${styles.quote} ${t.placeholder ? "placeholder" : ""}`}>
            <PlaceholderBadge show={t.placeholder} />
            <blockquote>
              <p>„{t.quote}“</p>
            </blockquote>
            <p className={styles.who}>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
