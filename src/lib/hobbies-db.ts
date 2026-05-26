import { sql, HAS_DB } from "@/lib/db"
import { hobbies as fallback, hobbyCategories as fallbackCats } from "@/data/hobbies"
import type { Hobby } from "@/data/hobbies"

export async function getHobbies(): Promise<Hobby[]> {
  if (!HAS_DB) return fallback
  try {
    const { rows } = await sql<Hobby>`
      SELECT id, name, category, brief, detail, image FROM hobbies ORDER BY category, name
    `
    return rows
  } catch (e) {
    console.error("[hobbies-db] getHobbies failed:", e)
    return fallback
  }
}

export async function getHobbyCategories(): Promise<string[]> {
  if (!HAS_DB) return fallbackCats
  try {
    const { rows } = await sql<{ category: string }>`
      SELECT DISTINCT category FROM hobbies ORDER BY category
    `
    return ["全部", ...rows.map((r) => r.category)]
  } catch (e) {
    console.error("[hobbies-db] getHobbyCategories failed:", e)
    return fallbackCats
  }
}
