import { sql } from "@/lib/db"

export type ChangelogEntry = {
  id: number
  date: string
  content: string
  type: "fix" | "feat" | "update"
}

const fallback: ChangelogEntry[] = [
  { id: 1, date: "2026-05-26", type: "fix", content: "修复博客文章点击后出现 404 的问题，移除不可靠的 HAS_DB 检测，改用 try/catch + 后备数据模式" },
  { id: 2, date: "2026-05-26", type: "feat", content: "博客编辑器 slug 改为根据标题自动生成，不再需要手动填写；中文标题自动使用时间戳 slug" },
  { id: 3, date: "2026-05-26", type: "fix", content: "安装 @tailwindcss/typography 插件，修复 Markdown 标题、列表等格式不生效的问题" },
  { id: 4, date: "2026-05-26", type: "feat", content: "Markdown 渲染器新增链接、图片、斜体、删除线、引用块、嵌套列表支持" },
  { id: 5, date: "2026-05-26", type: "update", content: "代码块样式全面重写为 Arknights 深色主题，新增 Python 语法高亮" },
  { id: 6, date: "2026-05-26", type: "feat", content: "友链、留言、更新记录整合为「邻里」页面，三栏布局" },
  { id: 7, date: "2026-05-25", type: "feat", content: "博客页面新增「写文章」按钮，支持在线 Markdown 编辑和发布" },
  { id: 8, date: "2026-05-25", type: "update", content: "首页移除「当下」区域，精简布局" },
  { id: 9, date: "2026-05-26", type: "update", content: "导航栏友链和留言入口合并为「邻里」链接，指向整合后的三栏页面" },
  { id: 10, date: "2026-05-26", type: "update", content: "博客页面「小零的碎碎念」标题背景更换为 art-05" },
]

export async function getChangelog(): Promise<ChangelogEntry[]> {
  try {
    const { rows } = await sql<ChangelogEntry>`
      SELECT id, date, content, type FROM changelog ORDER BY date DESC, id DESC LIMIT 50
    `
    return rows
  } catch {
    return fallback
  }
}
