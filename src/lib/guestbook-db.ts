import { sql } from "@/lib/db"

export type GuestbookMessage = {
  id: number
  name: string
  content: string
  createdAt: string
}

export async function getMessages(): Promise<GuestbookMessage[]> {
  try {
    const { rows } = await sql`
      SELECT id, name, content, created_at as "createdAt"
      FROM guestbook_messages ORDER BY created_at DESC
    `
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
    }))
  } catch {
    return []
  }
}

export async function addMessage(name: string, content: string, userId?: number): Promise<GuestbookMessage> {
  try {
    const { rows } = await sql`
      INSERT INTO guestbook_messages (name, content, user_id)
      VALUES (${name}, ${content}, ${userId ?? null})
      RETURNING id, name, content, created_at as "createdAt"
    `
    return {
      id: rows[0].id,
      name: rows[0].name,
      content: rows[0].content,
      createdAt: rows[0].createdAt.toISOString(),
    }
  } catch {
    return { id: 0, name, content, createdAt: new Date().toISOString() }
  }
}

export async function deleteMessage(id: number) {
  await sql`DELETE FROM guestbook_messages WHERE id = ${id}`
}
