import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

let cached: Database | null = null;

/**
 * Returns a Drizzle client, or null when DATABASE_URL is not configured.
 *
 * Callers turn a null client into a JSON 503 so the site keeps working
 * (with a "please call us" fallback) before the database is provisioned.
 */
export function getDb(): Database | null {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return null;
  }

  if (!cached) {
    cached = drizzle(neon(url), { schema });
  }

  return cached;
}

export { schema };
