"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { query } from "@/lib/db";
import { refreshPublicPages } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/session";
import { deleteObject, keyFromPublicUrl } from "@/lib/storage";

export type VideoState = { error?: string };

function refresh() {
  refreshPublicPages([]);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

const schema = z.object({
  id: z.coerce.number().int().positive(),
  src: z.string().trim().max(1000),
  poster: z.string().trim().max(1000),
});

export async function saveVideo(_prev: VideoState, formData: FormData): Promise<VideoState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    id: formData.get("id"),
    src: formData.get("src") ?? "",
    poster: formData.get("poster") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const d = parsed.data;
  await query("UPDATE testimonial_videos SET src = $1, poster = $2, updated_at = now() WHERE id = $3", [
    d.src || null,
    d.poster || null,
    d.id,
  ]);
  refresh();
  return {};
}

export async function addVideo() {
  await requireAdmin();
  const rows = await query<{ next: number }>(
    "SELECT coalesce(max(position) + 1, 0)::int AS next FROM testimonial_videos",
  );
  await query("INSERT INTO testimonial_videos (position) VALUES ($1)", [rows[0].next]);
  refresh();
}

export async function deleteVideo(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const rows = await query<{ src: string | null; poster: string | null }>(
    "DELETE FROM testimonial_videos WHERE id = $1 RETURNING src, poster",
    [id],
  );
  for (const url of [rows[0]?.src, rows[0]?.poster]) {
    const key = url && keyFromPublicUrl(url);
    if (key) await deleteObject(key).catch(() => {});
  }
  refresh();
}

export async function moveVideo(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const dir = z.enum(["up", "down"]).parse(formData.get("direction"));
  const rows = await query<{ position: number }>("SELECT position FROM testimonial_videos WHERE id = $1", [id]);
  const item = rows[0];
  if (!item) return;
  const op = dir === "up" ? "<" : ">";
  const order = dir === "up" ? "DESC" : "ASC";
  const neighbour = await query<{ id: number; position: number }>(
    `SELECT id, position FROM testimonial_videos WHERE position ${op} $1 ORDER BY position ${order} LIMIT 1`,
    [item.position],
  );
  if (!neighbour[0]) return;
  await query("UPDATE testimonial_videos SET position = $1 WHERE id = $2", [neighbour[0].position, id]);
  await query("UPDATE testimonial_videos SET position = $1 WHERE id = $2", [item.position, neighbour[0].id]);
  refresh();
}
