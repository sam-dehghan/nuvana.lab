"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { query } from "@/lib/db";
import { refreshPublicPages } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/session";
import { deleteObject, keyFromPublicUrl } from "@/lib/storage";

export type ClientState = { error?: string };

function refresh() {
  refreshPublicPages([]);
  revalidatePath("/admin/clients");
  revalidatePath("/");
}

const schema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().trim().max(80),
  logo: z.string().trim().max(1000),
  photo: z.string().trim().max(1000),
  scale: z.coerce.number().int().min(40).max(160),
});

export async function saveClient(_prev: ClientState, formData: FormData): Promise<ClientState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name") ?? "",
    logo: formData.get("logo") ?? "",
    photo: formData.get("photo") ?? "",
    scale: formData.get("scale") ?? 100,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const d = parsed.data;
  await query(
    "UPDATE clients SET name = $1, logo = $2, photo = $3, scale = $4, updated_at = now() WHERE id = $5",
    [d.name, d.logo || null, d.photo || null, d.scale, d.id],
  );
  refresh();
  return {};
}

export async function addClient() {
  await requireAdmin();
  const rows = await query<{ next: number }>("SELECT coalesce(max(position) + 1, 0)::int AS next FROM clients");
  await query("INSERT INTO clients (name, position) VALUES ($1, $2)", ["Neuer Kunde", rows[0].next]);
  refresh();
}

export async function deleteClient(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const rows = await query<{ logo: string | null; photo: string | null }>(
    "DELETE FROM clients WHERE id = $1 RETURNING logo, photo",
    [id],
  );
  for (const url of [rows[0]?.logo, rows[0]?.photo]) {
    const key = url && keyFromPublicUrl(url);
    if (key) await deleteObject(key).catch(() => {});
  }
  refresh();
}

export async function moveClient(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const dir = z.enum(["up", "down"]).parse(formData.get("direction"));
  const rows = await query<{ position: number }>("SELECT position FROM clients WHERE id = $1", [id]);
  const item = rows[0];
  if (!item) return;
  const op = dir === "up" ? "<" : ">";
  const order = dir === "up" ? "DESC" : "ASC";
  const neighbour = await query<{ id: number; position: number }>(
    `SELECT id, position FROM clients WHERE position ${op} $1 ORDER BY position ${order} LIMIT 1`,
    [item.position],
  );
  if (!neighbour[0]) return;
  await query("UPDATE clients SET position = $1 WHERE id = $2", [neighbour[0].position, id]);
  await query("UPDATE clients SET position = $1 WHERE id = $2", [item.position, neighbour[0].id]);
  refresh();
}
