'use client';

import React, { useState } from 'react';
import { 
  Monitor, 
  Cpu, 
  Layers, 
  Sparkles, 
  ExternalLink,
  Terminal,
  Zap,
  Layout,
  Loader2,
  Video,
  Eye,
  Box,
  Infinity as InfinityIcon,
  Wind,
  Command,
  Settings,
  AppWindow,
  MousePointer2,
  Square,
  ChevronRight,
  Workflow
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { useTranslation } from '@/components/LanguageProvider';
import { useToast } from '@/hooks/use-toast';

export default function PlaygroundPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  
  const desktopEnvironments = [
    { id: "kde", title: "KDE Plasma", tech: "Qt / Kwin", description: "Infinite customization powerhouse.", color: "from-blue-500/40 to-cyan-600/40", status: "Daily", icon: Monitor },
    { id: "gnome", title: "GNOME", tech: "GTK4 / Mutter", description: "Minimalist and focused workflow.", color: "from-indigo-500/40 to-blue-600/40", status: "Stable", icon: Layout },
    { id: "xfce", title: "XFCE", tech: "GTK3 / X11", description: "Rock solid and lightweight.", color: "from-gray-500/40 to-slate-600/40", status: "Legacy", icon: Box },
    { id: "cosmic", title: "System76 COSMIC", tech: "Rust / iced", description: "Next-gen high performance GUI.", color: "from-orange-500/40 to-red-600/40", status: "Alpha", icon: Zap },
    { id: "cinnamon", title: "Cinnamon", tech: "GTK3 / Muffin", description: "Traditional desktop experience.", color: "from-green-500/40 to-emerald-600/40", status: "Polished", icon: AppWindow },
    { id: "mate", title: "MATE", tech: "GTK3 / Marco", description: "The continuation of GNOME 2.", color: "from-teal-500/40 to-green-600/40", status: "Classic", icon: Settings },
    { id: "budgie", title: "Budgie", tech: "GTK / Raven", description: "Elegant and modern simplicity.", color: "from-pink-500/40 to-rose-600/40", status: "Modern", icon: MousePointer2 },
    { id: "lxqt", title: "LXQt", tech: "Qt / Openbox", description: "Extremely lightweight Qt desktop.", color: "from-cyan-500/40 to-sky-600/40", status: "Lite", icon: Layers },
    { id: "pantheon", title: "Pantheon", tech: "GTK / Gala", description: "The elementaryOS experience.", color: "from-blue-400/40 to-indigo-500/40", status: "Design", icon: Square },
    { id: "deepin", title: "Deepin DE", tech: "Qt / DTK", description: "Most beautiful out of the box.", color: "from-purple-500/40 to-indigo-600/40", status: "Visual", icon: Sparkles }
  ];

  const windowManagers = [
    { id: "hyprland", title: "Hyprland", tech: "Wayland / wlroots", description: "Dynamic blur and eye-candy.", color: "from-cyan-500/40 to-teal-600/40", status: "Elite", icon: InfinityIcon },
    { id: "i3wm", title: "i3-gaps", tech: "X11 / Polybar", description: "The tiling workflow standard.", color: "from-purple-500/40 to-pink-600/40", status: "Stable", icon: Command },
    { id: "sway", title: "Sway", tech: "Wayland / wlroots", description: "i3-compatible for Wayland.", color: "from-green-500/40 to-emerald-600/40", status: "Modern", icon: Wind },
    { id: "awesome", title: "AwesomeWM", tech: "X11 / Lua", description: "Highly scriptable with Lua.", color: "from-yellow-500/40 to-orange-600/40", status: "Power", icon: Terminal },
    { id: "bspwm", title: "bspwm", tech: "X11 / sxhkd", description: "Binary space partitioning WM.", color: "from-blue-600/40 to-indigo-700/40", status: "Minimal", icon: Workflow },
    { id: "qtile", title: "Qtile", tech: "Python / Wayland", description: "Full control using Python.", color: "from-red-500/40 to-orange-600/40", status: "Dev", icon: Cpu },
    { id: "dwm", title: "dwm", tech: "X11 / C", description: "Suckless and extremely fast.", color: "from-slate-700/40 to-zinc-800/40", status: "Hardcore", icon: Settings },
    { id: "openbox", title: "Openbox", tech: "X11 / XML", description: "Highly configurable stacking WM.", color: "from-amber-500/40 to-yellow-600/40", status: "Legacy", icon: Box }
  ];

  const handleGenerateVideo = async () => {
    toast({ variant: 'destructive', title: 'Disabled', description: 'Video generation is disabled on this deployment.' });
  };

  const ShowcaseCard = ({ item }: { item: any }) => (
    <RevealOnScroll direction="up">
      <Card className="tiled-card cyber-shimmer group flex flex-col p-6 bg-card/40 card-hover border-none h-full justify-between">
        <div className="space-y-5">
          <div className={`relative w-full aspect-video rounded-[2rem] overflow-hidden bg-gradient-to-br ${item.color} flex items-center justify-center shadow-inner`}>
            <item.icon className="w-12 h-12 text-foreground/40 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="bg-background/20 backdrop-blur-md border-foreground/10 text-[7px] uppercase font-black tracking-widest text-foreground">{item.status}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{item.tech}</span>
              <button className="p-1.5 rounded-lg bg-foreground/[0.03] hover:bg-primary/20 transition-all">
                <Eye className="w-3 h-3 text-foreground" />
              </button>
            </div>
            <h3 className="text-xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
            <p className="text-muted-foreground text-[11px] font-medium leading-relaxed opacity-70 line-clamp-2">{item.description}</p>
          </div>
        </div>
        <div className="pt-4">
          <Button variant="outline" className="w-full rounded-xl h-10 gap-2 text-[9px] font-black uppercase tracking-widest border-foreground/5 hover:bg-primary/10 transition-all">
            {t.playground.runDemo} <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    </RevealOnScroll>
  );

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl space-y-24 pb-32">
      {/* --- HEADER --- */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <RevealOnScroll direction="up">
          <div className="w-20 h-20 rounded-[2.5rem] bg-primary/20 flex items-center justify-center text-primary animate-float shadow-2xl cyber-shimmer">
            <Monitor className="w-10 h-10" />
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="up" delay={200} className="space-y-4">
          <h1 className="font-headline font-black text-5xl md:text-7xl tracking-tighter leading-none">{t.playground.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium max-w-2xl opacity-70">
            {t.playground.subtitle}
          </p>
        </RevealOnScroll>
      </div>

      {/* --- DE SECTION --- */}
      <section className="space-y-8">
        <RevealOnScroll direction="left" className="flex items-center gap-4 px-4">
          <div className="h-px flex-1 bg-foreground/5" />
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary/60">{t.playground.sectionDE}</h2>
          <div className="h-px flex-1 bg-foreground/5" />
        </RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {desktopEnvironments.map((de) => (
            <ShowcaseCard key={de.id} item={de} />
          ))}
        </div>
      </section>

      {/* --- WM SECTION --- */}
      <section className="space-y-8">
        <RevealOnScroll direction="right" className="flex items-center gap-4 px-4">
          <div className="h-px flex-1 bg-foreground/5" />
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-secondary/60">{t.playground.sectionWM}</h2>
          <div className="h-px flex-1 bg-foreground/5" />
        </RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {windowManagers.map((wm) => (
            <ShowcaseCard key={wm.id} item={wm} />
          ))}
        </div>
      </section>

      {/* --- AI SYNTHESIZER --- */}
      <RevealOnScroll direction="up">
        <Card className="tiled-card cyber-shimmer group overflow-hidden bg-primary/5 border-none p-0">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden bg-gradient-to-br from-purple-600/30 to-blue-600/30">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 rounded-[2.5rem] glass flex items-center justify-center text-primary shadow-3xl">
                  <Video className="w-10 h-10" />
                </div>
                <Badge className="bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-2xl">
                  {t.playground.veoBadge}
                </Badge>
              </div>
            </div>

            <div className="lg:col-span-7 p-10 space-y-8">
              <div className="space-y-4 text-left">
                <h3 className="text-3xl font-black tracking-tighter text-foreground leading-none">{t.playground.videoGenTitle}</h3>
                <p className="text-muted-foreground text-base font-medium leading-relaxed opacity-70">
                  {t.playground.videoGenDesc}
                </p>
                <div className="space-y-4 pt-4">
                  <Input 
                    placeholder="A cyberpunk i3wm setup with neon matrix rain..."
                    className="rounded-[1.2rem] h-14 bg-accent/40 border-none px-6 text-sm font-medium shadow-inner"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    disabled={isGenerating}
                  />
                  <Button 
                    onClick={handleGenerateVideo}
                    disabled={isGenerating || !videoPrompt}
                    className="w-full h-16 rounded-[1.5rem] gap-4 font-black uppercase tracking-widest text-base shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {isGenerating ? t.playground.videoGenLoading : t.playground.videoGenButton}
                  </Button>
                </div>
              </div>

              {videoResult && (
                <div className="mt-8 rounded-[2rem] overflow-hidden shadow-3xl border border-primary/20 bg-background/40 animate-in zoom-in-95 duration-700">
                  <video src={videoResult} controls className="w-full" autoPlay loop />
                </div>
              )}
            </div>
          </div>
        </Card>
      </RevealOnScroll>

      {/* --- FOOTER CTA --- */}
      <RevealOnScroll direction="up">
        <div className="tiled-card cyber-shimmer p-12 md:p-20 text-center relative overflow-hidden group bg-secondary/5 border-none">
          <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[35rem] h-[35rem] bg-primary/20 blur-[150px] rounded-full group-hover:scale-150 transition-transform duration-3000" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-primary/10 text-primary rounded-full font-black uppercase tracking-[0.4em] text-[10px] border border-primary/10 shadow-inner">
              <Zap className="w-4 h-4 fill-current" /> {t.playground.badge}
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] text-foreground">{t.playground.accessCode}</h2>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
              <Button size="lg" className="rounded-[2rem] h-20 px-12 bg-primary text-primary-foreground hover:scale-105 active:scale-95 gap-6 text-xl font-black shadow-3xl transition-all group">
                 <Terminal className="w-7 h-7 group-hover:rotate-12 transition-transform" /> GitHub Dotfiles
              </Button>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
