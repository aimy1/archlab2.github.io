import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArchLab | High-Performance Technical Blog',
  description: 'Technical logs and system optimization for Arch Linux with a premium minimalist aesthetic.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from '@/components/ui/toaster';
import PageTransition from '@/components/effects/PageTransition';
import ClickSparkles from '@/components/effects/ClickSparkles';
import { Providers } from '@/components/Providers';
import AICommandSearch from '@/components/search/AICommandSearch';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@100..900&family=Source+Code+Pro&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/auth.css" />
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        <Script src="/js/auth.js" strategy="lazyOnload" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 min-h-screen flex flex-col relative overflow-x-hidden">
        <Providers>
          <div className="fixed inset-0 -z-30 bg-grid pointer-events-none" />
          <Navbar />
          <main className="flex-grow pt-32 pb-20">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Toaster />
          <AICommandSearch />
          <ClickSparkles />
        </Providers>
      </body>
    </html>
  );
}
