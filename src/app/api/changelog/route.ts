import { NextResponse } from "next/server"
import { getChangelog } from "@/lib/changelog-db"
import { getCached, setCache } from "@/lib/api-cache"

export async function GET() {
  const cached = getCached<{ entries: unknown[] }>("changelog")
  if (cached) return NextResponse.json(cached)

  try {
    const entries = await getChangelog()
    const data = { entries }
    setCache("changelog", data)
    return NextResponse.json(data)
  } catch (e) {
    console.error("[api/changelog] GET failed:", e)
    return NextResponse.json({ error: "数据库查询失败" }, { status: 500 })
  }
}
