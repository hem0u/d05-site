import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const { rows } = await sql`
      SELECT id, email, name, avatar, bio, role, created_at as "createdAt"
      FROM users ORDER BY id
    `
    return NextResponse.json({
      users: rows.map((r) => ({
        id: r.id,
        email: r.email,
        name: r.name,
        avatar: r.avatar,
        bio: r.bio,
        role: r.role,
        createdAt: r.createdAt.toISOString(),
      })),
    })
  } catch {
    return NextResponse.json({ users: [] })
  }
}

export async function PUT(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const { userId, role } = await req.json()
    if (!userId || !["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid" }, { status: 400 })
    }
    await sql`UPDATE users SET role = ${role} WHERE id = ${userId}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    await sql`DELETE FROM users WHERE id = ${Number(id)}`
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
