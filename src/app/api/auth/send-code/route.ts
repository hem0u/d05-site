import { NextRequest, NextResponse } from "next/server"
import { ensureTables } from "@/lib/db"
import { saveVerificationCode } from "@/lib/user-db"
import { sendVerificationCode } from "@/lib/mail"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  const limit = rateLimit(ip, "send-code", 3, 60_000)
  if (!limit.ok) return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 })

  try {
    const { email } = await req.json()
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "请输入有效邮箱" }, { status: 400 })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))

    await ensureTables()
    const saved = await saveVerificationCode(email, code)
    if (!saved) {
      return NextResponse.json({ error: "验证码保存失败，请稍后重试" }, { status: 500 })
    }

    const sent = await sendVerificationCode(email, code)

    if (process.env.NODE_ENV === "development") {
      console.log(`[verify-code] ${email} → ${code}`)
      return NextResponse.json({
        code,
        message: sent ? "验证码已发送至邮箱" : "验证码已生成（邮件未配置，开发模式直接返回）",
      })
    }

    if (!sent) {
      return NextResponse.json({ error: "邮件发送失败，请稍后重试" }, { status: 500 })
    }

    return NextResponse.json({ message: "验证码已发送至邮箱" })
  } catch (e) {
    console.error("[api/auth/send-code]", e)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
