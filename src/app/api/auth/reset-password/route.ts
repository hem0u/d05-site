import { NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { updatePassword, verifyCode } from "@/lib/user-db"
import { ensureTables } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    await ensureTables()
    const { email, code, password } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "请输入有效邮箱" }, { status: 400 })
    }
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: "请输入6位验证码" }, { status: 400 })
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "新密码至少6位" }, { status: 400 })
    }

    const valid = await verifyCode(email, code)
    if (!valid) {
      return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    const ok = await updatePassword(email, passwordHash)
    if (!ok) {
      return NextResponse.json({ error: "密码修改失败，请重试" }, { status: 500 })
    }

    return NextResponse.json({ message: "密码修改成功" })
  } catch (e) {
    console.error("[api/auth/reset-password]", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
