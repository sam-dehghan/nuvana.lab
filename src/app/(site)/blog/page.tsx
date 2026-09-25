import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/PostCard";
import { blogTeaser } from "@/content/site";
import { getPublishedPosts } from "@/lib/content";
import styles from "@/components/BlogTeaser.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artikel von nuvana.lab über Branding, Personal Branding und Markenaufbau, verständlich erklärt.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageHero title="Blog" text={blogTeaser.text} />
      <section className="section">
        <div className="container">
          {posts.length > 0 ? (
            <div className={styles.grid} style={{ marginTop: 0 }}>
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>{blogTeaser.empty}</p>
          )}
        </div>
      </section>
    </>
  );
}
