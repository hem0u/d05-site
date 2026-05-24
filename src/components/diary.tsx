"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Plus, Edit3, Trash2, Camera, X } from "lucide-react"
import {
  type DiaryEntry,
  getAllEntries,
  getEntry,
  saveEntry,
  deleteEntry,
  seedIfEmpty,
  todayStr,
} from "@/data/diary"

/* ── Editor Modal ── */
function Editor({
  date,
  existing,
  onClose,
  onSaved,
  useApi = false,
}: {
  date: string
  existing: DiaryEntry | null
  onClose: () => void
  onSaved: () => void
  useApi?: boolean
}) {
  const [content, setContent] = useState(existing?.content ?? "")
  const [photos, setPhotos] = useState<string[]>(existing?.photos ?? [])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const remaining = 3 - photos.length
    if (remaining <= 0) return

    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => setPhotos((prev) => [...prev, reader.result as string])
        reader.readAsDataURL(file)
      })
  }

  const save = async () => {
    if (!content.trim() && photos.length === 0) return
    const entry = { date, content: content.trim(), photos, updatedAt: new Date().toISOString() }
    if (useApi) {
      await fetch("/api/diary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) })
    } else {
      saveEntry(entry)
    }
    onSaved()
    onClose()
  }

  const del = async () => {
    if (!confirm("删除这条记录？")) return
    if (useApi) {
      await fetch("/api/diary", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date }) })
    } else {
      deleteEntry(date)
    }
    onSaved()
    onClose()
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => (e.key === "Escape" ? onClose() : null)
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-card border border-border/20 rounded-xl shadow-2xl shadow-black/30 p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="font-serif text-sm font-bold mb-4 flex items-center gap-2">
          <Edit3 className="h-3.5 w-3.5 text-[hsl(var(--ark-amber))]" />
          {date === todayStr() ? "今日记录" : date}
        </h3>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天发生了什么..."
          rows={6}
          className="w-full resize-none bg-muted/30 border border-border/20 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors"
        />

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="h-3 w-3 text-muted-foreground/40" />
            <span className="text-[10px] text-muted-foreground/40 tracking-wider">照片 {photos.length}/3</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {photos.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted/30 border border-border/20">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center">
                  <X className="h-2.5 w-2.5 text-white/80" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <button onClick={() => fileRef.current?.click()} className="w-20 h-20 rounded-lg border border-dashed border-border/30 bg-muted/20 flex items-center justify-center hover:border-[hsl(var(--ark-amber)/0.3)] transition-colors">
                <Plus className="h-4 w-4 text-muted-foreground/30" />
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/10">
          {existing && (
            <button onClick={del} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-red-400/60 hover:text-red-400 transition-colors">
              <Trash2 className="h-3 w-3" />删除
            </button>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">取消</button>
            <button onClick={save} disabled={!content.trim() && photos.length === 0} className="px-4 py-1.5 text-[10px] tracking-widest uppercase rounded-full bg-[hsl(var(--ark-amber))] text-black font-medium hover:opacity-90 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed">保存</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── SVG Curved Timeline ── */
function CurvedTimeline({
  entries,
  activeIdx,
  onSelectDate,
}: {
  entries: DiaryEntry[]
  activeIdx: number
  onSelectDate: (date: string) => void
}) {
  const total = entries.length
  const spacing = 130
  // Large padding so first/last dates can scroll to viewport center
  const padding = 340
  const svgH = padding * 2 + (total - 1) * spacing

  // Barely perceptible wave
  const pts: [number, number][] = []
  for (let i = 0; i < total; i++) {
    const y = padding + i * spacing
    const x = 32 + Math.sin(i * 0.5) * 4
    pts.push([x, y])
  }

  const pathD = pts
    .map((p, i) => {
      if (i === 0) return `M ${p[0]} ${p[1]}`
      const prev = pts[i - 1]
      const cpx1 = prev[0] + (p[0] - prev[0]) * 0.5
      const cpy1 = (prev[1] + p[1]) / 2
      const cpx2 = prev[0] + (p[0] - prev[0]) * 0.5
      const cpy2 = (prev[1] + p[1]) / 2
      return `C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p[0]} ${p[1]}`
    })
    .join(" ")

  return (
    <div className="relative select-none" style={{ height: svgH }}>
      <svg viewBox={`0 0 56 ${svgH}`} className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Curved line */}
        <path d={pathD} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeOpacity={0.25} />
        {/* Glow trace */}
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--ark-amber))"
          strokeWidth="2"
          strokeOpacity={0.5}
          strokeDasharray={`0 ${svgH}`}
          strokeDashoffset={0}
          className="hidden"
        />
      </svg>

      {/* Date markers */}
      {entries.map((e, i) => {
        const [cx, cy] = pts[i]
        const isActive = i === activeIdx
        const d = new Date(e.date)
        const day = d.getDate()
        const months = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
        const wds = ["周日","周一","周二","周三","周四","周五","周六"]

        return (
          <button
            key={e.date}
            onClick={() => onSelectDate(e.date)}
            className="absolute group"
            style={{ left: 0, top: cy, transform: "translateY(-50%)", width: 56 }}
          >
            {/* Dot */}
            <span
              className={`absolute block rounded-full transition-all duration-500 ${
                isActive
                  ? "w-[10px] h-[10px] bg-[hsl(var(--ark-amber))] shadow-[0_0_12px_hsl(var(--ark-amber)/0.5)]"
                  : "w-[7px] h-[7px] bg-muted-foreground/35 group-hover:bg-muted-foreground/60"
              }`}
              style={{ left: cx - (isActive ? 5 : 3.5), top: "50%", transform: "translateY(-50%)" }}
            />

            {/* Date label — only show on active */}
            <span
              className={`absolute left-[42px] top-1/2 -translate-y-1/2 flex items-center gap-2 whitespace-nowrap transition-all duration-500 ${
                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
              }`}
            >
              <span className="text-xs font-mono tabular-nums font-bold text-[hsl(var(--ark-amber))] tracking-tight">
                {String(day).padStart(2, "0")}
              </span>
              <span className="text-[9px] tracking-wider text-muted-foreground/70">
                {months[d.getMonth()]} · {wds[d.getDay()]}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ── Main Diary Component ── */
export function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [editing, setEditing] = useState(false)
  const [useApi, setUseApi] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(async () => {
    // Try API first
    try {
      const res = await fetch("/api/diary")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setUseApi(true)
          setEntries(data)
          return
        }
      }
    } catch {}
    // Fallback to localStorage
    seedIfEmpty()
    setEntries(getAllEntries())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleSelectDate = useCallback((date: string) => {
    const idx = entries.findIndex((e) => e.date === date)
    if (idx >= 0) setActiveIdx(idx)
  }, [entries])

  // Scroll detection — update active index as user scrolls
  const handleTimelineScroll = useCallback(() => {
    if (!scrollRef.current || entries.length === 0) return
    const containerH = scrollRef.current.clientHeight
    const scrollCenter = scrollRef.current.scrollTop + containerH / 2
    const spacing = 130
    const padding = 340
    let closest = 0
    let closestDist = Infinity
    for (let i = 0; i < entries.length; i++) {
      const y = padding + i * spacing
      const dist = Math.abs(y - scrollCenter)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    }
    setActiveIdx(closest)
  }, [entries.length])

  const activeEntry = entries[activeIdx] ?? null
  const hasToday = entries.some((e) => e.date === todayStr())

  return (
    <div className="flex gap-0 items-start">
      {/* Left: scrollable curved timeline */}
      <div className="shrink-0 w-28 sticky top-20">
        <div
          ref={scrollRef}
          onScroll={handleTimelineScroll}
          className="h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {entries.length > 0 ? (
            <CurvedTimeline entries={entries} activeIdx={activeIdx} onSelectDate={handleSelectDate} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[10px] text-muted-foreground/20 tracking-wider">暂无记录</p>
            </div>
          )}
        </div>
      </div>

      {/* Center: content */}
      <div className="flex-1 min-w-0 pl-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-5 ark-line opacity-50" />
            {activeEntry ? (
              <h2 className="font-serif text-sm font-bold text-muted-foreground">
                {activeEntry.date}
              </h2>
            ) : (
              <h2 className="font-serif text-sm font-bold text-muted-foreground/60">选择日期</h2>
            )}
          </div>

          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-widest uppercase rounded-full border border-border/40 text-muted-foreground/70 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.5)] transition-all"
          >
            {hasToday ? (
              <><Edit3 className="h-3 w-3" />编辑今日</>
            ) : (
              <><Plus className="h-3 w-3" />记录今日</>
            )}
          </button>
        </div>

        {/* Content area */}
        {activeEntry ? (
          <div className="space-y-5">
            {/* Photos */}
            {activeEntry.photos.length > 0 && (
              <div
                className={`grid gap-3 ${
                  activeEntry.photos.length === 1 ? "grid-cols-1" : activeEntry.photos.length === 2 ? "grid-cols-2" : "grid-cols-3"
                }`}
              >
                {activeEntry.photos.map((src, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden bg-muted/30 border border-border/20 hover:border-[hsl(var(--ark-amber)/0.2)] transition-colors">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Text */}
            {activeEntry.content && (
              <div className="bg-card/40 rounded-xl border border-border/15 p-6 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {activeEntry.content}
                </p>
              </div>
            )}

            {!activeEntry.content && activeEntry.photos.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground/20 text-sm">空记录</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-6xl mb-3 opacity-10">&#128221;</p>
            <p className="text-muted-foreground/25 text-sm">滑动左侧时间轴</p>
            <p className="text-muted-foreground/15 text-[10px] mt-1 tracking-wider">或点击右上角记录今日</p>
          </div>
        )}
      </div>

      {/* Editor modal */}
      {editing && (
        <Editor
          date={todayStr()}
          existing={useApi ? entries.find((e) => e.date === todayStr()) ?? null : getEntry(todayStr())}
          onClose={() => setEditing(false)}
          onSaved={refresh}
          useApi={useApi}
        />
      )}
    </div>
  )
}
