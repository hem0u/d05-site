import { isAdmin, getCurrentUserId } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql, ensureTables } from "@/lib/db"
import { HexGrid, Sparkles } from "@/components/decorations"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await ensureTables()
  const admin = await isAdmin()
  if (!admin) {
    // If no admin exists, promote the current logged-in user
    const userId = await getCurrentUserId()
    if (userId) {
      const { rows } = await sql`SELECT count(*) as c FROM users WHERE role = 'admin'`
      if (Number(rows[0].c) === 0) {
        await sql`UPDATE users SET role = 'admin' WHERE id = ${userId}`
        redirect("/admin")
      }
    }
    redirect("/login")
  }

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 overflow-hidden">
      <HexGrid opacity={0.02} />
      <Sparkles count={4} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
