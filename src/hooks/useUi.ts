import { useEffect, useState } from 'react';

/** Media query subscription with an SSR-safe initial value. */
export function useMediaQuery(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? fallback : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/**
 * Fires once the visitor has scrolled past a threshold.
 * Drives both the nav's condensed state and the sticky order bar, which should
 * not appear until the hero's own CTA has left the viewport — showing both at
 * once splits attention and measurably costs clicks.
 */
export function useScrolledPast(px: number): boolean {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setPassed(window.scrollY > px);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [px]);

  return passed;
}

/**
 * Tracks which in-page section is currently in the reading zone, for the nav.
 * Uses a band in the upper third of the viewport so the highlight changes when
 * a section starts being *read*, not when it first peeks into view.
 */
export function useScrollSpy(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.2, 0.5] },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/** Locks background scroll while a modal or sheet is open, without layout shift. */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const previous = body.style.cssText;
    const offset = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (offset > 0) body.style.paddingRight = `${offset}px`;
    return () => {
      body.style.cssText = previous;
    };
  }, [locked]);
}

/** Escape-to-close, shared by the sheet and the spread lightbox. */
export function useEscape(active: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onEscape]);
}
