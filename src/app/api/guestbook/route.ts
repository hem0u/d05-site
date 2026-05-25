import { NextRequest, NextResponse } from "next/server"
import { getMessages, addMessage } from "@/lib/guestbook-db"

export async function GET() {
  try {
    const messages = await getMessages()
    return NextResponse.json(messages)
  } catch (e) {
    console.error("[api/guestbook] GET failed:", e)
    return NextResponse.json({ error: "database unavailable" }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, content } = await req.json()
    if (!name || !content) return NextResponse.json({ error: "name and content required" }, { status: 400 })
    const msg = await addMessage(name, content)
    return NextResponse.json(msg)
  } catch (e) {
    console.error("[api/guestbook] POST failed:", e)
    return NextResponse.json({ error: "database unavailable" }, { status: 503 })
  }
}
