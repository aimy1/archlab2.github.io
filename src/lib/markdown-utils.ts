
import fs from 'fs';
import path from 'path';
import mdPosts from '@/content/md-posts.json';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  image: string;
  keywords: string;
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

/**
 * 健壮的 Frontmatter 解析器，处理引号和特殊字符
 */
function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---([\s\S]*?)---/;
  const match = content.match(frontmatterRegex);
  const metadata: Record<string, string> = {};
  
  if (match) {
    const yamlContent = match[1].trim();
    const lines = yamlContent.split('\n');
    lines.forEach(line => {
      const firstColonIndex = line.indexOf(':');
      if (firstColonIndex !== -1) {
        const key = line.slice(0, firstColonIndex).trim();
        let value = line.slice(firstColonIndex + 1).trim();
        // 移除引号和中括号
        value = value.replace(/^["'](.*)["']$/, '$1').replace(/[\[\]]/g, '');
        metadata[key] = value;
      }
    });
  }
  
  const body = content.replace(frontmatterRegex, '').trim();
  return { metadata, body };
}

/**
 * 根据内容生成相关的关键词和图片
 */
function getRelevantImageInfo(metadata: any, slug: string, body: string) {
  const category = metadata.categories || 'Technology';
  const tags = metadata.tags || '';
  const keywords = `${category} ${tags}`.trim() || 'development';
  
  // 智能提示词：取前两个单词作为 AI 搜索提示
  const hint = keywords.split(/[\s,]+/).slice(0, 2).join(' ');
  
  // 优先使用 Frontmatter 里的图片，否则基于 slug 生成唯一种子图
  const image = metadata.image || metadata.cover || `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/600`;
  
  return { image, keywords: hint };
}

function resolvePostsDirectory() {
  let current = process.cwd();
  for (let i = 0; i < 8; i += 1) {
    const candidate = path.join(current, 'md');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return path.resolve(process.cwd(), 'md');
}

/**
 * 扫描所有文章（用于列表页）
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const postsDirectory = resolvePostsDirectory();
  const fallbackPosts = Array.isArray(mdPosts) ? (mdPosts as BlogPost[]) : [];

  if (!fs.existsSync(postsDirectory)) {
    return fallbackPosts;
  }

  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { metadata, body } = parseFrontmatter(fileContent);
      
      const slug = filename.replace(/\.md$/, '');
      const words = body.split(/\s+/).length;
      // 存储原始分钟数，由客户端格式化
      const readTime = `${Math.ceil(words / 200)}`;
      
      const { image, keywords } = getRelevantImageInfo(metadata, slug, body);

      return {
        id: slug,
        slug: slug,
        title: metadata.title || slug,
        excerpt: metadata.description || body.substring(0, 160).replace(/[#*`]/g, '') + '...',
        content: body,
        category: metadata.categories || 'General',
        tags: (metadata.tags || '').split(/[\s,]+/).filter(Boolean),
        date: metadata.date ? metadata.date.split(' ')[0] : '2025-01-01',
        readTime: readTime,
        image: image,
        keywords: keywords,
        featured: metadata.featured === 'true',
        author: {
          name: 'Asniya',
          role: 'Core Architect',
          avatar: `https://picsum.photos/seed/${encodeURIComponent(slug)}-author/400/400`
        }
      };
    });

  const sorted = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (sorted.length === 0 && fallbackPosts.length > 0) {
    return fallbackPosts;
  }
  return sorted;
}

/**
 * 快速读取单篇文章
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const postsDirectory = resolvePostsDirectory();
  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(postsDirectory, `${decodedSlug}.md`);
  
  if (!fs.existsSync(filePath)) {
    const all = await getAllPosts();
    return all.find(p => p.slug === decodedSlug || p.slug === slug) || null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { metadata, body } = parseFrontmatter(fileContent);
    
    const words = body.split(/\s+/).length;
    const readTime = `${Math.ceil(words / 200)}`;
    
    const { image, keywords } = getRelevantImageInfo(metadata, decodedSlug, body);

    return {
      id: decodedSlug,
      slug: decodedSlug,
      title: metadata.title || decodedSlug,
      excerpt: metadata.description || body.substring(0, 160).replace(/[#*`]/g, '') + '...',
      content: body,
      category: metadata.categories || 'General',
      tags: (metadata.tags || '').split(/[\s,]+/).filter(Boolean),
      date: metadata.date ? metadata.date.split(' ')[0] : '2025-01-01',
      readTime: readTime,
      image: image,
      keywords: keywords,
      featured: metadata.featured === 'true',
      author: {
        name: 'Asniya',
        role: 'Core Architect',
        avatar: `https://picsum.photos/seed/${encodeURIComponent(decodedSlug)}-author/400/400`
      }
    };
  } catch (e) {
    return null;
  }
}
