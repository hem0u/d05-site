"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ArkDiamond } from "@/components/decorations"

const links = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "博客" },
  { href: "/hobbies", label: "好物" },
  { href: "/records", label: "记录" },
  { href: "/friends", label: "友链" },
  { href: "/guestbook", label: "留言" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border/30">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <ArkDiamond size={10} filled />
          <span className="text-lg font-bold tracking-wider text-foreground group-hover:text-[hsl(var(--ark-amber))] transition-colors">
            D05
          </span>
          <span className="hidden sm:inline text-xs text-muted-foreground tracking-[0.2em] uppercase mt-0.5">
            / Rhodes Island
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none text-xs tracking-widest uppercase transition-all ${
                  pathname === link.href
                    ? "text-[hsl(var(--ark-amber))] border-b border-[hsl(var(--ark-amber))]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile nav */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass">
              <SheetHeader>
                <SheetTitle className="text-sm tracking-widest uppercase">
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant={pathname === link.href ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
