import type { Metadata } from "next"
import { HexGrid, Sparkles, CornerDeco, ArkDiamond, SakuraFlower, YuriBloom } from "@/components/decorations"
import { Diary } from "@/components/diary"

export const metadata: Metadata = {
  title: "记录 — D05",
  description: "每一天都值得被记住。",
}

export default function RecordsPage() {
  return (
    <div className="relative py-16 px-4 sm:px-6 overflow-hidden min-h-screen">
      <HexGrid opacity={0.03} />
      <Sparkles count={10} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <div className="absolute left-2 sm:left-8 top-1/3 pointer-events-none z-10 animate-float opacity-35 sm:opacity-50">
        <SakuraFlower size={20} />
      </div>
      <div className="absolute right-2 sm:right-8 top-2/3 pointer-events-none z-10 animate-float opacity-35 sm:opacity-50" style={{ animationDelay: "1.5s" }}>
        <YuriBloom size={18} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-14 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-10 ark-line" />
            <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">Records</p>
            <div className="w-10 ark-line" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mb-2">
            记录
          </h1>
          <p className="text-xs text-muted-foreground/60 tracking-widest">
            — EVERY DAY MATTERS —
          </p>
        </div>

        <Diary />

        <div className="flex justify-center mt-12 opacity-20">
          <ArkDiamond size={6} />
        </div>
      </div>
    </div>
  )
}
