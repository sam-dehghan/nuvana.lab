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
  console.log("Database is up to date.");
} finally {
  await client.end();
}
