export type Project = {
  title: string
  description: string
  tags: string[]
  image: string
  link?: string
  github?: string
}

export const projects: Project[] = [
  {
    title: "星野 Gallery",
    description: "一个二次元风格的个人图床与图片管理工具，支持拖拽上传、标签管理、相册展示，搭载 AI 自动标注功能。",
    tags: ["Next.js", "R2", "AI"],
    image: "/projects/gallery.png",
    link: "https://example.com",
    github: "https://github.com",
  },
  {
    title: "MoeTracker",
    description: "追番进度管理应用，自动同步 Bangumi 数据，支持评分、笔记、好友分享。界面使用 Material Design 风格。",
    tags: ["React", "Go", "SQLite"],
    image: "/projects/moetracker.png",
    link: "https://example.com",
    github: "https://github.com",
  },
  {
    title: "Kawaii CLI",
    description: "一个可爱的命令行工具集合，包含天气查询、TODO 管理、Git 统计等功能，终端里也能感受到温暖。",
    tags: ["Rust", "CLI"],
    image: "/projects/kawaii.png",
    github: "https://github.com",
  },
  {
    title: "Nijigen UI",
    description: "一套二次元风格的 React 组件库，提供丰富的动画效果和可爱的默认样式，让每个项目都充满活力。",
    tags: ["React", "Storybook", "CSS"],
    image: "/projects/nijigen.png",
    link: "https://example.com",
    github: "https://github.com",
  },
]
