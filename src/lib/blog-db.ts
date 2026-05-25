import { sql } from "@/lib/db"
import { toPgArray } from "@/lib/utils"
import { blogPosts as fallback } from "@/data/blog-posts"
import type { BlogPost } from "@/data/blog-posts"

let seeded = false

async function withFallback<T>(fn: () => Promise<T>, fallbackValue: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallbackValue
  }
}

async function ensureSeeded() {
  if (seeded) return
  try {
    const { rows } = await sql`SELECT count(*) as c FROM blog_posts`
    if (Number(rows[0].c) > 0) { seeded = true; return }
    for (const post of fallback) {
      await sql`
        INSERT INTO blog_posts (slug, title, excerpt, date, tags, content)
        VALUES (${post.slug}, ${post.title}, ${post.excerpt}, ${post.date}, ${toPgArray(post.tags)}, ${post.content})
        ON CONFLICT (slug) DO NOTHING
      `
    }
    seeded = true
  } catch { /* table might not exist yet; will retry next request */ }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  await ensureSeeded()
  return withFallback(async () => {
    const { rows } = await sql<BlogPost>`
      SELECT slug, title, excerpt, date, tags, content
      FROM blog_posts ORDER BY date DESC
    `
    return rows
  }, fallback)
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  await ensureSeeded()
  return withFallback(async () => {
    const { rows } = await sql<BlogPost>`
      SELECT slug, title, excerpt, date, tags, content
      FROM blog_posts WHERE slug = ${slug}
    `
    return rows[0] ?? null
  }, fallback.find((p) => p.slug === slug) ?? null)
}

export async function getAllTags(): Promise<string[]> {
  return withFallback(async () => {
    const { rows } = await sql<{ tag: string }>`
      SELECT DISTINCT unnest(tags) AS tag FROM blog_posts ORDER BY tag
    `
    return rows.map((r) => r.tag)
  }, Array.from(new Set(fallback.flatMap((p) => p.tags))).sort())
}
