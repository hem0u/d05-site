import { NextRequest, NextResponse } from "next/server"
import { HAS_DB } from "@/lib/db"
import { getMessages, addMessage } from "@/lib/guestbook-db"

export async function GET() {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const messages = await getMessages()
  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  if (!HAS_DB) return NextResponse.json({ error: "no database" }, { status: 503 })
  const { name, content } = await req.json()
  const msg = await addMessage(name, content)
  return NextResponse.json(msg)
}
