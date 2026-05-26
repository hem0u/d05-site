"use client"

import { useState, useEffect } from "react"
import { ArkDiamond } from "@/components/decorations"

export type TocHeading = { id: string; text: string; level: 1 | 2 | 3 | 4 }

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    )

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="fixed top-28 w-44" style={{ left: "max(0.75rem, calc(50% - 37rem))" }}>
      <div className="flex items-center gap-2 mb-4">
        <ArkDiamond size={5} filled />
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">目录</span>
        <div className="flex-1 h-px bg-gradient-to-r from-[hsl(var(--ark-amber)/0.3)] to-transparent ml-1" />
      </div>
      <ul className="space-y-0.5 border-l border-[hsl(var(--ark-amber)/0.12)]">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block py-1.5 transition-all duration-200 hover:text-[hsl(var(--ark-amber))] border-l-2 -ml-px ${
                h.level === 1
                  ? "pl-3 text-[11px] font-semibold"
                  : h.level === 2
                  ? "pl-5 text-[11px] font-medium"
                  : h.level === 3
                  ? "pl-7 text-[10px]"
                  : "pl-9 text-[10px]"
              } ${
                activeId === h.id
                  ? "text-[hsl(var(--ark-amber))] border-l-[hsl(var(--ark-amber))]"
                  : "text-muted-foreground/50 border-l-transparent"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
