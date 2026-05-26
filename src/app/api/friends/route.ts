import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { getFriends, addFriend, deleteFriend } from "@/lib/friends-db"
import { getCached, setCache } from "@/lib/api-cache"

export async function GET() {
  const cached = getCached<{ friends: unknown[] }>("friends")
  if (cached) return NextResponse.json(cached)

  const friends = await getFriends()
  const data = { friends }
  setCache("friends", data)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const body = await req.json()
    if (!body.name || !body.url) {
      return NextResponse.json({ error: "name and url required" }, { status: 400 })
    }
    await addFriend(body)
    setCache("friends", null)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const name = req.nextUrl.searchParams.get("name")
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 })
    await deleteFriend(name)
    setCache("friends", null)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
