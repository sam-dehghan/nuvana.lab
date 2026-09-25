import "server-only";
import { Pool, type QueryResultRow } from "pg";

const globalForDb = globalThis as unknown as { pgPool?: Pool };

export const hasDb = Boolean(process.env.DATABASE_URL);

function pool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  // Reuse one pool across hot reloads and warm serverless invocations.
  globalForDb.pgPool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return globalForDb.pgPool;
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []): Promise<T[]> {
  const result = await pool().query<T>(text, values);
  return result.rows;
}
