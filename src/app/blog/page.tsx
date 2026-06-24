
import React from 'react';
import { getAllPosts } from '@/lib/markdown-utils';
import BlogListClient from '@/components/blog/BlogListClient';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  return (
    <div className="min-h-screen">
      <BlogListClient initialPosts={posts} />
    </div>
  );
}
