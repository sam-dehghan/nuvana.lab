import Link from "next/link";
import { blogTeaser } from "@/content/site";
import type { Post } from "@/lib/content";
import { PostCard } from "./PostCard";
import styles from "./BlogTeaser.module.css";

export function BlogTeaser({ posts }: { posts: Post[] }) {
  return (
    <section className="section" aria-labelledby="blog-title">
      <div className="container">
        <div className={styles.head}>
          <div>
            <h2 id="blog-title">{blogTeaser.title}</h2>
            <p className="lead">{blogTeaser.text}</p>
          </div>
          {posts.length > 0 && (
            <Link href="/blog" className="button button-ghost">
              Alle Artikel
            </Link>
          )}
        </div>
        {posts.length > 0 ? (
          <div className={styles.grid}>
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>{blogTeaser.empty}</p>
        )}
      </div>
    </section>
  );
}
