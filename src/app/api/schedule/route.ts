import { NextRequest, NextResponse } from "next/server"
import { HAS_DB, sql } from "@/lib/db"

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date")
  if (!HAS_DB) return NextResponse.json(null)
  if (date) {
    const { rows } = await sql`SELECT date, content FROM schedules WHERE date = ${date}`
    return NextResponse.json(rows[0] ?? null)
  }
  const { rows } = await sql`SELECT date, content FROM schedules ORDER BY date`
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { date, content } = await req.json()
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 })
  await sql`
    INSERT INTO schedules (date, content)
    VALUES (${date}, ${content || ""})
    ON CONFLICT (date) DO UPDATE SET content = EXCLUDED.content
  `
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { date } = await req.json()
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 })
  await sql`DELETE FROM schedules WHERE date = ${date}`
  return NextResponse.json({ ok: true })
}
