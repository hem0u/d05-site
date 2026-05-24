"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, Trash2, Calendar as CalIcon } from "lucide-react"

type Plan = { date: string; content: string }

const DAY_NAMES = ["日", "一", "二", "三", "四", "五", "六"]
const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
const EMOJIS = ["😊", "😎", "🎶", "💖", "😜", "🐱‍💻", "🐱‍🚀", "🐱‍🏍", "✨", "😆"]

function getEmoji(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0
  return EMOJIS[Math.abs(hash) % EMOJIS.length]
}

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function todayKey() {
  const d = new Date()
  return dateKey(d.getFullYear(), d.getMonth(), d.getDate())
}

function isPast(key: string): boolean {
  return key < todayKey()
}

export function CalendarSchedule() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [plans, setPlans] = useState<Map<string, string>>(new Map())
  const [selected, setSelected] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [useApi, setUseApi] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch("/api/schedule")
      if (res.ok) {
        const data: Plan[] = await res.json()
        const map = new Map<string, string>()
        data.forEach((p) => p.content && map.set(p.date, p.content))
        setPlans(map)
        setUseApi(true)
        return
      }
    } catch {}
    try {
      const raw = localStorage.getItem("d05-schedules")
      if (raw) {
        const arr: Plan[] = JSON.parse(raw)
        const map = new Map<string, string>()
        arr.forEach((p) => p.content && map.set(p.date, p.content))
        setPlans(map)
      }
    } catch {}
  }, [])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    if (selected && textareaRef.current) textareaRef.current.focus()
  }, [selected])

  const open = (key: string) => {
    if (isPast(key)) return
    setSelected(key)
    setEditContent(plans.get(key) ?? "")
  }

  const save = async () => {
    if (!selected) return
    setSaving(true)
    const content = editContent.trim()
    if (useApi) {
      try {
        const res = await fetch("/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: selected, content }),
        })
        if (!res.ok) throw new Error()
      } catch { setSaving(false); return }
    }
    const next = new Map(plans)
    if (content) next.set(selected, content)
    else next.delete(selected)
    setPlans(next)
    localStorage.setItem("d05-schedules", JSON.stringify(
      Array.from(next.entries()).map(([date, content]) => ({ date, content }))
    ))
    setSaving(false)
    setSelected(null)
  }

  const del = async () => {
    if (!selected) return
    if (!confirm("删除这个日程？")) return
    if (useApi) {
      await fetch("/api/schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selected }),
      })
    }
    const next = new Map(plans)
    next.delete(selected)
    setPlans(next)
    localStorage.setItem("d05-schedules", JSON.stringify(
      Array.from(next.entries()).map(([date, content]) => ({ date, content }))
    ))
    setSelected(null)
  }

  const cells = getMonthGrid(year, month)

  return (
    <div className="relative z-10 mx-auto max-w-2xl">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1)}
          className="p-1.5 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="font-serif text-lg font-bold tracking-wide">
          {year}　{MONTHS[month]}
        </h2>
        <button
          onClick={() => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1)}
          className="p-1.5 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((name) => (
          <div key={name} className="text-center text-[10px] tracking-widest text-muted-foreground/40 py-2">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-t border-l border-border/10 rounded-xl">
        {cells.map((day, i) => {
          const key = day ? dateKey(year, month, day) : ""
          const hasPlan = day ? plans.has(key) : false
          const isToday = day && key === todayKey()
          const isSelected = selected === key
          const past = day ? isPast(key) : false
          const canClick = day && !past
          const canHover = day && past && hasPlan

          const cell = (
            <div
              onClick={() => day && canClick && open(key)}
              onMouseEnter={() => canHover && setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              className={`aspect-square border-r border-b border-border/10 flex items-center justify-center transition-all relative
                ${!canClick && !canHover ? "bg-muted/10 text-muted-foreground/20" : canClick ? "hover:bg-muted/20 cursor-pointer" : "hover:bg-muted/20 cursor-default"}
                ${isSelected ? "bg-[hsl(var(--ark-amber)/0.08)] ring-1 ring-[hsl(var(--ark-amber))]" : ""}
              `}
            >
              {day && (
                hasPlan ? (
                  <span className="text-sm leading-none">{getEmoji(key)}</span>
                ) : (
                  <span className={`text-sm ${isToday ? "font-bold text-[hsl(var(--ark-amber))]" : ""}`}>
                    {day}
                  </span>
                )
              )}

              {/* Hover tooltip for past days with plans */}
              {hovered === key && hasPlan && past && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30 pointer-events-none">
                  <div className="bg-card border border-border/30 rounded-lg shadow-xl shadow-black/20 p-2.5 w-44 text-left">
                    <p className="text-[10px] text-muted-foreground/40 mb-0.5">{key}</p>
                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap line-clamp-4">{plans.get(key)}</p>
                  </div>
                </div>
              )}
            </div>
          )
          return cell
        })}
      </div>

      {/* Edit modal (today/future only) */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border/20 rounded-xl shadow-2xl shadow-black/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalIcon className="h-4 w-4 text-[hsl(var(--ark-amber))]" />
              <h3 className="font-serif text-sm font-bold">{selected}</h3>
            </div>
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="今天有什么安排？"
              rows={4}
              className="w-full resize-none bg-muted/30 border border-border/20 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-[hsl(var(--ark-amber)/0.4)] transition-colors"
            />
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/10">
              <button
                onClick={del}
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-red-400/50 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />删除
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="px-3 py-1.5 text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-4 py-1.5 text-[10px] tracking-widest uppercase rounded-full bg-[hsl(var(--ark-amber))] text-black font-medium hover:opacity-90 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
