import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { profile } from "@/data/profile"
import { Sparkles, DriftingPetals, CornerDeco, HexGrid, SakuraFlower, YuriBloom, ArkDiamond, ChibiFace, PairedStars } from "@/components/decorations"

export function About() {
  return (
    <section id="about" className="relative min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 overflow-hidden vignette snap-start">
      {/* Ambient background image — subtle, blurred */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/images/art-03.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-15"
          style={{ filter: "blur(60px) saturate(0.6)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
      </div>

      <HexGrid opacity={0.04} />
      <Sparkles count={18} />
      <DriftingPetals count={10} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      {/* Side decorations */}
      <div className="absolute left-4 sm:left-8 top-1/3 pointer-events-none z-10 block animate-float opacity-50 sm:opacity-70">
        <ChibiFace size={36} expression="blush" />
        <div className="mt-1 flex justify-center">
          <PairedStars size={24} />
        </div>
      </div>
      <div className="absolute right-4 sm:right-8 top-2/3 pointer-events-none z-10 block animate-float opacity-50 sm:opacity-70" style={{ animationDelay: "1.5s" }}>
        <SakuraFlower size={28} />
        <div className="mt-1 flex justify-center gap-1">
          <YuriBloom size={20} />
          <YuriBloom size={20} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Section heading — Arknights clinical serif style */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-10 ark-line" />
            <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">
              About
            </p>
            <div className="w-10 ark-line" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mb-2">
            不止是代码
          </h2>
          <p className="text-xs text-muted-foreground/60 tracking-widest">
            — MORE THAN CODE —
          </p>
        </div>

        {/* Bio — clean cards */}
        <div className="space-y-4">
          {profile.bio.map((paragraph, i) => (
            <div key={i} className="glass rounded-sm p-5 border-l-2 border-[hsl(var(--ark-amber)/0.3)]">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        {/* Skills */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <ArkDiamond size={6} />
            <h3 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              技能栈 / Skills
            </h3>
            <ArkDiamond size={6} />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="px-3 py-1 text-xs tracking-wider">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bottom: yuri-themed decoration */}
        <div className="flex justify-center items-center gap-4 mt-12 opacity-25">
          <YuriBloom size={24} />
          <PairedStars size={30} />
          <YuriBloom size={24} />
        </div>
      </div>
    </section>
  )
}
