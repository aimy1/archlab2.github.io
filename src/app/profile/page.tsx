'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bookmark, 
  Clock, 
  ChevronRight, 
  Settings, 
  LogOut,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Highlight } from '@/components/ui/highlight';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // 获取用户信息
    const storedUser = localStorage.getItem('google_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 获取收藏和历史
    const storedFavs = JSON.parse(localStorage.getItem('archlab:favorites') || '[]');
    const storedHistory = JSON.parse(localStorage.getItem('archlab:history') || '[]');
    
    // 模拟数据 (带上真实的 href)
    if (storedFavs.length === 0 && !localStorage.getItem('archlab:favorites')) {
      const initialFavs = [
        { id: 1, title: "Linux vs Windows vs macOS: 深度对比", date: "2024-03-27", category: "System", href: "/blog" },
        { id: 2, title: "为什么我放弃传统桌面，选择 Wayland + Niri", date: "2024-03-25", category: "Desktop", href: "/blog" }
      ];
      setFavorites(initialFavs);
      localStorage.setItem('archlab:favorites', JSON.stringify(initialFavs));
    } else {
      setFavorites(storedFavs);
    }

    if (storedHistory.length === 0 && !localStorage.getItem('archlab:history')) {
      const initialHistory = [
        { id: 101, title: "OpenClaw 是什么 (认知篇)", date: "刚刚", category: "Tool", href: "/blog" },
        { id: 102, title: "Arch Linux 安装指南", date: "昨天", category: "Guide", href: "/blog" }
      ];
      setHistory(initialHistory);
      localStorage.setItem('archlab:history', JSON.stringify(initialHistory));
    } else {
      setHistory(storedHistory);
    }
  }, []);

  const removeItem = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // 阻止触发父级跳转
    e.stopPropagation();
    
    if (activeTab === 'favorites') {
      const newList = favorites.filter(item => item.id !== id);
      setFavorites(newList);
      localStorage.setItem('archlab:favorites', JSON.stringify(newList));
    } else {
      const newList = history.filter(item => item.id !== id);
      setHistory(newList);
      localStorage.setItem('archlab:history', JSON.stringify(newList));
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <User className="text-muted-foreground" size={32} />
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">请先登录以查看个人主页</p>
        <Link href="/">
          <Button variant="outline" className="rounded-full px-8 py-6 border-white/10 hover:bg-white/5 uppercase font-black text-[10px] tracking-widest">
            返回首页
          </Button>
        </Link>
      </div>
    );
  }

  const currentList = activeTab === 'favorites' ? favorites : history;

  return (
    <div className="max-w-4xl mx-auto px-6 animate-in slide-in-from-bottom-4 fade-in duration-1000">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Link href="/" className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
          <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/30 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">返回</span>
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
            <Settings size={18} className="text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass rounded-[3rem] p-10 mb-12 border-white/10 cyber-shimmer relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white/5 overflow-hidden shadow-2xl">
              <img src={user.picture} alt="Avatar" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-black p-2 rounded-full border-4 border-[#0a0a0a]">
              <Highlight className="text-[8px] font-black uppercase tracking-tighter">Verified</Highlight>
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              {user.name}
            </h1>
            <p className="text-muted-foreground font-mono text-sm mb-6 opacity-70 italic">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                <Bookmark size={12} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">{favorites.length} 收藏</span>
              </div>
              <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                <Clock size={12} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">{history.length} 浏览记录</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 p-6 rounded-[2rem] flex items-center justify-between border transition-all duration-500 ${activeTab === 'favorites' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <Bookmark size={20} />
            <span className="text-xs font-black uppercase tracking-widest">我的收藏</span>
          </div>
          {activeTab === 'favorites' && <ChevronRight size={16} />}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 p-6 rounded-[2rem] flex items-center justify-between border transition-all duration-500 ${activeTab === 'history' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <Clock size={20} />
            <span className="text-xs font-black uppercase tracking-widest">浏览记录</span>
          </div>
          {activeTab === 'history' && <ChevronRight size={16} />}
        </button>
      </div>

      {/* Content List */}
      <div className="flex flex-col gap-3">
        {currentList.length > 0 ? (
          currentList.map((item, idx) => (
            <Link 
              key={item.id} 
              href={item.href}
              className="group p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-between"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">{item.category}</span>
                  <span className="text-muted-foreground text-[8px] font-mono opacity-50">{item.date}</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest group-hover:text-primary transition-colors">{item.title}</h3>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => removeItem(e, item.id)}
                  className="p-3 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  title="删除"
                >
                  <LogOut size={14} className="rotate-180" />
                </button>
                <ChevronRight size={16} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center p-20 glass rounded-[2rem] border-dashed border-white/10">
            <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">列表为空</p>
          </div>
        )}
      </div>
    </div>
  );
}
