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
        <style dangerouslySetInnerHTML={{ __html: `
          .google-auth-container { display: flex; align-items: center; margin: 0 0.5rem; transition: all 0.3s ease; }
          .google-user-card { display: flex; align-items: center; gap: 0.8rem; padding: 0.35rem 1rem; border-radius: 9999px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); backdrop-filter: blur(12px); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: default; }
          .google-user-avatar { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(168, 85, 247, 0.6); box-shadow: 0 0 15px rgba(168, 85, 247, 0.3); }
          .google-user-name { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255, 255, 255, 0.9); }
          .google-user-link { display: flex; align-items: center; gap: 0.8rem; text-decoration: none; color: inherit; }
          .google-signout-btn { background: transparent; border: none; color: #ff4d4d; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; padding: 2px 6px; border-radius: 4px; opacity: 0.6; transition: all 0.2s; }
          .google-signout-btn:hover { opacity: 1; background: rgba(255, 77, 77, 0.1); }
          iframe[id^="gsi_"] { filter: grayscale(1) invert(1) brightness(0.8) contrast(1.2); mix-blend-mode: screen; opacity: 0.8; transition: opacity 0.3s; }
        ` }} />
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        <Script id="google-auth-handler" strategy="afterInteractive">
          {`
            const GOOGLE_CLIENT_ID = "327542881890-ale1t4ni01jl2c9mgfe00gtr7f4rvc3a.apps.googleusercontent.com";
            
            function initGoogleLogin() {
              const container = document.getElementById("google-auth-container");
              if (!container) return;
              if (typeof google === 'undefined' || !google.accounts) {
                setTimeout(initGoogleLogin, 500);
                return;
              }
              google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: false,
              });
              google.accounts.id.renderButton(container, {
                theme: "outline", size: "medium", shape: "pill", text: "signin_with",
              });
            }

            function handleCredentialResponse(response) {
              const idToken = response.credential;
              localStorage.setItem("google_id_token", idToken);
              
              fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
              }).then(resp => resp.json()).then(user => {
                localStorage.setItem("google_user", JSON.stringify(user));
                updateUI(user);
              }).catch(() => {
                try {
                  const payload = JSON.parse(window.atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
                  const user = { name: payload.name, email: payload.email, picture: payload.picture };
                  localStorage.setItem("google_user", JSON.stringify(user));
                  updateUI(user);
                } catch (e) {}
              });
            }

            function updateUI(user) {
              const container = document.getElementById("google-auth-container");
              if (!container) return;
              const basePath = window.location.pathname.includes('/archlab2.github.io/') ? '/archlab2.github.io' : '';
              container.innerHTML = \`
                <div class="google-user-card">
                  <a href="\${basePath}/profile/" class="google-user-link">
                    <img src="\${user.picture}" alt="avatar" class="google-user-avatar" />
                    <span class="google-user-name hidden md:inline">\${user.name}</span>
                  </a>
                  <button id="google-signout-btn" class="google-signout-btn">退出</button>
                </div>\`;
              const btn = document.getElementById("google-signout-btn");
              if (btn) btn.onclick = () => {
                localStorage.removeItem("google_id_token");
                localStorage.removeItem("google_user");
                location.reload();
              };
            }

            (function() {
              const checkState = () => {
                const storedUser = localStorage.getItem("google_user");
                if (storedUser) updateUI(JSON.parse(storedUser));
                else initGoogleLogin();
              };
              if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", checkState);
              else checkState();
            })();
          `}
        </Script>
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
