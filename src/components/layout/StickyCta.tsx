import { useEffect, useState } from 'react';
import { OrderButton } from '@/components/ui/Button';
import { BookCover } from '@/components/art/BookCover';
import { Close } from '@/components/art/Icons';
import { PRICING } from '@/lib/config';
import { useDraft } from '@/hooks/useDraft';
import { useScrolledPast } from '@/hooks/useUi';
import { cx, formatINR, formatName, possessive } from '@/lib/utils';

const DISMISS_KEY = 'bookmojo:sticky-dismissed';

/**
 * FLOATING CONVERSION BAR
 * -----------------------------------------------------------------------------
 * The brief asked for floating conversion elements "without feeling intrusive".
 * Intrusiveness is not about size, it is about timing, redundancy and control.
 * So this bar obeys four rules:
 *
 * 1. IT NEVER COMPETES. It appears only after the hero's own CTA has scrolled
 *    away, and it hides again while the final CTA is on screen. Two identical
 *    green buttons visible at once splits attention and measurably costs clicks.
 * 2. IT IS DISMISSIBLE, AND THE DISMISSAL STICKS for the session. An
 *    undismissable overlay is the thing people mean when they say a site feels
 *    cheap.
 * 3. IT EARNS ITS SPACE WITH INFORMATION, not urgency. It carries the visitor's
 *    own cover thumbnail, the price, and the delivery window — the three things
 *    a hesitating buyer is weighing. No countdown, no fake stock counter.
 * 4. IT NEVER COVERS CONTENT PERMANENTLY. On mobile it is a bottom bar and the
 *    document gets matching bottom padding, so nothing is trapped underneath.
 *
 * It also does real work for us: once a name has been typed it addresses the
 * child by name, which keeps the personalisation present for the entire scroll.
 */
export function StickyCta() {
  const { draft, isPersonalised } = useDraft();
  const passedHero = useScrolledPast(760);
  const [dismissed, setDismissed] = useState(true);
  const [atClose, setAtClose] = useState(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, []);

  /* Stand down while the closing section — which has a bigger, better version of
     this same offer — is in view. */
  useEffect(() => {
    const target = document.getElementById('final-cta');
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => setAtClose(entries.some((e) => e.isIntersecting)),
      { rootMargin: '-10% 0px -10% 0px' },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const visible = passedHero && !dismissed && !atClose;
  const name = formatName(draft.childName);

  return (
    <div
      className={cx(
        'fixed inset-x-0 bottom-0 z-40 transition-all duration-[420ms] ease-[var(--ease-spring)] sm:inset-x-auto sm:right-6 sm:bottom-6',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-6 opacity-0 sm:translate-y-8',
      )}
      aria-hidden={!visible}
    >
      <div
        className={cx(
          'glass flex items-center gap-3 p-3',
          /* Square top corners on mobile where it is docked to the viewport
             edge; a full capsule on desktop where it genuinely floats. */
          'rounded-t-[1.35rem] sm:w-[24rem] sm:rounded-[1.35rem] sm:p-4',
        )}
      >
        {/* Their cover, small. The single most persuasive pixel we have. */}
        <div className="w-12 shrink-0 overflow-hidden rounded-[3px] shadow-e2 sm:w-14">
          <BookCover draft={draft} className="block w-full" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-small font-semibold">
            {isPersonalised ? `${possessive(name)} book is ready to make` : 'Your book, in about 4 minutes'}
          </p>
          <p className="truncate text-[0.72rem] text-ink-muted">
            {formatINR(PRICING.hardcover)} all in · or {formatINR(PRICING.digital)} digital
          </p>
        </div>

        <OrderButton
          intent="sticky"
          size="sm"
          label="Start"
          className="shrink-0"
        />

        <button
          type="button"
          onClick={dismiss}
          className="btn btn-quiet btn-icon-sm shrink-0 text-ink-muted"
          tabIndex={visible ? 0 : -1}
        >
          <Close size={16} />
          <span className="sr-only">Hide this bar for now</span>
        </button>
      </div>
    </div>
  );
}
