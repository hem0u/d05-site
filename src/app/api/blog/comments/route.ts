import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth"
import { sql } from "@/lib/db"

export type Comment = {
  id: number
  content: string
  createdAt: string
  user: {
    id: number
    name: string
    avatar: string | null
    role: string
  }
}

// GET — get comments for a post
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

  try {
    const { rows } = await sql`
      SELECT
        c.id, c.content, c.created_at as "createdAt",
        u.id as user_id, u.name as user_name, u.avatar as user_avatar, u.role as user_role
      FROM blog_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_slug = ${slug}
      ORDER BY c.created_at ASC
      LIMIT 100
    `
    const comments: Comment[] = rows.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
      user: {
        id: r.user_id,
        name: r.user_name,
        avatar: r.user_avatar,
        role: r.user_role || "user",
      },
    }))
    return NextResponse.json({ comments })
  } catch (e) {
    console.error("[api/comments] GET failed:", e)
    return NextResponse.json({ comments: [] })
  }
}

// POST — add a comment
export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  try {
    const { slug, content } = await req.json()
    if (!slug || !content || !content.trim()) {
      return NextResponse.json({ error: "请输入评论内容" }, { status: 400 })
    }
    if (content.length > 500) {
      return NextResponse.json({ error: "评论最多500字" }, { status: 400 })
    }

    const { rows } = await sql`
      INSERT INTO blog_comments (user_id, post_slug, content)
      VALUES (${userId}, ${slug}, ${content.trim()})
      RETURNING id, content, created_at as "createdAt"
    `

    const userRes = await sql`
      SELECT id, name, avatar, role FROM users WHERE id = ${userId}
    `

    const comment: Comment = {
      id: rows[0].id,
      content: rows[0].content,
      createdAt: rows[0].createdAt.toISOString(),
      user: {
        id: userRes.rows[0].id,
        name: userRes.rows[0].name,
        avatar: userRes.rows[0].avatar,
        role: userRes.rows[0].role || "user",
      },
    }
    return NextResponse.json({ comment })
  } catch (e) {
    console.error("[api/comments] POST failed:", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

// DELETE — delete a comment
export async function DELETE(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  try {
    const { id } = await req.json()
    const { rows } = await sql`
      DELETE FROM blog_comments WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "无权删除" }, { status: 403 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[api/comments] DELETE failed:", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
