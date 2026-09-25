import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { PostEditor } from "@/components/admin/PostEditor";
import { getPostById } from "@/lib/content";
import { requireAdmin } from "@/lib/session";
import styles from "../../admin.module.css";

export default async function EditPostPage({ params, searchParams }: PageProps<"/admin/blog/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { neu } = await searchParams;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const post = await getPostById(numericId);
  if (!post) notFound();

  return (
    <>
      <AdminNav active="blog" />
      <div className={styles.page}>
        <div className={styles.cardHead}>
          <h1 className={styles.h1}>Artikel bearbeiten</h1>
          {post.published && (
            <Link href={`/blog/${post.slug}`} target="_blank" className={styles.linkButton}>
              Auf der Website ansehen
            </Link>
          )}
        </div>
        <PostEditor
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            body: post.body,
            cover_url: post.cover_url,
            published: post.published,
          }}
          justCreated={neu === "1"}
        />
      </div>
    </>
  );
}
