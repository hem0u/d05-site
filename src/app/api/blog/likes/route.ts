import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth"
import { sql } from "@/lib/db"

// GET — check if user liked + count, or get liked posts for a user
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  const queryUser = req.nextUrl.searchParams.get("user")

  // Get all liked posts for a user
  if (queryUser) {
    try {
      const { rows } = await sql`
        SELECT bl.post_slug as slug, bp.title, bp.date
        FROM blog_likes bl
        LEFT JOIN blog_posts bp ON bl.post_slug = bp.slug
        WHERE bl.user_id = ${Number(queryUser)}
        ORDER BY bl.created_at DESC
      `
      return NextResponse.json({
        posts: rows.map((r) => ({
          slug: r.slug,
          title: r.title || r.slug,
          date: r.date || "",
        })),
      })
    } catch (e) {
      console.error("[api/likes] user posts failed:", e)
      return NextResponse.json({ error: "数据库查询失败" }, { status: 500 })
    }
  }

  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

  const userId = await getCurrentUserId()

  try {
    const [countRes, likedRes] = await Promise.all([
      sql`SELECT count(*) as c FROM blog_likes WHERE post_slug = ${slug}`,
      userId
        ? sql`SELECT 1 as liked FROM blog_likes WHERE post_slug = ${slug} AND user_id = ${userId}`
        : Promise.resolve({ rows: [] }),
    ])

    return NextResponse.json({
      count: Number(countRes.rows[0].c),
      liked: likedRes.rows.length > 0,
    })
  } catch (e) {
    console.error("[api/likes] GET failed:", e)
    return NextResponse.json({ error: "数据库查询失败" }, { status: 500 })
  }
}

// POST — toggle like
export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  try {
    const { slug } = await req.json()
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

    const existing = await sql`
      SELECT id FROM blog_likes WHERE user_id = ${userId} AND post_slug = ${slug}
    `

    if (existing.rows.length > 0) {
      await sql`DELETE FROM blog_likes WHERE id = ${existing.rows[0].id}`
      return NextResponse.json({ liked: false })
    } else {
      await sql`INSERT INTO blog_likes (user_id, post_slug) VALUES (${userId}, ${slug})`
      return NextResponse.json({ liked: true })
    }
  } catch (e) {
    console.error("[api/likes] POST failed:", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

