import type { Metadata } from "next"
import { Heart } from "lucide-react"
import { HexGrid, Sparkles, CornerDeco, ArkDiamond, SakuraFlower, YuriBloom } from "@/components/decorations"
import { FriendsList, RandomVisit } from "@/components/friends-list"
import { getFriends } from "@/lib/friends-db"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "友链 — D05",
  description: "朋友们的小站",
}

export default async function FriendsPage() {
  const friends = await getFriends()
  return (
    <div className="relative py-16 px-4 sm:px-6 overflow-hidden min-h-screen">
      <HexGrid opacity={0.04} />
      <Sparkles count={12} />
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
        <div className="text-center mb-10 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-10 ark-line" />
            <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">
              Friends
            </p>
            <div className="w-10 ark-line" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mb-2">
            友链
          </h1>
          <p className="text-xs text-muted-foreground/60 tracking-widest">
            — MY DEAR FRIENDS —
          </p>
        </div>

        {/* Declaration */}
        <div className="max-w-xl mx-auto text-center mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-muted-foreground/60 leading-relaxed">
            这里收录着互联网上散落的灵魂碎片。如果你也热爱二次元、开源和技术，
            欢迎敲响我的小窗 —— 每一份真诚的链接，都是这座岛屿上的一盏灯。
          </p>
        </div>

        {/* Friends grid — 3 columns */}
        <FriendsList friends={friends} />

        {/* Footer actions */}
        <div className="flex items-center justify-center gap-4 my-10 flex-wrap">
          <RandomVisit friends={friends} />
          <span className="text-muted-foreground/20">·</span>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/15 bg-card/30 backdrop-blur-sm text-[11px] text-muted-foreground/40 tracking-widest">
            <Heart className="h-3 w-3" />
            <span>想交换友链？联系我</span>
          </div>
        </div>

        <div className="flex justify-center mt-8 opacity-20">
          <ArkDiamond size={6} />
        </div>
      </div>
    </div>
  )
}
