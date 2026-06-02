"use client"

import { useState, useEffect, useCallback } from "react"

type Message = {
  id: number | string
  name: string
  text?: string
  content?: string
  date?: string
  createdAt?: string
}

export function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const fetchMessages = useCallback(async () => {
    setError(false)
    try {
      const res = await fetch("/api/guestbook")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length >= 0) {
          setMessages((data as Array<{ id: number | string; name: string; content?: string; createdAt?: string }>).map((m) => ({
            id: m.id,
            name: m.name,
            text: m.content,
            date: m.createdAt?.slice(0, 10) || "",
          })))
          return
        }
      }
    } catch {}
    setError(true)
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const submit = async () => {
    if (!name.trim() || !text.trim()) return

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), content: text.trim() }),
      })
      if (res.ok) {
        await fetchMessages()
        setName("")
        setText("")
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 2000)
        return
      }
    } catch {}
    // API failed — show error, not fake success
    setError(true)
    setTimeout(() => setError(false), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-sm p-5 animate-slide-up">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            placeholder="你的名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-[hsl(var(--ark-amber)/0.4)] transition-colors"
          />
          <input
            type="text"
            placeholder="说点什么..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={200}
            className="px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-[hsl(var(--ark-amber)/0.4)] transition-colors sm:col-span-2"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] text-muted-foreground/30 tracking-wider">{text.length}/200</span>
          <button
            onClick={submit}
            disabled={!name.trim() || !text.trim()}
            className="px-4 py-1.5 text-xs tracking-widest uppercase rounded-full border border-[hsl(var(--ark-amber)/0.3)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.06)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            {error ? "发送失败 ✦" : submitted ? "已发送 ✦" : "留下痕迹"}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && messages.length === 0 && (
        <p className="text-[10px] text-red-400/60 text-center py-6">数据加载失败，请稍后刷新重试</p>
      )}
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className="p-4 rounded-xl border border-border/15 bg-card/30 backdrop-blur-sm animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-muted/50 border border-border/20 flex items-center justify-center text-[10px] font-bold text-muted-foreground/50">
                {msg.name[0]}
              </div>
              <span className="text-xs font-bold text-muted-foreground/70">{msg.name}</span>
              <span className="text-[10px] text-muted-foreground/25 ml-auto">{msg.date || msg.createdAt?.slice(0, 10)}</span>
            </div>
            <p className="text-sm text-muted-foreground/60 leading-relaxed pl-9">{msg.text || msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
