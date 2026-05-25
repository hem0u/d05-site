import { sql } from "@/lib/db"
import { toPgArray } from "@/lib/utils"
import { blogPosts as fallback } from "@/data/blog-posts"
import type { BlogPost } from "@/data/blog-posts"

let seeded = false

async function ensureSeeded() {
  if (seeded) return
  try {
    await sql`CREATE TABLE IF NOT EXISTS blog_posts (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL,
      tags TEXT[] NOT NULL DEFAULT '{}',
      content TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
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
  } catch (e) {
    console.error("[blog-db] ensureSeeded failed:", e)
  }
}

async function withDbFallback<T>(fn: () => Promise<T>, fallbackValue: T): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await ensureSeeded()
      return await fn()
    } catch (e) {
      if (attempt === 2) {
        console.error("[blog-db] all 3 attempts failed, using fallback:", e)
        return fallbackValue
      }
      console.error(`[blog-db] attempt ${attempt + 1}/3 failed, retrying:`, e)
      await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)))
    }
  }
  return fallbackValue
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return withDbFallback(async () => {
    const { rows } = await sql<BlogPost>`
      SELECT slug, title, excerpt, date, tags, content
      FROM blog_posts ORDER BY date DESC
    `
    return rows
  }, fallback)
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return withDbFallback(async () => {
    const { rows } = await sql<BlogPost>`
      SELECT slug, title, excerpt, date, tags, content
      FROM blog_posts WHERE slug = ${slug}
    `
    return rows[0] ?? null
  }, fallback.find((p) => p.slug === slug) ?? null)
}

export async function getAllTags(): Promise<string[]> {
  return withDbFallback(async () => {
    const { rows } = await sql<{ tag: string }>`
      SELECT DISTINCT unnest(tags) AS tag FROM blog_posts ORDER BY tag
    `
    return rows.map((r) => r.tag)
  }, Array.from(new Set(fallback.flatMap((p) => p.tags))).sort())
}
