import type { Metadata } from "next"
import { HexGrid, Sparkles, CornerDeco, ArkDiamond, SakuraFlower, YuriBloom, ChibiFace, PairedStars } from "@/components/decorations"
import { Guestbook } from "@/components/guestbook"

export const metadata: Metadata = {
  title: "留言板 — D05",
  description: "留下你的痕迹",
}

export default function GuestbookPage() {
  return (
    <div className="relative py-16 px-4 sm:px-6 overflow-hidden min-h-screen">
      <HexGrid opacity={0.04} />
      <Sparkles count={14} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <div className="absolute left-2 sm:left-8 top-1/3 pointer-events-none z-10 animate-float opacity-35 sm:opacity-50">
        <ChibiFace size={30} expression="smile" />
        <div className="mt-1 flex justify-center">
          <PairedStars size={18} />
        </div>
      </div>
      <div className="absolute right-2 sm:right-8 top-2/3 pointer-events-none z-10 animate-float opacity-35 sm:opacity-50" style={{ animationDelay: "1.5s" }}>
        <SakuraFlower size={22} />
        <div className="mt-1 flex justify-center gap-1">
          <YuriBloom size={16} />
          <YuriBloom size={16} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-10 ark-line" />
            <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">Guestbook</p>
            <div className="w-10 ark-line" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mb-2">
            留言板
          </h1>
          <p className="text-xs text-muted-foreground/60 tracking-widest">
            — LEAVE A MARK ON THE ISLAND —
          </p>
        </div>

        <Guestbook />

        <div className="flex justify-center mt-10 opacity-20">
          <ArkDiamond size={6} />
        </div>
      </div>
    </div>
  )
}
