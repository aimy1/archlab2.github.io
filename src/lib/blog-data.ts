export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
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

/**
 * 您可以在这里添加您的文章。
 * content 字段支持 HTML 字符串，您可以将 Markdown 转换后的 HTML 放入其中。
 */
export const POSTS: BlogPost[] = [];
