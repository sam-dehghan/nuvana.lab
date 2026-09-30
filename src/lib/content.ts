import "server-only";
import faqSeed from "@/content/faq-seed.json";
import { clients, team } from "@/content/site";
import { hasDb, query } from "./db";

export type Faq = { id: number; question: string; answer: string; position: number };

export type GalleryItem = {
  id: number;
  kind: "tile" | "reel";
  label: string;
  src: string | null;
  video: string | null;
  position: number;
};

export type Client = {
  id: number;
  name: string;
  logo: string | null;
  photo: string | null;
  /** Percent of the default logo size. */
  scale: number;
  position: number;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  published: boolean;
  published_at: Date | null;
  updated_at: Date;
};

const seedFaq: Faq[] = faqSeed.map((f, i) => ({ id: -(i + 1), position: i, ...f }));

const seedClients: Client[] = clients.items.map((c, i) => ({
  id: -(i + 1),
  name: c.name,
  logo: c.logo,
  photo: c.photo,
  scale: 100,
  position: i,
}));

/** Mirrors the placeholders in site.ts, used when there is no database. */
const seedGallery: GalleryItem[] = [
  ...team.gallery.tiles.map((t, i) => ({
    id: -(i + 1),
    kind: "tile" as const,
    label: t.label,
    src: t.src,
    video: t.video,
    position: i,
  })),
  ...team.gallery.reels.map((r, i) => ({
    id: -(100 + i),
    kind: "reel" as const,
    label: "",
    src: r.src,
    video: r.video,
    position: i,
  })),
];

/** Public reads fall back to safe defaults so the site still renders without a database. */
async function safely<T>(fallback: T, read: () => Promise<T>): Promise<T> {
  if (!hasDb) return fallback;
  try {
    return await read();
  } catch (error) {
    console.error("[content] database read failed", error);
    return fallback;
  }
}

export function getFaq(): Promise<Faq[]> {
  return safely(seedFaq, () =>
    query<Faq>("SELECT id, question, answer, position FROM faq ORDER BY position, id"),
  );
}

export function getGallery(): Promise<GalleryItem[]> {
  return safely(seedGallery, () =>
    query<GalleryItem>(
      "SELECT id, kind, label, src, video, position FROM gallery ORDER BY kind DESC, position, id",
    ),
  );
}

export function getClients(): Promise<Client[]> {
  return safely(seedClients, () =>
    query<Client>("SELECT id, name, logo, photo, scale, position FROM clients ORDER BY position, id"),
  );
}

export function getPublishedPosts(limit = 100): Promise<Post[]> {
  return safely([], () =>
    query<Post>("SELECT * FROM posts WHERE published ORDER BY published_at DESC NULLS LAST, id DESC LIMIT $1", [
      limit,
    ]),
  );
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const rows = await safely([] as Post[], () =>
    query<Post>("SELECT * FROM posts WHERE slug = $1 AND published", [slug]),
  );
  return rows[0] ?? null;
}

// Admin reads: no fallback, errors should surface in the dashboard.
export function getAllPosts(): Promise<Post[]> {
  return query<Post>("SELECT * FROM posts ORDER BY updated_at DESC");
}

export async function getPostById(id: number): Promise<Post | null> {
  const rows = await query<Post>("SELECT * FROM posts WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export function getAllFaq(): Promise<Faq[]> {
  return query<Faq>("SELECT id, question, answer, position FROM faq ORDER BY position, id");
}

export function getAllGallery(): Promise<GalleryItem[]> {
  return query<GalleryItem>(
    "SELECT id, kind, label, src, video, position FROM gallery ORDER BY kind DESC, position, id",
  );
}

export function getAllClients(): Promise<Client[]> {
  return query<Client>("SELECT id, name, logo, photo, scale, position FROM clients ORDER BY position, id");
}
