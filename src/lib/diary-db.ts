import { sql, HAS_DB } from "@/lib/db"
import { toPgArray } from "@/lib/utils"
import type { DiaryEntry } from "@/data/diary"

export async function getDiaryEntry(date: string): Promise<DiaryEntry | null> {
  if (!HAS_DB) return null
  const { rows } = await sql`
    SELECT date, content, photos, updated_at as "updatedAt"
    FROM diary_entries WHERE date = ${date}
  `
  if (!rows[0]) return null
  return {
    date: rows[0].date,
    content: rows[0].content,
    photos: rows[0].photos,
    updatedAt: rows[0].updatedAt.toISOString(),
  }
}

export async function getAllDiaryEntries(): Promise<DiaryEntry[]> {
  if (!HAS_DB) return []
  const { rows } = await sql`
    SELECT date, content, photos, updated_at as "updatedAt"
    FROM diary_entries ORDER BY date DESC
  `
  return rows.map((r) => ({
    date: r.date,
    content: r.content,
    photos:r.photos,
    updatedAt: r.updatedAt.toISOString(),
  }))
}

export async function saveDiaryEntry(entry: DiaryEntry) {
  if (!HAS_DB) return
  await sql`
    INSERT INTO diary_entries (date, content, photos, updated_at)
    VALUES (${entry.date}, ${entry.content}, ${toPgArray(entry.photos)}, NOW())
    ON CONFLICT (date)
    DO UPDATE SET content = EXCLUDED.content, photos = EXCLUDED.photos, updated_at = NOW()
  `
}

export async function deleteDiaryEntry(date: string) {
  if (!HAS_DB) return
  await sql`DELETE FROM diary_entries WHERE date = ${date}`
}
