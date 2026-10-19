import { testimonials } from "@/content/site";
import { getTestimonialVideos } from "@/lib/content";
import { PlaceholderBadge } from "./PlaceholderBadge";
import { VideoLightbox } from "./VideoLightbox";
import styles from "./Testimonials.module.css";

export async function Testimonials() {
  const videos = await getTestimonialVideos();

  return (
    <section id="kundenstimmen" className={`section ${styles.section}`} aria-labelledby="testimonials-title">
      <div className="container">
        <h2 id="testimonials-title">{testimonials.title}</h2>
        <p className="lead">{testimonials.text}</p>

        <div className={styles.videos}>
          {videos.map((v, i) => (
            <div key={v.id} className={`${styles.video} ${!v.src ? "placeholder" : ""}`}>
              <PlaceholderBadge show={!v.src} />
              {v.src ? (
                <VideoLightbox src={v.src} poster={v.poster} label={`Kundenstimme ${i + 1}`} />
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
