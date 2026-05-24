"use client"

import { useState, useEffect, useRef } from "react"
import { Edit3, Trash2, Upload, X } from "lucide-react"
import type { Hobby } from "@/data/hobbies"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || Date.now().toString(36)
}

export function HobbyEditor({ existing, onSaved, onClose }: { existing?: Hobby; onSaved: () => void; onClose: () => void }) {
  const [name, setName] = useState(existing?.name ?? "")
  const [id, setId] = useState(existing?.id ?? "")
  const [category, setCategory] = useState(existing?.category ?? "数码")
  const [imagePreview, setImagePreview] = useState(existing?.image ?? "")
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }
  const [brief, setBrief] = useState(existing?.brief ?? "")
  const [detail, setDetail] = useState(existing?.detail ?? "")
  const [saving, setSaving] = useState(false)

  const isNew = !existing

  const autoId = () => {
    if (isNew || !id) setId(slugify(name))
  }

  const save = async () => {
    if (!name.trim() || !id.trim()) return
    setSaving(true)
    await fetch("/api/hobbies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id.trim(), name: name.trim(), category, brief: brief.trim(), detail: detail.trim(), image: imagePreview }),
    })
    setSaving(false)
    onSaved()
    onClose()
  }

  const del = async () => {
    if (!confirm(`删除「${name}」？`)) return
    await fetch(`/api/hobbies/${id}`, { method: "DELETE" })
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
      <div className="relative z-10 w-full max-w-lg bg-card border border-border/20 rounded-xl shadow-2xl shadow-black/30 p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-5">
          <Edit3 className="h-3.5 w-3.5 text-[hsl(var(--ark-amber))]" />
          <h3 className="font-serif text-sm font-bold">{isNew ? "添加好物" : "编辑好物"}</h3>
        </div>

        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} onBlur={autoId} placeholder="名称" className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="分类" className="w-full px-3 py-2 text-xs bg-muted/30 border border-border/20 rounded-lg text-foreground/60 placeholder:text-muted-foreground/20 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors" />
          <input value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="一句话介绍" maxLength={100} className="w-full px-3 py-2 text-xs bg-muted/30 border border-border/20 rounded-lg text-foreground/60 placeholder:text-muted-foreground/20 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors" />
          <textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="详细介绍" rows={5} className="w-full resize-none bg-muted/30 border border-border/20 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors" />
          <div>
            <p className="text-[10px] text-muted-foreground/30 mb-1.5">图片</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="" className="w-24 h-24 rounded-lg object-cover border border-border/20" />
                <button
                  onClick={() => { setImagePreview(""); if (fileRef.current) fileRef.current.value = "" }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-24 h-24 rounded-lg border-2 border-dashed border-border/20 hover:border-[hsl(var(--ark-amber)/0.4)] flex flex-col items-center justify-center gap-1 text-muted-foreground/30 hover:text-[hsl(var(--ark-amber))] transition-all"
              >
                <Upload className="h-5 w-5" />
                <span className="text-[9px]">上传</span>
              </button>
            )}
          </div>
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
            <button onClick={save} disabled={!name.trim() || !id.trim() || saving} className="px-4 py-1.5 text-[10px] tracking-widest uppercase rounded-full bg-[hsl(var(--ark-amber))] text-black font-medium hover:opacity-90 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed">{saving ? "保存中..." : "保存"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
