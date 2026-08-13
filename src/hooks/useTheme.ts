import { useCallback, useEffect, useState } from 'react';
import { track } from '@/lib/analytics';

export type ThemeName = 'day' | 'night';
const STORAGE_KEY = 'bookmojo:theme';

/**
 * "Daylight" / "Bedtime" theming.
 *
 * Two themes are justified here, unlike on most marketing sites: our own chat
 * logs put peak ordering between 21:00 and midnight — parents shop after
 * bedtime, in a dark room, on a phone. A cream page at 400 nits in that context
 * is physically unpleasant and it is the moment the buying decision happens.
 *
 * The initial value is resolved before paint by an inline script in index.html;
 * this hook only reads what is already there, so there is no flash and no
 * hydration mismatch.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof document === 'undefined') return 'day';
    return (document.documentElement.dataset.theme as ThemeName) ?? 'day';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode — theme simply will not persist */
    }
  }, [theme]);

  /**
   * Flags the document while the theme flips so CSS can suppress every
   * transition for that frame, and clears the flag after the new colours have
   * actually been painted.
   *
   * Two nested rAFs, not one: the first fires before the paint that applies the
   * new tokens, the second after it. Clearing on a single frame re-enables
   * transitions too early and the staggered ripple comes back.
   */
  const flipInstantly = useCallback((apply: () => void) => {
    const root = document.documentElement;
    root.setAttribute('data-theme-switching', '');
    apply();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.removeAttribute('data-theme-switching'));
    });
  }, []);

  // Follow the OS only while the user has expressed no preference of their own.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (stored) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) =>
      flipInstantly(() => setTheme(e.matches ? 'night' : 'day'));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [flipInstantly]);

  const toggle = useCallback(() => {
    flipInstantly(() =>
      setTheme((current) => {
        const next = current === 'day' ? 'night' : 'day';
        track('theme_toggle', { to: next });
        return next;
      }),
    );
  }, [flipInstantly]);

  return { theme, toggle } as const;
}
