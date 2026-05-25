import type { Metadata } from "next"
import { HexGrid, Sparkles, CornerDeco, ArkDiamond } from "@/components/decorations"
import { LinliFriends } from "@/components/linli-friends"
import { LinliGuestbook } from "@/components/linli-guestbook"
import { LinliUpdates } from "@/components/linli-updates"
import { getFriends } from "@/lib/friends-db"
import { getChangelog } from "@/lib/changelog-db"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "邻里 — D05",
  description: "友链、留言与站点更新记录",
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-serif text-sm font-bold tracking-tight mb-1">{title}</h2>
      <p className="text-[10px] text-muted-foreground/40 tracking-widest uppercase">{subtitle}</p>
    </div>
  )
}

export default async function LinliPage() {
  const [friends, changelog] = await Promise.all([getFriends(), getChangelog()])

  return (
    <div className="relative py-12 px-4 sm:px-6 overflow-hidden min-h-screen">
      <HexGrid opacity={0.03} />
      <Sparkles count={10} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-8 ark-line" />
            <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">Neighborhood</p>
            <div className="w-8 ark-line" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mb-2">
            邻里
          </h1>
          <p className="text-xs text-muted-foreground/50 tracking-widest">
            友链 · 留言 · 足迹
          </p>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left — Friends */}
          <section className="lg:col-span-3">
            <div className="sticky top-24">
              <SectionHeader title="友链" subtitle="Friends" />
              <LinliFriends friends={friends} />
            </div>
          </section>

          {/* Center — Guestbook */}
          <section className="lg:col-span-5">
            <SectionHeader title="留言" subtitle="Guestbook" />
            <LinliGuestbook />
          </section>

          {/* Right — Updates */}
          <section className="lg:col-span-4">
            <div className="sticky top-24">
              <SectionHeader title="更新" subtitle="Changelog" />
              <LinliUpdates entries={changelog} />
            </div>
          </section>
        </div>

        <div className="flex justify-center mt-16 opacity-20">
          <ArkDiamond size={6} />
        </div>
      </div>
    </div>
  )
}
