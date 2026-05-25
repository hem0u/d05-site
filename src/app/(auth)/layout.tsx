import { HexGrid, Sparkles, ArkDiamond } from "@/components/decorations"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative py-16 px-4 sm:px-6 overflow-hidden min-h-[80vh] flex items-center justify-center">
      <HexGrid opacity={0.03} />
      <Sparkles count={8} />
      <div className="relative z-10 w-full max-w-sm">
        {children}
        <div className="flex justify-center mt-12 opacity-20">
          <ArkDiamond size={5} />
        </div>
      </div>
    </div>
  )
}
