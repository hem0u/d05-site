import { sql } from "@vercel/postgres"
import { ensureTables } from "@/lib/db"
import { toPgArray } from "@/lib/utils"
import { blogPosts } from "@/data/blog-posts"
import { friends } from "@/data/friends"
import { hobbies } from "@/data/hobbies"

export async function seed() {
  console.log("Seeding database...")
  await ensureTables()

  // Seed blog posts
  for (const post of blogPosts) {
    await sql`
      INSERT INTO blog_posts (slug, title, excerpt, date, tags, content)
      VALUES (${post.slug}, ${post.title}, ${post.excerpt}, ${post.date}, ${toPgArray(post.tags)}, ${post.content})
      ON CONFLICT (slug) DO NOTHING
    `
  }
  console.log(`  Blog: ${blogPosts.length} posts seeded`)

  // Seed friends
  for (const friend of friends) {
    await sql`
      INSERT INTO friends (name, url, description, avatar)
      VALUES (${friend.name}, ${friend.url}, ${friend.description}, ${friend.avatar ?? null})
      ON CONFLICT (name) DO NOTHING
    `
  }
  console.log(`  Friends: ${friends.length} links seeded`)

  // Seed hobbies
  for (const h of hobbies) {
    await sql`
      INSERT INTO hobbies (id, name, category, brief, detail, image)
      VALUES (${h.id}, ${h.name}, ${h.category}, ${h.brief}, ${h.detail}, ${h.image})
      ON CONFLICT (id) DO NOTHING
    `
  }
  console.log(`  Hobbies: ${hobbies.length} items seeded`)

  console.log("Seed complete.")
}
