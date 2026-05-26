import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Projects } from "@/components/projects"
import { SectionIndicator } from "@/components/section-indicator"
import { getBlogPosts } from "@/lib/blog-db"

export const dynamic = "force-dynamic"

export default async function Home() {
  let latestPost: { title: string; slug: string } | null = null
  let blogCount = 0
  try {
    const posts = await getBlogPosts()
    blogCount = posts.length
    if (posts.length > 0) {
      const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      latestPost = { title: sorted[0].title, slug: sorted[0].slug }
    }
  } catch { /* use defaults */ }

  return (
    <>
      <SectionIndicator />
      <Hero latestPost={latestPost} blogCount={blogCount} />
      <About />
      <Projects />
    </>
  )
}
