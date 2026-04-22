'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ExternalLink, 
  Github, 
  ArrowRight, 
  Terminal,
  Star,
  Activity,
  Code2,
  Zap,
  BookOpen,
  AlertCircle,
  Package,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { useTranslation } from '@/components/LanguageProvider';

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  fork: boolean;
  updated_at: string;
  homepage: string;
}

export default function ProjectsPage() {
  const { t, language } = useTranslation();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRepos() {
      setIsLoading(true);
      setError(false);
      try {
        const response = await fetch('https://api.github.com/users/aimy1/repos?sort=updated&per_page=100');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const originalRepos = data.filter((repo: Repository) => !repo.fork);
        setRepos(originalRepos);
      } catch (err) {
        console.error('GitHub fetch failed:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRepos();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'cn' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const featuredRepoNames = ['aa'];
  const featuredRepos = repos.filter(r => featuredRepoNames.includes(r.name));
  const otherRepos = repos.filter(r => !featuredRepoNames.includes(r.name));

  const getRepoDisplayInfo = (name: string) => {
    if (name === 'aa') return { 
      title: t.projects.repo_aa.title, 
      desc: t.projects.repo_aa.desc,
      icon: Zap,
      tag: 'Core Scripts',
      color: 'from-purple-500/20 to-pink-500/20'
    };
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl space-y-4">
      {/* --- HEADER TILE --- */}
      <RevealOnScroll direction="up">
        <div className="tiled-card cyber-shimmer p-12 bg-primary/5 flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-primary/10">
            <Github className="w-3.5 h-3.5" /> {t.projects.badge}
          </div>
          <h1 className="font-headline font-black text-5xl md:text-7xl tracking-tighter leading-none">
            {t.projects.title} <span className="text-gradient italic">{t.projects.titleAccent}</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed opacity-70">
            {t.projects.subtitle}
          </p>
        </div>
      </RevealOnScroll>

      {/* --- FEATURED REPO --- */}
      {!isLoading && !error && featuredRepos.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {featuredRepos.map((repo) => {
            const info = getRepoDisplayInfo(repo.name);
            const Icon = info?.icon || Code2;
            return (
              <RevealOnScroll key={repo.id} direction="up" className="h-full">
                <Card className="tiled-card cyber-shimmer group h-full flex flex-col p-0 bg-card/40 card-hover border-none">
                  <div className={cn("relative h-48 overflow-hidden bg-gradient-to-br", info?.color || "from-primary/10 to-secondary/10")}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-20 h-20 text-white/20 group-hover:scale-125 transition-transform duration-1000" />
                    </div>
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-white/10 backdrop-blur-md border-none px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-2xl">
                        {info?.tag || 'Mission Critical'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-10 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                          <Package className="w-3.5 h-3.5" /> Source Authenticated
                        </span>
                        <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-yellow-500" />
                          {repo.stargazers_count}
                        </div>
                      </div>
                      <h3 className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors leading-tight">
                        {info?.title || repo.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed font-medium text-sm opacity-70 line-clamp-2">
                        {info?.desc || repo.description || "No description provided."}
                      </p>
                    </div>

                    <Link href={repo.html_url} target="_blank">
                      <Button className="w-full rounded-2xl h-14 gap-3 text-sm font-black uppercase tracking-widest shadow-xl">
                        {t.projects.viewGithub} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            );
          })}
        </div>
      )}

      {/* --- ARCHIVE GRID --- */}
      <section className="space-y-4">
        {!isLoading && !error && (
          <RevealOnScroll direction="left">
            <div className="tiled-card cyber-shimmer p-8 bg-secondary/5 flex items-center gap-4">
              <Terminal className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-[0.2em]">{t.projects.archiveTitle}</h2>
            </div>
          </RevealOnScroll>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="tiled-card p-10 space-y-4 bg-card/40">
                <Skeleton className="h-8 w-3/4 bg-foreground/5 rounded-lg" />
                <Skeleton className="h-16 w-full bg-foreground/5 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 bg-foreground/5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <RevealOnScroll direction="up">
            <div className="tiled-card p-20 text-center bg-destructive/5 cyber-shimmer flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight">{t.projects.error}</h2>
                <p className="text-muted-foreground text-sm font-medium">GitHub API connection interrupted. Rate limit may have been reached.</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full h-12 px-8 font-black uppercase tracking-widest text-xs border-destructive/20 hover:bg-destructive/5">Retry System Sync</Button>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherRepos.map((repo, idx) => (
              <RevealOnScroll key={repo.id} direction="up" delay={idx * 30}>
                <Card className="tiled-card cyber-shimmer group h-full flex flex-col p-8 bg-card/40 card-hover border-none">
                  <CardContent className="p-0 flex flex-col justify-between flex-1 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[8px] uppercase font-black tracking-widest border-primary/20 text-primary px-3 py-0.5">
                          {repo.language || 'Config'}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground font-bold text-[10px]">
                          <Star className="w-3 h-3" />
                          {repo.stargazers_count}
                        </div>
                      </div>
                      <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors text-foreground">
                        {repo.name}
                      </h3>
                      <p className="text-muted-foreground text-[11px] line-clamp-2 font-medium leading-relaxed opacity-60">
                        {repo.description || "Experimental repository for system optimization."}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-foreground/5">
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        {t.projects.updated}: {formatDate(repo.updated_at)}
                      </div>
                      <Link href={repo.html_url} target="_blank">
                        <Button variant="outline" className="w-full rounded-xl h-10 gap-2 text-[10px] font-black uppercase tracking-widest border-foreground/5 hover:bg-primary/10">
                          {t.projects.viewGithub} <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </section>

      {/* --- STATS TILES --- */}
      <RevealOnScroll direction="up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Original Works', value: `${repos.length} Repos`, icon: Activity, color: 'text-green-500' },
            { label: 'Primary Focus', value: 'Arch / Bash', icon: Terminal, color: 'text-primary' },
            { label: 'Ecosystem', value: 'OSS Core', icon: Layers, color: 'text-secondary' }
          ].map((stat, i) => (
            <div key={i} className="tiled-card cyber-shimmer p-10 flex flex-col items-center text-center space-y-2 bg-card/40">
              <div className={cn("w-12 h-12 rounded-2xl bg-foreground/[0.03] flex items-center justify-center mb-2 shadow-inner", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-black tracking-tighter text-foreground font-headline">{stat.value}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      {/* --- FINAL CTA TILE --- */}
      <RevealOnScroll direction="up">
        <div className="tiled-card cyber-shimmer bg-primary/10 p-16 md:p-24 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[35rem] h-[35rem] bg-secondary/10 blur-[150px] rounded-full group-hover:scale-125 transition-transform duration-3000" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="w-24 h-24 bg-foreground/[0.03] rounded-[2.5rem] flex items-center justify-center text-primary mx-auto shadow-2xl animate-float">
              <Github className="w-12 h-12" />
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-foreground">
              {t.projects.followTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium max-w-xl mx-auto opacity-60">
              {t.projects.followSub}
            </p>
            <div className="pt-6">
              <Link href="https://github.com/aimy1" target="_blank">
                <Button size="lg" className="rounded-[2.5rem] h-20 px-12 text-xl font-black transition-all shadow-3xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 group">
                  Connect on GitHub <ExternalLink className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
