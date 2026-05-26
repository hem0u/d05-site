import { NextResponse } from "next/server"
import { sql, HAS_DB } from "@/lib/db"

export async function GET() {
  if (!HAS_DB) return NextResponse.json({ error: "no database configured" }, { status: 500 })

  const results: Record<string, unknown> = {}

  // 1. Check if role column exists
  try {
    const cols = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `
    results.columns = cols.rows
    const hasRole = cols.rows.some((r: Record<string, unknown>) => r.column_name === "role")
    results.hasRoleColumn = hasRole
  } catch (e) {
    results.columnsError = String(e)
  }

  // 2. Run migration explicitly
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'`
    results.migration = "success"
  } catch (e) {
    results.migrationError = String(e)
  }

  // 3. Verify after migration
  try {
    const verify = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'role'
    `
    results.roleExistsAfter = verify.rows.length > 0
  } catch (e) {
    results.verifyError = String(e)
  }

  // 4. Check existing users
  try {
    const users = await sql`SELECT id, email, role FROM users LIMIT 5`
    results.users = users.rows
  } catch (e) {
    results.usersError = String(e)
  }

  return NextResponse.json(results)
}
