export type Profile = {
  name: string
  nickname: string
  title: string
  subtitle: string
  avatar: string
  bio: string[]
  now?: {
    watching: string
    reading: string
    listening: string
  }
  siteStart?: string
  skills: string[]
  social: {
    github?: string
    twitter?: string
    bilibili?: string
    email?: string
  }
}

export const profile: Profile = {
  name: "D05",
  nickname: "小零",
  title: "普通路人一枚",
  subtitle: "喜欢搞东搞西，永远热爱自己",
  avatar: "",
  siteStart: "2026-05-24",
  bio: [
    "一名充满热情的全栈开发者，喜欢用代码构建有趣的数字世界。",
    "工作之余，我是一个不折不扣的二次元爱好者，喜欢看番、追漫画、听VOCALOID。",
    "我相信技术和创意可以改变世界，哪怕只是一点点。",
  ],
  now: {
    watching: "BanG Dream! Ave Mujica",
    reading: "终将成为你",
    listening: "VOCALOID — 妄想感傷代償連盟",
  },
  skills: [
    "TypeScript", "React", "Next.js", "Node.js",
    "Python", "PostgreSQL", "Docker", "AWS",
    "Figma", "Tailwind CSS", "GraphQL", "Rust",
  ],
  social: {
    github: "https://github.com/hem0u?tab=repositories",
    twitter: "https://twitter.com",
    bilibili: "https://space.bilibili.com/3546386968611327?spm_id_from=333.1007.0.0",
    email: "hello@example.com",
  },
}
