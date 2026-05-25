import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth"
import { getUserById, updateProfile } from "@/lib/user-db"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }
  const user = await getUserById(userId)
  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 })
  }
  return NextResponse.json({ user })
}

export async function PUT(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { name, avatar, bio } = await req.json()
  const updates: Record<string, string> = {}
  if (name !== undefined) {
    if (name.length < 1 || name.length > 20) {
      return NextResponse.json({ error: "昵称1-20个字符" }, { status: 400 })
    }
    updates.name = name
  }
  if (avatar !== undefined) {
    if (avatar && avatar.length > 200_000) {
      return NextResponse.json({ error: "头像图片过大" }, { status: 400 })
    }
    updates.avatar = avatar
  }
  if (bio !== undefined) {
    if (bio.length > 100) {
      return NextResponse.json({ error: "简介最多100字" }, { status: 400 })
    }
    updates.bio = bio
  }

  const user = await updateProfile(userId, updates)
  if (!user) {
    return NextResponse.json({ error: "更新失败" }, { status: 500 })
  }
  return NextResponse.json({ user })
}
