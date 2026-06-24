'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { translations, Language, TranslationKey } from '@/lib/translations';

// --- LANGUAGE CONTEXT ---
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
};
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// --- COMMAND SEARCH CONTEXT (must be declared before Providers uses it) ---
type CommandSearchContextType = {
  commandSearchOpen: boolean;
  setCommandSearchOpen: (open: boolean) => void;
  toggleCommandSearch: () => void;
};

const CommandSearchContext = createContext<CommandSearchContextType | undefined>(undefined);

export function useCommandSearchPanel() {
  const ctx = useContext(CommandSearchContext);
  if (!ctx) {
    return {
      commandSearchOpen: false,
      setCommandSearchOpen: () => {},
      toggleCommandSearch: () => {},
    };
  }
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);
  const toggleCommandSearch = useCallback(() => {
    setCommandSearchOpen((o) => !o);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('dark');

    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'cn')) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 320);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      <CommandSearchContext.Provider
        value={{ commandSearchOpen, setCommandSearchOpen, toggleCommandSearch }}
      >
        {children}
        {showBackToTop && (
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-card/80 border border-white/10 shadow-2xl backdrop-blur-xl hover:bg-primary/10 hover:text-primary transition-all"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </CommandSearchContext.Provider>
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: translations.en,
    };
  }
  return context;
}

/**
 * @deprecated Theme is now locked to dark mode.
 */
export function useTheme() {
  return { theme: 'dark', toggleTheme: () => {} };
}
