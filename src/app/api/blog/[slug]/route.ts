import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  try {
    const { slug } = await params
    await sql`DELETE FROM blog_posts WHERE slug = ${slug}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[api/blog] DELETE failed:", e)
    return NextResponse.json({ error: "database unavailable" }, { status: 503 })
  }
}
