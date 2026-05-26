import { sql } from "@/lib/db"

export type ChangelogEntry = {
  id: number
  date: string
  content: string
  type: "fix" | "feat" | "update"
}

const fallback: ChangelogEntry[] = [
  { id: 29, date: "2026-05-26", type: "feat", content: "仪表盘新增图表统计：内容分布饼图、月度文章柱状图、用户注册趋势面积图" },
  { id: 28, date: "2026-05-26", type: "fix", content: "记录页改为文字在上图片在下，图片容器改为正方形比例避免裁切" },
  { id: 27, date: "2026-05-26", type: "update", content: "记录照片改为本地上传（支持多选、自动裁剪至400x400、预览和删除）" },
  { id: 26, date: "2026-05-26", type: "fix", content: "修复退出登录后导航栏仍显示头像的问题（清除 cookie 时匹配相同参数 + auth/me 禁止缓存）" },
  { id: 25, date: "2026-05-26", type: "fix", content: "修复博客/好物/邻里页面冷启动时表不存在导致无内容或崩溃的问题（补 ensureTables + try/catch）" },
  { id: 24, date: "2026-05-26", type: "feat", content: "管理员登录后直接跳转管理后台 /admin，普通用户跳转首页" },
  { id: 23, date: "2026-05-26", type: "fix", content: "修复 role 列迁移在 Neon PgBouncer 事务模式下不执行的问题（改用 sql.query 单语句 ALTER TABLE）" },
  { id: 22, date: "2026-05-26", type: "fix", content: "修复管理后台冷启动时因 role 列/表不存在导致的应用错误（admin layout + API 路由均补齐 ensureTables）" },
  { id: 21, date: "2026-05-26", type: "fix", content: "修复登录时因 role 列不存在导致「用户不存在」的问题（登录路由未调用 ensureTables）" },
  { id: 20, date: "2026-05-26", type: "feat", content: "新增管理员角色系统和管理后台 /admin；所有内容编辑移至后台；留言需登录后使用账号昵称" },
  { id: 19, date: "2026-05-26", type: "update", content: "头像改为本地上传，自动裁剪居中并缩放至 200x200，存储为 base64 无需图床" },
  { id: 18, date: "2026-05-26", type: "fix", content: "修复登录后导航栏仍显示登录按钮的问题（改用硬导航刷新布局）；注册成功后提示并跳转登录页" },
  { id: 17, date: "2026-05-26", type: "fix", content: "修复验证码邮件已发送但注册时提示「验证码错误或已过期」的问题（verification_codes 表未创建 + 保存结果未检查）" },
  { id: 16, date: "2026-05-26", type: "feat", content: "接入 Nodemailer 邮件服务，注册验证码通过邮箱发送（需配置 EMAIL_HOST 等环境变量）" },
  { id: 15, date: "2026-05-26", type: "feat", content: "博客新增点赞、浏览统计、评论功能；新增个人资料页，可编辑头像昵称简介，查看点赞博文" },
  { id: 14, date: "2026-05-26", type: "feat", content: "新增登录/注册系统，支持邮箱验证码注册；导航栏显示头像ID或登录入口" },
  { id: 13, date: "2026-05-26", type: "update", content: "邻里页面滚动条改为 4px 细条，琥珀配色与整体风格统一" },
  { id: 12, date: "2026-05-26", type: "fix", content: "修复启动动画在上线后播放不完整的问题，改为等进度条和日志行全部完成后再淡出" },
  { id: 11, date: "2026-05-26", type: "feat", content: "邻里页面友链、留言、更新三栏添加滚动容器，内容多时不再撑长页面" },
  { id: 10, date: "2026-05-26", type: "update", content: "博客页面「小零的碎碎念」标题背景更换为 art-05" },
  { id: 9, date: "2026-05-26", type: "update", content: "导航栏友链和留言入口合并为「邻里」链接，指向整合后的三栏页面" },
  { id: 8, date: "2026-05-25", type: "update", content: "首页移除「当下」区域，精简布局" },
  { id: 7, date: "2026-05-25", type: "feat", content: "博客页面新增「写文章」按钮，支持在线 Markdown 编辑和发布" },
  { id: 6, date: "2026-05-26", type: "feat", content: "友链、留言、更新记录整合为「邻里」页面，三栏布局" },
  { id: 5, date: "2026-05-26", type: "update", content: "代码块样式全面重写为 Arknights 深色主题，新增 Python 语法高亮" },
  { id: 4, date: "2026-05-26", type: "feat", content: "Markdown 渲染器新增链接、图片、斜体、删除线、引用块、嵌套列表支持" },
  { id: 3, date: "2026-05-26", type: "fix", content: "安装 @tailwindcss/typography 插件，修复 Markdown 标题、列表等格式不生效的问题" },
  { id: 2, date: "2026-05-26", type: "feat", content: "博客编辑器 slug 改为根据标题自动生成，不再需要手动填写；中文标题自动使用时间戳 slug" },
  { id: 1, date: "2026-05-26", type: "fix", content: "修复博客文章点击后出现 404 的问题，移除不可靠的 HAS_DB 检测，改用 try/catch + 后备数据模式" },
]

async function ensureSeeded() {
  try {
    for (const entry of fallback) {
      await sql`
        INSERT INTO changelog (id, date, content, type)
        VALUES (${entry.id}, ${entry.date}, ${entry.content}, ${entry.type})
        ON CONFLICT (id) DO NOTHING
      `
    }
  } catch (e) {
    console.error("[changelog-db] ensureSeeded failed:", e)
  }
}

export async function getChangelog(): Promise<ChangelogEntry[]> {
  try {
    await ensureSeeded()
    const { rows } = await sql<ChangelogEntry>`
      SELECT id, date, content, type FROM changelog ORDER BY date DESC, id DESC LIMIT 50
    `
    if (rows.length > 0) return rows
    return fallback
  } catch {
    return fallback
  }
}

export async function addChangelogEntry(
  date: string,
  content: string,
  type: "fix" | "feat" | "update",
): Promise<ChangelogEntry> {
  try {
    await ensureSeeded()
    const { rows } = await sql<ChangelogEntry>`
      INSERT INTO changelog (date, content, type) VALUES (${date}, ${content}, ${type})
      RETURNING id, date, content, type
    `
    return rows[0]
  } catch (e) {
    console.error("[changelog-db] addChangelogEntry failed:", e)
    const entry: ChangelogEntry = {
      id: Date.now(),
      date,
      content,
      type,
    }
    fallback.unshift(entry)
    return entry
  }
}
