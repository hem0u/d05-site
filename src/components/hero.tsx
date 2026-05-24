"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowDown, Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { profile } from "@/data/profile"
import { HexGrid, Sparkles, DriftingPetals, FloatingChibi, CornerDeco, ArkDiamond } from "@/components/decorations"
import { blogPosts } from "@/data/blog-posts"
import { projects } from "@/data/projects"

const TYPEWRITER_TEXT = profile.subtitle

function FloatingOrbs() {
  const orbs = Array.from({ length: 18 }).map((_, i) => ({
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: 30 + Math.random() * 70,
    delay: Math.random() * 6,
    duration: Math.random() * 8 + 6,
    drift: (Math.random() - 0.5) * 30,
    color: i % 3 === 0 ? "amber" : i % 3 === 1 ? "blue" : "pink",
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${o.size}px`,
            height: `${o.size}px`,
            left: `${o.x}%`,
            top: `${o.y}%`,
            opacity: 0,
            animation: `orb-float ${o.duration}s ${o.delay}s ease-in-out infinite`,
            ["--drift" as string]: `${o.drift}px`,
            backgroundColor: o.color === "amber" ? "rgba(245,158,11,0.7)" : o.color === "blue" ? "rgba(59,130,246,0.6)" : "rgba(255,183,197,0.7)",
            boxShadow: o.color === "amber" ? "0 0 10px rgba(245,158,11,0.5)" : o.color === "blue" ? "0 0 10px rgba(59,130,246,0.4)" : "0 0 10px rgba(255,183,197,0.5)",
          }}
        />
      ))}
    </div>
  )
}

function DiamondRings() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {[20, 45, 72, 88].map((top, i) => (
        <div
          key={i}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: `${top}%`, animation: `ring-expand 5s ${i * 1.2}s ease-out infinite` }}
        >
          <div
            className="border border-[hsl(var(--ark-amber)/0.3)]"
            style={{
              width: "30px", height: "30px", transform: "rotate(45deg)", opacity: 0,
              animation: `ring-fade 5s ${i * 1.2}s ease-out infinite`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    // Wait for boot screen to finish before typing starts
    const start = setTimeout(() => setStarted(true), 3500)
    return () => clearTimeout(start)
  }, [])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      i++
      if (i <= text.length) {
        setDisplayed(text.slice(0, i))
      } else {
        clearInterval(interval)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-sm mx-auto">
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-3.5 bg-[hsl(var(--ark-amber)/0.6)] ml-0.5 animate-pulse align-[-2px]" />
      )}
    </p>
  )
}

function calcDays(siteStart: string | undefined): number {
  if (!siteStart) return 1
  const [y, m, d] = siteStart.split("-").map(Number)
  const startDay = new Date(y, m - 1, d).getTime()
  const now = new Date()
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.floor((nowDay - startDay) / 86400000) + 1
}

export function Hero() {
  const [daysRunning, setDaysRunning] = useState(() => calcDays(profile.siteStart))

  useEffect(() => {
    const update = () => setDaysRunning(calcDays(profile.siteStart))
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { label: "Days Running", value: daysRunning },
    { label: "Blog Posts", value: blogPosts.length },
    { label: "Projects", value: projects.length },
  ]

  const latestPost = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

  return (
    <section id="hero" className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 text-center overflow-hidden vignette snap-start">
      {/* Ambient background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/images/art-01.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-20"
          style={{ filter: "blur(80px) saturate(0.8)", animation: "bg-drift 20s ease-in-out infinite alternate" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>

      <HexGrid opacity={0.04} />
      <FloatingOrbs />
      <DiamondRings />
      <Sparkles count={50} />
      <DriftingPetals count={20} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <FloatingChibi side="left" />
      <FloatingChibi side="right" />

      {/* Rotating large faint hex outlines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[[15, 20, 140], [70, 60, 100], [40, 75, 120]].map(([x, y, size], i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${x}%`, top: `${y}%`,
              width: `${size}px`, height: `${size}px`,
              opacity: 0.03,
              animation: `hex-spin ${20 + i * 5}s linear infinite`,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="#F59E0B" strokeWidth="1" />
            </svg>
          </div>
        ))}
      </div>

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-[hsl(var(--ark-blue)/0.06)] blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-16 h-48 w-48 rounded-full bg-[hsl(var(--ark-amber)/0.06)] blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-[hsl(var(--ark-blue)/0.04)] blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/4 right-1/4 h-36 w-36 rounded-full bg-[hsl(var(--ark-amber)/0.04)] blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/3 left-1/2 h-40 w-40 rounded-full bg-[hsl(var(--ark-blue)/0.04)] blur-3xl animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Main content — centered layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 animate-slide-up">

        {/* ── Edge HUD overlays: no cards, just floating text ── */}
        {/* Left edge: stats */}
        <div className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <div className="flex flex-col gap-6 opacity-30" style={{ animation: "fade-slide-up 0.6s ease-out 0.3s both" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-4 h-px bg-amber-400/60" />
                <div>
                  <span className="font-mono text-xl font-bold text-amber-400/80 tabular-nums">{stat.value}</span>
                  <span className="text-[9px] text-muted-foreground tracking-wider ml-2">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right edge: latest post + nav */}
        <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto z-10">
          <div className="flex flex-col gap-5 opacity-35" style={{ animation: "fade-slide-up 0.6s ease-out 0.4s both" }}>
            {latestPost && (
              <a href={`/blog/${latestPost.slug}`} className="group text-right hover:opacity-100 transition-opacity pointer-events-auto">
                <p className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase mb-1.5">Latest Post</p>
                <p className="text-xs text-muted-foreground/70 group-hover:text-[hsl(var(--ark-blue))] transition-colors max-w-[160px] ml-auto leading-relaxed">
                  {latestPost.title}
                </p>
                <div className="flex items-center justify-end gap-2 mt-1.5">
                  <div className="w-3 h-px bg-blue-400/40" />
                  <ArkDiamond size={4} />
                </div>
              </a>
            )}
            <div className="flex items-center justify-end gap-3 text-[9px] tracking-[0.2em] text-muted-foreground/50">
              <a href="#about" className="hover:text-[hsl(var(--ark-amber))] transition-colors pointer-events-auto">About</a>
              <span className="text-border">/</span>
              <a href="#projects" className="hover:text-[hsl(var(--ark-amber))] transition-colors pointer-events-auto">Works</a>
              <span className="text-border">/</span>
              <Link href="/blog" className="hover:text-[hsl(var(--ark-amber))] transition-colors pointer-events-auto">Blog</Link>
            </div>
          </div>
        </div>

        {/* ── Center column ── */}
        <div className="flex flex-col items-center text-center gap-14">
            {/* Diamond frame around avatar */}
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)", animation: "aura-pulse 3s ease-in-out infinite" }}
              />
              <div
                className="absolute -inset-8 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", animation: "aura-pulse 3s ease-in-out 1.5s infinite" }}
              />
              <div
                className="absolute -inset-3 border-2 border-[hsl(var(--ark-amber)/0.3)]"
                style={{ transform: "rotate(45deg)", animation: "diamond-spin 12s linear infinite" }}
              />
              <div className="absolute -top-1 -right-2" style={{ animation: "accent-float 3s ease-in-out infinite" }}>
                <ArkDiamond size={8} filled />
              </div>
              <div className="absolute -bottom-2 -left-1" style={{ animation: "accent-float 3s ease-in-out 1s infinite" }}>
                <ArkDiamond size={6} filled />
              </div>
              <div className="relative h-28 w-28 rounded-full flex flex-col items-center justify-center gap-0.5">
                <span
                  className="font-serif text-3xl font-black tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, hsl(38 92% 60%), hsl(38 92% 45%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 20px rgba(245,158,11,0.15))",
                  }}
                >
                  {profile.nickname}
                </span>
                <div className="flex items-center gap-1.5 opacity-30">
                  <div className="w-3 h-px bg-amber-400" />
                  <ArkDiamond size={5} filled />
                  <div className="w-3 h-px bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 ark-line origin-right" style={{ animation: "line-stretch 3s ease-in-out infinite" }} />
                <div style={{ animation: "diamond-pop 3s ease-in-out infinite" }}>
                  <ArkDiamond size={12} filled />
                </div>
                <p className="text-xs font-medium text-muted-foreground tracking-[0.3em] uppercase">{profile.name}</p>
                <div style={{ animation: "diamond-pop 3s ease-in-out 0.5s infinite" }}>
                  <ArkDiamond size={12} filled />
                </div>
                <div className="w-8 ark-line origin-left" style={{ animation: "line-stretch 3s ease-in-out 0.3s infinite" }} />
              </div>
              <p className="text-sm text-muted-foreground tracking-widest uppercase" style={{ animation: "fade-slide-up 0.6s ease-out 0.2s both" }}>
                {profile.title}
              </p>
              <div className="pt-2">
                <TypewriterText text={TYPEWRITER_TEXT} />
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2" style={{ animation: "fade-slide-up 0.6s ease-out 0.4s both" }}>
              {profile.social.github && (
                <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full hover:text-[hsl(var(--ark-blue))] transition-all duration-300 hover:scale-110">
                    <Github className="h-5 w-5" />
                  </Button>
                </a>
              )}
              {profile.social.bilibili && (
                <a href={profile.social.bilibili} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full hover:text-[hsl(var(--ark-blue))] transition-all duration-300 hover:scale-110">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
                    </svg>
                  </Button>
                </a>
              )}
              {profile.social.email && (
                <a href={`mailto:${profile.social.email}`}>
                  <Button variant="ghost" size="icon" className="rounded-full hover:text-[hsl(var(--ark-amber))] transition-all duration-300 hover:scale-110">
                    <Mail className="h-5 w-5" />
                  </Button>
                </a>
              )}
            </div>

            {/* HUD status line */}
            <div className="flex items-center gap-3" style={{ animation: "fade-slide-up 0.6s ease-out 0.5s both" }}>
              <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse" />
                <span>Online</span>
              </div>
              <div className="w-px h-3 bg-border/30" />
              <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40">
                <span>Contract</span>
                <span className="text-[hsl(var(--ark-amber))]/60">OPEN</span>
              </div>
              {profile.now && (
                <>
                  <div className="w-px h-3 bg-border/30" />
                  <div className="hidden sm:flex items-center gap-2 text-[9px] tracking-[0.1em] text-muted-foreground/35">
                    <span>Watching</span>
                    <span className="text-muted-foreground/50">{profile.now.watching}</span>
                  </div>
                </>
              )}
            </div>

            <a href="#about">
              <Button variant="ghost" size="icon" className="rounded-full animate-bounce-gentle group mt-2">
                <ArrowDown className="h-5 w-5 text-muted-foreground group-hover:text-[hsl(var(--ark-amber))] transition-colors" />
              </Button>
            </a>
          </div>

        {/* Bottom accent */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-30">
          <div className="w-16 ark-line" style={{ animation: "line-stretch 3s ease-in-out infinite" }} />
          <div style={{ animation: "diamond-pop 3s ease-in-out 0.5s infinite" }}>
            <ArkDiamond size={8} />
          </div>
          <div className="w-16 ark-line" style={{ animation: "line-stretch 3s ease-in-out 0.3s infinite" }} />
        </div>
      </div>

      <style>{`
        @keyframes orb-float {
          0% { opacity: 0; transform: translateY(0) translateX(0); }
          10% { opacity: 1; }
          80% { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-120px) translateX(var(--drift)); }
        }
        @keyframes ring-expand {
          0% { transform: translateX(-50%) scale(0.3); }
          100% { transform: translateX(-50%) scale(8); }
        }
        @keyframes ring-fade {
          0% { opacity: 0.8; }
          50% { opacity: 0.2; }
          100% { opacity: 0; }
        }
        @keyframes aura-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.25); opacity: 1; }
        }
        @keyframes diamond-spin {
          0% { transform: rotate(45deg); }
          100% { transform: rotate(405deg); }
        }
        @keyframes accent-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-6px) scale(1.2); opacity: 1; }
        }
        @keyframes diamond-pop {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          25% { transform: scale(2); opacity: 1; }
          50% { transform: scale(1); opacity: 0.6; }
        }
        @keyframes line-stretch {
          0%, 100% { transform: scaleX(1); opacity: 0.4; }
          50% { transform: scaleX(2.5); opacity: 1; }
        }
        @keyframes name-glow {
          0%, 100% { text-shadow: 0 0 0 transparent; }
          50% { text-shadow: 0 0 40px rgba(245,158,11,0.5), 0 0 80px rgba(59,130,246,0.3); }
        }

        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bg-drift {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.05) translate(-1%, -0.5%); }
        }
        @keyframes hex-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
