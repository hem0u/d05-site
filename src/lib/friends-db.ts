import { sql } from "@/lib/db"
import { friends as fallback } from "@/data/friends"
import type { Friend } from "@/data/friends"

export async function getFriends(): Promise<Friend[]> {
  try {
    const { rows } = await sql<Friend>`
      SELECT name, url, description, avatar FROM friends ORDER BY name
    `
    return rows
  } catch {
    return fallback
  }
}

export async function addFriend(friend: Friend) {
  await sql`
    INSERT INTO friends (name, url, description, avatar)
    VALUES (${friend.name}, ${friend.url}, ${friend.description}, ${friend.avatar || null})
    ON CONFLICT (name) DO UPDATE SET url = EXCLUDED.url, description = EXCLUDED.description, avatar = EXCLUDED.avatar
  `
}

export async function deleteFriend(name: string) {
  await sql`DELETE FROM friends WHERE name = ${name}`
}
