"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { query } from "@/lib/db";
import { refreshPublicPages } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/session";
import { deleteObject, keyFromPublicUrl, presignUpload, storageConfigured, UPLOAD_TYPES } from "@/lib/storage";

export type GalleryState = { error?: string };
export type SignState = { url?: string; publicUrl?: string; error?: string };

function refresh() {
  refreshPublicPages([]);
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

/** Hands the browser a short-lived url so the file never passes through Vercel. */
export async function signUpload(_prev: SignState, formData: FormData): Promise<SignState> {
  await requireAdmin();
  if (!storageConfigured) return { error: "Speicher ist nicht eingerichtet: SUPABASE_S3_* fehlen." };
  const contentType = String(formData.get("contentType") ?? "");
  if (!UPLOAD_TYPES[contentType]) return { error: "Nur MP4, WebM, JPG, PNG, WebP oder AVIF." };
  try {
    const { url, publicUrl } = await presignUpload(contentType);
    return { url, publicUrl };
  } catch {
    return { error: "Upload konnte nicht vorbereitet werden." };
  }
}

const itemSchema = z.object({
  id: z.coerce.number().int().positive(),
  label: z.string().trim().max(60),
  src: z.string().trim().max(1000),
  video: z.string().trim().max(1000),
});

export async function saveItem(_prev: GalleryState, formData: FormData): Promise<GalleryState> {
  await requireAdmin();
  const parsed = itemSchema.safeParse({
    id: formData.get("id"),
    label: formData.get("label") ?? "",
    src: formData.get("src") ?? "",
    video: formData.get("video") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const d = parsed.data;
  await query("UPDATE gallery SET label = $1, src = $2, video = $3, updated_at = now() WHERE id = $4", [
    d.label,
    d.src || null,
    d.video || null,
    d.id,
  ]);
  refresh();
  return {};
}

export async function addItem(formData: FormData) {
  await requireAdmin();
  const kind = z.enum(["tile", "reel"]).parse(formData.get("kind"));
  const rows = await query<{ next: number }>(
    "SELECT coalesce(max(position) + 1, 0)::int AS next FROM gallery WHERE kind = $1",
    [kind],
  );
  await query("INSERT INTO gallery (kind, position) VALUES ($1, $2)", [kind, rows[0].next]);
  refresh();
}

export async function deleteItem(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const rows = await query<{ src: string | null; video: string | null }>(
    "DELETE FROM gallery WHERE id = $1 RETURNING src, video",
    [id],
  );
  // Drop the stored files too, so the bucket does not fill with orphans.
  for (const url of [rows[0]?.src, rows[0]?.video]) {
    const key = url && keyFromPublicUrl(url);
    if (key) await deleteObject(key).catch(() => {});
  }
  refresh();
}

export async function moveItem(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const dir = z.enum(["up", "down"]).parse(formData.get("direction"));
  const rows = await query<{ kind: string; position: number }>(
    "SELECT kind, position FROM gallery WHERE id = $1",
    [id],
  );
  const item = rows[0];
  if (!item) return;
  const op = dir === "up" ? "<" : ">";
  const order = dir === "up" ? "DESC" : "ASC";
  const neighbour = await query<{ id: number; position: number }>(
    `SELECT id, position FROM gallery WHERE kind = $1 AND position ${op} $2 ORDER BY position ${order} LIMIT 1`,
    [item.kind, item.position],
  );
  if (!neighbour[0]) return;
  await query("UPDATE gallery SET position = $1 WHERE id = $2", [neighbour[0].position, id]);
  await query("UPDATE gallery SET position = $1 WHERE id = $2", [item.position, neighbour[0].id]);
  refresh();
}
