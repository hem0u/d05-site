import { NextRequest, NextResponse } from "next/server"
import { HAS_DB, sql } from "@/lib/db"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { slug } = await params
  await sql`DELETE FROM blog_posts WHERE slug = ${slug}`
  return NextResponse.json({ ok: true })
}
