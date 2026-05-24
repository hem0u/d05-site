import type { Metadata } from "next"
import { BootScreen } from "@/components/boot-screen"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import "./globals.css"

export const metadata: Metadata = {
  title: "D05の小站",
  description: "D05 的个人网站",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bubble-pattern dark:arknights-grid">
        {/* Top snap anchor — ensures scroll-to-top doesn't snap back */}
        <div className="snap-start h-px invisible" />
        {/* Arknights signature: noise/grain texture overlay */}
        <div className="noise-overlay" />
        <BootScreen />
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <div className="snap-end h-px invisible" />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
