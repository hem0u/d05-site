"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const sendCode = async () => {
    if (!email || !email.includes("@")) {
      setError("请输入有效邮箱")
      return
    }
    setSendingCode(true)
    setError("")
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "发送失败")
        return
      }
      // Start countdown
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timer); return 0 }
          return c - 1
        })
      }, 1000)
    } catch {
      setError("网络错误")
    } finally {
      setSendingCode(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name || !password || !code) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), password, code: code.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "注册失败")
        return
      }
      router.push("/")
      router.refresh()
    } catch {
      setError("网络错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 rounded-2xl border border-border/20 bg-card/80 backdrop-blur-xl">
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold tracking-tight mb-1">注册</h1>
        <p className="text-xs text-muted-foreground/50">加入 D05 的小站</p>
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
          <label className="text-xs text-muted-foreground mb-1 block">昵称</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder="怎么称呼"
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
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">验证码</label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6位数字"
              className="flex-1 px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors"
            />
            <button
              type="button"
              onClick={sendCode}
              disabled={sendingCode || countdown > 0 || !email}
              className="px-3 py-2 text-xs tracking-wider rounded-lg border border-border/20 text-muted-foreground hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.3)] transition-colors disabled:opacity-30 whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}s` : sendingCode ? "发送中" : "获取验证码"}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || !email || !name || !password || code.length !== 6}
          className="w-full py-2 text-sm tracking-wider rounded-lg bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.25)] transition-colors disabled:opacity-30"
        >
          {loading ? "注册中..." : "注册"}
        </button>
      </form>

      <p className="text-xs text-muted-foreground/50 text-center mt-4">
        已有账号？{" "}
        <Link href="/login" className="text-[hsl(var(--ark-amber))] hover:underline">
          登录
        </Link>
      </p>
    </div>
  )
}
