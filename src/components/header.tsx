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
import { UserMenu } from "@/components/user-menu"

const links = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "博客" },
  { href: "/hobbies", label: "好物" },
  { href: "/records", label: "记录" },
  { href: "/schedule", label: "日程" },
  { href: "/linli", label: "邻里" },
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
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className={`rounded-none text-xs tracking-widest uppercase transition-all ${
                pathname === link.href
                  ? "text-[hsl(var(--ark-amber))] border-b border-[hsl(var(--ark-amber))]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <UserMenu />
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
                  <Button
                    key={link.href}
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    asChild
                    className="w-full justify-start"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
