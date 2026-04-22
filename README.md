# ArchLab Blog

一个基于 Next.js 15 的技术博客平台，专注于 Linux 系统、Arch Linux、暗网技术等领域的知识分享。

## 技术栈

| 分类 | 技术 |
|------|------|
| **框架** | Next.js 15.5.10, React 19.2.1 |
| **语言** | TypeScript |
| **样式** | Tailwind CSS 3.4.1, Radix UI |
| **动画** | Framer Motion 12.4.7 |
| **图表** | Recharts 2.15.1 |
| **AI** | Genkit 1.28.0, Google GenAI |
| **部署** | Cloudflare Workers/Pages, OpenNext.js |

## 项目结构

```
archlab2.github.io-main/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 首页
│   │   ├── layout.tsx         # 根布局
│   │   ├── globals.css        # 全局样式
│   │   ├── api/                # API 路由
│   │   │   ├── ai-chat/        # AI 聊天 API
│   │   │   └── command-search/ # 命令搜索 API
│   │   ├── blog/               # 博客模块
│   │   │   ├── page.tsx        # 博客列表页
│   │   │   ├── [id]/           # 博客详情页
│   │   │   └── timeline/      # 博客时间线
│   │   ├── dashboard/         # 仪表盘页面
│   │   ├── kb/                 # 知识库页面
│   │   ├── playground/         # AI Playground
│   │   ├── projects/           # 项目展示页
│   │   └── tools/              # 工具页面
│   │       └── [id]/           # 工具详情页
│   ├── components/             # React 组件
│   │   ├── ai/                 # AI 相关组件
│   │   ├── blog/               # 博客相关组件
│   │   ├── effects/            # 视觉效果组件
│   │   ├── home/               # 首页组件
│   │   ├── layout/             # 布局组件
│   │   ├── pixel/              # 像素风格组件
│   │   ├── search/             # 搜索组件
│   │   ├── tools/              # 工具相关组件
│   │   └── ui/                 # UI 基础组件 (Radix UI)
│   ├── content/                # 内容配置
│   │   ├── blog.ts             # 博客数据定义
│   │   └── md-posts.json       # Markdown 文章 JSON 格式
│   ├── hooks/                  # 自定义 React Hooks
│   ├── im/                     # 静态图片资源
│   └── lib/                    # 工具库
│       ├── blog-data.ts        # 博客数据处理
│       ├── command-search.ts   # 命令搜索功能
│       ├── discovery-data.ts   # 发现页数据
│       ├── markdown-utils.ts   # Markdown 解析工具
│       ├── translations.ts      # 国际化翻译
│       └── utils.ts            # 通用工具函数
├── md/                         # Markdown 文章源文件
├── public/                     # 静态公共资源
├── scripts/                    # 构建脚本
│   └── generate-md.cjs         # Markdown 生成脚本
└── ai/                         # AI 配置
    ├── flows/                  # Genkit Flow 定义
    ├── dev.ts                  # Genkit 开发入口
    └── genkit.ts               # Genkit 配置
```

## 页面路由

| 路径 | 描述 |
|------|------|
| `/` | 首页 - 技术展示、统计信息、最新文章 |
| `/blog` | 博客文章列表 |
| `/blog/[id]` | 博客文章详情页 |
| `/blog/timeline` | 博客时间线视图 |
| `/dashboard` | 用户仪表盘 |
| `/kb` | 知识库 |
| `/playground` | AI Playground |
| `/projects` | 项目展示 |
| `/tools` | 工具列表 |
| `/tools/[id]` | 工具详情页 |

## 核心功能

### 博客系统
- Markdown 文章渲染（支持 GFM 语法）
- 文章分类与标签系统
- 基于 `md/` 目录的动态文章加载
- 自动生成阅读时间
- 时间线视图

### AI 功能
- AI 聊天助手 (`/api/ai-chat`)
- 命令搜索 (`/api/command-search`)
- Semantic Search Flow
- Generate Video Flow

### 视觉效果
- 粒子背景 (Particle Background)
- 滚动渐入动画 (RevealOnScroll)
- 点击闪光效果 (ClickSparkles)
- 自定义光标 (CustomCursor)
- 页面过渡动画 (PageTransition)

## 博客文章

文章存放在 `md/` 目录下，使用 Markdown 格式编写，通过 frontmatter 定义元数据：

```markdown
---
title: 文章标题
date: 2025-01-01
categories: 分类
tags: 标签1, 标签2
description: 文章描述
---

文章内容...
```

现有文章主题：
- Arch Linux 教程与配置
- Linux vs Windows vs macOS 对比
- MariaDB 安装指南
- CachyOS + niri + dms 详细安装教程
- Open Claw 安装教程
- 暗网基础知识与 Tor 网站搭建
- 手机安装 Linux
- 各平台 VPN 汇总
- Windows 系统优化

## 环境变量

创建 `.env.local` 文件：

```env
GOOGLE_GENAI_API_KEY=your_api_key
```

## 开发命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 (端口 9003) |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run typecheck` | 运行 TypeScript 类型检查 |
| `npm run generate:md` | 生成 Markdown 文章 JSON |

## 部署

项目支持多种部署方式：

### Cloudflare Pages
```bash
npm run deploy:pages:cf
```

### Cloudflare Workers
```bash
npm run deploy:cf
```

## 样式系统

项目使用 Tailwind CSS 并集成了：
- `@tailwindcss/typography` - 文章排版
- `tailwindcss-animate` - 动画类
- `class-variance-authority` - 组件变体
- Radix UI 原始组件 + `cn` 工具类

### Cyberpunk 风格组件
- `cyber-shimmer` - 闪烁效果
- `glass` - 玻璃态效果
- `bg-grid` - 网格背景

## 作者

- **Asniya** - Core Architect / Lead Developer

## License

Private Project - All Rights Reserved
