import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { postDate } from "@/components/PostCard";
import { brand, cta } from "@/content/site";
import { getPublishedPost, getPublishedPosts } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import styles from "./post.module.css";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at?.toISOString(),
      modifiedTime: post.updated_at.toISOString(),
      ...(post.cover_url ? { images: [{ url: post.cover_url }] } : {}),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_url || undefined,
    datePublished: post.published_at?.toISOString(),
    dateModified: post.updated_at.toISOString(),
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Person", name: "Hesam" },
    publisher: { "@type": "Organization", name: brand.name, logo: `${siteUrl}/brand/nuvana-mark.jpg` },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className={styles.hero}>
        <div className="container">
          <Link href="/blog" className={styles.back}>
            Alle Artikel
          </Link>
          <h1 className={styles.title}>{post.title}</h1>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          <p className={styles.meta}>
            Hesam, nuvana.lab
            {post.published_at && (
              <>
                {", "}
                <time dateTime={post.published_at.toISOString()}>{postDate.format(post.published_at)}</time>
              </>
            )}
          </p>
        </div>
      </header>
      <div className="container">
        {post.cover_url && (
          <div className={styles.cover}>
            <Image src={post.cover_url} alt="" fill sizes="(max-width: 1240px) 100vw, 1240px" preload />
          </div>
        )}
        <div className={styles.body}>
          <Markdown>{post.body}</Markdown>
          <Link href={cta.href} className={`button button-red ${styles.cta}`}>
            {cta.label}
          </Link>
        </div>
      </div>
    </article>
  );
}
