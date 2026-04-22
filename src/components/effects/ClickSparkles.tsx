'use client';

import React, { useEffect, useState } from 'react';
import logo from '@/im/logo.png';

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  tx: number;
  ty: number;
  rotation: number;
  spin: number;
};

export default function ClickSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const count = 8;
      const newSparkles: Sparkle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const distance = 36 + Math.random() * 46;
        newSparkles.push({
          id: Date.now() + i + Math.floor(Math.random() * 1000),
          x: e.clientX,
          y: e.clientY,
          size: 12 + Math.random() * 12,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
          rotation: Math.random() * 360,
          spin: (Math.random() - 0.5) * 120
        });
      }

      setSparkles(prev => [...prev, ...newSparkles].slice(-96));

      setTimeout(() => {
        setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
      }, 750);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {sparkles.map(sparkle => (
        <SparkleItem key={sparkle.id} sparkle={sparkle} />
      ))}
    </div>
  );
}

function SparkleItem({ sparkle }: { sparkle: Sparkle }) {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'absolute',
    left: sparkle.x,
    top: sparkle.y,
    width: `${sparkle.size}px`,
    height: `${sparkle.size}px`,
    opacity: 0.95,
    transform: `translate(-50%, -50%) rotate(${sparkle.rotation}deg) scale(1)`,
    filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.65))',
    transition: 'none'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStyle(prev => ({
        ...prev,
        transform: `translate(calc(-50% + ${sparkle.tx}px), calc(-50% + ${sparkle.ty}px)) rotate(${sparkle.rotation + sparkle.spin}deg) scale(0.1)`,
        opacity: 0,
        transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out'
      }));
    }, 10);

    return () => clearTimeout(timer);
  }, [sparkle.rotation, sparkle.spin, sparkle.tx, sparkle.ty]);

  return (
    <img
      src={logo.src}
      alt=""
      aria-hidden
      draggable={false}
      style={style}
    />
  );
}
