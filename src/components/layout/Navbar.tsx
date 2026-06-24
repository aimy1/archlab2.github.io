'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BookText, 
  Github, 
  LayoutDashboard, 
  Cpu, 
  Wrench,
  Menu,
  X,
  Languages,
  Eye,
  EyeOff,
  Search,
  Clock,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/components/LanguageProvider';
import { useCommandSearchPanel } from '@/components/Providers';
import { Highlight } from '@/components/ui/highlight';
import Image from 'next/image';
import logo from '@/im/logo.png';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogMenuOpen, setBlogMenuOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  const { setCommandSearchOpen } = useCommandSearchPanel();
  const [bgOff, setBgOff] = useState<boolean>(false);

  const navItems = [
    { name: t.nav.home, href: '/', icon: Home },
    { name: t.nav.garden, href: '/kb', icon: Wrench },
    { name: t.nav.projects, href: '/projects', icon: Github },
    { name: t.nav.console, href: '/dashboard', icon: LayoutDashboard },
    { name: t.nav.lab, href: '/playground', icon: Cpu },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const saved = localStorage.getItem('archlab:bgOff');
    const off = saved === '1';
    setBgOff(off);
    document.body.classList.toggle('bg-off', off);
  }, []);
  
  const toggleBackground = () => {
    const next = !bgOff;
    setBgOff(next);
    document.body.classList.toggle('bg-off', next);
    localStorage.setItem('archlab:bgOff', next ? '1' : '0');
  };

  const isBlogActive = pathname === '/blog' || pathname === '/blog/timeline';

  return (
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-6">
      <nav className={cn(
        "max-w-fit flex items-center gap-3 p-2.5 rounded-full glass transition-all duration-500 shadow-2xl cyber-shimmer",
        isScrolled ? "scale-98 bg-card/95" : "scale-100"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3.5 px-6 py-3.5 rounded-full hover:bg-white/5 transition-all shadow-xl group">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-primary font-black text-[10px] group-hover:rotate-[360deg] transition-transform duration-700 overflow-hidden">
            <Image src={logo} alt="Logo" width={28} height={28} className="object-contain" priority />
          </div>
          <Highlight underline className="text-[11px] uppercase hidden sm:block">ArchLab</Highlight>
        </Link>

        {/* Items */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                  isActive 
                    ? "bg-white/10 text-primary shadow-inner" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon size={14} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
          
          {/* Blog Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setBlogMenuOpen(true)}
            onMouseLeave={() => {
              setTimeout(() => {
                if (!document.querySelector('.blog-dropdown:hover')) {
                  setBlogMenuOpen(false);
                }
              }, 500);
            }}
          >
            <Link 
              href="/blog"
              className={cn(
                "flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                isBlogActive 
                  ? "bg-white/10 text-primary shadow-inner" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <BookText size={14} className={cn(isBlogActive ? "text-primary" : "text-muted-foreground")} />
              {t.nav.blog}
            </Link>
            
            {/* Dropdown Menu */}
            <div 
              className={cn(
                "blog-dropdown absolute top-full left-0 mt-3 py-2 px-2 min-w-[200px] rounded-2xl bg-card/95 border border-white/10 shadow-2xl backdrop-blur-2xl transition-all duration-500 ease-out z-50",
                blogMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto visible" : "opacity-0 -translate-y-3 pointer-events-none invisible"
              )}
              onMouseEnter={() => setBlogMenuOpen(true)}
              onMouseLeave={() => setBlogMenuOpen(false)}
            >
              {/* Arrow pointing up */}
              <div className="absolute -top-1.5 left-8 w-3 h-3 bg-card/95 border-l border-t border-white/10 transform rotate-45" />
              
              <div className="relative z-10">
                <Link 
                  href="/blog"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    pathname === '/blog' 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <BookText size={14} />
                  <span>{language === 'cn' ? '全部文章' : 'All Posts'}</span>
                  {pathname === '/blog' && <ChevronRight size={12} className="ml-auto" />}
                </Link>
                <Link 
                  href="/blog/timeline"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    pathname === '/blog/timeline' 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <Calendar size={14} />
                  <span>{language === 'cn' ? '时间线视图' : 'Timeline View'}</span>
                  {pathname === '/blog/timeline' && <ChevronRight size={12} className="ml-auto" />}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

        {/* Action Capsule */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/5 text-muted-foreground h-12 w-12"
            onClick={() => setCommandSearchOpen(true)}
            title={t.search.semanticTitle}
            aria-label={t.search.semanticTitle}
          >
            <Search size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/5 text-muted-foreground h-12 w-12"
            onClick={toggleBackground}
            title={bgOff ? "开启背景" : "关闭背景"}
          >
            <span className={cn("transition-transform duration-300 ease-out", bgOff ? "rotate-0 scale-100" : "rotate-180 scale-110")}>
              {bgOff ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-muted-foreground h-12 w-12">
                <Languages size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-3xl p-2.5 bg-card/95 border-white/10 shadow-2xl backdrop-blur-2xl">
              <DropdownMenuItem onClick={() => setLanguage('en')} className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3.5 px-6 cursor-pointer hover:bg-primary/10 transition-all">English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('cn')} className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3.5 px-6 cursor-pointer hover:bg-primary/10 transition-all">中文</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
<div id="google-auth-container" className="google-auth-container"></div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden rounded-full hover:bg-white/5 text-muted-foreground h-12 w-12"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-24 bg-background/98 backdrop-blur-3xl z-40 p-6 flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-500 rounded-[3rem] m-4 border border-white/10 shadow-3xl">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setCommandSearchOpen(true);
            }}
            className="p-6 rounded-[2rem] flex items-center gap-4 font-black uppercase tracking-widest text-[12px] bg-primary/15 text-primary border border-primary/25 shadow-sm"
          >
            <Search size={20} />
            {t.search.semanticTitle}
          </button>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "p-6 rounded-[2rem] flex items-center justify-between font-black uppercase tracking-widest text-[12px] transition-all shadow-sm",
                pathname === item.href 
                  ? "bg-primary text-white" 
                  : "bg-white/5 text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-4">
                <item.icon size={20} />
                {item.name}
              </span>
            </Link>
          ))}
          
          {/* Blog item with submenu for mobile */}
          <React.Fragment key="/blog">
            <Link 
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "p-6 rounded-[2rem] flex items-center justify-between font-black uppercase tracking-widest text-[12px] transition-all shadow-sm",
                pathname === "/blog" 
                  ? "bg-primary text-white" 
                  : "bg-white/5 text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-4">
                <BookText size={20} />
                {t.nav.blog}
              </span>
              <ChevronRight size={16} />
            </Link>
            <Link 
              key="/blog/timeline" 
              href="/blog/timeline"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "p-6 rounded-[2rem] flex items-center justify-between font-black uppercase tracking-widest text-[12px] transition-all shadow-sm ml-8",
                pathname === "/blog/timeline" 
                  ? "bg-primary text-white" 
                  : "bg-white/5 text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-4">
                <Calendar size={16} />
                {t.blog.timeline.title}
              </span>
            </Link>
          </React.Fragment>
        </div>
      )}
    </header>
  );
}
