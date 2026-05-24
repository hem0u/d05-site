"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { BlogEditor } from "@/components/blog-editor"
import type { BlogPost } from "@/data/blog-posts"

export function BlogActions() {
  const [editing, setEditing] = useState(false)
  const router = useRouter()

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-widest uppercase rounded-full border border-border/40 text-muted-foreground/70 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.5)] transition-all"
        >
          <Plus className="h-3 w-3" />
          写文章
        </button>
      </div>

      {editing && (
        <BlogEditor
          onClose={() => setEditing(false)}
          onSaved={() => router.refresh()}
        />
      )}
    </>
  )
}
