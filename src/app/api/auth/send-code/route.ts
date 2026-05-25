import { NextRequest, NextResponse } from "next/server"
import { saveVerificationCode } from "@/lib/user-db"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "请输入有效邮箱" }, { status: 400 })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    const ok = await saveVerificationCode(email, code)

    if (!ok) {
      return NextResponse.json({ error: "验证码发送失败，请重试" }, { status: 500 })
    }

    // In production, send via email service. For now, log and return in dev.
    if (process.env.NODE_ENV === "development") {
      console.log(`[verify-code] ${email} → ${code}`)
      return NextResponse.json({ code, message: "验证码已生成（开发模式直接返回）" })
    }

    console.log(`[verify-code] ${email} → ${code}`)
    return NextResponse.json({ message: "验证码已发送" })
  } catch (e) {
    console.error("[api/auth/send-code]", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
