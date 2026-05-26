import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { HAS_DB, sql, ensureTables } from "@/lib/db"
import { getCached, setCache } from "@/lib/api-cache"

let tablesEnsured = false

async function ensure() {
  if (!tablesEnsured) {
    await ensureTables()
    tablesEnsured = true
  }
}

export async function GET(req: NextRequest) {
  await ensure()
  const date = req.nextUrl.searchParams.get("date")
  if (!HAS_DB) return NextResponse.json({ schedules: [] })
  if (date) {
    const { rows } = await sql`SELECT date, content FROM schedules WHERE date = ${date}`
    return NextResponse.json(rows[0] ?? null)
  }

  const cached = getCached<{ schedules: unknown[] }>("schedules")
  if (cached) return NextResponse.json(cached)

  const { rows } = await sql`SELECT date, content FROM schedules ORDER BY date`
  const data = { schedules: rows }
  setCache("schedules", data)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await ensure()
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { date, content } = await req.json()
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 })
  await sql`
    INSERT INTO schedules (date, content)
    VALUES (${date}, ${content || ""})
    ON CONFLICT (date) DO UPDATE SET content = EXCLUDED.content
  `
  setCache("schedules", null)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await ensure()
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { date } = await req.json()
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 })
  await sql`DELETE FROM schedules WHERE date = ${date}`
  setCache("schedules", null)
  return NextResponse.json({ ok: true })
}
