"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  type DiaryEntry,
} from "@/data/diary"

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
  const scrollRef = useRef<HTMLDivElement>(null)

  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    setError(false)
    try {
      const res = await fetch("/api/diary")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setEntries(data)
          return
        }
      }
    } catch {}
    setError(true)
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
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[10px] text-red-400/60 tracking-wider text-center px-2">数据加载失败<br/>请稍后重试</p>
            </div>
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

        </div>

        {/* Content area */}
        {activeEntry ? (
          <div className="space-y-5">
            {/* Text */}
            {activeEntry.content && (
              <div className="bg-card/40 rounded-xl border border-border/15 p-6 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {activeEntry.content}
                </p>
              </div>
            )}

            {/* Photos */}
            {activeEntry.photos.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center">
                {activeEntry.photos.map((src, i) => (
                  <div key={i} className="max-w-[240px] rounded-xl overflow-hidden bg-muted/30 border border-border/20 hover:border-[hsl(var(--ark-amber)/0.2)] transition-colors">
                    <img src={src} alt="" className="w-full h-auto max-h-64 object-contain" />
                  </div>
                ))}
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

    </div>
  )
}
