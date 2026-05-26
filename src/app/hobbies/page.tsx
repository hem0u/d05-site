import type { Metadata } from "next"
import { HobbiesContent } from "@/components/hobbies-content"
import { getHobbies, getHobbyCategories } from "@/lib/hobbies-db"
import { ensureTables } from "@/lib/db"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "好物 — D05",
  description: "我喜欢的东西，每一件都是生活的一部分。",
}

export default async function HobbiesPage() {
  await ensureTables()
  const [hobbies, categories] = await Promise.all([getHobbies(), getHobbyCategories()])
  return <HobbiesContent hobbies={hobbies} categories={categories} />
}
