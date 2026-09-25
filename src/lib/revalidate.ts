import "server-only";
import { revalidatePath } from "next/cache";

/** Public pages are prerendered; refresh the ones that show admin-managed content. */
export function refreshPublicPages(slugs: string[] = []) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) revalidatePath(`/blog/${slug}`);
}
