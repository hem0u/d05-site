import { readFileSync } from "fs"
import { resolve } from "path"

// Manually load .env.local
const envPath = resolve(process.cwd(), ".env.local")
try {
  const content = readFileSync(envPath, "utf-8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    const value = trimmed.slice(eq + 1)
    if (!process.env[key]) process.env[key] = value
  }
} catch {}

console.log("POSTGRES_URL set:", !!process.env.POSTGRES_URL)

// Dynamic import to load after env is set
const { seed } = await import("../src/lib/seed.ts")
await seed()
console.log("Seed complete.")
