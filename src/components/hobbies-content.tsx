"use client"

import { useState, useEffect, useCallback } from "react"
import type { Hobby } from "@/data/hobbies"
import { HexGrid, Sparkles, CornerDeco, ArkDiamond, SakuraFlower, YuriBloom } from "@/components/decorations"
import { CardSkeleton } from "@/components/skeleton"

function getCardRects() {
  const cards = document.querySelectorAll<HTMLElement>("[data-hobby-id]")
  const map = new Map<string, DOMRect>()
  cards.forEach((el) => {
    const id = el.dataset.hobbyId
    if (id) map.set(id, el.getBoundingClientRect())
  })
  return map
}

export function HobbiesContent() {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [animatingIn, setAnimatingIn] = useState(false)
  const [closing, setClosing] = useState(false)
  const [flyRect, setFlyRect] = useState<DOMRect | null>(null)
  const [activeCategory, setActiveCategory] = useState("全部")

  useEffect(() => {
    fetch("/api/hobbies")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.hobbies || [])
        setHobbies(list)
        const cats = Array.from(new Set(list.map((h: Hobby) => h.category))) as string[]
        setCategories(["全部", ...cats.sort()])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])
  const filteredHobbies = activeCategory === "全部"
    ? hobbies
    : hobbies.filter((h) => h.category === activeCategory)

  const hobby = selected ? hobbies.find((h) => h.id === selected) : null

  const open = useCallback((id: string) => {
    const rects = getCardRects()
    const rect = rects.get(id)
    if (rect) setFlyRect(rect)
    setSelected(id)
    setClosing(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimatingIn(true)
      })
    })
  }, [])

  const close = useCallback(() => {
    setAnimatingIn(false)
    setClosing(true)
    setTimeout(() => {
      setSelected(null)
      setClosing(false)
      setFlyRect(null)
    }, 400)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selected) close()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selected, close])

  const expanded = selected && flyRect
  const expandedW = Math.min(480, typeof window !== "undefined" ? window.innerWidth - 48 : 432)
  const expandedH = 520

  const fromX = flyRect ? flyRect.left + flyRect.width / 2 : 0
  const fromY = flyRect ? flyRect.top + flyRect.height / 2 : 0
  const fromW = flyRect?.width || 280
  const toX = typeof window !== "undefined" ? window.innerWidth / 2 : 0
  const toY = typeof window !== "undefined" ? window.innerHeight / 2 : 0

  const deltaX = fromX - toX
  const deltaY = fromY - toY
  const scale = fromW / expandedW

  const isActive = animatingIn && !closing

  return (
    <div className="relative py-16 px-4 sm:px-6 overflow-hidden min-h-screen">
      <HexGrid opacity={0.03} />
      <Sparkles count={10} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <div className="absolute left-2 sm:left-8 top-1/3 pointer-events-none z-10 block animate-float opacity-35 sm:opacity-50">
        <SakuraFlower size={20} />
      </div>
      <div className="absolute right-2 sm:right-8 top-2/3 pointer-events-none z-10 block animate-float opacity-35 sm:opacity-50" style={{ animationDelay: "1.5s" }}>
        <YuriBloom size={18} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-14 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-10 ark-line" />
            <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">Hobbies</p>
            <div className="w-10 ark-line" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mb-2">
            好物
          </h1>
          <p className="text-xs text-muted-foreground/60 tracking-widest">
            — THE THINGS I LOVE —
          </p>
        </div>

        {/* Content area: left category sidebar + right card grid */}
        <div className="flex gap-8 items-start">
          {/* Category sidebar — vertical */}
          <div className="shrink-0 w-24 flex flex-col gap-1 pt-2 sticky top-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left px-3 py-2 text-xs tracking-widest uppercase rounded transition-all duration-300 border-l-2 ${
                  activeCategory === cat
                    ? "border-[hsl(var(--ark-amber))] text-[hsl(var(--ark-amber))] bg-[hsl(var(--ark-amber)/0.04)]"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Card grid */}
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <span className="text-[10px] text-muted-foreground/30 tracking-wider">{loading ? "加载中..." : `${filteredHobbies.length} 件`}</span>
            </div>
            {loading ? (
              <CardSkeleton count={6} />
            ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHobbies.map((h) => {
            const isThisCard = selected === h.id && !closing
            const isDimmed = selected !== null && selected !== h.id

            return (
              <div
                key={h.id}
                data-hobby-id={h.id}
                onClick={() => !selected && open(h.id)}
                className={`group cursor-pointer transition-all duration-500 ${
                  isDimmed ? "opacity-15 scale-[0.97] pointer-events-none" : "hover:-translate-y-1 hover:shadow-lg hover:shadow-[hsl(var(--ark-amber)/0.06)]"
                } ${isThisCard ? "opacity-0 pointer-events-none" : ""}`}
                style={{
                  perspective: "800px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Card: thin border + thick "包边" padding mat */}
                <div className="h-full rounded-xl border border-border/20 bg-card/60 backdrop-blur-sm p-3 sm:p-4 hover:border-[hsl(var(--ark-amber)/0.2)] transition-colors">
                  {/* Image area */}
                  <div className="aspect-square mb-3 rounded-lg bg-muted/30">
                    <img
                      src={h.image}
                      alt={h.name}
                      className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {/* Text area */}
                  <div className="min-h-[5rem]">
                    <h3 className="font-serif text-sm font-bold mb-1.5 group-hover:text-[hsl(var(--ark-amber))] transition-colors">
                      {h.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground/55 leading-relaxed">
                      {h.brief}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
            </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-12 opacity-25">
          <ArkDiamond size={6} />
        </div>
      </div>

      {/* ── Expanded overlay ── */}
      {expanded && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity`}
            style={{ transitionDuration: "0.4s", opacity: isActive ? 1 : 0 }}
            onClick={close}
          />

          {/* Expanded card — mirrors grid card style */}
          <div
            className="fixed z-50"
            style={{
              width: expandedW,
              height: expandedH,
              left: "50%",
              top: "50%",
              marginLeft: -expandedW / 2,
              marginTop: -expandedH / 2,
              perspective: "1000px",
              transition: isActive
                ? "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                : "transform 0.35s ease-in",
              transform: isActive
                ? "translate(0, 0) scale(1) rotateY(360deg)"
                : `translate(${deltaX}px, ${deltaY}px) scale(${scale}) rotateY(0deg)`,
            }}
          >
            {/* Expanded card — thin border + thick mat */}
            <div className="w-full h-full rounded-xl border border-[hsl(var(--ark-amber)/0.2)] bg-card shadow-2xl shadow-black/30 flex flex-col p-5 sm:p-6 relative">
              {/* Image area */}
              <div className="h-44 mb-4 rounded-lg bg-muted/30">
                <img
                  src={hobby!.image}
                  alt={hobby!.name}
                  className="w-full h-full object-contain p-5"
                />
              </div>

              {/* Detail text */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 mb-3">
                  <ArkDiamond size={8} filled />
                  <h2 className="font-serif text-lg font-bold">{hobby!.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  {hobby!.detail}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-colors z-10 backdrop-blur-sm"
              >
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
