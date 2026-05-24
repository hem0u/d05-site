"use client"

import { useState, useEffect } from "react"
import { Plus, Edit3, Trash2, X } from "lucide-react"
import type { BlogPost } from "@/data/blog-posts"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || Date.now().toString(36)
}

export function BlogEditor({ existing, onSaved, onClose }: { existing?: BlogPost; onSaved: () => void; onClose: () => void }) {
  const [title, setTitle] = useState(existing?.title ?? "")
  const [slug, setSlug] = useState(existing?.slug ?? "")
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "")
  const [tags, setTags] = useState(existing?.tags?.join(", ") ?? "")
  const [content, setContent] = useState(existing?.content ?? "")
  const [saving, setSaving] = useState(false)

  const isNew = !existing

  const autoSlug = () => {
    if (isNew || !slug) setSlug(slugify(title))
  }

  const save = async () => {
    if (!title.trim() || !slug.trim()) return
    setSaving(true)
    await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: slug.trim(),
        title: title.trim(),
        excerpt: excerpt.trim(),
        tags: tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
        content: content.trim(),
      }),
    })
    setSaving(false)
    onSaved()
    onClose()
  }

  const del = async () => {
    if (!confirm(`删除「${title}」？`)) return
    await fetch(`/api/blog/${slug}`, { method: "DELETE" })
    onSaved()
    onClose()
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => (e.key === "Escape" ? onClose() : null)
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-card border border-border/20 rounded-xl shadow-2xl shadow-black/30 p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-5">
          <Edit3 className="h-3.5 w-3.5 text-[hsl(var(--ark-amber))]" />
          <h3 className="font-serif text-sm font-bold">{isNew ? "写文章" : "编辑文章"}</h3>
        </div>

        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={autoSlug} placeholder="标题" className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors" />
          <div className="flex gap-2">
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" className="flex-1 px-3 py-2 text-xs font-mono bg-muted/30 border border-border/20 rounded-lg text-foreground/60 placeholder:text-muted-foreground/20 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors" />
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="标签（逗号分隔）" className="flex-[2] px-3 py-2 text-xs bg-muted/30 border border-border/20 rounded-lg text-foreground/60 placeholder:text-muted-foreground/20 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors" />
          </div>
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="摘要" className="w-full px-3 py-2 text-xs bg-muted/30 border border-border/20 rounded-lg text-foreground/60 placeholder:text-muted-foreground/20 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="正文（Markdown）" rows={16} className="w-full resize-none bg-muted/30 border border-border/20 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground/30 font-mono outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors" />
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/10">
          {!isNew && (
            <button onClick={del} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-red-400/60 hover:text-red-400 transition-colors">
              <Trash2 className="h-3 w-3" />删除
            </button>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">取消</button>
            <button onClick={save} disabled={!title.trim() || !slug.trim() || saving} className="px-4 py-1.5 text-[10px] tracking-widest uppercase rounded-full bg-[hsl(var(--ark-amber))] text-black font-medium hover:opacity-90 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed">{saving ? "保存中..." : "保存"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
