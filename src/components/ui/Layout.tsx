import type { ElementType, ReactNode } from 'react';
import { cx } from '@/lib/utils';
import { useReveal, type RevealOptions } from '@/hooks/useReveal';

/**
 * GRID SYSTEM
 * -----------------------------------------------------------------------------
 * One shell width (1344px) with a fluid gutter that grows from 20px on the
 * smallest phone to 48px on desktop. Content columns are capped at 68ch for
 * prose regardless of shell width, because line length — not container width —
 * is what governs reading comfort.
 *
 * Past 1800px the layout gains structure instead of stretching: sections switch
 * to asymmetric two-column arrangements rather than widening a single measure
 * into an unreadable 140-character line.
 */
export function Container({
  children,
  className,
  width = 'shell',
}: {
  children: ReactNode;
  className?: string;
  width?: 'shell' | 'reading' | 'wide';
}) {
  return (
    <div
      className={cx(
        'mx-auto w-full px-5 sm:px-8 lg:px-12',
        width === 'shell' && 'max-w-[84rem]',
        width === 'reading' && 'max-w-[46rem]',
        width === 'wide' && 'max-w-[104rem]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Vertical rhythm lives in one place. Sections are spaced in a 3-step scale
 * (tight / normal / grand) rather than ad-hoc padding, so the page has a
 * detectable pulse as you scroll — the thing that makes a long page feel
 * composed instead of stacked.
 */
export function Section({
  id,
  children,
  className,
  space = 'normal',
  tone = 'paper',
  label,
  as: Tag = 'section',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  space?: 'tight' | 'normal' | 'grand';
  tone?: 'paper' | 'sunken' | 'inverse' | 'none';
  label?: string;
  as?: ElementType;
}) {
  return (
    <Tag
      id={id}
      aria-label={label}
      /* Exposes the surface tone to CSS so tone-dependent treatments (the brass
         hairline, the extra ring the order button needs against deep pine) live
         in one stylesheet rule instead of being passed down as props. */
      data-tone={tone}
      className={cx(
        'relative',
        space === 'tight' && 'py-14 sm:py-16',
        space === 'normal' && 'py-20 sm:py-28 lg:py-32',
        space === 'grand' && 'py-24 sm:py-32 lg:py-44',
        tone === 'paper' && 'bg-paper',
        tone === 'sunken' && 'bg-sunken',
        tone === 'inverse' && 'bg-inverse text-ink-inverse',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Declarative wrapper around the shared reveal observer. */
export function Reveal({
  children,
  className,
  as: Tag = 'div',
  ...options
}: RevealOptions & { children: ReactNode; className?: string; as?: ElementType }) {
  const ref = useReveal<HTMLDivElement>(options);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Section heading unit: eyebrow → headline → deck.
 * Enforced as a component so every section announces itself the same way and
 * the h2 is never skipped for styling reasons.
 */
export function SectionHeading({
  eyebrow,
  title,
  deck,
  align = 'center',
  tight = false,
  id,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  deck?: ReactNode;
  align?: 'center' | 'start';
  tight?: boolean;
  id?: string;
}) {
  return (
    <div
      className={cx(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
      )}
    >
      {eyebrow && (
        <Reveal y={12} className="eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <Reveal y={18} delay={60}>
        <h2
          id={id}
          className={cx(
            tight ? 'text-display-3' : 'text-display-2',
            'max-w-[26ch] text-balance-tight',
            align === 'center' && 'mx-auto',
          )}
        >
          {title}
        </h2>
      </Reveal>
      {deck && (
        <Reveal y={18} delay={120}>
          <p
            className={cx(
              'text-lead text-ink-soft max-w-[52ch]',
              align === 'center' && 'mx-auto',
            )}
          >
            {deck}
          </p>
        </Reveal>
      )}
    </div>
  );
}
