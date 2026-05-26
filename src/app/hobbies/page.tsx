import type { Metadata } from "next"
import { HobbiesContent } from "@/components/hobbies-content"

export const metadata: Metadata = {
  title: "好物 — D05",
  description: "我喜欢的东西，每一件都是生活的一部分。",
}

export default function HobbiesPage() {
  return <HobbiesContent />
}
