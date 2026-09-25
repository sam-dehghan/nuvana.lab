"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { query } from "@/lib/db";
import { refreshPublicPages } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/session";

export type FaqState = { error?: string; saved?: boolean };

const faqSchema = z.object({
  question: z.string().trim().min(3, "Die Frage ist zu kurz.").max(300),
  answer: z.string().trim().min(3, "Die Antwort ist zu kurz.").max(3000),
});

const idSchema = z.coerce.number().int().positive();

function done() {
  refreshPublicPages();
  revalidatePath("/admin/faq");
}

export async function saveFaq(_prev: FaqState, formData: FormData): Promise<FaqState> {
  await requireAdmin();
  const parsed = faqSchema.safeParse({ question: formData.get("question"), answer: formData.get("answer") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const rawId = formData.get("id");
  if (rawId) {
    const id = idSchema.parse(rawId);
    await query("UPDATE faq SET question = $1, answer = $2, updated_at = now() WHERE id = $3", [
      parsed.data.question,
      parsed.data.answer,
      id,
    ]);
  } else {
    await query(
      "INSERT INTO faq (question, answer, position) VALUES ($1, $2, (SELECT coalesce(max(position), -1) + 1 FROM faq))",
      [parsed.data.question, parsed.data.answer],
    );
  }
  done();
  return { saved: true };
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin();
  await query("DELETE FROM faq WHERE id = $1", [idSchema.parse(formData.get("id"))]);
  done();
}

export async function moveFaq(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const direction = formData.get("direction") === "up" ? "up" : "down";
  const rows = await query<{ id: number }>("SELECT id FROM faq ORDER BY position, id");
  const index = rows.findIndex((r) => r.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= rows.length) return;
  [rows[index], rows[target]] = [rows[target], rows[index]];
  // Rewrite all positions so gaps or duplicates from earlier edits can never linger.
  await query(
    "UPDATE faq SET position = v.pos FROM unnest($1::int[]) WITH ORDINALITY AS v(id, pos) WHERE faq.id = v.id",
    [rows.map((r) => r.id)],
  );
  done();
}
