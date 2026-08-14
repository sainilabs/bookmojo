import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useUi';
import { cx } from '@/lib/utils';

/**
 * TYPEWRITER
 * -----------------------------------------------------------------------------
 * Types a phrase out, holds it, deletes it, moves to the next. Used once, for
 * the hero sub-line.
 *
 * Rotating hero text is usually a bad idea, and it is worth being explicit about
 * why this instance is not. The standard failure is rotating a CLAIM: the
 * visitor starts reading "the fastest way to…", it vanishes mid-sentence, and
 * they have been handed a moving target instead of an argument. Here the rotating
 * span holds one role per real story in the catalogue, so the animation is doing a
 * job the static line could not — it says "there are nine of these, and your child
 * is already one of them" without spending a section on it.
 *
 * ACCESSIBILITY
 * · The animated span is aria-hidden. A live region that retypes itself every
 *   two seconds is unusable with a screen reader.
 * · The full list is in the DOM once, statically, as sr-only text. Assistive tech
 *   therefore gets MORE information than the visual reader, not less.
 * · Under `prefers-reduced-motion` nothing types: the first phrase is rendered
 *   whole and the caret sits still (the shared --animate-blink keyframe ends
 *   opaque precisely so this stays visible).
 *
 * LAYOUT
 * The caller must reserve the height of the tallest phrase. This component
 * cannot do it — it does not know the measure it will be rendered into — and
 * without it every phrase change of a different length reflows the paragraph and
 * shoves the CTA down the page. See the min-h on the hero paragraph.
 */

const TYPE_MS = 52;
const DELETE_MS = 26;
/** Long enough to read a seven-word title twice. Shorter felt like a slot machine. */
const HOLD_MS = 2200;
const GAP_MS = 420;

export function Typewriter({
  phrases,
  className,
}: {
  phrases: readonly string[];
  className?: string;
}) {
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [len, setLen] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const current = phrases[index] ?? '';

  useEffect(() => {
    if (still || phrases.length === 0) return;

    const typing = !deleting && len < current.length;
    const finished = !deleting && len === current.length;
    const erasing = deleting && len > 0;

    const delay = typing ? TYPE_MS : finished ? HOLD_MS : erasing ? DELETE_MS : GAP_MS;

    const id = window.setTimeout(() => {
      if (typing) setLen(len + 1);
      else if (finished) setDeleting(true);
      else if (erasing) setLen(len - 1);
      else {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      }
    }, delay);

    return () => window.clearTimeout(id);
  }, [current, deleting, len, phrases.length, still]);

  return (
    <>
      <span className="sr-only">{phrases.join('. ')}</span>

      <span aria-hidden="true" className={cx('whitespace-pre-wrap', className)}>
        {still ? current : current.slice(0, len)}
        <span className="caret" />
      </span>
    </>
  );
}
