import Image from 'next/image';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { getAllPosts } from '@/lib/markdown-utils';
import { 
  CombinedHeroSection,
  ClientStatsStrip, 
  ClientArsenalHeader, 
  ClientCTA,
  LatestLogsTile
} from '@/components/home/HomeClientComponents';

const TECH_STACK = [
  { name: 'Arch Linux', icon: 'archlinux' },
  { name: 'Linux Kernel', icon: 'linux' },
  { name: 'KDE Plasma', icon: 'kde' },
  { name: 'Wayland', icon: 'wayland' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Next.js', icon: 'nextdotjs' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Bash', icon: 'gnubash' },
];

export default async function Home() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 10);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 max-w-7xl py-12 space-y-4">
        <RevealOnScroll direction="up">
          <div className="tiled-card cyber-shimmer bg-card/40 p-8 md:p-12">
            <CombinedHeroSection />
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="up" className="h-full">
          <LatestLogsTile posts={latestPosts} />
        </RevealOnScroll>
        <RevealOnScroll direction="up">
          <ClientStatsStrip />
        </RevealOnScroll>
        <section className="tiled-card cyber-shimmer bg-card/20 p-12 text-center space-y-12">
          <RevealOnScroll direction="up">
            <ClientArsenalHeader />
          </RevealOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 max-w-6xl mx-auto">
            {TECH_STACK.map((tech, i) => (
              <RevealOnScroll key={tech.name} direction="up" delay={i * 50}>
                <div className="group flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-[2rem] glass flex items-center justify-center p-5 transition-all duration-700 group-hover:-translate-y-2 group-hover:bg-primary/10 group-hover:shadow-[0_0_30px_rgba(122,162,247,0.2)]">
                    <Image 
                      src={`https://cdn.simpleicons.org/${tech.icon}`} 
                      alt={tech.name} 
                      width={36} 
                      height={32} 
                      className="opacity-30 group-hover:opacity-100 transition-opacity filter brightness-200"
                      unoptimized
                    />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 group-hover:text-primary transition-colors">
                    {tech.name}
                  </span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>
        <RevealOnScroll direction="up">
          <div className="tiled-card cyber-shimmer bg-primary/10 p-16 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/30 blur-[150px] rounded-full group-hover:scale-150 transition-transform duration-3000" />
            <ClientCTA />
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}


