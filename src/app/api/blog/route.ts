import { NextRequest, NextResponse } from "next/server"
import { HAS_DB, sql } from "@/lib/db"
import { toPgArray } from "@/lib/utils"

export async function POST(req: NextRequest) {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { slug, title, excerpt, tags, content } = await req.json()
  if (!slug || !title) return NextResponse.json({ error: "slug and title required" }, { status: 400 })
  await sql`
    INSERT INTO blog_posts (slug, title, excerpt, date, tags, content)
    VALUES (${slug}, ${title}, ${excerpt || ""}, ${new Date().toISOString().slice(0, 10)}, ${toPgArray(tags || [])}, ${content || ""})
    ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, tags=EXCLUDED.tags, content=EXCLUDED.content
  `
  return NextResponse.json({ ok: true })
}
