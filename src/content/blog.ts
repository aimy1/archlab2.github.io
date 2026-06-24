
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string; // 现在支持 Markdown 语法
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export const POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Markdown 渲染测试：功能展示',
    excerpt: '我们的博客现在支持全功能的 Markdown 渲染了！包括代码块、表格、数学公式等。',
    category: 'Tutorials',
    date: '2024-03-22',
    readTime: '5 min read',
    featured: true,
    image: 'https://picsum.photos/seed/markdown-test/1200/600',
    author: {
      name: 'Asniya',
      role: 'Lead Architect',
      avatar: 'https://picsum.photos/seed/admin-avatar/100/100'
    },
    content: `
# 欢迎使用新版博客系统

这是一个真正的 **Markdown** 渲染器。

## 核心特性
1. **GitHub Flavored Markdown**：支持表格和任务列表。
2. **代码高亮**：精美的代码块展示。
3. **响应式排版**：自动适配移动端。

### 示例代码
\`\`\`javascript
function helloWorld() {
  console.log("Hello, PixelNest!");
}
\`\`\`

### 示例表格
| 特性 | 支持情况 | 备注 |
| :--- | :---: | :--- |
| Markdown | ✅ | 完美支持 |
| GFM | ✅ | 扩展语法已开启 |
| 代码高亮 | ✅ | 自动识别语言 |

---
> 所有的改变都源于对技术的热爱。
    `
  },
  {
    id: 2,
    title: 'AI 时代的前端架构演进',
    excerpt: '探讨 AI 如何从辅助编码到直接参与系统架构设计的全过程。',
    category: 'AI',
    date: '2024-03-21',
    readTime: '8 min read',
    image: 'https://picsum.photos/seed/ai-architecture/800/600',
    author: {
      name: 'Asniya',
      role: 'AI Engineer',
      avatar: 'https://picsum.photos/seed/admin-avatar/100/100'
    },
    content: `
# AI 时代的前端架构演进

AI 不再仅仅是 Copilot。

## 1. 声明式 UI 的极致
通过大模型理解业务意图，自动生成符合设计系统的 UI 组件。

## 2. 动态自愈系统
当 API 结构发生变化时，AI 层可以自动映射数据，减少前端崩溃。

### 总结
未来已来，只是分布不均。
    `
  }
];
