import pg from "pg";
import type { PoolClient } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

export const pool = new pg.Pool({
  connectionString,
});

/**
 * Get a client from the pool. Use for single queries or pass to repos.
 * Remember to release the client when done (client.release() or use in a callback).
 */
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

/**
 * Run the initial schema (001_init.sql) against the database.
 * Safe to call on startup; tables use IF NOT EXISTS where applicable.
 * For a fresh DB you run the full SQL once (e.g. via Supabase SQL Editor);
 * this helper is for automation or local dev.
 */
export async function runMigrations(): Promise<void> {
  const client = await getClient();
  try {
    const sqlPath = join(__dirname, "..", "sql", "001_init.sql");
    const sql = readFileSync(sqlPath, "utf-8");
    await client.query(sql);
  } finally {
    client.release();
  }
}

/**
 * Test that the database is reachable (e.g. for health checks).
 */
export async function ping(): Promise<boolean> {
  try {
    const res = await pool.query("SELECT 1 as ok");
    return res.rows[0]?.ok === 1;
  } catch {
    return false;
  }
}
