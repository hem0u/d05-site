"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit3 } from "lucide-react"
import { BlogEditor } from "@/components/blog-editor"
import type { BlogPost } from "@/data/blog-posts"

export function PostActions({ post }: { post: BlogPost }) {
  const [editing, setEditing] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] tracking-widest uppercase rounded-full border border-border/30 text-muted-foreground/40 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.4)] transition-all"
      >
        <Edit3 className="h-3 w-3" />
        编辑
      </button>

      {editing && (
        <BlogEditor
          existing={post}
          onClose={() => setEditing(false)}
          onSaved={() => { setEditing(false); router.refresh() }}
        />
      )}
    </>
  )
}
