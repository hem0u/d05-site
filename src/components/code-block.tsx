"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CodeBlock({ html, code, language }: { html: string; code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="not-prose my-8 rounded-xl overflow-hidden" style={{ background: "#0b0d15", border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Top accent bar */}
      <div style={{ height: 2, background: "linear-gradient(90deg, rgba(96,165,250,0.4), rgba(245,158,11,0.2), transparent)" }} />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span className="w-2 h-2 rounded-full" style={{ background: "rgba(245,158,11,0.4)" }} />
        <span className="flex-1 text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>
          {language || "code"}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-all"
          style={{ color: copied ? "#4ade80" : "rgba(255,255,255,0.2)" }}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span className="tracking-wider">已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="tracking-wider">复制</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="relative" style={{ background: "#0b0d15" }}>
        <div className="absolute left-0 top-0 bottom-0" style={{ width: 1, background: "rgba(96,165,250,0.1)" }} />
        <pre className="m-0 overflow-x-auto p-5 pl-7 text-sm leading-relaxed font-mono" style={{ color: "#c8d0da", background: "#0b0d15" }}>
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>

      {/* Bottom accent */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.08), transparent)" }} />
    </div>
  )
}
