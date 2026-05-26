import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { getFriends, addFriend, deleteFriend } from "@/lib/friends-db"

export async function GET() {
  const friends = await getFriends()
  return NextResponse.json({ friends })
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const body = await req.json()
    if (!body.name || !body.url) {
      return NextResponse.json({ error: "name and url required" }, { status: 400 })
    }
    await addFriend(body)
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
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
