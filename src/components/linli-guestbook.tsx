"use client"

import { useState, useEffect, useCallback } from "react"
import { Send } from "lucide-react"
import Link from "next/link"

type Message = {
  id: number | string
  name: string
  content: string
  createdAt: string
  avatar: string | null
  role: string
}

export function LinliGuestbook() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setLoggedIn(true)
          setUserName(data.user.name)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAuth(false))
  }, [])

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/guestbook")
      if (res.ok) {
        const data = await res.json()
        const list = data.messages || data
        if (Array.isArray(list)) {
          setMessages(list.map((m: Record<string, unknown>) => ({
            id: String(m.id ?? ""),
            name: String(m.name ?? ""),
            content: String(m.content ?? ""),
            createdAt: String(m.createdAt ?? ""),
            avatar: (m.avatar as string) || null,
            role: String(m.role || "user"),
          })))
        }
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const submit = async () => {
    if (!text.trim()) return
    setSending(true)
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() }),
      })
      if (res.ok) {
        setText("")
        await fetchMessages()
      }
    } catch { /* ignore */ }
    setSending(false)
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      {loadingAuth ? (
        <div className="w-4 h-4 rounded-full border-2 border-border border-t-transparent animate-spin mx-auto" />
      ) : !loggedIn ? (
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground/40 mb-3">登录后才能留言</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 px-4 py-1.5 text-xs tracking-wider rounded-lg bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.25)] transition-colors"
          >
            去登录
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground/50">
            以 <span className="text-[hsl(var(--ark-amber))]">{userName}</span> 的身份留言
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 200))}
            placeholder="说点什么..."
            rows={2}
            className="w-full px-3 py-1.5 text-xs bg-muted/30 border border-border/20 rounded-lg resize-none outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/40">{text.length}/200</span>
            <button
              onClick={submit}
              disabled={!text.trim() || sending}
              className="inline-flex items-center gap-1 px-3 py-1 text-[10px] tracking-wider rounded-full border border-border/30 text-muted-foreground/60 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.4)] transition-all disabled:opacity-20"
            >
              <Send className="h-2.5 w-2.5" />
              发送
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className="p-3 rounded-xl border border-border/10 bg-muted/15 animate-fade-in"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-[hsl(var(--ark-amber)/0.15)] flex items-center justify-center overflow-hidden shrink-0">
                {msg.avatar ? (
                  <img src={msg.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] font-bold text-[hsl(var(--ark-amber))]">{msg.name[0]}</span>
                )}
              </div>
              <span className="text-[10px] font-medium">{msg.name}</span>
              {msg.role === "admin" && (
                <span className="text-[8px] px-1 py-px rounded border border-[hsl(var(--ark-amber)/0.4)] text-[hsl(var(--ark-amber))] tracking-wider">管理</span>
              )}
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{msg.createdAt?.slice(0, 10)}</span>
            </div>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
