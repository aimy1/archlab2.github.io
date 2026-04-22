
export type Category = 'All' | 'Productivity' | 'Dev' | 'AI' | 'Design' | 'Infrastructure' | 'Security' | 'Social' | 'OS' | 'Network' | 'Privacy' | 'Database' | 'Media' | 'Finance';
export type ResourceType = 'Software' | 'Website' | 'Social' | 'Linux' | 'Proxy';

export interface Resource {
  id: string;
  name: string;
  description: string;
  descriptionCn?: string;
  url: string;
  category: Category;
  type: ResourceType;
  tags: string[];
  logoSlug: string; 
  brandColor?: string;
  featured?: boolean;
}

export const DISCOVERY_RESOURCES: Resource[] = [
  // --- PROXY & NETWORK ---
  { id: 'clash-verge', name: 'Clash Verge (Revive)', description: 'Modern Clash GUI based on Tauri. High-performance and cross-platform.', descriptionCn: '基于 Tauri 的现代 Clash 客户端，高性能且跨平台。', url: 'https://github.com/clash-verge-revive/clash-verge-revive', category: 'Network', type: 'Proxy', tags: ['Tauri', 'Cross-platform'], logoSlug: 'clash', brandColor: '67c23a', featured: true },
  { id: 'sing-box', name: 'sing-box', description: 'The universal proxy platform. Supports almost all proxy protocols.', descriptionCn: '通用代理平台，支持几乎所有主流代理协议。', url: 'https://sing-box.sagernet.org/', category: 'Network', type: 'Proxy', tags: ['Universal', 'Engine'], logoSlug: 'sing-box', brandColor: '000000', featured: true },
  { id: 'surge-mac', name: 'Surge', description: 'The ultimate network debugging and proxy tool for macOS and iOS.', descriptionCn: '适用于 macOS 和 iOS 的终极网络调试和代理工具任务。', url: 'https://nssurge.com/', category: 'Network', type: 'Proxy', tags: ['MacOS', 'Professional'], logoSlug: 'surge', brandColor: '191919', featured: true },
  { id: 'shadowrocket', name: 'Shadowrocket', description: 'Powerful rule-based proxy utility client for iOS.', descriptionCn: 'iOS 上强大的基于规则的代理实用客户端。', url: 'https://apps.apple.com/app/shadowrocket/id932747118', category: 'Security', type: 'Proxy', tags: ['iOS', 'Rule-based'], logoSlug: 'shadowrocket', brandColor: '007aff', featured: true },
  { id: 'stash', name: 'Stash', description: 'Rule-based proxy client for iOS/macOS/tvOS, compatible with Clash.', descriptionCn: 'iOS/macOS/tvOS 上基于规则的代理客户端，完美兼容 Clash。', url: 'https://stash.software/', category: 'Network', type: 'Proxy', tags: ['iOS', 'MacOS'], logoSlug: 'stash', brandColor: '000000' },
  { id: 'tailscale', name: 'Tailscale', description: 'Zero config VPN. Build a secure mesh network in minutes.', descriptionCn: '零配置 VPN，分钟级构建安全的网状网络。', url: 'https://tailscale.com/', category: 'Network', type: 'Proxy', tags: ['SD-WAN', 'Mesh'], logoSlug: 'tailscale', brandColor: '000000', featured: true },
  
  // --- LINUX DISTROS ---
  { id: 'arch', name: 'Arch Linux', description: 'A lightweight and flexible Linux distribution that tries to Keep It Simple (KISS).', descriptionCn: '轻量、灵活的 Linux 发行版，遵循 KISS 原则。', url: 'https://archlinux.org/', category: 'OS', type: 'Linux', tags: ['Rolling', 'DIY'], logoSlug: 'archlinux', brandColor: '1793D1', featured: true },
  { id: 'nixos', name: 'NixOS', description: 'Declarative and reproducible Linux. Configuration is functional and immutable.', descriptionCn: '声明式且可复现的 Linux，配置完全函数化且不可变。', url: 'https://nixos.org/', category: 'Dev', type: 'Linux', tags: ['Declarative', 'Immutable'], logoSlug: 'nixos', brandColor: '5277C3', featured: true },
  { id: 'debian', name: 'Debian', description: 'The Universal Operating System. Rock-solid stability for servers.', descriptionCn: '通用操作系统，为服务器提供磐石般的稳定性。', url: 'https://debian.org/', category: 'OS', type: 'Linux', tags: ['Stable', 'Universal'], logoSlug: 'debian', brandColor: 'A81D33', featured: true },
  { id: 'kali', name: 'Kali Linux', description: 'The standard for penetration testing and digital forensics.', descriptionCn: '渗透测试和数字取证的行业标准发行版。', url: 'https://www.kali.org/', category: 'Security', type: 'Linux', tags: ['Pentest', 'Security'], logoSlug: 'kalilinux', brandColor: '557C94', featured: true },

  // --- SOFTWARE ---
  { id: 'cursor', name: 'Cursor', description: 'The AI Code Editor. Built to help you build software faster.', descriptionCn: 'AI 代码编辑器，旨在加速软件开发流程。', url: 'https://cursor.com/', category: 'Dev', type: 'Software', tags: ['AI', 'IDE'], logoSlug: 'cursor', brandColor: '34D399', featured: true },
  { id: 'obsidian', name: 'Obsidian', description: 'A powerful knowledge base that works on top of a local folder of plain text Markdown files.', descriptionCn: '基于本地 Markdown 文件的强大知识库工具。', url: 'https://obsidian.md/', category: 'Productivity', type: 'Software', tags: ['Knowledge', 'Markdown'], logoSlug: 'obsidian', brandColor: '483699', featured: true },
  { id: 'raycast', name: 'Raycast', description: 'A blazingly fast, extendable launcher for macOS.', descriptionCn: 'macOS 上极速、可扩展的启动器。', url: 'https://raycast.com/', category: 'Productivity', type: 'Software', tags: ['Launcher', 'MacOS'], logoSlug: 'raycast', brandColor: 'FF6363', featured: true },
  { id: 'arc', name: 'Arc Browser', description: 'A browser that actually thinks. Better organization and focused UX.', descriptionCn: '一款会思考的浏览器，具备更好的组织能力和专注体验。', url: 'https://arc.net/', category: 'Productivity', type: 'Software', tags: ['Browser', 'UX'], logoSlug: 'arc', brandColor: 'ffffff', featured: true },
  { id: 'figma', name: 'Figma', description: 'The design platform for teams who build products together.', descriptionCn: '面向团队的协作式产品设计平台。', url: 'https://figma.com/', category: 'Design', type: 'Software', tags: ['Design', 'UX'], logoSlug: 'figma', brandColor: 'F24E1E', featured: true },

  // --- WEBSITES ---
  { id: 'claude', name: 'Claude 3.5', description: 'Anthropic\'s most advanced AI. Best-in-class coding and reasoning.', descriptionCn: 'Anthropic 最先进的 AI，具备顶级的代码和推理能力。', url: 'https://claude.ai/', category: 'AI', type: 'Website', tags: ['LLM', 'AI'], logoSlug: 'anthropic', brandColor: 'D97757', featured: true },
  { id: 'vercel', name: 'Vercel', description: 'The platform for frontend developers. Build, scale, and deploy fast.', descriptionCn: '面向前端开发者的平台，快速构建、扩展及部署。', url: 'https://vercel.com/', category: 'Infrastructure', type: 'Website', tags: ['Hosting', 'NextJS'], logoSlug: 'vercel', brandColor: '000000', featured: true },
  { id: 'supabase', name: 'Supabase', description: 'The open source Firebase alternative. Postgres, Auth, Realtime.', descriptionCn: '开源的 Firebase 替代方案，集成 Postgres 和鉴权。', url: 'https://supabase.com/', category: 'Database', type: 'Website', tags: ['Postgres', 'Backend'], logoSlug: 'supabase', brandColor: '3ECF8E', featured: true },
  { id: 'github-site', name: 'GitHub', description: 'Where the world builds software. Millions of developers and projects.', descriptionCn: '全球软件开发的中心，汇聚数千万开发者。', url: 'https://github.com/', category: 'Dev', type: 'Website', tags: ['Git', 'Community'], logoSlug: 'github', brandColor: '181717', featured: true },

  // --- SOCIAL ---
  { id: 'discord', name: 'Discord', description: 'The digital third place for communities and tech enthusiasts.', descriptionCn: '社区与技术爱好者的数字第三空间。', url: 'https://discord.com/', category: 'Social', type: 'Social', tags: ['Community', 'Chat'], logoSlug: 'discord', brandColor: '5865F2', featured: true },
  { id: 'telegram', name: 'Telegram', description: 'Pure instant messaging — simple, fast, secure, and synced.', descriptionCn: '纯粹的即时通讯——简单、快速、安全且多端同步。', url: 'https://telegram.org/', category: 'Social', type: 'Social', tags: ['Privacy', 'Fast'], logoSlug: 'telegram', brandColor: '26A5E4', featured: true },
  { id: 'x-site', name: 'X / Twitter', description: 'Global real-time conversation platform for news and tech.', descriptionCn: '全球实时对话平台，聚焦新闻与技术前沿。', url: 'https://x.com/', category: 'Social', type: 'Social', tags: ['Real-time', 'News'], logoSlug: 'x', brandColor: '000000', featured: true }
];
