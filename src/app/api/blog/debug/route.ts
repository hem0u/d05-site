import { isAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!await isAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 })
  try {
    const { rows } = await sql`
      SELECT slug, title, date FROM blog_posts ORDER BY date DESC
    `
    return Response.json({ count: rows.length, posts: rows })
  } catch (e) {
    return Response.json({ error: "db unavailable", detail: String(e) }, { status: 503 })
  }
}
