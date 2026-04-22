'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, Mail, Terminal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/components/LanguageProvider';

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      toast({
        title: t.newsletter.success,
        description: t.newsletter.successSub,
      });
      setEmail('');
    }, 1500);
  };

  return (
    <RevealOnScroll direction="up">
      <div className="relative glass rounded-[5rem] p-12 md:p-28 overflow-hidden shadow-3xl group mt-16 bg-card/20 border-white/5 cyber-shimmer">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[45rem] h-[40rem] bg-primary/15 blur-[150px] rounded-full group-hover:scale-125 transition-transform duration-4000 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[45rem] h-[40rem] bg-secondary/15 blur-[150px] rounded-full group-hover:scale-125 transition-transform duration-4000 pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-5 px-8 py-3 bg-primary/10 text-primary rounded-full text-[11px] font-black uppercase tracking-[0.4em] border border-primary/10 shadow-inner">
                <Sparkles className="w-5 h-5 fill-current animate-pulse" /> {t.newsletter.badge}
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-6xl md:text-8xl font-black tracking-[-0.06em] leading-[0.85] text-white">
                {t.newsletter.title}
              </h2>
              <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed font-medium max-w-2xl opacity-70">
                {t.newsletter.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-6 justify-center lg:justify-start pt-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-accent/40 flex items-center justify-center text-primary font-black text-[11px] shadow-2xl">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 font-code">
                JOIN_USER_LIST: 2,400+
              </p>
            </div>
          </div>

          <div className="w-full lg:w-auto min-w-[450px]">
            {status === 'success' ? (
              <div className="flex flex-col items-center gap-8 text-center animate-in zoom-in-95 duration-700 bg-green-500/5 p-16 rounded-[4rem] border border-green-500/10 shadow-3xl">
                <div className="w-28 h-28 bg-green-500/20 text-green-500 rounded-[3rem] flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-14 h-14" />
                </div>
                <div className="space-y-3">
                  <p className="text-4xl font-black tracking-tighter text-white">{t.newsletter.success}</p>
                  <p className="text-lg text-muted-foreground font-medium opacity-70">{t.newsletter.successSub}</p>
                </div>
                <Button variant="ghost" className="mt-8 rounded-2xl font-black uppercase tracking-[0.3em] h-14 px-10 hover:bg-white/5 border border-white/5" onClick={() => setStatus('idle')}>
                  {t.newsletter.resubscribe}
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="glass bg-white/5 p-12 rounded-[4rem] border border-white/5 shadow-3xl space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Terminal size={150} />
                  </div>
                  
                  <form onSubmit={handleSubscribe} className="space-y-8 relative z-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60 px-4 block">System Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          type="email" 
                          placeholder={t.newsletter.placeholder} 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-20 rounded-[2rem] pl-20 pr-10 border-none glass bg-background/40 text-xl focus-visible:ring-2 focus-visible:ring-primary shadow-inner font-medium"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-20 rounded-[2rem] gap-5 font-black uppercase text-base tracking-[0.3em] shadow-3xl transition-all hover:scale-[1.02] active:scale-95 group bg-primary text-primary-foreground"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>{t.newsletter.subscribe} <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" /></>
                      )}
                    </Button>
                  </form>
                </div>
                <p className="text-[10px] text-center text-muted-foreground/30 uppercase font-black tracking-[0.6em] px-12 leading-relaxed">
                  {t.newsletter.noSpam} — Strictly encrypted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
