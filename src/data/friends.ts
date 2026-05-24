export type Friend = {
  name: string
  url: string
  description: string
  avatar?: string
}

export const friends: Friend[] = [
  {
    name: "示例友人A",
    url: "https://example.com",
    description: "前端开发 / 百合爱好者",
  },
  {
    name: "示例友人B",
    url: "https://example.org",
    description: "全栈工程师 / 明日方舟博士",
  },
  {
    name: "示例友人C",
    url: "https://example.dev",
    description: "设计师 / VOCALOID Producer",
  },
  {
    name: "示例友人D",
    url: "https://example.io",
    description: "Rust ace / 同人画师",
  },
]
