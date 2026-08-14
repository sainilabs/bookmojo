import { Star } from '@/components/art/Icons';
import { cx } from '@/lib/utils';
import { PROOF } from '@/lib/config';

/**
 * Star rating.
 *
 * Two accessibility decisions worth naming: the stars are `aria-hidden` and the
 * rating is announced as text, because a screen reader user needs "4.9 out of 5
 * from 2,148 reviews", not "star star star star star". And the count is always
 * shown next to the score — a rating without a sample size is a weaker trust
 * signal than no rating at all, and savvy buyers know it.
 */
export function Rating({
  value = PROOF.rating,
  count,
  size = 15,
  className,
  tone = 'gold',
}: {
  value?: number;
  count?: number;
  size?: number;
  className?: string;
  tone?: 'gold' | 'inherit';
}) {
  const rounded = Math.round(value);

  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <span
        className={cx('inline-flex gap-0.5', tone === 'gold' && 'text-gold-500')}
        aria-hidden="true"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} className={i < rounded ? 'opacity-100' : 'opacity-25'} />
        ))}
      </span>
      <span className="text-small font-semibold tabular-nums">
        {value.toFixed(1)}
        {count !== undefined && (
          <span className="text-ink-muted font-medium"> · {count.toLocaleString()} reviews</span>
        )}
      </span>
      <span className="sr-only-focusable sr-only">
        Rated {value.toFixed(1)} out of 5
        {count !== undefined ? ` from ${count.toLocaleString()} reviews` : ''}
      </span>
    </span>
  );
}

/** Compact label pill. Used for grouping and status, never as a button. */
export function Pill({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'gold' | 'verdant' | 'outline';
  className?: string;
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-micro font-bold tracking-[0.08em] uppercase',
        tone === 'neutral' && 'bg-inset text-ink-soft',
        tone === 'gold' && 'bg-gold-50 text-gold-700',
        tone === 'verdant' && 'bg-verdant-50 text-verdant-700',
        tone === 'outline' && 'border border-hairline text-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Number + label. Kept as a primitive so every stat on the page aligns its
 *  baselines and uses tabular figures — mismatched numerals look amateur. */
export function Stat({
  value,
  label,
  sub,
  className,
}: {
  value: React.ReactNode;
  label: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <span className="font-display text-display-3 leading-none font-bold tabular-nums">
        {value}
      </span>
      <span className="text-small font-semibold">{label}</span>
      {sub && <span className="text-small text-ink-muted">{sub}</span>}
    </div>
  );
}
