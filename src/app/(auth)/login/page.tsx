"use client"

import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "登录失败")
        return
      }
      window.location.href = "/"
    } catch {
      setError("网络错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 rounded-2xl border border-border/20 bg-card/80 backdrop-blur-xl">
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold tracking-tight mb-1">登录</h1>
        <p className="text-xs text-muted-foreground/50">欢迎回到 D05</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少6位"
            className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full py-2 text-sm tracking-wider rounded-lg bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.25)] transition-colors disabled:opacity-30"
        >
          {loading ? "登录中..." : "登录"}
        </button>
      </form>

      <p className="text-xs text-muted-foreground/50 text-center mt-4">
        还没有账号？{" "}
        <Link href="/register" className="text-[hsl(var(--ark-amber))] hover:underline">
          注册
        </Link>
      </p>
    </div>
  )
}
