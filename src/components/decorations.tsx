/* ========================================
   Decorative elements:
   Sakura flowers, Lily (yuri), Chibi,
   Arknights diamond shapes, sparkles
   ======================================== */

/* ── Sakura (cherry blossom) flower ── */
export function SakuraFlower({
  size = 40,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`drop-shadow-sm ${className}`}
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="20"
          cy="18"
          rx="5"
          ry="9"
          fill="#FFB7C5"
          transform={`rotate(${angle} 20 18)`}
          opacity="0.85"
        />
      ))}
      <circle cx="20" cy="18" r="4" fill="#FF6B85" />
      <circle cx="20" cy="18" r="2" fill="#FFD1DC" />
    </svg>
  )
}

/* ── Yuri bloom (百合: intertwined double bloom) ── */
export function YuriBloom({
  size = 36,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={`drop-shadow-sm ${className}`}
    >
      {/* Left bloom (pink rose) */}
      <g transform="translate(9, 22) scale(0.7)">
        <ellipse cx="0" cy="-8" rx="5" ry="7" fill="#FFB7C5" opacity="0.85" />
        <ellipse cx="-4" cy="-10" rx="5" ry="7" fill="#FF8FA3" transform="rotate(-30 0 -6)" opacity="0.8" />
        <ellipse cx="4" cy="-10" rx="5" ry="7" fill="#FFD1DC" transform="rotate(30 0 -6)" opacity="0.8" />
        <ellipse cx="0" cy="-12" rx="4" ry="5" fill="#FFB7C5" />
        <circle cx="0" cy="-7" r="3" fill="#FF6B85" />
        <circle cx="0" cy="-7" r="1.5" fill="#FFF0F3" />
      </g>
      {/* Right bloom (lavender rose) */}
      <g transform="translate(27, 22) scale(0.7)">
        <ellipse cx="0" cy="-8" rx="5" ry="7" fill="#C4B5FD" opacity="0.85" />
        <ellipse cx="-4" cy="-10" rx="5" ry="7" fill="#A78BFA" transform="rotate(-30 0 -6)" opacity="0.8" />
        <ellipse cx="4" cy="-10" rx="5" ry="7" fill="#DDD6FE" transform="rotate(30 0 -6)" opacity="0.8" />
        <ellipse cx="0" cy="-12" rx="4" ry="5" fill="#C4B5FD" />
        <circle cx="0" cy="-7" r="3" fill="#8B5CF6" />
        <circle cx="0" cy="-7" r="1.5" fill="#EDE9FE" />
      </g>
      {/* Intertwined stems crossing in a heart-like loop */}
      <path
        d="M15 28 Q18 22 12 18 Q18 14 18 10"
        fill="none"
        stroke="#FFB7C5"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M21 28 Q18 22 24 18 Q18 14 18 10"
        fill="none"
        stroke="#C4B5FD"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Small connecting sparkle */}
      <circle cx="18" cy="20" r="1.5" fill="#FFD1DC" opacity="0.7" />
    </svg>
  )
}

/* ── Arknights diamond (◇) ── */
export function ArkDiamond({
  size = 16,
  filled = false,
  className = "",
}: {
  size?: number
  filled?: boolean
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
    >
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="0.5"
        transform="rotate(45 8 8)"
        fill={filled ? "#F59E0B" : "none"}
        stroke="#F59E0B"
        strokeWidth="1.5"
        opacity={filled ? 0.9 : 0.6}
      />
    </svg>
  )
}

/* ── Chibi face (cute round anime face) ── */
export function ChibiFace({
  size = 48,
  expression = "happy",
  className = "",
}: {
  size?: number
  expression?: "happy" | "wink" | "blush"
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`drop-shadow-md ${className}`}
    >
      {/* Head */}
      <circle cx="24" cy="24" r="22" fill="#FFF0F3" stroke="#FFB7C5" strokeWidth="1" />
      {/* Hair (simple bangs) */}
      <path d="M6 20 Q12 4 24 4 Q36 4 42 20" fill="#FFB7C5" />
      <path d="M8 19 Q14 5 24 5 Q34 5 40 19" fill="#FF8FA3" opacity="0.5" />
      {/* Hair sides */}
      <ellipse cx="4" cy="26" rx="3" ry="8" fill="#FFB7C5" />
      <ellipse cx="44" cy="26" rx="3" ry="8" fill="#FFB7C5" />
      {/* Eyes */}
      {expression === "wink" ? (
        <>
          <ellipse cx="18" cy="22" rx="3" ry="3.5" fill="#333" />
          <circle cx="19" cy="21" r="1.2" fill="#fff" />
          <path d="M33 20 Q35 22 37 20" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="18" cy="22" rx="3" ry="3.5" fill="#333" />
          <circle cx="19" cy="21" r="1.2" fill="#fff" />
          <ellipse cx="32" cy="22" rx="3" ry="3.5" fill="#333" />
          <circle cx="33" cy="21" r="1.2" fill="#fff" />
        </>
      )}
      {/* Blush */}
      {expression === "blush" && (
        <>
          <ellipse cx="12" cy="28" rx="4" ry="2.5" fill="#FFB7C5" opacity="0.6" />
          <ellipse cx="38" cy="28" rx="4" ry="2.5" fill="#FFB7C5" opacity="0.6" />
        </>
      )}
      {expression === "happy" && (
        <>
          <ellipse cx="13" cy="27" rx="3" ry="2" fill="#FFD1DC" opacity="0.5" />
          <ellipse cx="37" cy="27" rx="3" ry="2" fill="#FFD1DC" opacity="0.5" />
        </>
      )}
      {/* Mouth */}
      {expression === "happy" && (
        <path d="M21 30 Q24 34 27 30" fill="none" stroke="#E63950" strokeWidth="1.2" strokeLinecap="round" />
      )}
      {expression === "wink" && (
        <path d="M22 30 Q24 33 26 30" fill="none" stroke="#E63950" strokeWidth="1.2" strokeLinecap="round" />
      )}
      {expression === "blush" && (
        <ellipse cx="24" cy="31" rx="2.5" ry="1.5" fill="#E63950" opacity="0.7" />
      )}
      {/* Ahoge (アホ毛) */}
      <path d="M24 4 Q28 -2 30 2" fill="none" stroke="#FF6B85" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── Paired stars (yuri: two stars together) ── */
export function PairedStars({
  size = 40,
  className = "",
}: {
  size?: number
  className?: string
}) {
  const starPath =
    "M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14l-6-4.5h7.5z"
  return (
    <svg width={size} height={size} viewBox="0 0 30 24" className={className}>
      {/* Left star (pink) */}
      <g transform="translate(0, 0) scale(0.7)">
        <path d={starPath} fill="#FFB7C5" />
      </g>
      {/* Right star (lavender) */}
      <g transform="translate(12, 2) scale(0.55)">
        <path d={starPath} fill="#C4B5FD" />
      </g>
      {/* Connecting sparkle */}
      <circle cx="12" cy="10" r="1.5" fill="#FFD1DC" opacity="0.8" />
    </svg>
  )
}

/* ── Hex pattern (Arknights style) ── */
export function HexGrid({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="arkhex"
            width="60"
            height="104"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.5)"
          >
            <path
              d="M30 0L60 17.5V52.5L30 70L0 52.5V17.5Z"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="0.8"
              className="dark:stroke-amber-500 stroke-amber-400"
            />
            <path
              d="M30 104L60 86.5V52.5L30 70L0 52.5V86.5Z"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="0.8"
              className="dark:stroke-amber-500 stroke-amber-400"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arkhex)" />
      </svg>
    </div>
  )
}

/* ── Sparkle particles ── */
export function Sparkles({ count = 20 }: { count?: number }) {
  const shapes = ["✦", "✧", "⋆", "·"]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 10 + 6
        const left = Math.random() * 100
        const top = Math.random() * 100
        const delay = Math.random() * 4
        const duration = Math.random() * 3 + 2
        const shape = shapes[i % shapes.length]
        const isSakura = i % 3 === 0
        const isLavender = i % 3 === 1
        return (
          <span
            key={i}
            className="absolute select-none"
            style={{
              fontSize: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animation: `sparkle-fade ${duration}s ${delay}s ease-in-out infinite`,
              color: isSakura
                ? "#FFB7C5"
                : isLavender
                  ? "#C4B5FD"
                  : "#F59E0B",
              opacity: 0,
            }}
          >
            {shape}
          </span>
        )
      })}
    </div>
  )
}

/* ── Corner decoration ── */
export function CornerDeco({ position }: { position: "tl" | "br" }) {
  const isTL = position === "tl"
  return (
    <div
      className={`absolute ${
        isTL ? "top-3 left-3" : "bottom-3 right-3"
      } pointer-events-none z-10`}
    >
      <div className="flex items-center gap-1.5 opacity-40 dark:opacity-60">
        <ArkDiamond size={10} />
        <div className="w-6 h-[1px] bg-amber-400 dark:bg-amber-500" />
        <ArkDiamond size={6} filled />
      </div>
    </div>
  )
}

/* ── Section divider (Arknights-style line) ── */
export function ArkDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4 opacity-30 dark:opacity-50">
      <div className="w-8 h-[1px] bg-amber-400 dark:bg-amber-500" />
      <ArkDiamond size={8} filled />
      <div className="w-8 h-[1px] bg-amber-400 dark:bg-amber-500" />
    </div>
  )
}

/* ── Floating chibi cluster ── */
export function FloatingChibi({
  side,
}: {
  side: "left" | "right"
}) {
  const offset = side === "left" ? "left-2 sm:left-8" : "right-2 sm:right-8"
  return (
    <div
      className={`absolute ${offset} bottom-8 pointer-events-none z-10 block animate-float opacity-50 sm:opacity-70`}
    >
      <div className="flex flex-col items-center gap-1">
        <ChibiFace size={40} expression="happy" />
        <PairedStars size={28} />
      </div>
    </div>
  )
}

/* ── Drifting petals (sakura + lily) ── */
export function DriftingPetals({ count = 12 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const isSakura = i % 2 === 0
        const size = Math.random() * 14 + 10
        const left = Math.random() * 100
        const delay = Math.random() * 10
        const duration = Math.random() * 8 + 7
        const sway = (Math.random() - 0.5) * 120
        return (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              top: "-5%",
              animation: `petal-drift ${duration}s ${delay}s linear infinite`,
              ["--sway" as string]: `${sway}px`,
            }}
          >
            {isSakura ? (
              <SakuraFlower size={size} className="opacity-50 dark:opacity-35" />
            ) : (
              <YuriBloom size={size} className="opacity-50 dark:opacity-35" />
            )}
          </span>
        )
      })}
    </div>
  )
}

/* ── Decorative framed image ── */
export function DecoImage({
  src,
  alt = "",
  className = "",
  variant = "glass",
  aspectRatio,
}: {
  src: string
  alt?: string
  className?: string
  variant?: "glass" | "polaroid" | "banner"
  aspectRatio?: "square" | "4/3" | "16/9"
}) {
  const ratioClass =
    aspectRatio === "4/3"
      ? "aspect-[4/3]"
      : aspectRatio === "16/9"
        ? "aspect-[16/9]"
        : "aspect-square"

  if (variant === "banner") {
    return (
      <div className={`relative overflow-hidden rounded-lg group ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ark-amber)/0.08)] to-transparent pointer-events-none" />
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 ring-1 ring-border/20 rounded-lg pointer-events-none" />
      </div>
    )
  }

  if (variant === "polaroid") {
    return (
      <div
        className={`group glass rounded-lg p-2 shadow-lg shadow-black/5 dark:shadow-white/5 transition-all duration-500 hover:shadow-xl hover:shadow-[hsl(var(--ark-amber)/0.1)] hover:-translate-y-1 ${className}`}
      >
        <div className={`${ratioClass} overflow-hidden rounded-md`}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        {/* Polaroid bottom strip hint */}
        <div className="h-1.5 flex items-center justify-center opacity-30">
          <div className="w-8 h-px bg-foreground/20" />
        </div>
      </div>
    )
  }

  // glass (default)
  return (
    <div className={`glass rounded-lg overflow-hidden group ${ratioClass} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-[hsl(var(--ark-amber)/0.1)] to-transparent pointer-events-none" />
    </div>
  )
}
