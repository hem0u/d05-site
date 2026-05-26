import { NextResponse } from "next/server"
import { getChangelog } from "@/lib/changelog-db"

export async function GET() {
  try {
    const entries = await getChangelog()
    return NextResponse.json({ entries })
  } catch {
    return NextResponse.json({ entries: [] })
  }
}
