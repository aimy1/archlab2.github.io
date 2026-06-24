import { translations } from '@/lib/translations';
import type { BlogPost } from '@/lib/markdown-utils';

export type CommandSearchKind = 'page' | 'blog' | 'tool';

export type CommandSearchHit = {
  id: string;
  title: string;
  url: string;
  score: number;
  kind: CommandSearchKind;
  subtitle?: string;
};

const TOOL_ENTRIES: Array<{
  id: string;
  titleEn: string;
  titleCn: string;
  descEn: string;
  descCn: string;
  category: string;
}> = [
  { id: 'json-formatter-pro', titleEn: 'JSON Architect', titleCn: 'JSON 架构师', descEn: 'Validate and beautify complex JSON structures.', descCn: '验证并美化复杂的 JSON 结构。', category: 'Dev' },
  { id: 'regex-tester-ai', titleEn: 'Neural Regex', titleCn: '神经网络正则', descEn: 'Pattern matching with real-time feedback.', descCn: '带实时反馈的模式匹配工具。', category: 'Dev' },
  { id: 'base64-toolkit', titleEn: 'Base64 Engine', titleCn: 'Base64 引擎', descEn: 'Dual-path text transformation.', descCn: '文本与 Base64 的双向转换。', category: 'Encoding' },
  { id: 'jwt-neural-debugger', titleEn: 'JWT Inspector', titleCn: 'JWT 检测器', descEn: 'Decrypt and audit JSON Web Tokens.', descCn: '解密并审计 JSON Web 令牌。', category: 'Security' },
  { id: 'secure-pass-gen', titleEn: 'Quantum Pass', titleCn: '量子密码', descEn: 'High-entropy cryptographic generator.', descCn: '高熵加密级别密码生成器。', category: 'Security' },
  { id: 'sql-formatter-pro', titleEn: 'SQL Architect', titleCn: 'SQL 架构师', descEn: 'Optimize and clean database queries.', descCn: '优化并清理数据库查询语句。', category: 'Database' },
  { id: 'ip-calculator-pro', titleEn: 'IP Calculator', titleCn: 'IP 计算器', descEn: 'Subnetting and network range analytics.', descCn: '子网划分与网络范围分析。', category: 'Network' },
  { id: 'svg-path-optimizer', titleEn: 'SVG Nano', titleCn: 'SVG 纳米压缩', descEn: 'Coordinate precision compression.', descCn: '坐标精度的矢量图形压缩。', category: 'Design' },
  { id: 'cron-job-scheduler', titleEn: 'Cron Visualizer', titleCn: 'Cron 可视化', descEn: 'Natural language expression parsing.', descCn: 'Cron 表达式的人类语言解析。', category: 'DevOps' },
  { id: 'markdown-live-editor', titleEn: 'Markdown Live', titleCn: 'Markdown 实时', descEn: 'Live rendering with GFM support.', descCn: '支持 GFM 的实时渲染引擎。', category: 'Writing' },
];

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function tokenize(s: string) {
  return normalize(s)
    .split(/[\s/._\-+]+/)
    .filter((t) => t.length > 0);
}

/** Score 0..1 from query against multiple haystacks; keeps best field match + token bonus */
function scoreAgainst(query: string, ...haystacks: string[]): number {
  const q = normalize(query);
  if (!q) return 0;

  let best = 0;
  for (const raw of haystacks) {
    const t = normalize(raw);
    if (!t) continue;
    if (t === q) best = Math.max(best, 1);
    else if (t.startsWith(q)) best = Math.max(best, 0.94);
    else if (t.includes(q)) best = Math.max(best, 0.82);
    else {
      const qt = tokenize(q);
      const matched = qt.filter((tok) => t.includes(tok));
      if (matched.length > 0) {
        best = Math.max(best, 0.38 + 0.42 * (matched.length / qt.length));
      }
    }
  }

  const qt = tokenize(q);
  const all = normalize(haystacks.join(' '));
  if (qt.length > 1) {
    const allMatch = qt.filter((tok) => all.includes(tok)).length;
    if (allMatch === qt.length) best = Math.max(best, 0.72);
    else if (allMatch > 0) best = Math.max(best, 0.45 + 0.2 * (allMatch / qt.length));
  }

  return best;
}

function staticPageHits(lang: 'en' | 'cn'): Omit<CommandSearchHit, 'score'>[] {
  const t = translations[lang];
  return [
    { id: 'page-home', title: t.nav.home, url: '/', kind: 'page', subtitle: 'ArchLab' },
    { id: 'page-blog', title: t.nav.blog, url: '/blog', kind: 'page', subtitle: t.blog.title },
    { id: 'page-kb', title: t.nav.garden, url: '/kb', kind: 'page', subtitle: t.garden.title },
    { id: 'page-projects', title: t.nav.projects, url: '/projects', kind: 'page', subtitle: t.projects.title },
    { id: 'page-dashboard', title: t.nav.console, url: '/dashboard', kind: 'page', subtitle: t.dashboard.title },
    { id: 'page-playground', title: t.nav.lab, url: '/playground', kind: 'page', subtitle: t.playground.title },
  ];
}

function toolHits(lang: 'en' | 'cn'): Omit<CommandSearchHit, 'score'>[] {
  return TOOL_ENTRIES.map((row) => ({
    id: `tool-${row.id}`,
    title: lang === 'cn' ? row.titleCn : row.titleEn,
    url: `/tools/${row.id}`,
    kind: 'tool' as const,
    subtitle: lang === 'cn' ? row.descCn : row.descEn,
  }));
}

export function commandSearch(query: string, lang: 'en' | 'cn', posts: BlogPost[]): CommandSearchHit[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const buckets: CommandSearchHit[] = [];

  for (const row of staticPageHits(lang)) {
    const score = scoreAgainst(q, row.title, row.subtitle ?? '', row.url);
    if (score > 0.2) buckets.push({ ...row, score });
  }

  for (const row of toolHits(lang)) {
    const meta = TOOL_ENTRIES.find((e) => `tool-${e.id}` === row.id)!;
    const score = scoreAgainst(
      q,
      row.title,
      row.subtitle ?? '',
      meta.titleEn,
      meta.titleCn,
      meta.descEn,
      meta.descCn,
      meta.category,
      meta.id.replace(/-/g, ' ')
    );
    if (score > 0.2) buckets.push({ ...row, score });
  }

  for (const post of posts) {
    const tagStr = post.tags.join(' ');
    const score = scoreAgainst(q, post.title, post.excerpt, post.category, tagStr, post.keywords || '', post.slug);
    if (score > 0.22) {
      buckets.push({
        id: `blog-${post.slug}`,
        title: post.title,
        url: `/blog/${post.slug}`,
        kind: 'blog',
        subtitle: post.category,
        score,
      });
    }
  }

  buckets.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const dedup: CommandSearchHit[] = [];
  for (const h of buckets) {
    if (seen.has(h.url)) continue;
    seen.add(h.url);
    dedup.push(h);
    if (dedup.length >= 12) break;
  }
  return dedup;
}
