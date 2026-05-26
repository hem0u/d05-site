"use client"

import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "reset">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Reset password state
  const [resetCode, setResetCode] = useState("")
  const [resetPassword, setResetPassword] = useState("")
  const [resetSending, setResetSending] = useState(false)
  const [resetMsg, setResetMsg] = useState("")

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
      if (data.user?.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/"
      }
    } catch {
      setError("网络错误")
    } finally {
      setLoading(false)
    }
  }

  const sendResetCode = async () => {
    if (!email || !email.includes("@")) return
    setResetSending(true)
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    })
    const data = await res.json()
    setResetMsg(data.message || data.error || "")
    setResetSending(false)
  }

  const resetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !resetCode || !resetPassword) return
    setLoading(true)
    setResetMsg("")
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), code: resetCode, password: resetPassword }),
    })
    const data = await res.json()
    if (res.ok) {
      setResetMsg("密码修改成功，请登录")
      setMode("login")
      setPassword("")
    } else {
      setResetMsg(data.error || "修改失败")
    }
    setLoading(false)
  }

  return (
    <div className="p-6 rounded-2xl border border-border/20 bg-card/80 backdrop-blur-xl">
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold tracking-tight mb-1">
          {mode === "login" ? "登录" : "找回密码"}
        </h1>
        <p className="text-xs text-muted-foreground/50">
          {mode === "login" ? "欢迎回到 D05" : "通过邮箱验证码重置密码"}
        </p>
      </div>

      {mode === "login" ? (
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
      ) : (
        <form onSubmit={resetSubmit} className="space-y-4">
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
            <label className="text-xs text-muted-foreground mb-1 block">验证码</label>
            <div className="flex gap-2">
              <input
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6位数字"
                className="flex-1 px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)]"
              />
              <button
                type="button"
                onClick={sendResetCode}
                disabled={resetSending || !email.includes("@")}
                className="px-3 py-2 text-xs tracking-wider rounded-lg border border-border/20 text-muted-foreground hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.3)] transition-colors whitespace-nowrap disabled:opacity-40"
              >
                {resetSending ? "发送中..." : "发送验证码"}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">新密码</label>
            <input
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              placeholder="至少6位"
              className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors"
            />
          </div>

          {resetMsg && (
            <p className={`text-xs ${resetMsg.includes("成功") ? "text-emerald-400" : "text-amber-400"}`}>{resetMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading || resetCode.length < 6 || resetPassword.length < 6}
            className="w-full py-2 text-sm tracking-wider rounded-lg bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.25)] transition-colors disabled:opacity-30"
          >
            {loading ? "提交中..." : "重置密码"}
          </button>
        </form>
      )}

      <p className="text-xs text-muted-foreground/50 text-center mt-4 space-x-4">
        {mode === "login" ? (
          <>
            <button
              type="button"
              onClick={() => { setMode("reset"); setResetMsg(""); setResetCode(""); setResetPassword("") }}
              className="text-muted-foreground/50 hover:text-[hsl(var(--ark-amber))] transition-colors"
            >
              忘记密码？
            </button>
            <Link href="/register" className="text-[hsl(var(--ark-amber))] hover:underline">
              注册
            </Link>
          </>
        ) : (
          <button
            type="button"
            onClick={() => { setMode("login"); setResetMsg("") }}
            className="text-[hsl(var(--ark-amber))] hover:underline"
          >
            返回登录
          </button>
        )}
      </p>
    </div>
  )
}
