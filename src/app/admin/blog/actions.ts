"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { query } from "@/lib/db";
import { refreshPublicPages } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/slug";

export type PostState = { error?: string; saved?: boolean };
export type UploadState = { url?: string; error?: string };

const postSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  title: z.string().trim().min(3, "Der Titel ist zu kurz.").max(160),
  slug: z.string().trim().max(80),
  excerpt: z.string().trim().max(300, "Die Kurzbeschreibung darf höchstens 300 Zeichen haben."),
  body: z.string().max(100_000),
  cover_url: z.string().trim().max(1000),
  published: z.boolean(),
});

export async function savePost(_prev: PostState, formData: FormData): Promise<PostState> {
  await requireAdmin();
  const parsed = postSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    body: formData.get("body") ?? "",
    cover_url: formData.get("cover_url") ?? "",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  if (!slug) return { error: "Die URL ist leer. Bitte einen Titel mit Buchstaben verwenden." };
  if (d.published && d.body.trim().length < 20) return { error: "Zum Veröffentlichen braucht der Artikel einen Text." };
  const cover = d.cover_url || null;

  let id = d.id;
  let oldSlug: string | undefined;
  try {
    if (id) {
      const prev = await query<{ slug: string }>("SELECT slug FROM posts WHERE id = $1", [id]);
      if (!prev[0]) return { error: "Dieser Artikel existiert nicht mehr." };
      oldSlug = prev[0].slug;
      await query(
        `UPDATE posts SET title = $1, slug = $2, excerpt = $3, body = $4, cover_url = $5, published = $6,
           published_at = CASE WHEN $6 THEN coalesce(published_at, now()) ELSE published_at END,
           updated_at = now()
         WHERE id = $7`,
        [d.title, slug, d.excerpt, d.body, cover, d.published, id],
      );
    } else {
      const rows = await query<{ id: number }>(
        `INSERT INTO posts (title, slug, excerpt, body, cover_url, published, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, CASE WHEN $6 THEN now() END) RETURNING id`,
        [d.title, slug, d.excerpt, d.body, cover, d.published],
      );
      id = rows[0].id;
    }
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return { error: "Diese URL wird schon von einem anderen Artikel benutzt. Bitte eine andere wählen." };
    }
    throw error;
  }

  refreshPublicPages([slug, ...(oldSlug && oldSlug !== slug ? [oldSlug] : [])]);
  revalidatePath("/admin/blog");
  if (!d.id) redirect(`/admin/blog/${id}?neu=1`);
  return { saved: true };
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const rows = await query<{ slug: string }>("DELETE FROM posts WHERE id = $1 RETURNING slug", [id]);
  refreshPublicPages(rows.map((r) => r.slug));
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_BYTES = 4 * 1024 * 1024;

export async function uploadCover(_prev: UploadState, formData: FormData): Promise<UploadState> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Bitte ein Bild auswählen." };
  const ext = IMAGE_TYPES[file.type];
  if (!ext) return { error: "Nur JPG, PNG, WebP oder AVIF." };
  if (file.size > MAX_BYTES) return { error: "Das Bild ist größer als 4 MB." };

  const name = `${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`blog/${name}`, file, { access: "public", contentType: file.type });
    return { url: blob.url };
  }

  // Local development without Vercel Blob: store in /public/uploads.
  if (process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return { url: `/uploads/${name}` };
  }

  return { error: "Bild-Upload ist nicht eingerichtet: BLOB_READ_WRITE_TOKEN fehlt." };
}
