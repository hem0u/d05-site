import { NextRequest, NextResponse } from "next/server"
import { HAS_DB } from "@/lib/db"
import { getAllDiaryEntries, saveDiaryEntry, deleteDiaryEntry } from "@/lib/diary-db"

export async function GET() {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const entries = await getAllDiaryEntries()
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const body = await req.json()
  await saveDiaryEntry(body)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { date } = await req.json()
  await deleteDiaryEntry(date)
  return NextResponse.json({ ok: true })
}
