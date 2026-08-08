import { useEffect, useRef } from 'react';

/**
 * Scroll-reveal via a SINGLE shared IntersectionObserver.
 *
 * A page with ~15 sections and ~120 revealed elements would otherwise create
 * 120 observers. One shared observer keeps the main thread quiet during scroll,
 * which is what protects INP on mid-range Android — the device most of our
 * traffic actually arrives on.
 *
 * Elements unobserve themselves the moment they have revealed: the animation is
 * a one-way state change, so there is nothing left to watch.
 */

type Entry = { el: Element };

let observer: IntersectionObserver | null = null;
const tracked = new WeakSet<Element>();

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = 'in';
        observer?.unobserve(entry.target);
      }
    },
    {
      // Fire slightly before the element is fully on screen so the motion has
      // finished by the time it reaches comfortable reading position.
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08,
    },
  );
  return observer;
}

export interface RevealOptions {
  /** Stagger, in ms. Used for lists so items arrive in reading order. */
  delay?: number;
  /** Travel distance, in px. Smaller for large blocks, larger for small cards. */
  y?: number;
  /** Subtle scale-in. Reserved for cards that should feel like they land. */
  scale?: number;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  delay = 0,
  y,
  scale,
}: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.dataset.reveal = '';
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
    if (y !== undefined) el.style.setProperty('--reveal-y', `${y}px`);
    if (scale !== undefined) el.style.setProperty('--reveal-s', String(scale));

    const io = getObserver();
    if (!io) {
      // No observer support: show content rather than hiding it forever.
      el.dataset.reveal = 'in';
      return;
    }
    if (!tracked.has(el)) tracked.add(el);
    io.observe(el);
    return () => io.unobserve(el);
  }, [delay, y, scale]);

  return ref;
}

/** Reports whether an element is currently on screen. Used for lazy work such
 *  as starting the chat simulation only once it can be seen. */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  onEnter: () => void,
  { once = true, threshold = 0.25 } = {},
) {
  const ref = useRef<T>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      onEnter();
      return;
    }
    const io = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const hit = entries.some((e: IntersectionObserverEntry) => e.isIntersecting);
        if (!hit) return;
        if (once && fired.current) return;
        fired.current = true;
        onEnter();
        if (once) io.disconnect();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, threshold]);

  return ref as React.RefObject<T | null> & { current: T | null };
}

export type { Entry };
