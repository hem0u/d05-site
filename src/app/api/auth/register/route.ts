import { NextRequest, NextResponse } from "next/server"
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth"
import { createUser, getUserByEmail, verifyCode } from "@/lib/user-db"
import { ensureTables } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    await ensureTables()
    const { email, name, password, code } = await req.json()

    if (!email || !name || !password || !code) {
      return NextResponse.json({ error: "请填写所有字段" }, { status: 400 })
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "请输入有效邮箱" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "密码至少6位" }, { status: 400 })
    }
    if (name.length < 1 || name.length > 20) {
      return NextResponse.json({ error: "昵称1-20个字符" }, { status: 400 })
    }

    if (process.env.NODE_ENV !== "development" || !req.headers.get("x-dev-skip-code")) {
      const valid = await verifyCode(email, code)
      if (!valid) {
        return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 })
      }
    }

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = await createUser(email, name, passwordHash)

    if (!user) {
      return NextResponse.json({ error: "注册失败，请重试" }, { status: 500 })
    }

    const token = await signToken({ userId: user.id })
    await setAuthCookie(token)

    return NextResponse.json({ user })
  } catch (e) {
    console.error("[api/auth/register]", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
