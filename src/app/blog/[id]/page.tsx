import React from 'react';
import { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/markdown-utils';
import BlogPostClient from '@/components/blog/BlogPostClient';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Terminal, AlertTriangle } from 'lucide-react';

type Params = { id: string };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostBySlug(id);
  
  return {
    title: post ? `${post.title} | ArchLab Log` : 'Log Not Found | ArchLab',
    description: post?.excerpt || 'Arch Linux system documentation and optimization research.',
  };
}

export default async function BlogPostDetail({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const post = await getPostBySlug(id);
  
  if (!post) {
    return (
      <div className="container mx-auto px-6 py-40 flex items-center justify-center">
        <RevealOnScroll direction="up" className="max-w-2xl w-full">
          <div className="tiled-card cyber-shimmer p-16 text-center space-y-10 bg-destructive/5 border-destructive/10">
            <div className="w-24 h-24 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto shadow-2xl animate-pulse">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tighter text-foreground">ERR_LOG_NOT_FOUND</h1>
              <p className="text-muted-foreground text-lg font-medium opacity-70">
                The technical log you are attempting to address has been moved, purged, or never existed in the kernel archive.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/blog">
                <Button size="lg" className="rounded-2xl h-16 px-12 font-black uppercase tracking-[0.3em] shadow-3xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all">
                  <ArrowLeft className="w-5 h-5 mr-4" /> Reconnect to Blog
                </Button>
              </Link>
            </div>
            <div className="pt-8 flex items-center justify-center gap-4 opacity-20 grayscale">
               <Terminal className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Archive Protocol v2.4</span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    );
  }

  const allPosts = await getAllPosts();
  // Filter related posts by latest publish date
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug)
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeB - timeA;
    })
    .slice(0, 2);

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
