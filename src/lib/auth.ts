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

export async function signToken(payload: { userId: number }): Promise<string> {
  return new SignJWT({ sub: String(payload.userId) })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return Number(payload.sub)
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
  return verifyToken(token)
}

export async function getCurrentUserRole(): Promise<string | null> {
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
  const role = await getCurrentUserRole()
  return role === "admin"
}
