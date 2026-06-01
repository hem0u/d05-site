import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "d05-dev-secret-change-in-production-min-32-chars!!"
)

const COOKIE_NAME = "d05-token"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function signToken(payload: { userId: number; role?: string; tokenVersion?: number }): Promise<string> {
  return new SignJWT({
    sub: String(payload.userId),
    role: payload.role ?? "user",
    ver: payload.tokenVersion ?? 0,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<{ userId: number; tokenVersion: number } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { userId: Number(payload.sub), tokenVersion: Number(payload.ver ?? 0) }
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie() {
  const store = await cookies()
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value ?? null
}

export async function getCurrentUserId(): Promise<number | null> {
  const token = await getAuthToken()
  if (!token) return null
  const result = await verifyToken(token)
  if (!result) return null
  // Verify token_version hasn't been invalidated (e.g., password changed)
  try {
    const { rows } = await sql`SELECT token_version FROM users WHERE id = ${result.userId}`
    if (rows.length === 0 || Number(rows[0].token_version) !== result.tokenVersion) return null
  } catch {
    // If DB is down, still allow the token (graceful degradation)
  }
  return result.userId
}

export async function getRoleFromToken(): Promise<string | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return (payload.role as string) ?? null
  } catch {
    return null
  }
}

export async function getCurrentUserRole(): Promise<string | null> {
  // Fast path: read role from JWT
  const role = await getRoleFromToken()
  if (role) return role
  // Fallback: DB query for old tokens without role
  const userId = await getCurrentUserId()
  if (!userId) return null
  try {
    const { rows } = await sql`SELECT role FROM users WHERE id = ${userId}`
    return rows.length > 0 ? rows[0].role : null
  } catch {
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  const role = await getRoleFromToken()
  if (role) return role === "admin"
  // Fallback for old tokens
  return (await getCurrentUserRole()) === "admin"
}
