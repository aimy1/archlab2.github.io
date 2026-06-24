'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark, 
  ThumbsUp,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Hash,
  Activity,
  ListIcon,
  Cpu,
  Layers,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { useTranslation } from '@/components/LanguageProvider';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@/lib/markdown-utils';
import { cn } from '@/lib/utils';
import logo from '@/im/logo.png';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const sanitizeAttribute = (value?: string) => {
  if (!value) return '';
  return value.trim().replace(/^["'`]+|["'`]+$/g, '').trim();
};

const normalizeImageUrl = (value?: string) => {
  const sanitized = sanitizeAttribute(value);
  return sanitized.replace(/\s+/g, '');
};

const convertHtmlImagesToMarkdown = (content: string) => {
  return content.replace(/<img\b[^>]*>/gi, (tag) => {
    const srcMatch = tag.match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)'|`([^`]*)`|([^\s>]+))/i);
    const altMatch = tag.match(/\balt\s*=\s*("([^"]*)"|'([^']*)'|`([^`]*)`|([^\s>]+))/i);
    const rawSrc = srcMatch?.[2] || srcMatch?.[3] || srcMatch?.[4] || srcMatch?.[5] || '';
    const rawAlt = altMatch?.[2] || altMatch?.[3] || altMatch?.[4] || altMatch?.[5] || '';
    const src = normalizeImageUrl(rawSrc);
    const alt = sanitizeAttribute(rawAlt);
    if (!src) return '';
    return `![${alt}](${src})`;
  });
};

const buildChecksum = (seed: string) => {
  let a = 0x9e3779b1;
  let b = 0x85ebca6b;
  for (let i = 0; i < seed.length; i += 1) {
    const code = seed.charCodeAt(i);
    a = Math.imul(a ^ code, 2654435761) >>> 0;
    b = Math.imul((b + code) >>> 0, 1597334677) >>> 0;
  }
  return `${a.toString(16)}${b.toString(16)}`.toUpperCase().slice(0, 12).padEnd(12, '0');
};

const SAVED_POSTS_KEY = 'archlab:favorites';
const HISTORY_KEY = 'archlab:history';

const readSavedPosts = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SAVED_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const MarkdownComponents = {
  h2: ({ children, ...props }: any) => {
    const id = slugify(String(children));
    // Generate a mock hex address based on title
    const hex = slugify(String(children)).substring(0, 4).toUpperCase();
    return (
      <h2 
        id={id} 
        className="group flex items-center gap-3 text-2xl font-black tracking-tight mt-10 mb-4 text-foreground scroll-mt-24 break-words"
        {...props}
      >
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-code text-primary opacity-40 leading-none">[0x{hex}]</span>
          <Hash className="w-4 h-4 text-primary opacity-20 group-hover:opacity-100 transition-all duration-500" />
        </div>
        <span className="flex-1">{children}</span>
      </h2>
    );
  },
  h3: ({ children, ...props }: any) => {
    const id = slugify(String(children));
    return (
      <h3 
        id={id} 
        className="flex items-center gap-3 text-lg font-black mt-8 mb-3 text-foreground/90 tracking-tight scroll-mt-24 group break-words"
        {...props}
      >
        <div className="w-1.5 h-1.5 bg-accent rounded-sm rotate-45 group-hover:scale-150 transition-transform" />
        {children}
      </h3>
    );
  },
  p: ({ ...props }: any) => (
    <p className="mb-4 leading-relaxed text-foreground/80 text-base font-medium antialiased break-words" {...props} />
  ),
  strong: ({ ...props }: any) => (
    <strong className="font-black text-primary border-b border-primary/10 px-0.5 bg-primary/5 rounded-sm" {...props} />
  ),
  em: ({ ...props }: any) => <em className="italic text-accent font-bold px-0.5" {...props} />,
  table: ({ ...props }: any) => (
    <div className="overflow-x-auto my-6 rounded-2xl surface shadow-2xl backdrop-blur-sm">
      <table className="w-full text-xs text-left border-collapse" {...props} />
    </div>
  ),
  th: ({ ...props }: any) => (
    <th className="bg-primary/10 p-4 font-black uppercase tracking-widest text-[9px] text-primary border-b border-white/5" {...props} />
  ),
  td: ({ ...props }: any) => (
    <td className="p-4 border-b border-white/5 text-foreground/70 font-mono break-words" {...props} />
  ),
  blockquote: ({ ...props }: any) => (
    <blockquote className="relative border-l-4 border-primary/40 bg-primary/5 p-6 rounded-r-2xl my-6 overflow-hidden group" {...props}>
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
        <Terminal size={60} />
      </div>
      <div className="relative z-10 italic text-base text-foreground/90 leading-relaxed font-bold break-words">
        {props.children}
      </div>
    </blockquote>
  ),
  pre: ({ ...props }: any) => {
    const [copied, setCopied] = useState(false);
    const [wrap, setWrap] = useState(false);
    const rawContent = props.children?.props?.children;
    const content =
      typeof rawContent === 'string'
        ? rawContent
        : Array.isArray(rawContent)
          ? rawContent.join('')
          : rawContent
            ? String(rawContent)
            : '';
    const rawClass = props.children?.props?.className || '';
    const lang =
      typeof rawClass === 'string' && rawClass.startsWith('language-')
        ? rawClass.replace('language-', '').toUpperCase()
        : 'SYSTEM_BUFFER';
    const lines = typeof content === 'string' ? content.split('\n') : [];
    const preRef = React.useRef<HTMLDivElement | null>(null);
    
    const handleCopy = async () => {
      if (!content) return;
      let success = false;
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(content);
          success = true;
        }
      } catch {
        success = false;
      }
      if (!success) {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = content;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          textarea.style.left = '0';
          textarea.style.top = '0';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          textarea.setSelectionRange(0, textarea.value.length);
          success = document.execCommand('copy');
          document.body.removeChild(textarea);
        } catch {
          success = false;
        }
      }
      if (!success && preRef.current) {
        try {
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            const range = document.createRange();
            range.selectNodeContents(preRef.current);
            selection.addRange(range);
            success = document.execCommand('copy');
            selection.removeAllRanges();
          }
        } catch {
          success = false;
        }
      }
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopied(false);
        window.prompt('复制下面内容', content);
      }
    };

    return (
      <div className="relative my-6 rounded-2xl overflow-hidden surface-strong shadow-3xl group cyber-shimmer">
        <div className="flex items-center justify-between px-5 py-2.5 bg-background/60 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/20" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
              <div className="w-2 h-2 rounded-full bg-green-500/20" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 font-code flex items-center gap-2">
              <Terminal className="w-3 h-3 text-primary" /> {lang}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWrap(v => !v)}
              className="transition-all font-black text-[9px] uppercase tracking-widest flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 text-white/50 hover:text-primary hover:bg-white/5"
              title={wrap ? 'Disable Wrap' : 'Enable Wrap'}
            >
              {wrap ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              {wrap ? 'WRAP' : 'NOWRAP'}
            </button>
            <button 
              onClick={handleCopy}
              className={cn(
                "transition-all font-black text-[9px] uppercase tracking-widest flex items-center gap-2 px-3 py-1 rounded-full border border-white/5",
                copied ? "text-accent bg-accent/10 border-accent/20" : "text-white/40 hover:text-primary hover:bg-white/5"
              )}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'SYNCED' : 'COPY'}
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-6 pointer-events-none bg-gradient-to-r from-background/40 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-6 pointer-events-none bg-gradient-to-l from-background/40 to-transparent" />
          <div ref={preRef} className={cn("p-6 overflow-x-auto font-code text-foreground select-text", wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre")}>
            {lines.length > 0 ? (
              <ol className="list-decimal pl-8 marker:text-primary/40 marker:font-black text-[14px] leading-7">
                {lines.filter(line => line.trim() !== '').map((line, idx) => (
                  <li key={idx} className="pl-2">
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <pre className="text-[14px] leading-7">{content}</pre>
            )}
          </div>
        </div>
      </div>
    );
  },
  code: ({ ...props }: any) => (
    <code className="text-primary font-code bg-primary/10 px-1.5 py-0.5 rounded-md text-[0.9em] font-black border border-primary/10 shadow-inner break-words" {...props} />
  ),
  ul: ({ ...props }: any) => <ul className="space-y-2 my-6 list-none pl-2" {...props} />,
  ol: ({ ...props }: any) => <ol className="space-y-2 my-6 list-decimal pl-6 marker:text-primary marker:font-black" {...props} />,
  li: ({ ...props }: any) => (
    <li className="flex items-start gap-3.5 text-foreground/90 text-base font-medium" {...props}>
      <div className="mt-2 w-2 h-2 bg-primary/20 flex items-center justify-center rounded-sm rotate-45 shrink-0 border border-primary/30 shadow-[0_0_8px_rgba(var(--primary),0.2)]">
        <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
      </div>
      <span className="flex-1 leading-relaxed break-words">{props.children}</span>
    </li>
  ),
  img: ({ src, alt }: any) => {
    const cleanSrc = normalizeImageUrl(src);
    const cleanAlt = sanitizeAttribute(alt);
    if (!cleanSrc) return null;
    return (
      <figure className="my-8 rounded-2xl overflow-hidden border border-white/5 bg-card/40 shadow-2xl">
        <img src={cleanSrc} alt={cleanAlt} className="w-full h-auto object-cover" />
        {cleanAlt && (
          <figcaption className="text-center text-[10px] uppercase tracking-widest font-black text-muted-foreground py-3 border-t border-white/5">
            {cleanAlt}
          </figcaption>
        )}
      </figure>
    );
  },
  a: ({ ...props }: any) => (
    <a 
      className="text-primary font-black underline underline-offset-4 decoration-primary/20 hover:decoration-primary transition-all inline-flex items-center gap-1 group" 
      target="_blank" 
      rel="noopener noreferrer" 
      {...props}
    >
      {props.children}
      <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" /> 
    </a>
  ),
  hr: () => <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
};

export default function BlogPostClient({ post, relatedPosts }: { post: BlogPost, relatedPosts: BlogPost[] }) {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const renderedContent = useMemo(() => convertHtmlImagesToMarkdown(post.content), [post.content]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (language === 'cn') {
        return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const toc = useMemo(() => {
    const headingRegex = /^(#{2,3})\s+(.*)$/gm;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(post.content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = slugify(title);
      headings.push({ level, title, id });
    }
    return headings;
  }, [post.content]);
  
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    if (toc.length === 0) return;
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (manualSelecting.current) return;
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).id;
            setActiveId(id);
          }
        });
      },
      {
        // When heading reaches top third, mark active
        rootMargin: '0px 0px -70% 0px',
        threshold: 0.1,
      }
    );
    const nodes: HTMLElement[] = [];
    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
        nodes.push(el);
      }
    });
    return () => {
      nodes.forEach((n) => observer.unobserve(n));
      observer.disconnect();
    };
  }, [toc]);

  const checksum = useMemo(() => buildChecksum(`${post.slug}|${post.date}|${post.title}`), [post.slug, post.date, post.title]);
  const manualSelecting = React.useRef(false);
  const [isSaved, setIsSaved] = useState(false);

  // 自动记录历史记录
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const currentHref = `/blog/${post.slug}`;
    const isAlreadyInHistory = history.some((item: any) => item.href === currentHref);
    
    if (!isAlreadyInHistory) {
      const newHistoryItem = {
        id: Date.now(),
        title: post.title,
        date: new Date().toLocaleDateString(),
        category: post.category,
        href: currentHref
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    }
  }, [post.slug, post.title, post.category]);

  useEffect(() => {
    const savedPosts = readSavedPosts();
    setIsSaved(savedPosts.some((p: any) => p.href === `/blog/${post.slug}`));
  }, [post.slug]);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: language === 'cn' ? '分享成功' : 'Shared',
          description: language === 'cn' ? '已调用系统分享面板' : 'System share sheet opened.'
        });
        return;
      } catch (error: any) {
        if (error?.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        window.prompt(language === 'cn' ? '复制以下链接' : 'Copy this link', shareUrl);
        return;
      }
      toast({
        title: language === 'cn' ? '链接已复制' : 'Link copied',
        description: language === 'cn' ? '你可以直接粘贴分享给他人' : 'Ready to paste and share.'
      });
    } catch {
      window.prompt(language === 'cn' ? '复制以下链接' : 'Copy this link', shareUrl);
    }
  };
  const handleSave = () => {
    const savedPosts = readSavedPosts();
    const currentHref = `/blog/${post.slug}`;
    const alreadySaved = savedPosts.some((p: any) => p.href === currentHref);
    
    let nextSavedPosts;
    if (alreadySaved) {
      nextSavedPosts = savedPosts.filter((p: any) => p.href !== currentHref);
    } else {
      const newFavorite = {
        id: Date.now(),
        title: post.title,
        date: new Date().toLocaleDateString(),
        category: post.category,
        href: currentHref
      };
      nextSavedPosts = [newFavorite, ...savedPosts];
    }

    try {
      window.localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(nextSavedPosts));
      setIsSaved(!alreadySaved);
      toast({
        title: language === 'cn' ? (!alreadySaved ? '已保存' : '已取消保存') : (!alreadySaved ? 'Saved' : 'Removed'),
        description: language === 'cn'
          ? (!alreadySaved ? '文章已加入个人中心' : '文章已从个人中心移除')
          : (!alreadySaved ? 'Added to profile.' : 'Removed from profile.')
      });
    } catch {
      toast({
        title: language === 'cn' ? '保存失败' : 'Save failed',
        description: language === 'cn' ? '当前环境不支持本地存储' : 'Local storage is unavailable in this environment.'
      });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-[60] origin-left" 
        style={{ scaleX }}
      />

      <div className="relative w-full pt-24 pb-12 bg-white/[0.01] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[30rem] h-[30rem] bg-primary/5 blur-[100px] rounded-full" />
        <div className="container mx-auto max-w-5xl px-6 relative z-10">
          <RevealOnScroll direction="up">
            <Link href="/blog">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary -ml-4 gap-2 mb-6 font-black uppercase tracking-[0.3em] text-[10px] h-10 px-4 rounded-xl hover:bg-white/5">
                <ArrowLeft className="w-4 h-4" /> {t.blog.backToBlog}
              </Button>
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                {post.category}
              </Badge>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 px-3 bg-white/5 rounded-lg border border-white/5">
                <Cpu className="w-3.5 h-3.5" /> ID: {post.slug.substring(0, 8).toUpperCase()}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] max-w-4xl text-foreground mb-8">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 pt-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground font-code border-t border-white/5 w-fit mt-8">
              <div className="flex items-center gap-2 group cursor-default">
                <Calendar className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> {formatDate(post.date)}
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <Clock className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> {post.readTime} min read
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <Image src={logo} alt={post.author.name} width={16} height={16} className="w-4 h-4 rounded-full ring-1 ring-primary/30 group-hover:scale-110 transition-transform" />
                {post.author.name}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3">
          <div className="sticky top-28 space-y-6">
            <RevealOnScroll direction="left">
              <div className="space-y-4">
                {toc.length > 0 && (
                  <div className="p-5 rounded-2xl surface shadow-2xl space-y-4 cyber-shimmer max-h-[70vh] overflow-hidden border border-white/5">
                    <div className="flex items-center justify-between gap-3 text-primary">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shadow-inner">
                          <ListIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest">{language === 'cn' ? '日志索引' : 'SYSTEM_INDEX'}</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse" />
                    </div>
                    <div className="max-h-[56vh] overflow-y-auto overscroll-contain scroll-smooth pr-3 toc-scrollbar">
                      <nav className="space-y-3">
                        {toc.map((item, idx) => (
                          <a
                            key={idx}
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const el = document.getElementById(item.id);
                              if (el) {
                                manualSelecting.current = true;
                                setActiveId(item.id);
                                history.replaceState(null, '', `#${item.id}`);
                                const top = el.getBoundingClientRect().top + window.scrollY - 96;
                                window.scrollTo({ top, behavior: 'smooth' });
                                el.classList.add('ring-2', 'ring-primary/40', 'rounded-lg');
                                toast({ title: language === 'cn' ? '已锁定章节' : 'Section locked', description: item.title });
                                setTimeout(() => {
                                  manualSelecting.current = false;
                                  el.classList.remove('ring-2', 'ring-primary/40', 'rounded-lg');
                                }, 800);
                              }
                            }}
                            className={cn(
                              "group flex items-start gap-3 text-[12px] font-bold transition-all leading-tight rounded-lg px-2 py-1",
                              item.level === 3 ? "pl-6" : "pl-2",
                              activeId === item.id
                                ? "text-primary bg-primary/5"
                                : "text-foreground/80 hover:text-primary"
                            )}
                          >
                            <span
                              className={cn(
                                "font-code",
                                activeId === item.id ? "text-primary" : "text-primary/30 group-hover:text-primary"
                              )}
                            >
                              #
                            </span>
                            {item.title}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  <Button onClick={handleShare} variant="outline" className="w-full justify-between rounded-xl px-5 font-black h-12 text-[10px] uppercase tracking-widest hover:bg-primary transition-all bg-card/40 shadow-xl border-none group">
                    <span className="flex items-center gap-3"><Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> {t.blog.share}</span>
                  </Button>
                  <Button onClick={handleSave} aria-pressed={isSaved} variant="outline" className={cn("w-full justify-between rounded-xl px-5 font-black h-12 text-[10px] uppercase tracking-widest transition-all shadow-xl border-none group", isSaved ? "bg-accent/20 hover:bg-accent/30 text-accent" : "hover:bg-accent bg-card/40")}>
                    <span className="flex items-center gap-3">{isSaved ? <Check className="w-4 h-4 group-hover:scale-110 transition-transform" /> : <Bookmark className="w-4 h-4 group-hover:scale-110 transition-transform" />} {t.blog.save}</span>
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </aside>

        <article className="lg:col-span-9">
          <RevealOnScroll direction="up" threshold={0}>
            <div className="prose prose-base dark:prose-invert max-w-none mb-16 antialiased selection:bg-primary/40 selection:text-white break-words">
              <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                {renderedContent}
              </ReactMarkdown>
            </div>

            {/* --- SYSTEM METADATA GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
               {[
                 { label: 'Status', value: 'VERIFIED_ARCHIVE', icon: ShieldCheck, color: 'text-green-500' },
                 { label: 'Integrity', value: 'ECC_CHECK_PASS', icon: Activity, color: 'text-primary' },
                 { label: 'Checksum', value: `ADDR_${checksum}`, icon: Layers, color: 'text-accent' }
               ].map((meta, i) => (
                 <div key={i} className="p-5 rounded-2xl surface flex flex-col gap-3 shadow-2xl cyber-shimmer group hover:bg-card/60 transition-colors">
                    <meta.icon className={cn("w-5 h-5", meta.color, "group-hover:scale-110 transition-transform")} />
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{meta.label}</p>
                       <p className="text-[11px] font-black font-code truncate tracking-tight">{meta.value}</p>
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-8 bg-primary/5 border border-primary/10 shadow-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-6 relative z-10">
                <Button variant="ghost" className="rounded-2xl h-14 w-14 p-0 bg-background border border-white/10 text-primary shadow-2xl hover:scale-110 transition-all group/btn">
                  <ThumbsUp className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                </Button>
                <div className="text-left space-y-1">
                  <p className="font-black text-2xl tracking-tighter">{t.blog.enjoyed}</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{t.blog.claps}</p>
                </div>
              </div>
              <Button className="rounded-2xl gap-3 font-black h-14 px-8 uppercase tracking-widest text-[11px] bg-primary text-primary-foreground shadow-2xl border-none hover:scale-105 active:scale-95 transition-all relative z-10">
                 <MessageSquare className="w-5 h-5" /> {t.blog.comments}
              </Button>
            </div>

            {relatedPosts.length > 0 && (
              <div className="mt-16 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/5" />
                  <h3 className="text-xs font-black tracking-[0.4em] uppercase text-muted-foreground opacity-40">NEXT_MEMORY_BLOCK</h3>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedPosts.map(related => (
                    <Link key={related.slug} href={`/blog/${encodeURIComponent(related.slug)}`}>
                      <Card className="rounded-[2rem] p-6 h-full flex flex-col justify-between bg-card/40 hover:bg-card/60 transition-all border-none shadow-2xl group cyber-shimmer">
                        <CardContent className="p-0 space-y-4">
                          <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-primary/20 text-primary px-4 py-1 bg-primary/5 rounded-md">
                            {related.category}
                          </Badge>
                          <h4 className="font-black text-lg leading-tight group-hover:text-primary transition-all line-clamp-2 tracking-tight">
                            {related.title}
                          </h4>
                        </CardContent>
                        <div className="pt-6 flex items-center justify-between border-t border-white/5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">{related.readTime} min read</span>
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all shadow-inner">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </RevealOnScroll>
        </article>
      </div>
    </div>
  );
}
