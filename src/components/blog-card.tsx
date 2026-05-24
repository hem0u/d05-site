import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/data/blog-posts"

export function BlogCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  return (
    <Card className={`group flex flex-col glass border-border/30 hover:border-[hsl(var(--ark-amber)/0.3)] transition-all duration-500 ${
      featured ? "border-l-2 border-l-[hsl(var(--ark-amber)/0.5)]" : ""
    }`}>
      <CardHeader>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground tracking-wider mb-2">
          <Calendar className="h-3 w-3" />
          {post.date}
        </div>
        <CardTitle className="font-serif text-lg tracking-tight group-hover:text-[hsl(var(--ark-amber))] transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] tracking-wider">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${post.slug}`}>
          <Button variant="ghost" size="sm" className="group/btn text-xs tracking-wider hover:text-[hsl(var(--ark-amber))]">
            阅读更多
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
