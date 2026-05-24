import { sql, HAS_DB } from "@/lib/db"
import { blogPosts as fallback } from "@/data/blog-posts"
import type { BlogPost } from "@/data/blog-posts"

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!HAS_DB) return fallback
  const { rows } = await sql<BlogPost>`
    SELECT slug, title, excerpt, date, tags, content
    FROM blog_posts ORDER BY date DESC
  `
  return rows
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!HAS_DB) return fallback.find((p) => p.slug === slug) ?? null
  const { rows } = await sql<BlogPost>`
    SELECT slug, title, excerpt, date, tags, content
    FROM blog_posts WHERE slug = ${slug}
  `
  return rows[0] ?? null
}

export async function getAllTags(): Promise<string[]> {
  if (!HAS_DB) {
    return Array.from(new Set(fallback.flatMap((p) => p.tags))).sort()
  }
  const { rows } = await sql<{ tag: string }>`
    SELECT DISTINCT unnest(tags) AS tag FROM blog_posts ORDER BY tag
  `
  return rows.map((r) => r.tag)
}
