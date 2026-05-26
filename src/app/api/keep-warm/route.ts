import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

const endpoints = [
  "/api/blog",
  "/api/friends",
  "/api/hobbies",
  "/api/changelog",
  "/api/schedule",
  "/api/admin/stats",
  "/api/admin/users",
  "/api/admin/changelog",
]

export async function GET() {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

  // Ping DB to keep connection warm
  try { await sql`SELECT 1` } catch { /* cold, ignore */ }

  // Touch all data endpoints to warm their caches
  const results = await Promise.allSettled(
    endpoints.map(async (path) => {
      try {
        await fetch(`${base}${path}`, { signal: AbortSignal.timeout(8000) })
      } catch { /* ignore individual failures */ }
    })
  )

  const ok = results.filter((r) => r.status === "fulfilled").length
  return NextResponse.json({ warmed: ok, total: endpoints.length })
}
