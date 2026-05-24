"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CodeBlock({ html, code, language }: { html: string; code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between px-4 py-1.5 bg-muted/60 rounded-t-xl border border-border/20 border-b-0">
        <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
          {language || "code"}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="p-1 rounded-md hover:bg-muted transition-colors"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3 text-muted-foreground/60" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 pt-3 text-sm bg-muted/40 rounded-b-xl border border-border/20 border-t-0">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}
