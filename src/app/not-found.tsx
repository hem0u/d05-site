import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HexGrid, Sparkles, CornerDeco, ArkDiamond, ChibiFace } from "@/components/decorations"

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 text-center overflow-hidden">
      <HexGrid opacity={0.04} />
      <Sparkles count={15} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <div className="relative z-10 flex flex-col items-center gap-6 animate-slide-up">
        {/* Chibi with confused expression */}
        <div className="animate-float">
          <ChibiFace size={64} expression="wink" />
        </div>

        {/* 404 display */}
        <div className="flex items-center gap-4">
          <div className="w-8 ark-line" />
          <span
            className="text-7xl font-serif font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, hsl(38 92% 55%), hsl(38 92% 40%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(245,158,11,0.2))",
            }}
          >
            404
          </span>
          <div className="w-8 ark-line" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold tracking-tight">
            页面去二次元旅行了
          </h2>
          <p className="text-xs text-muted-foreground/60 tracking-wider max-w-sm">
            这份文件似乎被罗德岛回收了，或者从未存在过
          </p>
        </div>

        <Button variant="kawaii" size="lg" asChild className="rounded-full mt-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            返回首页
          </Link>
        </Button>

        <div className="flex items-center gap-3 opacity-25">
          <ArkDiamond size={5} />
          <div className="w-6 h-px bg-amber-400" />
          <ArkDiamond size={5} />
          <div className="w-6 h-px bg-amber-400" />
          <ArkDiamond size={5} />
        </div>
      </div>
    </div>
  )
}
