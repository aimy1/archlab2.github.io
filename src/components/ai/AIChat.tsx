'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Bot, User, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function AIChat() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! I am Pixel. How can I assist you with your project today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const clearHistory = () => {
    setMessages([{ role: 'model', content: 'Neural links reset. Memory purged. How can I help?' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = newMessages.slice(0, -1).map(m => ({
        role: m.role as 'user' | 'model',
        content: m.content
      }));

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history })
      });
      const data = await res.json();
      if (!res.ok || !data?.response) throw new Error('ai-chat failed');

      setMessages(prev => [...prev, { role: 'model', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Connection interrupted. Neural pathways currently unstable." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- TRIGGER BUTTON --- */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            className={cn(
              "w-16 h-16 rounded-[2.2rem] shadow-[0_25px_60px_rgba(147,131,255,0.4)] z-50 p-0 overflow-hidden group border-none transition-all",
              isOpen ? "rotate-90 bg-destructive shadow-destructive/20" : "bg-primary"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-primary animate-pulse opacity-40 group-hover:opacity-60 transition-opacity" />
            {isOpen ? <X className="relative z-10 w-7 h-7 text-white" /> : <Sparkles className="relative z-10 w-7 h-7 text-primary-foreground animate-float" />}
          </Button>
        </motion.div>
      </div>

      {/* --- FLOATING CHAT WINDOW --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-[90] flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] rounded-[3.5rem] overflow-hidden glass border-white/10",
              "bottom-32 right-10",
              isExpanded 
                ? "w-[90vw] h-[85vh] sm:w-[600px] sm:h-[80vh]" 
                : "w-[90vw] h-[600px] sm:w-[420px] max-h-[75vh]"
            )}
          >
            {/* Top Glossy Border Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent z-20" />

            {/* Header */}
            <CardHeader className="bg-primary/5 border-b border-primary/10 py-7 px-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-primary/10 blur-[60px] rounded-full" />
              <CardTitle className="flex items-center justify-between gap-3 text-xl relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-[0_15px_35px_rgba(147,131,255,0.4)] transition-transform hover:scale-110">
                    <Bot className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline font-black tracking-tight text-2xl">Pixel</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Neural Link Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="rounded-2xl h-11 w-11 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all hidden sm:flex"
                  >
                    {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={clearHistory} 
                    className="rounded-2xl h-11 w-11 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-grow p-0 overflow-hidden bg-background/30 backdrop-blur-3xl">
              <ScrollArea className="h-full p-10" viewportRef={scrollRef}>
                <div className="flex flex-col gap-10 pb-6">
                  {messages.map((msg, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      key={i}
                      className={cn(
                        "flex gap-5 max-w-[92%] group",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <div className={cn(
                        "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xl transition-all group-hover:scale-110",
                        msg.role === 'user' ? "bg-primary/20 text-primary" : "bg-accent/60 text-secondary"
                      )}>
                        {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                      </div>
                      <div
                        className={cn(
                          "rounded-[2.5rem] px-7 py-5 text-sm leading-relaxed shadow-3xl transition-all border border-white/5",
                          msg.role === 'user' 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "glass bg-card/90 text-card-foreground rounded-tl-none"
                        )}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <div className="mr-auto flex gap-5 max-w-[92%]">
                      <div className="w-11 h-11 rounded-2xl bg-accent/60 text-secondary flex items-center justify-center shadow-lg animate-pulse">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="glass bg-card/90 text-card-foreground rounded-[2.5rem] rounded-tl-none border border-white/5 px-7 py-5 text-sm flex items-center gap-5 shadow-2xl">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-[10px] text-primary animate-pulse">Processing...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Footer Input */}
            <CardFooter className="p-10 bg-background/50 backdrop-blur-2xl border-t border-primary/10">
              <form onSubmit={handleSubmit} className="flex w-full items-center gap-5 relative">
                <Input
                  placeholder="Type your command..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-[2rem] border-none bg-accent/50 h-16 pl-10 pr-20 focus-visible:ring-2 focus-visible:ring-primary shadow-inner text-lg transition-all"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-2.5 top-2.5 h-11 w-11 rounded-2xl shadow-2xl transition-all hover:scale-110 active:scale-90 bg-primary" 
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
