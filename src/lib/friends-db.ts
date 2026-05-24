import { sql, HAS_DB } from "@/lib/db"
import { friends as fallback } from "@/data/friends"
import type { Friend } from "@/data/friends"

export async function getFriends(): Promise<Friend[]> {
  if (!HAS_DB) return fallback
  const { rows } = await sql<Friend>`
    SELECT name, url, description, avatar FROM friends ORDER BY name
  `
  return rows
}
