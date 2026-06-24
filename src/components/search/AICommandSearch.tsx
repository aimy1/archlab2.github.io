'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Sparkles, ArrowRight, CornerDownLeft, Search, Command, Zap } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation, useCommandSearchPanel } from '@/components/Providers';
import { cn } from '@/lib/utils';
import type { CommandSearchKind } from '@/lib/command-search';
import logo from '@/im/mi.jpg';

type SearchResult = {
  id: string;
  title: string;
  url: string;
  score: number;
  kind: CommandSearchKind;
  subtitle?: string;
};

const DEBOUNCE_MS = 220;

export default function AICommandSearch() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const { commandSearchOpen, setCommandSearchOpen, toggleCommandSearch } = useCommandSearchPanel();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const runFetch = useCallback(
    (q: string) => {
      if (abortRef.current) abortRef.current.abort();
      if (q.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      const ac = new AbortController();
      abortRef.current = ac;
      setIsLoading(true);
      const lang = language === 'cn' ? 'cn' : 'en';
      fetch(`/api/command-search?q=${encodeURIComponent(q)}&lang=${lang}`, { signal: ac.signal })
        .then((r) => r.json())
        .then((data: { results?: SearchResult[] }) => {
          setResults(Array.isArray(data.results) ? data.results : []);
          setSelected(0);
        })
        .catch((err) => {
          if (err?.name === 'AbortError') return;
          setResults([]);
        })
        .finally(() => {
          if (!ac.signal.aborted) setIsLoading(false);
        });
    },
    [language]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandSearch();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleCommandSearch]);

  useEffect(() => {
    if (!commandSearchOpen) {
      setQuery('');
      setResults([]);
      setSelected(0);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
      setIsLoading(false);
    }
  }, [commandSearchOpen]);

  useEffect(() => {
    const el = rowRefs.current[selected];
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selected, results]);

  const onQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    debounceRef.current = setTimeout(() => runFetch(val), DEBOUNCE_MS);
  };

  const kindLabel = (k: CommandSearchKind) => {
    if (k === 'blog') return t.search.kindBlog;
    if (k === 'tool') return t.search.kindTool;
    return t.search.kindPage;
  };

  const go = (url: string) => {
    setCommandSearchOpen(false);
    router.push(url);
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) setSelected((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      go(results[selected].url);
    }
  };

  return (
    <Dialog open={commandSearchOpen} onOpenChange={setCommandSearchOpen}>
      <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden rounded-3xl gap-0 border border-white/10 bg-card/95 backdrop-blur-2xl shadow-2xl shadow-primary/10">
        <DialogHeader className="sr-only">
          <DialogTitle>{t.search.semanticTitle}</DialogTitle>
        </DialogHeader>

        {/* Header with gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-white/5">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative flex items-center px-6 py-5 gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-inner shrink-0 border border-primary/30">
              <Search className="w-5 h-5 text-primary" aria-hidden />
            </div>
            <Input
              autoFocus
              placeholder={t.search.placeholder}
              className="border-none focus-visible:ring-0 text-lg p-0 bg-transparent h-auto flex-1 min-w-0 placeholder:text-muted-foreground/50 font-medium"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={onKeyDownInput}
              aria-autocomplete="list"
              aria-controls="command-search-results"
              aria-activedescendant={results[selected] ? `cmd-result-${results[selected].id}` : undefined}
            />
            <div className="flex items-center gap-2 shrink-0">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" aria-label={t.search.searching} />
              ) : (
                <kbd className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-muted-foreground shadow-sm">
                  <Command className="w-3 h-3" />K
                </kbd>
              )}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div
          id="command-search-results"
          className="max-h-[min(420px,50vh)] overflow-y-auto p-3"
          role="listbox"
          aria-label={t.search.semanticTitle}
        >
          {results.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-2 py-2">
                <p className="text-[9px] uppercase font-black tracking-[0.2em] text-primary/60 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> {t.search.aiResults}
                </p>
                <span className="text-[9px] text-muted-foreground/50 font-bold">{results.length} {language === 'cn' ? '结果' : 'results'}</span>
              </div>
              {results.map((res, idx) => (
                <Link
                  key={res.id}
                  id={`cmd-result-${res.id}`}
                  ref={(el) => {
                    rowRefs.current[idx] = el;
                  }}
                  href={res.url}
                  role="option"
                  aria-selected={idx === selected}
                  onClick={() => setCommandSearchOpen(false)}
                  onMouseEnter={() => setSelected(idx)}
                  className={cn(
                    'flex items-center justify-between gap-3 p-4 rounded-2xl transition-all duration-200 group',
                    idx === selected
                      ? 'bg-primary/10 shadow-lg shadow-primary/5 ring-1 ring-primary/20 scale-101'
                      : 'hover:bg-white/5 hover:shadow-md'
                  )}
                >
                  <div className="flex flex-col min-w-0 text-left gap-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-wider shrink-0 px-3 py-1 rounded-full shadow-sm",
                        res.kind === 'blog' && "bg-blue-500/10 text-blue-500",
                        res.kind === 'tool' && "bg-purple-500/10 text-purple-500",
                        res.kind === 'page' && "bg-green-500/10 text-green-500"
                      )}>
                        {kindLabel(res.kind)}
                      </span>
                      <span className="font-bold text-sm truncate text-foreground group-hover:text-primary transition-colors">{res.title}</span>
                    </div>
                    {res.subtitle ? (
                      <span className="text-xs text-muted-foreground/70 truncate pl-0.5">{res.subtitle}</span>
                    ) : null}
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-primary/60 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${res.score * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground/50 font-bold">
                        {(res.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0",
                    idx === selected 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
                  )}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length >= 2 && !isLoading ? (
            <div className="p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="font-bold text-foreground">{t.search.noMatches}</p>
                <p className="text-sm text-muted-foreground/60 mt-1">{language === 'cn' ? '尝试其他关键词' : 'Try different keywords'}</p>
              </div>
            </div>
          ) : (
            <div className="p-10 flex flex-col items-center gap-5 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20 overflow-hidden shadow-lg">
                  <Image src={logo} alt="Logo" width={64} height={64} className="object-contain" priority />
                </div>
              </div>
              <div>
                <h3 className="font-headline font-black text-xl tracking-tight">{t.search.semanticTitle}</h3>
                <p className="text-sm text-muted-foreground/70 mt-2 max-w-xs mx-auto leading-relaxed">{t.search.semanticSub}</p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <kbd className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Command className="w-3.5 h-3.5" />K
                </kbd>
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{language === 'cn' ? '快速打开' : 'to open'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 px-5 py-3 bg-white/[0.02] flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 font-black flex items-center gap-1.5">
              <CornerDownLeft className="w-3 h-3" />
              {language === 'cn' ? '选择' : 'Select'}
            </span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 font-black flex items-center gap-1.5">
              <span className="flex gap-0.5">
                <span className="w-3 h-3 rounded bg-white/10 flex items-center justify-center text-[6px]">↑</span>
                <span className="w-3 h-3 rounded bg-white/10 flex items-center justify-center text-[6px]">↓</span>
              </span>
              {language === 'cn' ? '导航' : 'Navigate'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40 font-black">AI Ready</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
