import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { whatsappHref, type HandoffOptions, type Intent } from '@/lib/whatsapp';
import { useDraft } from '@/hooks/useDraft';
import { WhatsAppMark } from '@/components/art/Icons';
import { BRAND } from '@/lib/config';

/**
 * The emphasis ladder, exposed as a closed union so a fifth "just this once"
 * button style cannot enter the product without editing the system.
 *
 *   order · the WhatsApp CTA — at most one per viewport
 *   ink   · high-contrast neutral, for secondary commitments
 *   tonal · solid tinted fill, for navigation / filters / icon controls
 *   quiet · text only, for dismissals and tertiary links
 */
type Variant = 'order' | 'ink' | 'tonal' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, string> = { sm: 'btn-sm', md: '', lg: 'btn-lg' };
const VARIANTS: Record<Variant, string> = {
  order: 'btn-order',
  ink: 'btn-ink',
  tonal: 'btn-tonal',
  quiet: 'btn-quiet',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = 'ink',
  size = 'md',
  className,
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx('btn', VARIANTS[variant], SIZES[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = 'ink',
  size = 'md',
  className,
  children,
  ...rest
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cx('btn', VARIANTS[variant], SIZES[size], className)} {...rest}>
      {children}
    </a>
  );
}

/**
 * ORDER BUTTON — the only conversion surface on the site.
 * -----------------------------------------------------------------------------
 * Every instance is the same component on purpose. Consequences:
 *
 *   · One colour. Verdant appears nowhere else, so "green = order" is learned
 *     within the first screen and never has to be re-learned.
 *   · Always carries the WhatsApp glyph plus a text label. Channel recognition
 *     is doing real work here: people who trust WhatsApp more than a checkout
 *     form need to see *which* channel before they commit.
 *   · Always pre-fills the message from the live draft, and always tags its
 *     `intent`, so the automation opens in the right register and attribution
 *     is readable without extra instrumentation.
 *   · `rel="noopener"` on a new tab is a security requirement, not a nicety —
 *     without it the opened context can reach back through window.opener.
 *
 * A sub-label is supported because "Order now" alone leaves the cost of the
 * click unknown. "No account needed · 2 min" removes that hesitation in place.
 */
export function OrderButton({
  intent,
  note,
  size = 'lg',
  label = 'Start on WhatsApp',
  sublabel,
  block = false,
  className,
  variant = 'order',
}: {
  intent: Intent;
  note?: string;
  size?: Size;
  label?: ReactNode;
  sublabel?: ReactNode;
  block?: boolean;
  className?: string;
  variant?: Variant;
}) {
  const { draft, isPersonalised } = useDraft();
  const options: HandoffOptions = { intent, draft: isPersonalised ? draft : null, note };

  return (
    <a
      href={whatsappHref(options)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        track('whatsapp_open', {
          intent,
          personalised: isPersonalised,
          theme: draft.themeId,
        })
      }
      className={cx(
        'btn group',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        sublabel ? 'flex-col !gap-0 py-2.5' : null,
        className,
      )}
      aria-label={`${typeof label === 'string' ? label : 'Start your book on WhatsApp'} — opens WhatsApp at ${BRAND.whatsappDisplay}`}
    >
      {sublabel ? (
        <>
          <span className="flex items-center gap-2 font-semibold">
            <WhatsAppMark size={19} className="shrink-0" />
            {label}
          </span>
          <span className="text-[0.7rem] font-medium tracking-wide opacity-80">{sublabel}</span>
        </>
      ) : (
        <>
          <WhatsAppMark size={size === 'sm' ? 16 : 19} className="shrink-0" />
          {label}
        </>
      )}
    </a>
  );
}
