import { sql } from "@vercel/postgres"

const HAS_DB = !!process.env.POSTGRES_URL || !!process.env.DATABASE_URL

export { sql, HAS_DB }

export async function ensureTables() {
  if (!HAS_DB) return

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL,
      tags TEXT[] NOT NULL DEFAULT '{}',
      content TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS friends (
      name TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      avatar TEXT DEFAULT NULL
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS diary_entries (
      id SERIAL PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL DEFAULT '',
      photos TEXT[] NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS guestbook_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS hobbies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      brief TEXT NOT NULL DEFAULT '',
      detail TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT ''
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS schedules (
      date TEXT PRIMARY KEY,
      content TEXT NOT NULL DEFAULT ''
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS changelog (
      id SERIAL PRIMARY KEY,
      date TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'update'
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      avatar TEXT DEFAULT NULL,
      bio TEXT DEFAULT '',
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  // Migration: add role column to existing users table
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'`
  } catch { /* column might already exist */ }

  // Migration: add user_id column to existing guestbook_messages table
  try {
    await sql`ALTER TABLE guestbook_messages ADD COLUMN IF NOT EXISTS user_id INTEGER`
  } catch { /* column might already exist */ }

  await sql`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS blog_likes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      post_slug TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, post_slug)
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS blog_comments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      post_slug TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS blog_views (
      post_slug TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    )
  `
}
