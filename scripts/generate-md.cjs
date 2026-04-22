const fs = require('fs');
const path = require('path');

const mdDir = path.join(process.cwd(), 'md');
const outFile = path.join(process.cwd(), 'src', 'content', 'md-posts.json');

const parse = (content) => {
  const frontmatterRegex = /^---([\s\S]*?)---/;
  const match = content.match(frontmatterRegex);
  const metadata = {};
  if (match) {
    const yaml = match[1].trim();
    yaml.split('\n').forEach((line) => {
      const firstColonIndex = line.indexOf(':');
      if (firstColonIndex !== -1) {
        const key = line.slice(0, firstColonIndex).trim();
        let value = line.slice(firstColonIndex + 1).trim();
        value = value.replace(/^["'](.*)["']$/, '$1').replace(/[\[\]]/g, '');
        metadata[key] = value;
      }
    });
  }
  const body = content.replace(frontmatterRegex, '').trim();
  return { metadata, body };
};

const getImageInfo = (metadata, slug) => {
  const category = metadata.categories || 'Technology';
  const tags = metadata.tags || '';
  const keywords = (category + ' ' + tags).trim() || 'development';
  const hint = keywords.split(/[\s,]+/).slice(0, 2).join(' ');
  const image =
    metadata.image ||
    metadata.cover ||
    'https://picsum.photos/seed/' + encodeURIComponent(slug) + '/1200/600';
  return { image, keywords: hint };
};

const writeEmpty = () => {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, '[]');
};

if (!fs.existsSync(mdDir)) {
  writeEmpty();
  process.exit(0);
}

const filenames = fs.readdirSync(mdDir).filter((f) => f.endsWith('.md'));
const posts = filenames.map((filename) => {
  const filePath = path.join(mdDir, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { metadata, body } = parse(fileContent);
  const slug = filename.replace(/\.md$/, '');
  const words = body.split(/\s+/).length;
  const readTime = '' + Math.ceil(words / 200);
  const { image, keywords } = getImageInfo(metadata, slug);
  return {
    id: slug,
    slug,
    title: metadata.title || slug,
    excerpt:
      (metadata.description || body.substring(0, 160).replace(/[#*`]/g, '')) +
      '...',
    content: body,
    category: metadata.categories || 'General',
    tags: (metadata.tags || '').split(/[\s,]+/).filter(Boolean),
    date: metadata.date ? metadata.date.split(' ')[0] : '2025-01-01',
    readTime,
    image,
    keywords,
    featured: metadata.featured === 'true',
    author: {
      name: 'Asniya',
      role: 'Core Architect',
      avatar:
        'https://picsum.photos/seed/' +
        encodeURIComponent(slug) +
        '-author/400/400'
    }
  };
});

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(posts, null, 2));
