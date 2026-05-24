export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "hello-world",
    title: "你好，世界！",
    excerpt: "这是我的第一篇博客文章，记录了我开始构建这个个人网站的历程和心情。",
    date: "2026-05-01",
    tags: ["随笔", "生活"],
    content: `
## 一个新的开始

大家好！欢迎来到我的个人博客。

### 为什么要建这个网站？

一直以来，我都想在互联网上拥有一块属于自己的小天地。这里不需要像社交媒体那样喧嚣，也不会像技术论坛那样严肃。就是一个可以安静记录想法、分享技术心得的地方。

### 技术选型

这个网站使用 Next.js 构建，搭配 Tailwind CSS 和 shadcn/ui 组件库。选择它们的原因很简单：

- **Next.js** —— React 生态中最成熟的全栈框架
- **Tailwind CSS** —— 原子化 CSS，写样式快如闪电
- **shadcn/ui** —— 质量高、可定制性强的组件库

### 一点二次元的私心

作为一个二次元爱好者，我在设计上加入了一些小心思：樱花色调、圆润的卡片边角、柔和的动画效果……希望来访的你能感受到一点点温暖 ✨

### 接下来

我会不定期在这里更新技术文章和生活随笔。如果你感兴趣，欢迎常来看看。

那么，就让我们开始这段旅程吧 🚀
    `,
  },
  {
    slug: "typescript-patterns",
    title: "TypeScript 中那些优雅的设计模式",
    excerpt: "分享几个在实际项目中非常实用的 TypeScript 设计模式，让你的代码更加健壮和优雅。",
    date: "2026-05-10",
    tags: ["TypeScript", "设计模式"],
    content: `
## TypeScript 设计模式实践

TypeScript 的静态类型系统让我们能够实现一些非常优雅的设计模式。

### 1. 品牌类型（Brand Types）

\`\`\`typescript
type Brand<T, B> = T & { __brand: B };
type UserId = Brand<string, 'UserId'>;
type PostId = Brand<string, 'PostId'>;

function getUser(id: UserId) { /* ... */ }

const userId = 'abc' as UserId;
const postId = 'abc' as PostId;

getUser(userId); // OK
getUser(postId); // Error: 类型不兼容
\`\`\`

品牌类型让你在编译时就能区分语义不同但结构相同的类型，避免把 PostId 错误传给接受 UserId 的函数。

### 2. 区分联合类型（Discriminated Unions）

\`\`\`typescript
type Result<T> =
  | { type: 'success'; data: T }
  | { type: 'error'; message: string }
  | { type: 'loading' };

function handleResult<T>(result: Result<T>) {
  switch (result.type) {
    case 'success':
      console.log(result.data); // T
      break;
    case 'error':
      console.error(result.message); // string
      break;
    case 'loading':
      console.log('加载中...');
      break;
  }
}
\`\`\`

通过 \`type\` 字段作为判别标签，TypeScript 能自动收窄类型，在处理异步状态时特别好用。

### 3. Builder 模式

\`\`\`typescript
class QueryBuilder<T> {
  private filters: Partial<T> = {};

  where<K extends keyof T>(key: K, value: T[K]): this {
    this.filters[key] = value;
    return this;
  }

  build(): Partial<T> {
    return { ...this.filters };
  }
}

interface User { name: string; age: number; }

const query = new QueryBuilder<User>()
  .where('name', '小明')
  .where('age', 18)
  .build();
\`\`\`

---
这些模式在实际项目中帮我避免了很多 bug。后续我会继续分享更多实用的技巧！
    `,
  },
  {
    slug: "why-rust",
    title: "一个前端开发者为什么要学 Rust？",
    excerpt: "从前端视角谈谈学习 Rust 的动机、收获和踩过的坑。",
    date: "2026-05-15",
    tags: ["Rust", "前端"],
    content: `
## 前端 × Rust：这不是跨界，是进化

作为一个写了 5 年 JavaScript/TypeScript 的前端开发者，我开始学 Rust 的时候，周围的朋友都觉得我疯了。"前端都不够你学的吗？" 他们问我。

### 为什么是 Rust？

1. **性能极致** —— 当你需要写一个高性能的 WebAssembly 模块，或者一个 CLI 工具时，Rust 是绝佳选择。

2. **类型系统的启迪** —— Rust 的 \`Option\`、\`Result\`、\`trait\` 系统让我对 TypeScript 的类型有了更深的理解。

3. **编译器的温柔** —— Rust 的编译器错误提示非常友好，每次编译失败都是一次学习。

### 从零到一的路径

\`\`\`rust
fn main() {
    let greeting = String::from("Hello, Rust!");
    println!("{greeting}");
}
\`\`\`

推荐学习路径：
- \`rustlings\` 小练习
- 《Rust 程序设计语言》（The Book）
- 用 Rust 重写一个小工具

### 前端与 Rust 的交叉点

现在越来越多前端工具链开始用 Rust 重写：SWC、Turbopack、Rspack……未来可期！

---
学 Rust 不一定要成为 Rust 专家，但它给你的思维方式带来的改变是无价的。
    `,
  },
]
