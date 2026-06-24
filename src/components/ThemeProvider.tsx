'use client';

/**
 * @deprecated Theme is locked to dark mode.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  return { theme: 'dark', toggleTheme: () => {} };
}
