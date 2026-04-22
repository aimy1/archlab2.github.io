'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Share2, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookText,
  Activity,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { useTranslation } from '@/components/LanguageProvider';
import type { BlogPost } from '@/lib/markdown-utils';
import Image from 'next/image';
import logo from '@/im/logo.png';

const POSTS_PER_PAGE = 6;

export default function BlogListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { t, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByTime, setSortByTime] = useState(false);
  const buildPostHref = (slug: string) => `/blog/${encodeURIComponent(slug)}`;

  const CATEGORIES = t.blog.categories;

  useEffect(() => {
    const savedSort = localStorage.getItem('archlab:sortByTime');
    if (savedSort) {
      setSortByTime(savedSort === '1');
    }

    const handleSortChange = (e: CustomEvent<boolean>) => {
      setSortByTime(e.detail);
      setCurrentPage(1);
    };

    window.addEventListener('sortByTimeChange', handleSortChange as EventListener);
    return () => window.removeEventListener('sortByTimeChange', handleSortChange as EventListener);
  }, []);
  
  const filteredPosts = useMemo(() => {
    let posts = initialPosts.filter(post => {
      const isAll = activeCategory === 'All' || activeCategory === '全部';
      const catMatch = isAll || 
                       post.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
                       activeCategory.toLowerCase().includes(post.category.toLowerCase());
                              
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return catMatch && matchesSearch;
    });

    if (sortByTime) {
      posts = [...posts].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    }

    return posts;
  }, [initialPosts, activeCategory, searchQuery, sortByTime]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const featuredPost = initialPosts.find(p => p.featured) || initialPosts[0];

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (language === 'cn') {
        return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-4 max-w-7xl">
      {/* --- SYSTEM HEADER --- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-8">
          <RevealOnScroll direction="left" className="h-full">
            <div className="tiled-card cyber-shimmer h-full p-8 md:p-12 flex flex-col justify-center bg-card/40 border-none shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20 overflow-hidden group-hover:rotate-[360deg] transition-transform duration-700">
                    <Image src={logo} alt="Blog Logo" width={32} height={32} className="object-contain" priority />
                  </div>
                  <div className="space-y-0.5">
                    <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-0.5 font-black uppercase tracking-widest text-[8px] shadow-sm">
                      {t.blog.authorRole}
                    </Badge>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/50 ml-1">KERNEL_LOG_ARCHIVE</p>
                  </div>
                </div>
                <h1 className="font-headline font-black text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.85] text-foreground mb-4">
                  {t.blog.title}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-lg font-bold opacity-70 leading-relaxed">
                  {t.blog.subtitle}
                </p>
              </div>
          </RevealOnScroll>
        </div>
        
        <div className="lg:col-span-4 flex items-end">
          <RevealOnScroll direction="right" className="w-full h-full">
            <div className="tiled-card cyber-shimmer h-full flex flex-col justify-between p-8 bg-secondary/5 border-none">
              <div className="space-y-4">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/60 px-2 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Quick Access
                </p>
                <div className="relative group rounded-xl overflow-hidden shadow-xl">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                  <Input 
                    className="rounded-xl pl-12 h-12 glass border-none shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 text-sm bg-background/40 placeholder:text-muted-foreground/30 font-bold"
                    placeholder={t.blog.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="pt-6 grid grid-cols-3 gap-2">
                <div className="p-4 glass rounded-xl bg-background/40 border-none shadow-inner text-center">
                  <p className="text-[7px] font-black text-primary/60 mb-0.5 uppercase tracking-widest">Logs</p>
                  <p className="text-2xl font-black text-foreground">{initialPosts.length}</p>
                </div>
                <div className="p-4 glass rounded-xl bg-background/40 border-none shadow-inner text-center">
                  <p className="text-[7px] font-black text-secondary/60 mb-0.5 uppercase tracking-widest">Scope</p>
                  <p className="text-[10px] font-black truncate text-foreground">{activeCategory === 'All' || activeCategory === '全部' ? 'Global' : activeCategory}</p>
                </div>
                <div className={cn(
                  "p-4 glass rounded-xl border-none shadow-inner text-center transition-all duration-300",
                  sortByTime ? "bg-primary/10" : "bg-background/40"
                )}>
                  <p className={cn(
                    "text-[7px] font-black mb-0.5 uppercase tracking-widest transition-colors",
                    sortByTime ? "text-primary" : "text-muted-foreground/60"
                  )}>Sort</p>
                  <p className={cn(
                    "text-[10px] font-black truncate transition-colors",
                    sortByTime ? "text-primary" : "text-foreground"
                  )}>{sortByTime ? 'Time' : 'Default'}</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- PINNED POST --- */}
      {!searchQuery && (activeCategory === 'All' || activeCategory === '全部') && featuredPost && currentPage === 1 && (
        <RevealOnScroll direction="up">
          <Link href={buildPostHref(featuredPost.slug)}>
            <div className="tiled-card cyber-shimmer group overflow-hidden min-h-[300px] flex flex-col justify-center p-10 md:p-12 bg-primary/5 relative border-none">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none transition-transform duration-15000 group-hover:scale-110">
                  <BookText size={300} className="text-primary rotate-12" />
               </div>
               
               <CardContent className="p-0 flex flex-col justify-center space-y-4 text-left relative z-10 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-4 text-[8px] font-black uppercase tracking-[0.3em] text-primary">
                    <Badge className="bg-primary text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] shadow-xl">
                      <Sparkles className="w-3 h-3 mr-1.5 fill-current" /> {t.blog.featured}
                    </Badge>
                    <div className="flex items-center gap-2 text-foreground/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> {formatDate(featuredPost.date)}
                    </div>
                    <div className="flex items-center gap-2 text-foreground/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 font-bold">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {featuredPost.readTime} min
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black leading-[0.9] tracking-tighter text-foreground group-hover:text-primary transition-all duration-500">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed text-base md:text-lg font-bold opacity-80 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="pt-2">
                    <span className="text-white font-black text-[9px] inline-flex items-center gap-3 group-hover:translate-x-2 transition-all duration-500 uppercase tracking-[0.3em] bg-primary px-6 py-3 rounded-lg shadow-2xl border-none">
                      {t.blog.continueReading} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
               </CardContent>
            </div>
          </Link>
        </RevealOnScroll>
      )}

      {/* --- CATEGORIES --- */}
      <RevealOnScroll direction="up">
        <div className="tiled-card cyber-shimmer p-3 bg-card/20 flex flex-wrap items-center justify-center gap-2 border-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden",
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-xl scale-105' 
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/5'
              )}
            >
              {activeCategory === cat && (
                <motion.div layoutId="active-cat" className="absolute inset-0 bg-primary -z-10" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>
      </RevealOnScroll>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {displayedPosts.map((post, idx) => (
            <motion.div
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
            >
              <Link href={buildPostHref(post.slug)} className="group h-full block">
                <div className="tiled-card cyber-shimmer p-6 flex flex-col h-full bg-card/40 border-none shadow-xl group-hover:bg-white/[0.02] transition-all duration-500 min-h-[320px]">
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow-inner">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground font-black uppercase tracking-widest">
                      <Clock className="w-3 h-3 text-primary/50" /> {post.readTime} min
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-grow">
                    <div className="text-[8px] text-primary/60 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(post.date)}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black group-hover:text-primary transition-all leading-tight tracking-tight text-foreground">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed text-xs font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 flex items-center justify-between mt-auto border-t border-white/5">
                    <span className="text-primary font-black text-[9px] inline-flex items-center gap-2 group-hover:translate-x-1 transition-all uppercase tracking-[0.2em]">
                      {t.blog.readMore} <ArrowRight className="w-4 h-4" />
                    </span>
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-primary/20 transition-all shadow-inner group-hover:scale-110 text-foreground">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- PAGER --- */}
      {totalPages > 1 && (
        <RevealOnScroll direction="up">
          <div className="tiled-card cyber-shimmer p-6 bg-card/20 flex flex-col items-center gap-6 shadow-2xl border-none">
            <div className="flex items-center gap-4">
              <button
                className="rounded-full w-12 h-12 glass border-white/10 hover:bg-primary hover:text-white transition-all shadow-xl disabled:opacity-20 flex items-center justify-center group"
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-2 px-3 py-3 glass rounded-xl border-white/10 shadow-inner bg-background/20">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={cn(
                      "w-10 h-10 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                      currentPage === page 
                        ? "bg-primary text-white shadow-lg scale-110" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {String(page).padStart(2, '0')}
                  </button>
                ))}
              </div>

              <button
                className="rounded-full w-12 h-12 glass border-white/10 hover:bg-primary hover:text-white transition-all shadow-xl disabled:opacity-20 flex items-center justify-center group"
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.6em] text-primary font-code opacity-50">
              BLOCK_SEGMENT {currentPage} / {totalPages}
            </p>
          </div>
        </RevealOnScroll>
      )}
    </div>
  );
}
