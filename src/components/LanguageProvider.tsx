'use client';

/**
 * @deprecated Use Providers from '@/components/Providers' instead.
 * This file is kept for backward compatibility during transition.
 */
export { useTranslation } from './Providers';
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
