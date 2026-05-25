"use client"

import { useState, useEffect } from "react"

const BOOT_LINES = [
  "> INITIALIZING CORE SYSTEMS...",
  "> LOADING MODULE: RHODES ISLAND PROTOCOL",
  "> ESTABLISHING SECURE CONNECTION...",
  "> AUTHENTICATING OPERATOR D05...",
  "> ORIPATHY MONITOR: NOMINAL",
  "> ALL SYSTEMS ONLINE",
]

const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\`~"
const FINAL_TEXT = "RHODES ISLAND"

export function BootScreen() {
  const [phase, setPhase] = useState<"boot" | "glitch" | "fadeout" | "done">("boot")
  const [progress, setProgress] = useState(0)
  const [visibleLines, setVisibleLines] = useState(0)
  const [titleText, setTitleText] = useState("")
  const [titleDone, setTitleDone] = useState(false)

  // Scramble-to-text effect for RHODES ISLAND
  useEffect(() => {
    if (titleDone) return
    let frame = 0
    const maxFrames = 20
    const interval = setInterval(() => {
      frame++
      if (frame >= maxFrames) {
        setTitleText(FINAL_TEXT)
        setTitleDone(true)
        clearInterval(interval)
      } else {
        // Gradually reveal correct characters
        const revealCount = Math.floor((frame / maxFrames) * FINAL_TEXT.length)
        let result = ""
        for (let i = 0; i < FINAL_TEXT.length; i++) {
          if (i < revealCount) {
            result += FINAL_TEXT[i]
          } else {
            result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }
        }
        setTitleText(result)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [titleDone])

  useEffect(() => {
    // Skip only in production if already played this session
    const key = "boot-played-v3"
    const played = sessionStorage.getItem(key)
    if (played && process.env.NODE_ENV === "production") {
      setPhase("done")
      return
    }
    if (!played) sessionStorage.setItem(key, "1")

    let progressDone = false
    let linesDone = false
    const allLines = BOOT_LINES.length

    const tryFinish = () => {
      if (progressDone && linesDone) {
        setPhase("glitch")
        setTimeout(() => setPhase("fadeout"), 300)
        setTimeout(() => setPhase("done"), 1300) // 300 glitch + 900 fade + 100 buffer
      }
    }

    // Progress: fast start, then slow, then fast finish
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval)
          if (!progressDone) {
            progressDone = true
            setTimeout(tryFinish, 0)
          }
          return 100
        }
        if (p < 30) return p + Math.random() * 12 + 6
        if (p < 70) return p + Math.random() * 6 + 2
        if (p < 95) return p + Math.random() * 3 + 1
        return p + 0.5
      })
    }, 70)

    // Log lines appear sequentially
    const lineTimers = BOOT_LINES.map((_, i) =>
      setTimeout(() => {
        setVisibleLines(i + 1)
        if (i + 1 >= allLines) {
          linesDone = true
          setTimeout(tryFinish, 0)
        }
      }, 200 + i * 220),
    )

    return () => {
      clearInterval(progressInterval)
      lineTimers.forEach(clearTimeout)
    }
  }, [])

  if (phase === "done") return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden ${
        phase === "fadeout" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ transition: "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)" }}
    >
      {/* Glitch overlay bars */}
      {phase === "glitch" && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {[0, 15, 30, 50, 70, 85].map((y) => (
            <div
              key={y}
              className="absolute left-0 right-0 h-[2px] bg-amber-500/60"
              style={{
                top: `${y}%`,
                animation: `glitch-bar 0.15s ease-in-out ${Math.random() * 0.3}s`,
              }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(transparent 0%, rgba(245,158,11,0.08) 50%, transparent 100%)",
              animation: "glitch-shift 0.3s ease-in-out",
            }}
          />
        </div>
      )}

      {/* Scanline effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0 animate-scan"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-500"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
              animation: `particle-float ${Math.random() * 4 + 3}s ${Math.random() * 3}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 flex items-center gap-2 opacity-50 z-10">
        <div className="w-3 h-3 rotate-45 border border-amber-500 animate-pulse" />
        <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-2 opacity-50 z-10">
        <div className="w-8 h-px bg-gradient-to-l from-amber-500 to-transparent" />
        <div className="w-3 h-3 rotate-45 border border-amber-500 animate-pulse" />
      </div>
      <div className="absolute bottom-6 left-6 flex items-center gap-2 opacity-50 z-10">
        <div className="w-3 h-3 rotate-45 border border-amber-500 animate-pulse" />
        <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
      </div>
      <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-50 z-10">
        <div className="w-8 h-px bg-gradient-to-l from-amber-500 to-transparent" />
        <div className="w-3 h-3 rotate-45 border border-amber-500 animate-pulse" />
      </div>

      {/* Main boot content */}
      <div className="relative z-10 flex flex-col items-center gap-7">
        {/* Animated diamond logo */}
        <div className="relative">
          {/* Outer ring */}
          <div
            className="w-20 h-20 rotate-45 border-2 border-amber-500/40"
            style={{ animation: "diamond-ring 2s ease-in-out infinite" }}
          />
          {/* Main diamond */}
          <div
            className="absolute inset-0 w-20 h-20 rotate-45 border-2 border-amber-500"
            style={{
              animation: "diamond-pulse 1s ease-in-out infinite",
              boxShadow: "0 0 30px rgba(245,158,11,0.3), inset 0 0 30px rgba(245,158,11,0.1)",
            }}
          />
          {/* Inner glow */}
          <div
            className="absolute inset-0 w-20 h-20 rotate-45 bg-amber-500/10"
            style={{ animation: "diamond-inner 1.5s ease-in-out infinite" }}
          />
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-amber-500 text-sm font-bold tracking-[0.3em]"
              style={{ animation: "text-glow 2s ease-in-out infinite" }}
            >
              D05
            </span>
          </div>
        </div>

        {/* Title: scramble text effect */}
        <div className="text-center space-y-1">
          <p
            className={`text-amber-500/90 text-sm tracking-[0.4em] font-mono h-5 ${
              titleDone ? "" : ""
            }`}
          >
            {titleText || " "}
          </p>
          <p
            className="text-amber-500/40 text-[10px] tracking-[0.3em] font-mono"
            style={{
              opacity: titleDone ? 1 : 0,
              transition: "opacity 0.3s ease-in",
            }}
          >
            SYSTEM BOOT SEQUENCE v3.7.1
          </p>
        </div>

        {/* System log lines */}
        <div className="w-72 space-y-1 font-mono">
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-2 overflow-hidden"
              style={{
                opacity: i < visibleLines ? 1 : 0,
                transform: i < visibleLines ? "translateY(0)" : "translateY(4px)",
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                height: i < visibleLines ? "auto" : 0,
              }}
            >
              <span className="text-amber-500/60 text-[9px] tracking-wider whitespace-nowrap shrink-0">
                [{i + 1}]
              </span>
              <span
                className={`text-[9px] tracking-wider whitespace-nowrap ${
                  i === visibleLines - 1
                    ? "text-amber-500/80"
                    : i === BOOT_LINES.length - 1 && i < visibleLines
                      ? "text-green-400/80"
                      : "text-amber-500/50"
                }`}
              >
                {line}
                {i === visibleLines - 1 && (
                  <span className="inline-block w-1.5 h-3 bg-amber-500/70 ml-0.5 animate-pulse align-middle" />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-56 space-y-1.5">
          <div className="h-px bg-amber-500/15 relative overflow-hidden rounded-full">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500/80 via-amber-500 to-amber-400 rounded-full transition-[width] duration-75"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 8px rgba(245,158,11,0.4)",
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono tracking-wider">
            <span className="text-amber-500/40">LOADING</span>
            <span className="text-amber-500/60">{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Status indicator */}
        <div
          className="flex items-center gap-2"
          style={{
            opacity: progress >= 95 ? 1 : 0,
            transition: "opacity 0.5s ease-out",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400/70 text-[9px] tracking-[0.2em] font-mono">
            CONNECTION ESTABLISHED
          </span>
        </div>
      </div>

      {/* Inline styles for all keyframes */}
      <style>{`
        @keyframes diamond-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(245,158,11,0.2), inset 0 0 20px rgba(245,158,11,0.05);
            border-color: rgba(245,158,11,0.6);
          }
          50% {
            box-shadow: 0 0 50px rgba(245,158,11,0.5), inset 0 0 40px rgba(245,158,11,0.2);
            border-color: rgba(245,158,11,1);
          }
        }
        @keyframes diamond-ring {
          0%, 100% {
            transform: rotate(45deg) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: rotate(45deg) scale(1.15);
            opacity: 0.7;
          }
        }
        @keyframes diamond-inner {
          0%, 100% { opacity: 0.1; transform: rotate(45deg) scale(0.85); }
          50% { opacity: 0.3; transform: rotate(45deg) scale(1); }
        }
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 4px rgba(245,158,11,0.3); }
          50% { text-shadow: 0 0 12px rgba(245,158,11,0.7); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes particle-float {
          0% { opacity: 0; transform: translateY(0) translateX(0); }
          20% { opacity: 0.7; }
          80% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-60px) translateX(10px); }
        }
        @keyframes glitch-bar {
          0% { transform: translateX(-30%); opacity: 0.8; }
          50% { transform: translateX(20%); opacity: 0.3; }
          100% { transform: translateX(0); opacity: 0.6; }
        }
        @keyframes glitch-shift {
          0% { transform: translateX(-5px) skewX(-2deg); }
          33% { transform: translateX(5px) skewX(2deg); }
          66% { transform: translateX(-3px); }
          100% { transform: translateX(0) skewX(0); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  )
}
