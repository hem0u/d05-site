import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Projects } from "@/components/projects"
import { SectionIndicator } from "@/components/section-indicator"

export default function Home() {
  return (
    <>
      <SectionIndicator />
      <Hero />
      <About />
      <Projects />
    </>
  )
}
