import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getBlogPost } from "@/lib/blog-db"
import { HexGrid, Sparkles, CornerDeco, ArkDiamond } from "@/components/decorations"
import { ReadingProgress } from "@/components/reading-progress"
import { CodeBlock } from "@/components/code-block"
import { TableOfContents, type TocHeading } from "@/components/table-of-contents"
import { PostActions } from "@/components/post-actions"
import { highlightCode } from "@/lib/highlight"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: "文章未找到" }
  return {
    title: `${post.title} — D05の小站`,
    description: post.excerpt,
  }
}

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  console.log("[blog/[slug]] looking up:", slug)
  const post = await getBlogPost(slug)

  if (!post) {
    console.log("[blog/[slug]] NOT FOUND for slug:", slug)
    notFound()
  }

  const headings = extractHeadings(post.content)

  return (
    <article className="relative py-16 px-4 sm:px-6 animate-fade-in overflow-hidden">
      <ReadingProgress />
      <HexGrid opacity={0.03} />
      <Sparkles count={8} />
      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <TableOfContents headings={headings} />

      <div className="relative z-10 mx-auto max-w-3xl">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="mb-6 rounded-full">
                <ArrowLeft className="h-4 w-4" />
                返回博客
              </Button>
            </Link>

        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{post.date}</time>
            </div>
            <PostActions post={post} />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => {
              const variants = ["default", "secondary", "lavender"] as const
              const variant = variants[tag.length % 3]
              return (
                <Badge key={tag} variant={variant}>{tag}</Badge>
              )
            })}
          </div>
        </header>

        <Separator className="mb-8" />

        <div className="prose prose-sakura dark:prose-invert max-w-none
          prose-headings:font-display prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:leading-relaxed prose-p:text-base
          prose-code:bg-sakura-100 prose-code:dark:bg-sakura-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
          prose-pre:bg-muted prose-pre:rounded-xl prose-pre:border prose-pre:border-sakura-100 dark:prose-pre:border-sakura-800
          prose-a:text-sakura-500 hover:prose-a:text-sakura-600
          prose-strong:text-foreground
          prose-li:marker:text-sakura-400"
        >
          {renderMarkdown(post.content)}
        </div>

        <Separator className="my-10" />

        <footer className="text-center">
          <Link href="/blog">
            <Button variant="kawaii" size="lg" className="rounded-full">
              查看更多文章
            </Button>
          </Link>
          <div className="flex justify-center mt-10 opacity-25">
            <ArkDiamond size={6} />
          </div>
        </footer>
      </div>{/* max-w-3xl */}
    </article>
  )
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function extractHeadings(md: string): TocHeading[] {
  const headings: TocHeading[] = []
  for (const line of md.split("\n")) {
    if (line.startsWith("#### ")) {
      const text = line.slice(5).replace(/\*\*/g, "").replace(/`/g, "")
      headings.push({ id: slugify(text), text, level: 4 })
    } else if (line.startsWith("### ")) {
      const text = line.slice(4).replace(/\*\*/g, "").replace(/`/g, "")
      headings.push({ id: slugify(text), text, level: 3 })
    } else if (line.startsWith("## ")) {
      const text = line.slice(3).replace(/\*\*/g, "").replace(/`/g, "")
      headings.push({ id: slugify(text), text, level: 2 })
    } else if (line.startsWith("# ")) {
      const text = line.slice(2).replace(/\*\*/g, "").replace(/`/g, "")
      headings.push({ id: slugify(text), text, level: 1 })
    }
  }
  return headings
}

/* Simple markdown-to-JSX renderer */
function renderMarkdown(md: string): React.ReactNode {
  const lines = md.trim().split("\n")
  const elements: React.ReactNode[] = []
  let i = 0
  let inCodeBlock = false
  let codeLines: string[] = []
  let codeLang = ""
  let inBlockquote = false
  let quoteLines: string[] = []

  function flushBlockquote() {
    if (quoteLines.length > 0) {
      elements.push(
        <blockquote key={elements.length} className="border-l-4 border-[hsl(var(--ark-amber)/0.4)] pl-4 my-4 italic text-muted-foreground">
          {quoteLines.map((ql, qi) => <p key={qi} className="my-1">{parseInline(ql)}</p>)}
        </blockquote>
      )
      quoteLines = []
    }
    inBlockquote = false
  }

  while (i < lines.length) {
    const line = lines[i]

    // Code blocks (allow leading whitespace)
    const trimmedLine = line.trimStart()
    if (trimmedLine.startsWith("```")) {
      flushBlockquote()
      if (inCodeBlock) {
        elements.push(
          <CodeBlock key={elements.length} code={codeLines.join("\n")} language={codeLang} html={highlightCode(codeLines.join("\n"), codeLang)} />
        )
        codeLines = []
        inCodeBlock = false
        codeLang = ""
        i++
        continue
      } else {
        inCodeBlock = true
        codeLang = trimmedLine.slice(3).trim()
        i++
        continue
      }
    }
    if (inCodeBlock) {
      codeLines.push(line)
      i++
      continue
    }

    // Blockquote
    if (line.startsWith("> ")) {
      inBlockquote = true
      quoteLines.push(line.slice(2))
      i++
      continue
    }
    if (inBlockquote && line.trim() === "") {
      flushBlockquote()
      i++
      continue
    }
    if (inBlockquote) {
      flushBlockquote()
      continue
    }

    // Skip empty lines
    if (line.trim() === "") {
      i++
      continue
    }

    // Headers
    if (line.startsWith("#### ")) {
      const text = line.slice(5)
      elements.push(<h4 key={elements.length} id={slugify(text.replace(/\*\*/g, "").replace(/`/g, ""))}>{parseInline(text)}</h4>)
      i++
      continue
    }
    if (line.startsWith("### ")) {
      const text = line.slice(4)
      elements.push(<h3 key={elements.length} id={slugify(text.replace(/\*\*/g, "").replace(/`/g, ""))}>{parseInline(text)}</h3>)
      i++
      continue
    }
    if (line.startsWith("## ")) {
      const text = line.slice(3)
      elements.push(<h2 key={elements.length} id={slugify(text.replace(/\*\*/g, "").replace(/`/g, ""))}>{parseInline(text)}</h2>)
      i++
      continue
    }
    if (line.startsWith("# ")) {
      const text = line.slice(2)
      elements.push(<h1 key={elements.length} id={slugify(text.replace(/\*\*/g, "").replace(/`/g, ""))}>{parseInline(text)}</h1>)
      i++
      continue
    }

    // Separator
    if (line.trim() === "---") {
      elements.push(<Separator key={elements.length} className="my-8" />)
      i++
      continue
    }

    // Ordered list
    if (line.trimStart().match(/^\d+\.\s/)) {
      const items: React.ReactNode[] = []
      while (i < lines.length) {
        const tl = lines[i].trimStart()
        if (!tl.match(/^\d+\.\s/)) break
        const baseIndent = lines[i].length - tl.length
        items.push(<li key={i} className={baseIndent >= 2 ? "ml-4" : ""}>{parseInline(tl.replace(/^\d+\.\s/, ""))}</li>)
        i++
      }
      elements.push(<ol key={elements.length} className="list-decimal pl-6 my-4 space-y-1">{items}</ol>)
      continue
    }
    // Unordered list
    if (line.trimStart().startsWith("- ")) {
      const items: React.ReactNode[] = []
      while (i < lines.length) {
        const tl = lines[i].trimStart()
        if (!tl.startsWith("- ")) break
        const baseIndent = lines[i].length - tl.length
        items.push(<li key={i} className={baseIndent >= 2 ? "ml-4" : ""}>{parseInline(tl.slice(2))}</li>)
        i++
      }
      elements.push(<ul key={elements.length} className="list-disc pl-6 my-4 space-y-1">{items}</ul>)
      continue
    }

    // Bold list items (like **key** — value)
    if (line.startsWith("**") && line.includes("** —")) {
      const match = line.match(/\*\*(.+?)\*\*\s*[—–-]\s*(.+)/)
      if (match) {
        elements.push(
          <p key={elements.length} className="my-1">
            <strong>{match[1]}</strong> — {match[2]}
          </p>
        )
        i++
        continue
      }
    }

    // Inline code-only lines (but not images or links)
    if (line.startsWith("`") && line.endsWith("`") && !line.includes("](")) {
      elements.push(
        <p key={elements.length} className="my-1">
          <code>{line.slice(1, -1)}</code>
        </p>
      )
      i++
      continue
    }

    // Image on its own line
    if (line.startsWith("![") && line.includes("](")) {
      const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
      if (imgMatch) {
        elements.push(
          <figure key={elements.length} className="my-6">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="rounded-xl max-w-full" />
            {imgMatch[1] && <figcaption className="text-center text-xs text-muted-foreground mt-2">{imgMatch[1]}</figcaption>}
          </figure>
        )
        i++
        continue
      }
    }

    // Paragraph
    elements.push(<p key={elements.length} className="my-2">{parseInline(line)}</p>)
    i++
  }

  // Flush any remaining blockquote or code block
  flushBlockquote()
  if (inCodeBlock) {
    elements.push(
      <CodeBlock key={elements.length} code={codeLines.join("\n")} language={codeLang} html={highlightCode(codeLines.join("\n"), codeLang)} />
    )
  }

  return elements
}

function parseInline(text: string): React.ReactNode {
  // Split by inline code, images, links, bold, italic, strikethrough
  const parts = text.split(/(`[^`]+`|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|__[^_]+__|_[^_]+_)/g)
  return parts.map((part, i) => {
    // Inline code
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>
    }
    // Image
    if (part.startsWith("![")) {
      const m = part.match(/!\[([^\]]*)\]\(([^)]+)\)/)
      if (m) return <img key={i} src={m[2]} alt={m[1]} className="inline rounded" />
    }
    // Link
    if (part.startsWith("[")) {
      const m = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
      if (m) return <a key={i} href={m[2]} className="text-[hsl(var(--ark-amber))] hover:underline">{m[1]}</a>
    }
    // Strikethrough
    if (part.startsWith("~~") && part.endsWith("~~")) {
      return <del key={i}>{part.slice(2, -2)}</del>
    }
    // Bold
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    // Italic
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}
