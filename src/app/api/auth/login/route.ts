import { NextRequest, NextResponse } from "next/server"
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth"
import { getUserByEmail, getPasswordHash } from "@/lib/user-db"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "请输入邮箱和密码" }, { status: 400 })
    }

    const hash = await getPasswordHash(email)
    if (!hash) {
      return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 })
    }

    const valid = await comparePassword(password, hash)
    if (!valid) {
      return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 401 })
    }

    const token = await signToken({ userId: user.id })
    await setAuthCookie(token)

    return NextResponse.json({ user })
  } catch (e) {
    console.error("[api/auth/login]", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
