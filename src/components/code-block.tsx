"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CodeBlock({ html, code, language }: { html: string; code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="relative group my-8 rounded-xl border border-border/30 bg-[hsl(225,20%,4%)] dark:bg-[hsl(225,20%,4%)] overflow-hidden">
      {/* Arknights-style top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-[hsl(var(--ark-blue)/0.6)] via-[hsl(var(--ark-amber)/0.3)] to-transparent" />

      {/* Header row */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/10">
        <span className="w-2 h-2 rounded-full bg-[hsl(var(--ark-amber)/0.5)]" />
        <span className="flex-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium">
          {language || "code"}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] text-muted-foreground/30 hover:text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.08)] transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
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

      {/* Code area */}
      <div className="relative">
        {/* Line numbers gutter (decorative left stripe) */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[hsl(var(--ark-blue)/0.12)]" />
        <pre className="overflow-x-auto p-5 pl-7 m-0 text-sm leading-relaxed font-mono text-[hsl(220,10%,78%)] bg-transparent">
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>

      {/* Bottom accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--ark-amber)/0.1)] to-transparent" />
    </div>
  )
}
