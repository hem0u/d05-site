"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Mail, Send } from "lucide-react"
import { ArkDiamond } from "@/components/decorations"
import { profile } from "@/data/profile"

const QUOTES = [
  "願わくば、その先に光がありますように",
  "明日もまた、ここで会おう",
  "たとえ世界が終わろうとも",
  "この瞬間は永遠だから",
  "ずっと、ずっと、一緒にいよう",
]

export function Footer() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  const [daysOnline, setDaysOnline] = useState(0)

  useEffect(() => {
    if (!profile.siteStart) return
    const start = new Date(profile.siteStart).getTime()
    const update = () => setDaysOnline(Math.floor((Date.now() - start) / 86400000))
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="border-t border-border/30 relative overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--ark-amber)/0.3)] to-transparent" />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-10 sm:px-6">
        {/* Quote */}
        <p className="text-[11px] text-muted-foreground/50 tracking-widest italic font-serif">
          「{quote}」
        </p>

        {/* Now status — compact one-liner */}
        {profile.now && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground/50 tracking-wider">
            <span>📺 {profile.now.watching}</span>
            <span className="text-border">·</span>
            <span>📖 {profile.now.reading}</span>
            <span className="text-border">·</span>
            <span>🎧 {profile.now.listening}</span>
          </div>
        )}

        {/* Social icons */}
        <div className="flex items-center gap-1">
          {profile.social.github && (
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="p-1.5 text-muted-foreground/40 hover:text-[hsl(var(--ark-blue))] transition-colors">
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
          {profile.social.bilibili && (
            <a href={profile.social.bilibili} target="_blank" rel="noopener noreferrer" className="p-1.5 text-muted-foreground/40 hover:text-[hsl(var(--ark-blue))] transition-colors">
              <Send className="h-3.5 w-3.5" />
            </a>
          )}
          {profile.social.email && (
            <a href={`mailto:${profile.social.email}`} className="p-1.5 text-muted-foreground/40 hover:text-[hsl(var(--ark-amber))] transition-colors">
              <Mail className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Branding */}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
          <ArkDiamond size={4} />
          <span>D05</span>
          <span className="text-border">/</span>
          <span>Island</span>
          <ArkDiamond size={4} />
        </div>

        <div className="flex items-center gap-6 text-[10px] text-muted-foreground tracking-widest">
          <Link href="/" className="hover:text-[hsl(var(--ark-amber))] transition-colors">
            HOME
          </Link>
          <Link href="/blog" className="hover:text-[hsl(var(--ark-amber))] transition-colors">
            BLOG
          </Link>
          <Link href="/friends" className="hover:text-[hsl(var(--ark-amber))] transition-colors">
            FRIENDS
          </Link>
        </div>

        {daysOnline > 0 && (
          <p className="text-[10px] text-muted-foreground/30 tracking-wider">
            D05的岛屿已存在 {daysOnline} 天
          </p>
        )}
        <p className="text-[10px] text-muted-foreground/40 tracking-wider">
          &copy; {new Date().getFullYear()} D05 — Built with Next.js
        </p>
      </div>
    </footer>
  )
}
