'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Mascot() {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [tailRotation, setTailRotation] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(height > 0 ? winScroll / height : 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    let frameId: number;
    const animate = () => {
      setTailRotation(Math.sin(Date.now() / 600) * 12);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      clearInterval(blinkInterval);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-24 right-8 z-40 transition-all duration-700 cursor-pointer hidden lg:block",
        isHovered ? "scale-125 -translate-y-4" : "scale-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="relative w-24 h-24"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          {/* Ears with secondary color accents */}
          <path d="M15,45 L30,15 L50,45 Z" fill="hsl(var(--primary))" />
          <path d="M50,45 L70,15 L85,45 Z" fill="hsl(var(--primary))" />
          <path d="M22,38 L30,22 L38,38 Z" fill="hsl(var(--secondary) / 0.4)" />
          <path d="M62,38 L70,22 L78,38 Z" fill="hsl(var(--secondary) / 0.4)" />
          
          {/* Main Face Container */}
          <circle cx="50" cy="60" r="38" fill="hsl(var(--primary))" className="transition-colors duration-700" />
          
          {/* Futuristic Glowing Eyes */}
          <g transform={`translate(0, ${isBlinking ? 2 : 0})`}>
            {/* Outer Glow */}
            <circle cx="38" cy="55" r={isBlinking ? "0" : "8"} fill="hsl(var(--primary-foreground) / 0.1)" />
            <circle cx="62" cy="55" r={isBlinking ? "0" : "8"} fill="hsl(var(--primary-foreground) / 0.1)" />
            
            {/* Pupil */}
            <circle cx="38" cy="55" r={isBlinking ? "0" : "5"} fill="hsl(var(--primary-foreground))" />
            <circle cx="62" cy="55" r={isBlinking ? "0" : "5"} fill="hsl(var(--primary-foreground))" />
            
            {/* Catchlight */}
            <circle cx="36" cy="53" r={isBlinking ? "0" : "2"} fill="white" />
            <circle cx="60" cy="53" r={isBlinking ? "0" : "2"} fill="white" />

            {isBlinking && (
              <>
                <line x1="32" y1="55" x2="44" y2="55" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round" />
                <line x1="56" y1="55" x2="68" y2="55" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
          </g>
          
          {/* Nose & Mouth */}
          <path d="M47,65 L53,65 L50,68 Z" fill="hsl(var(--primary-foreground))" />
          <path d="M42,72 Q50,80 58,72" stroke="hsl(var(--primary-foreground))" fill="none" strokeWidth="3" strokeLinecap="round" />
          
          {/* Whiskers */}
          <line x1="15" y1="60" x2="28" y2="62" stroke="hsl(var(--primary-foreground) / 0.2)" strokeWidth="1" />
          <line x1="15" y1="68" x2="28" y2="66" stroke="hsl(var(--primary-foreground) / 0.2)" strokeWidth="1" />
          <line x1="85" y1="60" x2="72" y2="62" stroke="hsl(var(--primary-foreground) / 0.2)" strokeWidth="1" />
          <line x1="85" y1="68" x2="72" y2="66" stroke="hsl(var(--primary-foreground) / 0.2)" strokeWidth="1" />
        </svg>

        {/* Dynamic Bubble with Typewriter Feel */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, x: 20, y: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 20, y: 10 }}
              className="absolute -top-16 -left-32 glass border-primary/20 rounded-[1.5rem] px-5 py-3 text-[10px] font-black uppercase tracking-widest shadow-2xl z-50 min-w-[160px]"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Pixel Assistant</span>
              </div>
              <p className="mt-1 text-muted-foreground leading-tight">Meow! Scanning logs... everything looks perfect.</p>
              <div className="absolute bottom-[-8px] right-6 w-4 h-4 glass border-b border-r rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tail - Responsive to Scroll */}
        <div 
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2.5 bg-gradient-to-b from-primary to-secondary rounded-full origin-top shadow-lg"
          style={{ 
            height: `${25 + scrollProgress * 50}px`, 
            transform: `translateX(-50%) rotate(${tailRotation}deg)`,
            transition: 'height 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        />
      </motion.div>
    </div>
  );
}
