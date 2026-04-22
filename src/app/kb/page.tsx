'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Link as LinkIcon, 
  ChevronRight, 
  Network, 
  Brain,
  Zap,
  Tag,
  Terminal,
  Shield,
  Code2,
  Layers,
  Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { useTranslation } from '@/components/LanguageProvider';

const TOOLS_DATA = (language: string) => [
  {
    id: 'json-formatter-pro',
    title: language === 'cn' ? '高级 JSON 格式化' : 'Advanced JSON Formatter',
    tags: ['Dev', 'Data'],
    backLinks: 124,
    growth: 98,
    updated: 'Active v2.4',
    icon: Code2
  },
  {
    id: 'regex-tester-ai',
    title: language === 'cn' ? '神经网络正则测试' : 'Neural Regex Tester',
    tags: ['AI', 'Dev'],
    backLinks: 89,
    growth: 95,
    updated: 'Active v1.2',
    icon: Terminal
  },
  {
    id: 'base64-toolkit',
    title: language === 'cn' ? '极速 Base64 工具箱' : 'High-Speed Base64 Toolkit',
    tags: ['Encoding', 'Media'],
    backLinks: 85,
    growth: 92,
    updated: 'Active v1.1',
    icon: Layers
  },
  {
    id: 'jwt-neural-debugger',
    title: language === 'cn' ? 'JWT 神经调试器' : 'Neural JWT Debugger',
    tags: ['Security', 'Auth'],
    backLinks: 215,
    growth: 95,
    updated: 'Active v3.0',
    icon: Shield
  },
  {
    id: 'sql-formatter-pro',
    title: language === 'cn' ? 'SQL 语句架构师' : 'SQL Query Architect',
    tags: ['Database', 'Dev'],
    backLinks: 67,
    growth: 90,
    updated: 'Active v2.1',
    icon: Code2
  },
  {
    id: 'svg-path-optimizer',
    title: language === 'cn' ? 'SVG 纳米优化器' : 'SVG Nano Optimizer',
    tags: ['Design', 'UX'],
    backLinks: 42,
    growth: 88,
    updated: 'Active v0.9',
    icon: Layers
  },
  {
    id: 'cron-job-scheduler',
    title: language === 'cn' ? '可视化 Cron 生成器' : 'Visual Cron Generator',
    tags: ['DevOps', 'System'],
    backLinks: 56,
    growth: 94,
    updated: 'Active v1.5',
    icon: Activity
  },
  {
    id: 'ip-calculator-pro',
    title: language === 'cn' ? '网络 IP 计算器' : 'Network IP Calculator',
    tags: ['Network', 'System'],
    backLinks: 112,
    growth: 96,
    updated: 'Active v3.2',
    icon: Network
  },
  {
    id: 'secure-pass-gen',
    title: language === 'cn' ? '量子级密码生成' : 'Quantum Password Gen',
    tags: ['Security', 'Privacy'],
    backLinks: 156,
    growth: 99,
    updated: 'Active v4.0',
    icon: Shield
  },
  {
    id: 'markdown-live-editor',
    title: language === 'cn' ? '实时 Markdown 引擎' : 'Real-time Markdown Engine',
    tags: ['Writing', 'Web'],
    backLinks: 132,
    growth: 94,
    updated: 'Active v2.8',
    icon: Layers
  }
];

export default function OnlineTools() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const tools = TOOLS_DATA(language);
  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl space-y-4">
      {/* --- HEADER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <RevealOnScroll direction="left" className="h-full">
            <div className="tiled-card cyber-shimmer h-full p-6 md:p-8 flex flex-col justify-center bg-card/40">
              <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 font-bold uppercase tracking-widest text-[9px] mb-6 w-fit">
                {t.garden.badge}
              </Badge>
              <h1 className="font-headline font-bold text-2xl md:text-5xl tracking-tighter leading-none text-foreground">{t.garden.title}</h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl font-medium leading-relaxed mt-4">{t.garden.subtitle}</p>
            </div>
          </RevealOnScroll>
        </div>
        
        <div className="lg:col-span-4 flex items-end">
          <RevealOnScroll direction="right" className="w-full">
            <div className="relative group rounded-[2rem] surface p-2 overflow-hidden cyber-shimmer">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
              <Input 
                className="rounded-[2rem] h-12 pl-14 pr-14 border-none bg-transparent focus-visible:ring-2 focus-visible:ring-primary text-base"
                placeholder={t.garden.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  aria-label="clear"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* --- SIDEBAR --- */}
        <aside className="lg:col-span-3 space-y-4">
          <RevealOnScroll direction="up">
            <div className="tiled-card cyber-shimmer p-8 space-y-6 bg-card/20">
              <h3 className="font-bold uppercase text-[10px] tracking-widest text-primary flex items-center gap-2">
                <Tag className="w-4 h-4" /> {t.garden.trendingTags}
              </h3>
              <div className="flex flex-wrap gap-2">
                {['#Security', '#Network', '#DevOps', '#Database', '#AI', '#Web'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setSearchQuery(tag.replace('#', ''))}
                    className="px-4 py-2 bg-foreground/[0.03] rounded-2xl hover:bg-primary/10 hover:text-primary transition-all text-[10px] font-bold text-muted-foreground"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="up" delay={200}>
            <div className="tiled-card cyber-shimmer p-8 space-y-6 bg-card/20">
              <h3 className="font-bold uppercase text-[10px] tracking-widest text-primary flex items-center gap-2">
                <Brain className="w-4 h-4" /> {t.garden.activeSeedlings}
              </h3>
              <div className="space-y-3">
                {tools.slice(0, 3).map(tool => (
                  <div key={tool.id} className="p-5 glass rounded-[2rem] space-y-3 border-none group cursor-pointer hover:bg-foreground/[0.03] transition-all shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <tool.icon className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold leading-tight group-hover:text-primary transition-colors text-foreground">{tool.title}</p>
                    </div>
                    <div className="w-full h-1 bg-foreground/[0.05] rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${tool.growth}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </aside>

        {/* --- MAIN GRID --- */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTools.map((tool, idx) => (
              <RevealOnScroll key={tool.id} direction="up" delay={idx * 50}>
                <Link href={`/tools/${tool.id}`} className="group block h-full">
                  <div className="tiled-card cyber-shimmer p-8 h-full flex flex-col justify-between space-y-8 bg-card/40 card-hover">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                          <tool.icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                          <LinkIcon className="w-3 h-3" /> {tool.backLinks}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight tracking-tight text-foreground">{tool.title}</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {tool.tags.map((t: string) => (
                            <span key={t} className="text-[8px] bg-foreground/[0.03] text-muted-foreground px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-foreground/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-foreground/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${tool.growth}%` }} />
                          </div>
                          <span className="text-[8px] font-bold uppercase text-muted-foreground">{t.garden.maturity} {tool.growth}%</span>
                        </div>
                        <div className="p-2 rounded-xl bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 shadow-inner">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
            
            {/* CTA Card */}
            <RevealOnScroll direction="up" delay={400}>
              <div className="tiled-card cyber-shimmer border-dashed border-2 border-primary/20 bg-primary/5 p-10 flex flex-col items-center justify-center text-center space-y-6 cursor-pointer hover:bg-primary/10 transition-all group min-h-[300px]">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-xl">
                  <Network className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-xl text-foreground">{t.garden.vizTitle}</h4>
                  <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">{t.garden.vizSub}</p>
                </div>
                <Button variant="outline" className="rounded-full h-11 px-8 gap-2 font-bold text-xs border-primary/20 shadow-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  {t.garden.vizButton} <Zap className="w-3.5 h-3.5 fill-current" />
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
