import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"
import { toPgArray } from "@/lib/utils"
import { getCached, setCache } from "@/lib/api-cache"

export async function GET() {
  const cached = getCached<{ posts: unknown[] }>("blog")
  if (cached) return NextResponse.json(cached)

  try {
    const { rows } = await sql`SELECT slug, title, excerpt, date, tags, content FROM blog_posts ORDER BY date DESC`
    const data = { posts: rows }
    setCache("blog", data)
    return NextResponse.json(data)
  } catch (e) {
    console.error("[api/blog] GET failed:", e)
    return NextResponse.json({ error: "数据库查询失败" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  try {
    const { slug, title, excerpt, tags, content } = await req.json()
    if (!slug || !title) return NextResponse.json({ error: "slug and title required" }, { status: 400 })
    await sql`
      INSERT INTO blog_posts (slug, title, excerpt, date, tags, content)
      VALUES (${slug}, ${title}, ${excerpt || ""}, ${new Date().toISOString().slice(0, 10)}, ${toPgArray(tags || [])}, ${content || ""})
      ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, tags=EXCLUDED.tags, content=EXCLUDED.content
    `
    setCache("blog", null) // invalidate
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[api/blog] POST failed:", e)
    return NextResponse.json({ error: "database unavailable" }, { status: 503 })
  }
}
