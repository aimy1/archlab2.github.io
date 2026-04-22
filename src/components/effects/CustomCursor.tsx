
'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.6 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block overflow-hidden">
      {/* Dynamic Halo */}
      <motion.div
        style={{
          translateX: ringX,
          translateY: ringY,
        }}
        className="absolute top-0 left-0 w-12 h-12 -ml-6 -mt-6 rounded-full border border-primary/30 mix-blend-difference"
        animate={{
          scale: isClicked ? 0.7 : isHovering ? 1.8 : 1,
          borderWidth: isHovering ? '1px' : '1.5px',
          backgroundColor: isHovering ? 'hsl(var(--primary) / 0.1)' : 'transparent',
          rotate: isHovering ? 90 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
      
      {/* Digital Core */}
      <motion.div
        style={{
          translateX: cursorX,
          translateY: cursorY,
        }}
        className="absolute top-0 left-0 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-sm bg-primary shadow-[0_0_20px_rgba(147,131,255,0.8)]"
        animate={{
          scale: isClicked ? 1.4 : isHovering ? 0.5 : 1,
          borderRadius: isHovering ? '50%' : '2px',
          rotate: isClicked ? 45 : 0
        }}
      />

      {/* Orbiting Ring */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              translateX: cursorX,
              translateY: cursorY,
            }}
            className="absolute top-0 left-0 w-14 h-14 -ml-7 -mt-7 border-t-2 border-l-2 border-secondary/40 rounded-full animate-spin-slow"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
