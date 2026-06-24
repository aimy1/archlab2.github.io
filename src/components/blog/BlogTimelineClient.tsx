'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { useTranslation } from '@/components/LanguageProvider';
import type { BlogPost } from '@/lib/markdown-utils';
import Image from 'next/image';
import logo from '@/im/logo.png';

const POSTS_PER_PAGE = 10;

export default function BlogTimelineClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { t, language } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const buildPostHref = (slug: string) => `/blog/${encodeURIComponent(slug)}`;

  // Group posts by year
  const postsByYear = useMemo(() => {
    const grouped: Record<string, BlogPost[]> = {};
    initialPosts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(post);
    });
    return grouped;
  }, [initialPosts]);

  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  // Filter posts by selected year
  const filteredPosts = useMemo(() => {
    if (selectedYear) {
      return postsByYear[selectedYear] || [];
    }
    return initialPosts;
  }, [initialPosts, postsByYear, selectedYear]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

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

  const formatShortDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (language === 'cn') {
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-4 max-w-7xl">
      {/* --- HEADER --- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-8">
          <RevealOnScroll direction="left" className="h-full">
            <div className="tiled-card cyber-shimmer h-full p-8 md:p-10 flex flex-col justify-center bg-card/40 border-none">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20 overflow-hidden">
                  <Image src={logo} alt="Blog Logo" width={28} height={28} className="object-contain" priority />
                </div>
                <div className="space-y-0.5">
                  <Badge className="bg-primary/10 text-primary border-none rounded-full px-3 py-0.5 font-black uppercase tracking-widest text-[8px]">
                    {t.blog.timeline.badge}
                  </Badge>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/50 ml-1">{t.blog.timeline.archiveLabel}</p>
                </div>
              </div>
              <h1 className="font-headline font-black text-4xl md:text-6xl tracking-tighter leading-[0.85] text-foreground">
                {t.blog.timeline.title}
              </h1>
              <p className="text-base text-muted-foreground max-w-lg font-bold opacity-70 mt-6 leading-relaxed">
                {t.blog.timeline.subtitle}
              </p>
            </div>
          </RevealOnScroll>
        </div>
        
        <div className="lg:col-span-4 flex items-end">
          <RevealOnScroll direction="right" className="w-full h-full">
            <div className="tiled-card cyber-shimmer h-full flex flex-col justify-between p-8 bg-secondary/5 border-none">
              <div className="space-y-4">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/60 px-2 flex items-center gap-2">
                  <Filter className="w-3 h-3" /> {t.blog.timeline.filterByYear}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedYear(null); setCurrentPage(1); }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      selectedYear === null
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                    )}
                  >
                    {language === 'cn' ? '全部' : 'All'}
                  </button>
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => { setSelectedYear(year); setCurrentPage(1); }}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        selectedYear === year
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-6 grid grid-cols-2 gap-2">
                <div className="p-4 glass rounded-xl bg-background/40 border-none shadow-inner text-center">
                  <p className="text-[7px] font-black text-primary/60 mb-0.5 uppercase tracking-widest">{t.blog.timeline.total}</p>
                  <p className="text-2xl font-black text-foreground">{initialPosts.length}</p>
                </div>
                <div className="p-4 glass rounded-xl bg-background/40 border-none shadow-inner text-center">
                  <p className="text-[7px] font-black text-secondary/60 mb-0.5 uppercase tracking-widest">{t.blog.timeline.years}</p>
                  <p className="text-2xl font-black text-foreground">{years.length}</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- TIMELINE --- */}
      <RevealOnScroll direction="up">
        <div className="tiled-card cyber-shimmer p-6 md:p-8 bg-card/20 border-none">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[19px] md:left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
            
            <div className="space-y-6">
              {displayedPosts.map((post, idx) => {
                const year = new Date(post.date).getFullYear().toString();
                const isFirstOfYear = idx === 0 || 
                  new Date(displayedPosts[idx - 1].date).getFullYear().toString() !== year;
                
                return (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="relative"
                  >
                    {/* Year Marker */}
                    {isFirstOfYear && (
                      <div className="flex items-center gap-4 mb-4 -ml-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center z-10">
                          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                        </div>
                        <span className="text-lg md:text-xl font-black text-primary tracking-tight">{year}</span>
                        <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent" />
                      </div>
                    )}
                    
                    {/* Post Item */}
                    <Link href={buildPostHref(post.slug)} className="group block ml-12 md:ml-16">
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-primary/5 transition-all border border-white/5 hover:border-primary/20">
                        {/* Date Badge */}
                        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px] py-2 px-3 rounded-xl bg-background/50 border border-white/5">
                          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-xl md:text-2xl font-black text-foreground leading-none">
                            {new Date(post.date).getDate()}
                          </span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary bg-primary/5">
                              {post.category}
                            </Badge>
                            <span className="flex items-center gap-1 text-[9px] text-muted-foreground font-black uppercase">
                              <Clock3 className="w-3 h-3" /> {post.readTime}m
                            </span>
                          </div>
                          <h3 className="text-base md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1 opacity-70">
                            {post.excerpt}
                          </p>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-primary/20 transition-all self-center">
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </RevealOnScroll>

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
              {t.blog.timeline.segment} {currentPage} / {totalPages}
            </p>
          </div>
        </RevealOnScroll>
      )}
    </div>
  );
}
