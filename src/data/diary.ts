export type DiaryEntry = {
  date: string // "2026-05-24"
  content: string
  photos: string[] // base64 data URLs, max 3
  updatedAt: string // ISO timestamp
}

const STORAGE_KEY = "d05-diary"

function readAll(): Record<string, DiaryEntry> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, DiaryEntry>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getEntry(date: string): DiaryEntry | null {
  const all = readAll()
  return all[date] || null
}

export function getAllEntries(): DiaryEntry[] {
  const all = readAll()
  return Object.values(all).sort((a, b) => b.date.localeCompare(a.date))
}

export function getAllDates(): string[] {
  const all = readAll()
  return Object.keys(all).sort((a, b) => b.localeCompare(a))
}

export function saveEntry(entry: DiaryEntry) {
  const all = readAll()
  all[entry.date] = { ...entry, updatedAt: new Date().toISOString() }
  writeAll(all)
}

export function deleteEntry(date: string) {
  const all = readAll()
  delete all[date]
  writeAll(all)
}

export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function seedIfEmpty() {
  if (typeof window === "undefined") return
  const existing = readAll()
  if (Object.keys(existing).length > 0) return

  const today = new Date()
  const seeds: DiaryEntry[] = [
    {
      date: fmt(today, 0),
      content: "今天把记录页做好了！时间轴+日记的设计意外地顺手。\n\n晚上用新买的键盘打了会儿字，金粉轴的声音真的像雨点，打字都变成了一种享受。\n\n明天打算开始学 Rust 的异步编程，已经收藏了好几篇文章。",
      photos: [],
      updatedAt: "",
    },
    {
      date: fmt(today, -1),
      content: "下午泡了一壶凤凰单丛，配着新到的 Midori MD 笔记本写了点东西。\n\n纸和笔的感觉永远比屏幕更真实。想问题的时候喜欢在纸上乱画，思路反而更清晰。\n\n博客那边又囤了几个选题，等周末再写。",
      photos: [],
      updatedAt: "",
    },
    {
      date: fmt(today, -2),
      content: "周末惯例 —— 拼模型！\n\n这次是之前囤的 HG 风灵高达，从下午两点一直做到晚上八点。渗线、水贴、消光，每一步都很解压。\n\n摆在显示器旁边，和之前的巴巴托斯摆在一起，书桌越来越有感觉了。",
      photos: [],
      updatedAt: "",
    },
    {
      date: fmt(today, -4),
      content: "出门扫街，带了 FM2 和一卷 Kodak Gold 200。\n\n在城西的老街区逛了一下午，拍了些老房子和猫。纯机械相机每按一次快门都要认真想，36 张用完就没了。这种「有限」反而让人更专注。\n\n下周拿去冲扫，期待成片。",
      photos: [],
      updatedAt: "",
    },
    {
      date: fmt(today, -6),
      content: "折腾了一下午的 Neovim 配置。\n\n从插件管理器换到 lazy.nvim，又把配色从 tokyonight 换成了 catppuccin。虽然花了不少时间，但看着编辑器一点点变得顺手真的很满足。\n\n程序员三大爱好：调配置、买键盘、屯域名。我全占了。",
      photos: [],
      updatedAt: "",
    },
    {
      date: fmt(today, -9),
      content: "耳机一戴就是一下午。\n\n今天翻出了吃灰已久的 K701，接上小胆放，听了一下午的女声。从 Aimer 听到 yorushika，再到几首老狼。\n\nAKG 的高频真的有一种空气感，听弦乐和女声尤其毒。虽然低频偏少，但对于我今天的心情来说刚刚好。",
      photos: [],
      updatedAt: "",
    },
    {
      date: fmt(today, -12),
      content: "把博客的代码高亮功能做好了！\n\n踩了不少坑 —— CSS 被 Tailwind purge 掉、颜色在 light/dark 模式下不一致、ToC 的位置各种漂移……\n\n不过搞定之后看着代码块整整齐齐地高亮，心里还是很舒服的。这就是程序员的小确幸吧。",
      photos: [],
      updatedAt: "",
    },
  ]

  seeds.forEach((s) => {
    s.updatedAt = new Date().toISOString()
    saveEntry(s)
  })
}

function fmt(d: Date, offset: number): string {
  const t = new Date(d)
  t.setDate(t.getDate() + offset)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`
}
