"use client"

import { useState } from "react"
import { MessageSquareText, Send, X } from "lucide-react"

const types = [
  { value: "suggestion", label: "建议" },
  { value: "bug", label: "问题反馈" },
  { value: "other", label: "其他" },
]

export function FeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [content, setContent] = useState("")
  const [contact, setContact] = useState("")
  const [type, setType] = useState("suggestion")
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState("")

  if (!open) return null

  const submit = async () => {
    if (!content.trim()) return
    setSending(true)
    setMsg("")
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim(), contact: contact.trim(), type }),
    })
    const data = await res.json()
    if (res.ok) {
      setMsg(data.message)
      setTimeout(() => {
        onClose()
        setContent("")
        setContact("")
        setType("suggestion")
        setMsg("")
      }, 1500)
    } else {
      setMsg(data.error || "提交失败")
    }
    setSending(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-card border border-border/20 rounded-2xl shadow-2xl shadow-black/30 p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquareText className="h-4 w-4 text-[hsl(var(--ark-amber))]" />
          <h2 className="font-serif text-sm font-bold">反馈问题</h2>
          <button onClick={onClose} className="ml-auto p-1 text-muted-foreground/40 hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Type selector */}
          <div className="flex gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  type === t.value
                    ? "border-[hsl(var(--ark-amber))] text-[hsl(var(--ark-amber))] bg-[hsl(var(--ark-amber)/0.08)]"
                    : "border-border/20 text-muted-foreground hover:border-border/40"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="请详细描述你的问题或建议..."
              className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg resize-none outline-none focus:border-[hsl(var(--ark-amber)/0.3)] placeholder:text-muted-foreground/30"
            />
          </div>

          {/* Contact */}
          <div>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="联系方式（选填，方便我们回复）"
              className="w-full px-3 py-2 text-xs bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)] placeholder:text-muted-foreground/20"
            />
          </div>

          {msg && (
            <p className={`text-xs text-center ${msg.includes("感谢") ? "text-emerald-400" : "text-amber-400"}`}>{msg}</p>
          )}

          <button
            onClick={submit}
            disabled={sending || !content.trim()}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs tracking-wider rounded-lg bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.25)] transition-colors disabled:opacity-30"
          >
            <Send className="h-3 w-3" />
            {sending ? "提交中..." : "提交反馈"}
          </button>
        </div>
      </div>
    </div>
  )
}
