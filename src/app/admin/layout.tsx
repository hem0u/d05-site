import { isAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HexGrid, Sparkles } from "@/components/decorations"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!await isAdmin()) redirect("/login")

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 overflow-hidden">
      <HexGrid opacity={0.02} />
      <Sparkles count={4} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
