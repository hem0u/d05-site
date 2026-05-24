"use client"

import { useEffect, useState } from "react"

const sections = [
  { id: "hero", label: "TOP" },
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "WORKS" },
]

export function SectionIndicator() {
  const [active, setActive] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )

    const hero = document.getElementById("hero")
    const about = document.getElementById("about")
    const projects = document.getElementById("projects")

    if (hero) observer.observe(hero)
    if (about) observer.observe(about)
    if (projects) observer.observe(projects)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-4">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="group flex items-center gap-3"
        >
          <span
            className={`text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
              active === section.id
                ? "text-[hsl(var(--ark-amber))] opacity-100 translate-x-0"
                : "text-muted-foreground opacity-0 translate-x-4 group-hover:opacity-60 group-hover:translate-x-0"
            }`}
          >
            {section.label}
          </span>
          <div
            className={`w-2 h-2 transition-all duration-300 ${
              active === section.id
                ? "rotate-45 bg-[hsl(var(--ark-amber))] shadow-lg shadow-[hsl(var(--ark-amber)/0.3)] scale-125"
                : "rotate-45 bg-muted-foreground/20 group-hover:bg-muted-foreground/40 scale-100"
            }`}
          />
        </a>
      ))}
    </div>
  )
}
