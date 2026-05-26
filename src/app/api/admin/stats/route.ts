import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { sql, ensureTables } from "@/lib/db"

export async function GET() {
  await ensureTables()
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const [posts, comments, messages, users] = await Promise.all([
      sql`SELECT count(*) as c FROM blog_posts`,
      sql`SELECT count(*) as c FROM blog_comments`,
      sql`SELECT count(*) as c FROM guestbook_messages`,
      sql`SELECT count(*) as c FROM users`,
    ])

    return NextResponse.json({
      posts: Number(posts.rows[0].c),
      comments: Number(comments.rows[0].c),
      messages: Number(messages.rows[0].c),
      users: Number(users.rows[0].c),
    })
  } catch {
    return NextResponse.json({ posts: 0, comments: 0, messages: 0, users: 0 })
  }
}
