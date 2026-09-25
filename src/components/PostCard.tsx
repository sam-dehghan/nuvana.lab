import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";
import styles from "./PostCard.module.css";

export const postDate = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" });

export function PostCard({ post }: { post: Post }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {post.cover_url ? (
          <Image src={post.cover_url} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
        ) : (
          <span className={styles.fallback} aria-hidden="true" />
        )}
      </div>
      {post.published_at && (
        <time className={styles.date} dateTime={post.published_at.toISOString()}>
          {postDate.format(post.published_at)}
        </time>
      )}
      <h3 className={styles.title}>
        <Link href={`/blog/${post.slug}`} className={styles.link}>
          {post.title}
        </Link>
      </h3>
      {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
    </article>
  );
}
