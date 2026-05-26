import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { sql, ensureTables } from "@/lib/db"
import { setCache } from "@/lib/api-cache"

export async function GET() {
  await ensureTables()
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const { rows } = await sql`
      SELECT id, date, content, type FROM changelog ORDER BY date DESC, id DESC LIMIT 50
    `
    return NextResponse.json({ entries: rows })
  } catch {
    return NextResponse.json({ entries: [] })
  }
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const { date, content, type } = await req.json()
    if (!date || !content || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const { rows } = await sql`
      INSERT INTO changelog (date, content, type) VALUES (${date}, ${content}, ${type})
      RETURNING id, date, content, type
    `
    setCache("changelog", null)
    return NextResponse.json({ entry: rows[0] })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    await sql`DELETE FROM changelog WHERE id = ${Number(id)}`
    setCache("changelog", null)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
