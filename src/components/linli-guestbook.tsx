"use client"

import { useState, useEffect, useCallback } from "react"
import { Send } from "lucide-react"

type Message = {
  id: number | string
  name: string
  content: string
  createdAt: string
}

const STORAGE_KEY = "d05-guestbook-msgs-v2"

const seedMessages: Message[] = [
  { id: "seed-1", name: "路人甲", content: "网站好漂亮！Arknights的配色真的很舒服~", createdAt: "2026-05-20" },
  { id: "seed-2", name: "匿名博士", content: "路过踩踩，交换友链吗？", createdAt: "2026-05-18" },
]

function loadLocal(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return [...seedMessages]
}

function saveLocal(msgs: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
}

export function LinliGuestbook() {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [useApi, setUseApi] = useState(true)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/guestbook")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setMessages(data.map((m: Record<string, unknown>) => ({
            id: String(m.id ?? ""),
            name: String(m.name ?? ""),
            content: String(m.content ?? ""),
            createdAt: String(m.createdAt ?? ""),
          })))
          return
        }
      }
    } catch { /* fall through */ }
    setUseApi(false)
    setMessages(loadLocal())
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const submit = async () => {
    if (!name.trim() || !text.trim()) return
    setSending(true)
    if (useApi) {
      try {
        const res = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), content: text.trim() }),
        })
        if (res.ok) {
          setName("")
          setText("")
          await fetchMessages()
          setSending(false)
          return
        }
      } catch { /* fallback */ }
    }
    // Local fallback
    const msg: Message = { id: Date.now(), name: name.trim(), content: text.trim(), createdAt: new Date().toISOString().slice(0, 10) }
    const updated = [msg, ...messages]
    setMessages(updated)
    saveLocal(updated)
    setName("")
    setText("")
    setSending(false)
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          placeholder="昵称"
          className="w-full px-3 py-1.5 text-xs bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors"
        />
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
            disabled={!name.trim() || !text.trim() || sending}
            className="inline-flex items-center gap-1 px-3 py-1 text-[10px] tracking-wider rounded-full border border-border/30 text-muted-foreground/60 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.4)] transition-all disabled:opacity-20"
          >
            <Send className="h-2.5 w-2.5" />
            发送
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className="p-3 rounded-xl border border-border/10 bg-muted/15 animate-fade-in"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-[hsl(var(--ark-amber)/0.15)] flex items-center justify-center text-[9px] font-bold text-[hsl(var(--ark-amber))]">
                {msg.name[0]}
              </span>
              <span className="text-[10px] font-medium">{msg.name}</span>
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{msg.createdAt?.slice(0, 10)}</span>
            </div>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
