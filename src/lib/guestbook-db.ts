import { sql } from "@/lib/db"

export type GuestbookMessage = {
  id: number
  name: string
  content: string
  createdAt: string
  avatar: string | null
  role: string
}

export async function getMessages(): Promise<GuestbookMessage[]> {
  try {
    const { rows } = await sql`
      SELECT g.id, g.name, g.content, g.created_at as "createdAt",
             u.avatar, COALESCE(u.role, 'user') as role
      FROM guestbook_messages g
      LEFT JOIN users u ON g.user_id = u.id
      ORDER BY g.created_at DESC
    `
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
      avatar: r.avatar || null,
      role: r.role || "user",
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
      avatar: null,
      role: "user",
    }
  } catch {
    return { id: 0, name, content, createdAt: new Date().toISOString(), avatar: null, role: "user" }
  }
}

export async function deleteMessage(id: number) {
  await sql`DELETE FROM guestbook_messages WHERE id = ${id}`
}
