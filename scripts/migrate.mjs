// Creates the tables and seeds the FAQ once. Run: npm run db:migrate
import { readFile } from "node:fs/promises";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  if (process.env.VERCEL) {
    // Let the first deploy succeed before Neon is connected; the site falls back to the built in FAQ.
    console.warn("DATABASE_URL is not set, skipping migration. Connect Neon in Vercel > Storage.");
    process.exit(0);
  }
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query(await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"));

  const { rows } = await client.query("SELECT count(*)::int AS n FROM faq");
  if (rows[0].n === 0) {
    const seed = JSON.parse(await readFile(new URL("../src/content/faq-seed.json", import.meta.url), "utf8"));
    for (const [i, item] of seed.entries()) {
      await client.query("INSERT INTO faq (question, answer, position) VALUES ($1, $2, $3)", [
        item.question,
        item.answer,
        i,
      ]);
    }
    console.log(`Seeded ${seed.length} FAQ entries.`);
  }
  const { rows: gal } = await client.query("SELECT count(*)::int AS n FROM gallery");
  if (gal[0].n === 0) {
    // Mirrors the placeholders the gallery shipped with, so nothing disappears on first migrate.
    const tiles = ["Markenfilm", "Personal Branding", "Kundenstimmen"];
    for (const [i, label] of tiles.entries()) {
      await client.query("INSERT INTO gallery (kind, label, position) VALUES ('tile', $1, $2)", [label, i]);
    }
    for (let i = 0; i < 8; i++) {
      await client.query("INSERT INTO gallery (kind, position) VALUES ('reel', $1)", [i]);
    }
    console.log(`Seeded ${tiles.length} gallery tiles and 8 reels.`);
  }

  const { rows: cl } = await client.query("SELECT count(*)::int AS n FROM clients");
  if (cl[0].n === 0) {
    for (let i = 0; i < 8; i++) {
      await client.query("INSERT INTO clients (name, position) VALUES ($1, $2)", [`Kunde ${i + 1}`, i]);
    }
    console.log("Seeded 8 client holders.");
  }

  console.log("Database is up to date.");
} finally {
  await client.end();
}
