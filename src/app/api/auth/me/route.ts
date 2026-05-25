import { NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth"
import { getUserById } from "@/lib/user-db"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ user: null })
  }
  const user = await getUserById(userId)
  return NextResponse.json({ user })
}
