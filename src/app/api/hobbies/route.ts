import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { HAS_DB, sql } from "@/lib/db"
import { getCached, setCache } from "@/lib/api-cache"

export async function GET() {
  if (!HAS_DB) return NextResponse.json({ hobbies: [] })

  const cached = getCached<{ hobbies: unknown[] }>("hobbies")
  if (cached) return NextResponse.json(cached)

  try {
    const { rows } = await sql`SELECT id, name, category, brief, detail, image FROM hobbies ORDER BY category, name`
    const data = { hobbies: rows }
    setCache("hobbies", data)
    return NextResponse.json(data)
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
  setCache("hobbies", null)
  return NextResponse.json({ ok: true })
}
