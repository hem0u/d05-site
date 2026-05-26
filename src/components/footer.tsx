"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, MessageSquareText } from "lucide-react"
import { ArkDiamond } from "@/components/decorations"
import { FeedbackModal } from "@/components/feedback-modal"
import { profile } from "@/data/profile"

const QUOTES = [
  "願わくば、その先に光がありますように",
  "明日もまた、ここで会おう",
  "たとえ世界が終わろうとも",
  "この瞬間は永遠だから",
  "ずっと、ずっと、一緒にいよう",
]

function calcDays(siteStart: string | undefined): number {
  if (!siteStart) return 1
  const [y, m, d] = siteStart.split("-").map(Number)
  const startDay = new Date(y, m - 1, d).getTime()
  const now = new Date()
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.floor((nowDay - startDay) / 86400000) + 1
}

export function Footer() {
  const [quote, setQuote] = useState(QUOTES[0])
  const [daysOnline, setDaysOnline] = useState(() => calcDays(profile.siteStart))
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
    if (!profile.siteStart) return
    const update = () => setDaysOnline(calcDays(profile.siteStart))
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
              </svg>
            </a>
          )}
          <button onClick={() => setFeedbackOpen(true)} className="p-1.5 text-muted-foreground/40 hover:text-[hsl(var(--ark-amber))] transition-colors">
            <MessageSquareText className="h-3.5 w-3.5" />
          </button>
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

        <p className="text-[10px] text-muted-foreground/30 tracking-wider">
          D05的岛屿已存在 {daysOnline} 天
        </p>
        <p className="text-[10px] text-muted-foreground/40 tracking-wider">
          &copy; {new Date().getFullYear()} D05 — Built with Next.js
          {/* Year from Date is stable across server/client for the same build */}
        </p>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </footer>
  )
}
