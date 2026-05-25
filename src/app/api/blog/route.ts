import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { toPgArray } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const { slug, title, excerpt, tags, content } = await req.json()
    if (!slug || !title) return NextResponse.json({ error: "slug and title required" }, { status: 400 })
    await sql`
      INSERT INTO blog_posts (slug, title, excerpt, date, tags, content)
      VALUES (${slug}, ${title}, ${excerpt || ""}, ${new Date().toISOString().slice(0, 10)}, ${toPgArray(tags || [])}, ${content || ""})
      ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, tags=EXCLUDED.tags, content=EXCLUDED.content
    `
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[api/blog] POST failed:", e)
    return NextResponse.json({ error: "database unavailable" }, { status: 503 })
  }
}
