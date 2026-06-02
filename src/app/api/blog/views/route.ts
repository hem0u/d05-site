import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// POST — increment view count
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

    await sql`
      INSERT INTO blog_views (post_slug, count) VALUES (${slug}, 1)
      ON CONFLICT (post_slug) DO UPDATE SET count = blog_views.count + 1
    `
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[api/views] POST failed:", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

// GET — get view count
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

  try {
    const { rows } = await sql`
      SELECT count FROM blog_views WHERE post_slug = ${slug}
    `
    return NextResponse.json({ count: rows.length > 0 ? Number(rows[0].count) : 0 })
  } catch (e) {
    console.error("[api/views] GET failed:", e)
    return NextResponse.json({ error: "数据库查询失败" }, { status: 500 })
  }
}
