import { NextRequest, NextResponse } from "next/server"
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth"
import { getUserByEmail, getPasswordHash } from "@/lib/user-db"
import { ensureTables } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  const limit = rateLimit(ip, "login", 10, 60_000)
  if (!limit.ok) return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 })

  try {
    await ensureTables()
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

    const token = await signToken({ userId: user.id, role: user.role, tokenVersion: user.tokenVersion })
    await setAuthCookie(token)

    return NextResponse.json({ user })
  } catch (e) {
    console.error("[api/auth/login]", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
