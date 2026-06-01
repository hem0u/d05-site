"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Shield } from "lucide-react"

type UserInfo = {
  id: number
  name: string
  avatar: string | null
  role: string
}

export function UserMenu() {
  const pathname = usePathname()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="w-7 h-7 rounded-full bg-muted/30 animate-pulse" />
  }

  if (!user) {
    return (
      <Link
        href={`/login?redirect=${encodeURIComponent(pathname)}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-wider rounded-lg border border-border/30 text-muted-foreground/60 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.4)] transition-all"
      >
        <User className="h-3 w-3" />
        登录
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {user.role === "admin" && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] tracking-wider rounded-lg border border-[hsl(var(--ark-amber)/0.3)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.1)] transition-colors"
        >
          <Shield className="h-3 w-3" />
          <span className="hidden sm:inline">管理</span>
        </Link>
      )}
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-border/20 hover:border-[hsl(var(--ark-amber)/0.3)] transition-colors group"
      >
        <div className="w-6 h-6 rounded-full bg-[hsl(var(--ark-blue)/0.15)] flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold text-[hsl(var(--ark-blue))]">{user.name[0]}</span>
          )}
        </div>
        <span className="text-xs text-muted-foreground/70 group-hover:text-foreground transition-colors hidden sm:inline">
          {user.name}
        </span>
      </Link>
    </div>
  )
}
