import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { HAS_DB } from "@/lib/db"
import { getAllDiaryEntries, saveDiaryEntry, deleteDiaryEntry } from "@/lib/diary-db"

export async function GET() {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const entries = await getAllDiaryEntries()
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  try {
    const body = await req.json()
    await saveDiaryEntry(body)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[api/diary] POST failed:", e)
    return NextResponse.json({ error: "数据库写入失败" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  try {
    const { date } = await req.json()
    await deleteDiaryEntry(date)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[api/diary] DELETE failed:", e)
    return NextResponse.json({ error: "数据库删除失败" }, { status: 500 })
  }
}
