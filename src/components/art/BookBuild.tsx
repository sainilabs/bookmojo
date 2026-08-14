import { useEffect, useMemo, useState } from 'react';
import { Book3D } from './BookCover';
import { HAIR_COLOURS, SKIN_TONES } from '@/data/catalogue';
import { useDraft } from '@/hooks/useDraft';
import { useReducedMotion } from '@/hooks/useUi';
import { cx, formatName, possessive } from '@/lib/utils';
import type { Draft } from '@/types';

/**
 * THE BOOK, BEING BUILT
 * -----------------------------------------------------------------------------
 * The hero's right column used to hold a static cover. A static cover proves the
 * product exists; it does not explain that the product is *made for one child*.
 * So the cover assembles itself instead, cycling through the four things a buyer
 * actually chooses — and each stage changes the artefact visibly, because a
 * demonstration nobody can see the effect of is just an animation.
 *
 * Two rules keep it from becoming decoration:
 *
 * · The four stages are the same four questions the WhatsApp flow asks, in the
 *   same order. The hero therefore discloses the whole process before the first
 *   click, which is the single largest objection to ordering in a chat.
 * · The moment the visitor types a name, the loop stops and freezes on THEIR
 *   cover. Their own child's book is the most persuasive image on the page, and
 *   continuing to animate past it would be showing them somebody else's.
 *
 * Accessibility: all four labels are always present in the DOM as real text, and
 * only the emphasis moves. Nothing is announced on a timer, so a screen reader
 * user gets the complete list without being interrupted four times a loop.
 * Under `prefers-reduced-motion` the sequence does not run at all — the finished
 * book is shown immediately.
 */

/** The personalisation stages, in the order the ordering conversation asks. */
const STEPS = [
  { label: 'Their name', note: 'Foil-stamped on the cover' },
  { label: 'How they look', note: 'Skin tone, hair and style' },
  { label: 'Their story world', note: 'Nine original stories' },
  { label: 'Made and bound', note: 'Hardcover, linen spine' },
] as const;

const DEMO_NAME = 'Aarav';
const HOLD_MS = 2400;

export function BookBuild({ className }: { className?: string }) {
  const { draft, isPersonalised } = useDraft();
  const still = useReducedMotion();
  const frozen = isPersonalised || still;

  const [step, setStep] = useState(frozen ? STEPS.length - 1 : 0);
  const [paused, setPaused] = useState(false);

  /* Once a name exists the demonstration has done its job — land on the last
     stage and stay there, showing the visitor's own cover. */
  useEffect(() => {
    if (frozen) setStep(STEPS.length - 1);
  }, [frozen]);

  useEffect(() => {
    if (frozen || paused) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [frozen, paused]);

  /**
   * The draft shown on the cover. When the visitor has personalised, this is
   * simply their draft. Before that, each stage substitutes a different value so
   * the change is unmistakable: stage 1 is a plain default child, stage 2 swaps
   * the character, stage 3 swaps the entire story world — motif and palette.
   */
  const preview = useMemo<Draft>(() => {
    if (isPersonalised) return draft;

    const base: Draft = { ...draft, childName: DEMO_NAME };
    const plain: Draft['look'] = {
      skin: SKIN_TONES[1]!.hex,
      hair: HAIR_COLOURS[0]!.hex,
      hairStyle: 'short',
    };
    const matched: Draft['look'] = {
      skin: SKIN_TONES[4]!.hex,
      hair: HAIR_COLOURS[0]!.hex,
      hairStyle: 'patka',
    };

    if (step === 0) return { ...base, themeId: 'chandni', look: plain };
    if (step === 1) return { ...base, themeId: 'chandni', look: matched };
    return { ...base, themeId: 'banyan', look: matched };
  }, [draft, isPersonalised, step]);

  const name = formatName(draft.childName);

  return (
    <div
      className={cx('flex w-full flex-col items-center', className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <Book3D draft={preview} placeholderName={DEMO_NAME} width={362} />

      <div className="mt-8 w-full max-w-[24rem]">
        {/* Assembly rail. Decorative: the same information is in the labels. */}
        <div aria-hidden="true" className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s.label}
              className={cx(
                'h-[3px] flex-1 rounded-full transition-colors duration-500',
                frozen || i <= step ? 'bg-ink' : 'bg-hairline',
              )}
            />
          ))}
        </div>

        <p className="mt-4 text-small font-semibold text-ink">
          {isPersonalised
            ? `${possessive(name)} cover, as it would print.`
            : 'Every cover is built from four choices.'}
        </p>

        <ul className="mt-3 grid gap-x-4 gap-y-2 xs:grid-cols-2">
          {STEPS.map((s, i) => {
            const active = !frozen && i === step;
            return (
              <li key={s.label} className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className={cx(
                    'mt-[0.45rem] size-1.5 shrink-0 rounded-full transition-colors duration-300',
                    frozen || active ? 'bg-gold-500' : 'bg-strong',
                  )}
                />
                <span className="min-w-0">
                  <span
                    className={cx(
                      'block text-[0.8rem] leading-tight font-semibold transition-colors duration-300',
                      frozen || active ? 'text-ink' : 'text-ink-muted',
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="block text-[0.72rem] leading-tight text-ink-muted">
                    {s.note}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
