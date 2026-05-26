"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart, Eye, MessageCircle, Send } from "lucide-react"

// ── Like Button ──
export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/blog/likes?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count)
        setLiked(d.liked)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  const toggle = async () => {
    try {
      const res = await fetch("/api/blog/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) {
        // Redirect to login if not authenticated
        if (res.status === 401) {
          window.location.href = "/login"
          return
        }
        return
      }
      const data = await res.json()
      setLiked(data.liked)
      setCount((c) => (data.liked ? c + 1 : c - 1))
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all ${
        liked
          ? "border-red-400/30 text-red-400 bg-red-400/5"
          : "border-border/20 text-muted-foreground/60 hover:text-red-400 hover:border-red-400/30"
      }`}
    >
      <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
      {loading ? "..." : count}
    </button>
  )
}

// ── View Counter ──
export function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch(`/api/blog/views?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {})
    // Increment view
    fetch("/api/blog/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {})
  }, [slug])

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/50">
      <Eye className="h-3.5 w-3.5" />
      {count}
    </span>
  )
}

// ── Comments Section ──
type CommentType = {
  id: number
  content: string
  createdAt: string
  user: { id: number; name: string; avatar: string | null; role: string }
}

export function BlogComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const fetchComments = useCallback(() => {
    fetch(`/api/blog/comments?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => { fetchComments() }, [fetchComments])

  const submit = async () => {
    if (!text.trim()) return
    setSending(true)
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content: text.trim() }),
      })
      if (res.status === 401) {
        window.location.href = "/login"
        return
      }
      const data = await res.json()
      if (res.ok && data.comment) {
        setComments((prev) => [...prev, data.comment])
        setText("")
      }
    } catch {} finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground/50" />
        <span className="text-xs text-muted-foreground/70 tracking-wider">
          评论 {loading ? "" : `(${comments.length})`}
        </span>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="写评论..."
          className="flex-1 px-3 py-1.5 text-xs bg-muted/20 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)]"
          onKeyDown={(e) => { if (e.key === "Enter") submit() }}
        />
        <button
          onClick={submit}
          disabled={!text.trim() || sending}
          className="px-3 py-1.5 text-xs rounded-lg bg-[hsl(var(--ark-amber)/0.1)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.2)] transition-colors disabled:opacity-20"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[hsl(var(--ark-blue)/0.1)] flex items-center justify-center shrink-0">
              {c.user.avatar ? (
                <img src={c.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-[9px] font-bold text-[hsl(var(--ark-blue))]">{c.user.name[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{c.user.name}</span>
                {c.user.role === "admin" && (
                  <span className="text-[8px] px-1 py-px rounded border border-[hsl(var(--ark-amber)/0.4)] text-[hsl(var(--ark-amber))] tracking-wider">管理</span>
                )}
                <span className="text-[10px] text-muted-foreground/40">
                  {new Date(c.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-0.5 leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
        {!loading && comments.length === 0 && (
          <p className="text-xs text-muted-foreground/30 text-center py-4">暂无评论</p>
        )}
      </div>
    </div>
  )
}
