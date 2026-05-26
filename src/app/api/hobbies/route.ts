import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { HAS_DB, sql } from "@/lib/db"

export async function GET() {
  if (!HAS_DB) return NextResponse.json({ hobbies: [] })
  try {
    const { rows } = await sql`SELECT id, name, category, brief, detail, image FROM hobbies ORDER BY category, name`
    return NextResponse.json({ hobbies: rows })
  } catch {
    return NextResponse.json({ hobbies: [] })
  }
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { id, name, category, brief, detail, image } = await req.json()
  if (!id || !name) return NextResponse.json({ error: "id and name required" }, { status: 400 })
  await sql`
    INSERT INTO hobbies (id, name, category, brief, detail, image)
    VALUES (${id}, ${name}, ${category || ""}, ${brief || ""}, ${detail || ""}, ${image || "/images/art-01.jpg"})
    ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, category=EXCLUDED.category, brief=EXCLUDED.brief, detail=EXCLUDED.detail, image=EXCLUDED.image
  `
  return NextResponse.json({ ok: true })
}
