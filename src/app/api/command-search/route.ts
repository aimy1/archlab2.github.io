import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/markdown-utils';
import { commandSearch } from '@/lib/command-search';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const lang = searchParams.get('lang') === 'cn' ? 'cn' : 'en';

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const posts = await getAllPosts();
    const results = commandSearch(q, lang, posts);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
