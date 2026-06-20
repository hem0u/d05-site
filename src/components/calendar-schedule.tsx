"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch("/api/schedule")
      if (res.ok) {
        const data = await res.json()
        const list: Plan[] = Array.isArray(data) ? data : (data.schedules || [])
        const map = new Map<string, string>()
        list.forEach((p) => p.content && map.set(p.date, p.content))
        setPlans(map)
        setLoading(false)
        return
      }
    } catch {}
    setError(true)
    setLoading(false)
  }, [])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  const cells = getMonthGrid(year, month)

  return (
    <div className="relative z-10 mx-auto max-w-2xl">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1)}
          className="p-1.5 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="上个月"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="font-serif text-lg font-bold tracking-wide">
          {year}　{MONTHS[month]}
        </h2>
        <button
          onClick={() => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1)}
          className="p-1.5 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="下个月"
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

      {/* Loading / Error / Empty */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-border border-t-[hsl(var(--ark-amber))] animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-sm text-red-400/60">数据加载失败</p>
          <button onClick={fetchPlans} className="mt-3 text-xs text-[hsl(var(--ark-amber))] hover:underline">点击重试</button>
        </div>
      ) : (
      <>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-t border-l border-border/10 rounded-xl">
        {cells.map((day) => {
          const key = day ? dateKey(year, month, day) : ""
          const hasPlan = day ? plans.has(key) : false
          const isToday = day && key === todayKey()
          const past = day ? isPast(key) : false
          const canHover = day && hasPlan

          const cell = (
            <div
              onMouseEnter={() => canHover && setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => hasPlan && setSelectedDay(selectedDay === key ? null : key)}
              className={`aspect-square border-r border-b border-border/10 flex items-center justify-center transition-all relative cursor-default
                ${past && !hasPlan ? "bg-muted/10 text-muted-foreground/20" : hasPlan ? `hover:bg-muted/20 cursor-pointer ${selectedDay === key ? "bg-[hsl(var(--ark-amber)/0.08)] ring-1 ring-[hsl(var(--ark-amber)/0.3)]" : ""}` : ""}
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

              {/* Hover tooltip */}
              {hovered === key && hasPlan && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30 pointer-events-none">
                  <div className="bg-card border border-border/30 rounded-lg shadow-xl shadow-black/20 p-3 w-56 text-left">
                    <p className="text-[10px] text-muted-foreground/40 mb-1">{key}</p>
                    <p className="text-xs text-foreground/85 leading-relaxed whitespace-pre-wrap max-h-28 overflow-hidden">{plans.get(key)}</p>
                  </div>
                </div>
              )}
            </div>
          )
          return cell
        })}
      </div>

      {/* ── 本月日程列表 ── */}
      {(() => {
        const monthPlans = Array.from(plans.entries())
          .filter(([key]) => key.startsWith(dateKey(year, month, 1).slice(0, 7)))
          .sort(([a], [b]) => a.localeCompare(b))
        if (monthPlans.length === 0) return null
        return (
          <div className="mt-8 space-y-3">
            <h3 className="text-xs tracking-widest text-muted-foreground/40">
              本月日程 · {monthPlans.length} 项
            </h3>
            <div className="space-y-2">
              {monthPlans.map(([key, content]) => (
                <div
                  key={key}
                  onClick={() => setSelectedDay(selectedDay === key ? null : key)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedDay === key
                      ? "border-[hsl(var(--ark-amber)/0.3)] bg-[hsl(var(--ark-amber)/0.06)]"
                      : "border-border/15 bg-card/30 hover:border-border/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{getEmoji(key)}</span>
                    <span className="text-[10px] text-muted-foreground/50 tracking-wider">{key}</span>
                    <span className="text-[10px] text-muted-foreground/30">
                      {["日","一","二","三","四","五","六"][new Date(key).getDay()]}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{content}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
      </>
      )}
    </div>
  )
}
