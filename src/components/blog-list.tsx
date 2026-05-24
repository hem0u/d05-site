"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import { BlogEditor } from "@/components/blog-editor"
import type { BlogPost } from "@/data/blog-posts"

const PAGE_SIZE = 4

export function BlogList({ posts: blogPosts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(false)

  const allTags = useMemo(
    () => Array.from(new Set(blogPosts.flatMap((p) => p.tags))).sort(),
    [blogPosts]
  )

  const filtered = useMemo(() => {
    const byTag = activeTag
      ? blogPosts.filter((p) => p.tags.includes(activeTag))
      : blogPosts

    const q = query.trim().toLowerCase()
    const bySearch = q
      ? byTag.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q)
        )
      : byTag

    return bySearch.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [activeTag, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // Reset page when filters change
  const setTag = (tag: string | null) => {
    setActiveTag(tag)
    setPage(1)
  }
  const setSearch = (q: string) => {
    setQuery(q)
    setPage(1)
  }

  return (
    <>
      {/* Search + tag row + write button */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        {/* Search input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/30 pointer-events-none" />
          <input
            type="text"
            placeholder="搜索文章..."
            value={query}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-muted/30 border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground/25 outline-none focus:border-[hsl(var(--ark-amber)/0.3)] transition-colors"
          />
          {query && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              ESC
            </button>
          )}
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap justify-center gap-1.5">
          <button
            onClick={() => setTag(null)}
            className={`px-3 py-1 text-[10px] tracking-widest uppercase rounded-sm transition-all ${
              activeTag === null
                ? "bg-[hsl(var(--ark-amber))] text-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ALL
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTag(tag === activeTag ? null : tag)}
              className={`px-3 py-1 text-[10px] tracking-widest uppercase rounded-sm transition-all ${
                tag === activeTag
                  ? "bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] ring-1 ring-[hsl(var(--ark-amber)/0.3)]"
                  : "text-muted-foreground/60 hover:text-muted-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Write button — pushed to the right on desktop */}
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-widest uppercase rounded-full border border-border/40 text-muted-foreground/70 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.5)] transition-all sm:ml-auto"
        >
          <Plus className="h-3 w-3" />
          写文章
        </button>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-3 opacity-30">&#128269;</p>
          <p className="text-muted-foreground/40 text-sm">
            {query ? `没有找到包含 "${query}" 的文章` : "该标签下还没有文章"}
          </p>
        </div>
      ) : (
        <>
          {/* Result count */}
          <p className="text-[10px] text-muted-foreground/30 tracking-wider mb-4">
            {filtered.length} 篇文章
            {query && ` · 搜索 "${query}"`}
            {activeTag && ` · 标签 "${activeTag}"`}
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {paged.map((post, i) => (
              <div
                key={post.slug}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <BlogCard post={post} featured={i === 0 && activeTag === null && !query && page === 1} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] tracking-widest uppercase rounded-full border border-border/20 text-muted-foreground/50 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.3)] transition-all disabled:opacity-15 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3 w-3" />
                上一页
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-7 h-7 rounded-full text-[10px] font-mono transition-all ${
                      n === safePage
                        ? "bg-[hsl(var(--ark-amber)/0.1)] text-[hsl(var(--ark-amber))] border border-[hsl(var(--ark-amber)/0.3)]"
                        : "text-muted-foreground/40 hover:text-muted-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] tracking-widest uppercase rounded-full border border-border/20 text-muted-foreground/50 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.3)] transition-all disabled:opacity-15 disabled:cursor-not-allowed"
              >
                下一页
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </>
      )}

      {editing && (
        <BlogEditor
          onClose={() => setEditing(false)}
          onSaved={() => router.refresh()}
        />
      )}
    </>
  )
}
