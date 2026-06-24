'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Github, 
  ShieldCheck,
  Activity,
  Box,
  BookText,
  Clock,
  ChevronRight,
  ChevronLeft,
  Terminal
} from 'lucide-react';
import miImage from '@/im/mi.jpg';
import pceaImage from '@/im/pcea.png';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/components/LanguageProvider';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/lib/markdown-utils';

export function ClientHeroSection() {
  const { t } = useTranslation();
  
  const systemInfo = [
    { key: '联系邮箱', value: 'aisaniya.proton.me' },
    { key: '近况', value: '最近在持续完成对karing的语言校对，clashmi可能不会响应国际化语言支持。（其实已经完成了，只不过嫌麻烦没有加入clashmi）' },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 font-code">
      <div className="flex-shrink-0 animate-float opacity-80 scale-90 lg:scale-100 -translate-x-2 md:-translate-x-3">
        <pre className="text-[5px] sm:text-[6px] md:text-[7px] leading-[1] text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
{`
                       ..................
                  ..:::....           ....::...
              ..:::..                       ..:::.
           .::^:.                               .:::.
         .:^^:                                     :^^:
       .^^^:                           ..            :^^:
      :~~^                ..::::.   .^^^^^:           .^^^.
     ^~~:            .:^~~~~~~~~^  .~~^^^^~~^^^^::..    :^~:
    ~~~.         .:^~~~~~~~~~755!. ~~~~~~~~~~~~~~~~~~~^::^~~^
   ~!!.        :~~!~~~~~~~~~~!77!~~~~~~~~~~~~~~~~~~~~~~~~~~^:
  ^!!:       ^!!!!!!!!!!!!!!!~~~~!!!!!!!!!!!!!~~~~!!!~~:..
 .!!!      ^!!!!!!!!!!!!!!!!!!.~!!!!!!!!!!!!!!!!!!~:.
 .!!!      ^!!!!!!!!!!!!!!!!!!.~!!!!!!!!!!!!!!!!!!~:.
 .!!!      ^!!!!!!!!!!!!!!!!!!.~!!!!!!!!!!!!!!!!!!~:.
 ^77:    :!77!!!777!!!!!!!7??7. :7!!!!!!!!77!!^:.
 !77.   ~777777777777777?YYJJJ~  :7777777~^.
 777   !?77777777!!?77?5PP55YY:   .777^.
 ???  !??????7??J: :7PBBBB5PP7     .7?!^:.
 7?J:~???????Y55Y.   ?##G~!GGJ       !????7~:.
 ~JJ?J?JJ?J5GGGP5      ^ .BBGGP^      !J?JJJJJ?!^.
 .JJJJJJJPB##GPGY        G###BP^       ~?~?JJJJJJJ?7~:.
  ~YJJYP#&&B! ~#^       5&&&G~        :?J. ^?YJJJJJYYYY?!:.
   7YY5&@#!   :5       !@@B~        ^5GP5!   :?YYJ7~..:!?YYJ7
    75YP7             :@B~        ~G#GJYG5     ::       .JYY~
     !55J.            Y~        ~GG7.   ^P~            ^Y5Y:
      :YP5!                    ~^.        :          .755?.
        !5P5!.                                     .75PY^
          !5PP?:                                 ^JPPY^
            ^JPGP?^.                         .~JPG5?:
              .^?5GG5J!^..             .:^7JPGP57:
                  .^7YPPGPP5YYJJJJJY55PGGP5J!^.
                       ..:~!7??JJJ??7!^:.
`}
        </pre>
      </div>
      <div className="flex-grow space-y-6 text-left">
        <div className="flex items-center gap-3">
          <span className="text-3xl md:text-4xl font-black tracking-tighter">aimy1</span>
          <span className="text-primary font-bold text-xl">@</span>
          <span className="text-3xl md:text-4xl font-black tracking-tighter opacity-60">archlab</span>
        </div>
        
        <div className="group rounded-2xl bg-transparent transition-all shadow-[0_0_30px_rgba(var(--primary),0.18)] hover:shadow-[0_0_45px_rgba(var(--primary),0.3)] p-3 flex flex-col gap-2.5 divide-y divide-white/5">
          {systemInfo.map((info) => (
            <div key={info.key} className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0">
              <span className="font-black text-primary uppercase tracking-[0.4em] text-[10px]">{info.key}</span>
              <span className="text-foreground font-bold whitespace-normal break-words leading-relaxed text-[13px]">{info.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          {[
            'bg-black', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 
            'bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-white'
          ].map((color, i) => (
            <div key={i} className={cn("w-8 h-4 rounded shadow-inner border border-white/5", color)} />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-6 font-body">
          <Link href="/blog">
            <Button size="lg" className="rounded-xl h-14 px-8 text-[10px] font-black uppercase tracking-widest shadow-2xl bg-primary text-primary-foreground hover:scale-105 transition-all">
              {t.hero.exploreWork} <ArrowRight className="ml-3 w-4 h-4" />
            </Button>
          </Link>
          <Link href="https://github.com/aimy1" target="_blank">
            <Button size="lg" variant="outline" className="rounded-xl h-14 px-8 text-[10px] font-black uppercase tracking-widest border-none glass hover:bg-white/5 transition-all">
              {t.hero.followGithub} <Github className="ml-3 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LatestLogsTile({ posts }: { posts: BlogPost[] }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const displayPosts = posts.slice(0, 9);

  const [animationDirection, setAnimationDirection] = useState('next');

  const nextPost = () => {
    if (!isAnimating) {
      setAnimationDirection('next');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % displayPosts.length);
        setIsAnimating(false);
      }, 500);
    }
  };

  const prevPost = () => {
    if (!isAnimating) {
      setAnimationDirection('prev');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + displayPosts.length) % displayPosts.length);
        setIsAnimating(false);
      }, 500);
    }
  };

  const currentPost = displayPosts[currentIndex];

  return (
    <div className="tiled-card p-6 md:p-8 flex flex-col h-full gap-6 bg-card/40 border-none shadow-xl cyber-shimmer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <BookText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-widest">{t.blog.title}</h3>
        </div>
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-[0.3em] gap-2 text-primary hover:bg-primary/5 rounded-lg px-4 py-2 h-auto">
            {t.blog.readMore} <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center gap-6">
        {/* Book-style card with stack effect */}
        <div className="relative w-full max-w-2xl perspective-1000 h-96">
          {/* Stacked background cards */}
          {displayPosts.slice(0, 3).map((_, index) => (
            <div
              key={`stack-${index}`}
              className="absolute inset-0 rounded-2xl bg-card border border-primary/20 shadow-xl transition-all duration-500"
              style={{
                transform: `translate(${index * 48}px, ${index * 16}px)`,
                zIndex: 10 - index,
                opacity: 1 - (index * 0.3)
              }}
            />
          ))}
          
          {/* Current book cover */}
          <div className={`relative w-full h-full transition-all duration-700 transform-style:preserve-3d hover:rotateY(5deg) hover:rotateX(2deg) z-20 ${isAnimating ? (animationDirection === 'next' ? 'rotate-y-90 opacity-0' : '-rotate-y-90 opacity-0') : 'rotate-y-0 opacity-100'}`}>
            <div className="absolute inset-0 transform-style:preserve-3d">
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={(e) => {
                // Prevent default link behavior when clicking inside the card
                e.preventDefault();
                // Switch to next post
                nextPost();
              }}
            >
              <div className="w-full h-full rounded-2xl bg-card border border-primary/30 shadow-2xl flex flex-col p-8 hover:shadow-3xl hover:border-primary/50 transition-all duration-500 relative overflow-hidden">
                {/* Book spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-primary/80 rounded-l-2xl shadow-lg" />
                

                
                <div className="flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <Badge
                      variant="outline"
                      className="text-[8px] font-black uppercase border-primary/40 text-primary bg-primary/20 px-4 py-1 shrink-0 mb-4 shadow-sm"
                    >
                      {currentPost.category}
                    </Badge>
                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                      {currentPost.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                      {currentPost.excerpt || 'Read this article to learn more about this topic.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-[10px] text-muted-foreground font-black uppercase">
                        {currentPost.readTime} min read
                      </span>
                    </div>
                    <Link href={`/blog/${encodeURIComponent(currentPost.slug)}`} className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors group">
                      <span className="text-[10px] font-black uppercase">Read Article</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            </div>
            {/* Hidden link for SEO and accessibility */}
            <Link href={`/blog/${encodeURIComponent(currentPost.slug)}`} className="sr-only">
              {currentPost.title}
            </Link>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          {displayPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-primary w-8' : 'bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ClientStatsStrip() {
  const { t } = useTranslation();
  
  const stats = [
    { label: t.stats.specialist, value: t.stats.linux, icon: ShieldCheck, color: 'text-primary' },
    { label: t.stats.dev, value: t.stats.active, icon: Activity, color: 'text-secondary' },
    { label: t.stats.profile, value: 'aimy1', icon: Github, color: 'text-accent', href: 'https://github.com/aimy1' },
    { label: t.stats.infra, value: t.stats.secure, icon: Box, color: 'text-foreground' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const content = (
          <div className="tiled-card flex flex-col gap-6 p-8 group bg-card/40 border-none shadow-lg hover:shadow-2xl hover:bg-card transition-all cyber-shimmer">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-muted border border-white/5 transition-all duration-700 group-hover:scale-110 shadow-inner group-hover:rotate-[360deg]", stat.color)}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-black tracking-tighter font-headline leading-none">{stat.value}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-3 opacity-50 group-hover:opacity-100 transition-opacity">{stat.label}</p>
            </div>
          </div>
        );

        return stat.href ? (
          <Link key={i} href={stat.href} target="_blank" className="cursor-pointer h-full">{content}</Link>
        ) : (
          <div key={i} className="h-full">{content}</div>
        );
      })}
    </div>
  );
}

export function ClientArsenalHeader() {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Badge variant="outline" className="px-6 py-2 rounded-full font-black uppercase tracking-[0.4em] text-[9px] border-primary/20 text-primary bg-primary/5 shadow-inner">
        {t.sections.arsenal}
      </Badge>
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85]">{t.sections.arsenalTitle}</h2>
      <p className="text-lg text-muted-foreground font-bold opacity-70 max-w-2xl mx-auto leading-relaxed">
        High-fidelity toolchain precision-engineered for the rolling release philosophy.
      </p>
    </div>
  );
}

export function ClientCTA() {
  const { t } = useTranslation();
  return (
    <div className="relative z-10 max-w-4xl mx-auto space-y-10 py-6">
      <div className="w-24 h-24 bg-muted/50 rounded-3xl flex items-center justify-center text-primary mx-auto border border-white/5 shadow-2xl animate-float">
        <Github className="w-12 h-12" />
      </div>
      <div className="space-y-6">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8]">
          {t.sections.ctaTitle}
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed font-bold max-w-3xl mx-auto opacity-70">
          {t.sections.ctaSub}
        </p>
      </div>
      <div className="pt-8">
        <Link href="https://github.com/aimy1" target="_blank">
          <Button size="lg" className="rounded-2xl h-20 px-12 text-2xl font-black transition-all shadow-[0_20px_60px_rgba(var(--primary),0.3)] bg-primary text-primary-foreground hover:scale-105 border-none">
            GitHub Profile <ArrowRight className="ml-6 w-8 h-8 group-hover:translate-x-3 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function CombinedHeroSection() {
  const { t } = useTranslation();

  const systemInfo = [
    { key: '联系邮箱', value: 'aisaniya.proton.me' },
    { key: '近况', value: '最近在持续完成对karing的语言校对，clashmi可能不会响应国际化语言支持。（其实已经完成了，只不过嫌麻烦没有加入clashmi）' },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-8">
      {/* Left: Hero Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-10 font-code">
        <div className="flex-shrink-0 animate-float opacity-80 scale-75 lg:scale-90 -translate-x-2">
          <pre className="text-[4px] sm:text-[5px] md:text-[6px] leading-[1] text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
{`
                       ..................
                  ..:::....           ....::...
              ..:::..                       ..:::.
           .::^:.                               .:::.
         .:^^:                                     :^^:
       .^^^:                           ..            :^^:
      :~~^                ..::::.   .^^^^^:           .^^^.
     ^~~:            .:^~~~~~~~~^  .~~^^^^~~^^^^::..    :^~:
    ~~~.         .:^~~~~~~~~~755!. ~~~~~~~~~~~~~~~~~~~^::^~~^
   ~!!.        :~~!~~~~~~~~~~!77!~~~~~~~~~~~~~~~~~~~~~~~~~~^:
  ^!!:       ^!!!!!!!!!!!!!!!~~~~!!!!!!!!!!!!!~~~~!!!~~:..
 .!!!      ^!!!!!!!!!!!!!!!!!!.~!!!!!!!!!!!!!!!!!!~:.
 .!!!      ^!!!!!!!!!!!!!!!!!!.~!!!!!!!!!!!!!!!!!!~:.
 .!!!      ^!!!!!!!!!!!!!!!!!!.~!!!!!!!!!!!!!!!!!!~:.
 ^77:    :!77!!!777!!!!!!!7??7. :7!!!!!!!!77!!^:.
 !77.   ~777777777777777?YYJJJ~  :7777777~^.
 777   !?77777777!!?77?5PP55YY:   .777^.
 ???  !??????7??J: :7PBBBB5PP7     .7?!^:.
 7?J:~???????Y55Y.   ?##G~!GGJ       !????7~:.
 ~JJ?J?JJ?J5GGGP5      ^ .BBGGP^      !J?JJJJJ?!^.
 .JJJJJJJPB##GPGY        G###BP^       ~?~?JJJJJJJ?7~:.
  ~YJJYP#&&B! ~#^       5&&&G~        :?J. ^?YJJJJJYYYY?!:.
   7YY5&@#!   :5       !@@B~        ^5GP5!   :?YYJ7~..:!?YYJ7
    75YP7             :@B~        ~G#GJYG5     ::       .JYY~
     !55J.            Y~        ~GG7.   ^P~            ^Y5Y:
      :YP5!                    ~^.        :          .755?.
        !5P5!.                                     .75PY^
          !5PP?:                                 ^JPPY^
            ^JPGP?^.                         .~JPG5?:
              .^?5GG5J!^..             .:^7JPGP57:
                  .^7YPPGPP5YYJJJJJY55PGGP5J!^.
                       ..:~!7??JJJ??7!^:.
`}
          </pre>
        </div>
        <div className="flex-grow space-y-5 text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-black tracking-tighter">aimy1</span>
            <span className="text-primary font-bold text-lg">@</span>
            <span className="text-2xl md:text-3xl font-black tracking-tighter opacity-60">archlab</span>
          </div>

          <div className="group rounded-2xl bg-transparent transition-all shadow-[0_0_30px_rgba(var(--primary),0.18)] hover:shadow-[0_0_45px_rgba(var(--primary),0.3)] p-3 flex flex-col gap-2 divide-y divide-white/5">
            {systemInfo.map((info) => (
              <div key={info.key} className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0">
                <span className="font-black text-primary uppercase tracking-[0.4em] text-[10px]">{info.key}</span>
                <span className="text-foreground font-bold whitespace-normal break-words leading-relaxed text-[12px]">{info.value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            {[
              'bg-black', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
              'bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-white'
            ].map((color, i) => (
              <div key={i} className={cn("w-6 h-3 rounded shadow-inner border border-white/5", color)} />
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-4 font-body">
            <Link href="/blog">
              <Button size="lg" className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest shadow-2xl bg-primary text-primary-foreground hover:scale-105 transition-all">
                {t.hero.exploreWork} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="https://github.com/aimy1" target="_blank">
              <Button size="lg" variant="outline" className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest border-none glass hover:bg-white/5 transition-all">
                {t.hero.followGithub} <Github className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent self-stretch" />

      {/* Right: Identity Card */}
      <Link href="https://github.com/aimy1" target="_blank" className="lg:w-[280px] flex-shrink-0 block">
        <div className="h-full flex items-center justify-center group rounded-2xl p-6 min-h-[280px] transition-all duration-500 relative overflow-hidden">
          {/* Background image */}
          <div className="absolute top-4 right-2 w-16 h-16 opacity-15 transition-opacity duration-500 group-hover:opacity-20">
            <Image src={pceaImage} alt="Background" width={64} height={64} className="object-contain" />
          </div>
          <div className="text-center p-6 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-lg flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-black/60 group-hover:scale-105 group-hover:shadow-xl group-hover:border-primary/30 relative z-10">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border border-primary/30 transition-all duration-500 group-hover:border-primary/60 group-hover:shadow-lg group-hover:rotate-3">
              <Image src={miImage} alt="Profile" width={80} height={80} className="object-cover transition-all duration-500 group-hover:scale-110" />
            </div>
            <h2 className="text-xl font-bold text-white transition-colors duration-500 group-hover:text-primary">aimy1</h2>
            <p className="text-sm text-muted-foreground mt-2 transition-colors duration-500 group-hover:text-white/80">Connect on GitHub</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
