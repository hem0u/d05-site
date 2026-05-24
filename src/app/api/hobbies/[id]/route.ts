import { NextRequest, NextResponse } from "next/server"
import { HAS_DB, sql } from "@/lib/db"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { id } = await params
  await sql`DELETE FROM hobbies WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
