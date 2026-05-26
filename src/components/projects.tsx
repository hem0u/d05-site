import { ExternalLink, Github } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projects } from "@/data/projects"
import { Sparkles, CornerDeco, HexGrid, SakuraFlower, YuriBloom, ArkDivider } from "@/components/decorations"

export function Projects() {
  return (
    <section id="projects" className="relative min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 overflow-hidden vignette snap-start">
      <HexGrid opacity={0.04} />
      <Sparkles count={20} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <div className="absolute left-2 sm:left-8 top-1/2 pointer-events-none z-10 block animate-float opacity-40 sm:opacity-70">
        <SakuraFlower size={24} />
      </div>
      <div className="absolute right-2 sm:right-8 top-1/3 pointer-events-none z-10 block animate-float opacity-40 sm:opacity-70" style={{ animationDelay: "1.5s" }}>
        <YuriBloom size={22} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-10 ark-line" />
            <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">
              Projects
            </p>
            <div className="w-10 ark-line" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mb-2">
            我的项目
          </h2>
          <p className="text-xs text-muted-foreground/60 tracking-widest">
            — DEPLOYED · MAINTAINED · LOVED —
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, idx) => (
            <Card key={project.title} className="group flex flex-col glass border-border/30 hover:border-[hsl(var(--ark-amber)/0.3)] transition-all duration-500">
              <CardHeader>
                <div className="mb-4 h-40 rounded-sm bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02] relative overflow-hidden border border-border/20">
                  <img
                    src={`/images/art-0${idx + 1}.jpg`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <CardTitle className="font-serif text-lg tracking-tight group-hover:text-[hsl(var(--ark-amber))] transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] tracking-wider">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                {project.link && (
                  <Button variant="kawaii" size="sm" asChild className="rounded-sm">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      访问
                    </a>
                  </Button>
                )}
                {project.github && (
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-[hsl(var(--ark-blue))]">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <ArkDivider />

        <p className="text-center text-[10px] text-muted-foreground tracking-[0.3em] uppercase opacity-40">
          more projects coming soon
        </p>
      </div>
    </section>
  )
}
