import React from 'react';
import { getAllPosts } from '@/lib/markdown-utils';
import BlogTimelineClient from '@/components/blog/BlogTimelineClient';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function BlogTimelinePage() {
  const posts = await getAllPosts();
  
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  
  return (
    <div className="min-h-screen">
      <BlogTimelineClient initialPosts={sortedPosts} />
    </div>
  );
}
