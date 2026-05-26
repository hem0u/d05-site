import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, isAdmin } from "@/lib/auth"
import { getMessages, addMessage, deleteMessage } from "@/lib/guestbook-db"
import { getUserById } from "@/lib/user-db"

export async function GET() {
  try {
    const messages = await getMessages()
    return NextResponse.json({ messages })
  } catch (e) {
    console.error("[api/guestbook] GET failed:", e)
    return NextResponse.json({ error: "database unavailable" }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const content = body.content
    if (!content) return NextResponse.json({ error: "content required" }, { status: 400 })

    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    const user = await getUserById(userId)
    const name = user?.name || "匿名"

    const msg = await addMessage(name, content, userId)
    return NextResponse.json(msg)
  } catch (e) {
    console.error("[api/guestbook] POST failed:", e)
    return NextResponse.json({ error: "database unavailable" }, { status: 503 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    await deleteMessage(Number(id))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
