import type { Metadata } from "next"
import { BlogList } from "@/components/blog-list"
import { getBlogPosts } from "@/lib/blog-db"
import { ArkDiamond, HexGrid, Sparkles, CornerDeco, SakuraFlower, YuriBloom } from "@/components/decorations"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "BLOG — D05",
  description: "技术文章、生活随笔和一切有趣的想法",
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="relative py-16 px-4 sm:px-6 overflow-hidden">
      <HexGrid opacity={0.03} />
      <Sparkles count={10} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <div className="absolute left-2 sm:left-8 top-1/3 pointer-events-none z-10 block animate-float opacity-35 sm:opacity-50">
        <SakuraFlower size={20} />
      </div>
      <div className="absolute right-2 sm:right-8 top-2/3 pointer-events-none z-10 block animate-float opacity-35 sm:opacity-50" style={{ animationDelay: "1.5s" }}>
        <YuriBloom size={18} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header with ambient image background */}
        <div className="relative text-center mb-14 animate-slide-up overflow-hidden rounded-xl">
          <img
            src="/images/art-04.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25 dark:opacity-15"
            style={{ filter: "blur(40px) saturate(0.8)" }}
          />
          <div className="absolute inset-0 bg-background/60" />
          <div className="relative z-10 py-12">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-10 ark-line" />
              <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">
                Blog
              </p>
              <div className="w-10 ark-line" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mb-2">
              小零的碎碎念
            </h1>
            <p className="text-xs text-muted-foreground/60 tracking-widest">
              — THOUGHTS · CODE · LIFE —
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">&#127800;</p>
            <p className="text-muted-foreground text-lg">还没有文章，敬请期待</p>
          </div>
        ) : (
          <BlogList posts={posts} />
        )}

        <div className="flex justify-center mt-12 opacity-25">
          <ArkDiamond size={6} />
        </div>
      </div>
    </div>
  )
}
