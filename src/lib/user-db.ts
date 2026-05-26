import { sql } from "@/lib/db"

export type User = {
  id: number
  email: string
  name: string
  avatar: string | null
  bio: string
  role: string
  createdAt: string
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const { rows } = await sql`
      SELECT id, email, name, avatar, bio, role, created_at as "createdAt"
      FROM users WHERE id = ${id}
    `
    if (rows.length === 0) return null
    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      avatar: rows[0].avatar,
      bio: rows[0].bio,
      role: rows[0].role,
      createdAt: rows[0].createdAt.toISOString(),
    }
  } catch (e) {
    console.error("[user-db] getUserById failed:", e)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { rows } = await sql`
      SELECT id, email, name, avatar, bio, role, created_at as "createdAt"
      FROM users WHERE email = ${email.toLowerCase()}
    `
    if (rows.length === 0) return null
    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      avatar: rows[0].avatar,
      bio: rows[0].bio,
      role: rows[0].role,
      createdAt: rows[0].createdAt.toISOString(),
    }
  } catch (e) {
    console.error("[user-db] getUserByEmail failed:", e)
    return null
  }
}

export async function createUser(email: string, name: string, passwordHash: string): Promise<User | null> {
  try {
    const { rows } = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email.toLowerCase()}, ${name}, ${passwordHash})
      RETURNING id, email, name, avatar, bio, created_at as "createdAt"
    `
    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      avatar: rows[0].avatar,
      bio: rows[0].bio,
      role: rows[0].role,
      createdAt: rows[0].createdAt.toISOString(),
    }
  } catch (e) {
    console.error("[user-db] createUser failed:", e)
    return null
  }
}

export async function updateProfile(
  id: number,
  data: { name?: string; avatar?: string; bio?: string },
): Promise<User | null> {
  try {
    const sets: string[] = []
    const vals: unknown[] = []
    let idx = 1

    if (data.name !== undefined) {
      sets.push(`name = $${idx++}`)
      vals.push(data.name)
    }
    if (data.avatar !== undefined) {
      sets.push(`avatar = $${idx++}`)
      vals.push(data.avatar)
    }
    if (data.bio !== undefined) {
      sets.push(`bio = $${idx++}`)
      vals.push(data.bio)
    }

    if (sets.length === 0) return getUserById(id)

    vals.push(id)
    const { rows } = await sql.query(
      `UPDATE users SET ${sets.join(", ")} WHERE id = $${idx} RETURNING id, email, name, avatar, bio, created_at as "createdAt"`,
      vals,
    )
    if (rows.length === 0) return null
    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      avatar: rows[0].avatar,
      bio: rows[0].bio,
      role: rows[0].role,
      createdAt: rows[0].createdAt.toISOString(),
    }
  } catch (e) {
    console.error("[user-db] updateProfile failed:", e)
    return null
  }
}

export async function getPasswordHash(email: string): Promise<string | null> {
  try {
    const { rows } = await sql`
      SELECT password_hash FROM users WHERE email = ${email.toLowerCase()}
    `
    if (rows.length === 0) return null
    return rows[0].password_hash
  } catch (e) {
    console.error("[user-db] getPasswordHash failed:", e)
    return null
  }
}

export async function saveVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await sql`
      INSERT INTO verification_codes (email, code, expires_at)
      VALUES (${email.toLowerCase()}, ${code}, ${expiresAt.toISOString()})
    `
    return true
  } catch (e) {
    console.error("[user-db] saveVerificationCode failed:", e)
    return false
  }
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  try {
    const { rows } = await sql`
      SELECT id FROM verification_codes
      WHERE email = ${email.toLowerCase()}
        AND code = ${code}
        AND used = FALSE
        AND expires_at > NOW()
      ORDER BY id DESC LIMIT 1
    `
    if (rows.length === 0) return false

    await sql`UPDATE verification_codes SET used = TRUE WHERE id = ${rows[0].id}`
    return true
  } catch (e) {
    console.error("[user-db] verifyCode failed:", e)
    return false
  }
}
