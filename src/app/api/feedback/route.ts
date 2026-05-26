import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { content, contact, type } = await req.json()
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "请输入反馈内容" }, { status: 400 })
    }

    await sql`
      INSERT INTO feedbacks (content, contact, type)
      VALUES (${content.trim()}, ${contact?.trim() || null}, ${type || "suggestion"})
    `

    return NextResponse.json({ message: "感谢你的反馈！" })
  } catch (e) {
    console.error("[api/feedback]", e)
    return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 })
  }
}
