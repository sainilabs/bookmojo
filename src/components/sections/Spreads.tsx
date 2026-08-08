import { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { Motif } from '@/components/art/Motif';
import { HeroChild } from '@/components/art/HeroChild';
import { Chevron, Feather } from '@/components/art/Icons';
import { SPREADS } from '@/data/spreads';
import { THEMES, THEME_BY_ID } from '@/data/catalogue';
import { useDraft } from '@/hooks/useDraft';
import { useReducedMotion } from '@/hooks/useUi';
import { track } from '@/lib/analytics';
import { cx, formatName } from '@/lib/utils';

/**
 * BOOK PREVIEW SHOWCASE
 * -----------------------------------------------------------------------------
 * An openable book, not a carousel of photographs.
 *
 * Why the page-turn is worth building properly: the cover sells the idea, but
 * the INTERIOR is where buyers decide whether this is a real book or a novelty.
 * Turning a page is the gesture that tells you an object has weight. A fading
 * slideshow does not carry that information, and photographs of someone else's
 * book carry none of the personalisation.
 *
 * Mechanics: the outgoing recto is cloned into an overlay with
 * `transform-origin: left` and rotated through Y, back-face hidden, while the
 * spread underneath has already committed to the next index. One 640ms
 * animation, no measurement, no library.
 *
 * Accessibility: the turn is decorative. Content is swapped in the DOM
 * immediately, the live region announces the new spread, arrow keys work, and
 * under `prefers-reduced-motion` the overlay never mounts.
 */
export function Spreads() {
  const { draft } = useDraft();
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<{ dir: 1 | -1; key: number } | null>(null);
  const busy = useRef(false);

  const theme = THEME_BY_ID.get(draft.themeId) ?? THEMES[0]!;
  const name = formatName(draft.childName) || 'Ava';
  const spread = SPREADS[index]!;
  const previous = SPREADS[Math.max(0, index - 1)]!;

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = index + dir;
      if (next < 0 || next >= SPREADS.length) return;
      if (busy.current) return;
      setIndex(next);
      track('spread_turn', { to: SPREADS[next]!.id });
      if (still) return;
      busy.current = true;
      setTurn({ dir, key: Date.now() });
      window.setTimeout(() => {
        busy.current = false;
        setTurn(null);
      }, 640);
    },
    [index, still],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-spread-viewer]') == null) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const fill = (text: string) => text.replaceAll('{name}', name);
  const turning = turn !== null;
  /* While turning forward, the overlay carries the page we are leaving; while
     turning back, it carries the page we are returning to. */
  const overlaySpread = turn?.dir === 1 ? previous : spread;

  return (
    <Section space="grand" tone="sunken" className="rule-top overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow={
            <>
              <Feather size={14} /> Inside the book
            </>
          }
          title="Turn the pages before you buy them."
          deck="Four spreads from a real BookMojo, with your child's name already in the text. This is the standard of writing and printing every book leaves the studio at."
        />

        <div
          data-spread-viewer
          tabIndex={-1}
          className="mt-14 lg:mt-20"
          aria-roledescription="book preview"
        >
          <div className="mx-auto max-w-[62rem]">
            {/* ------------------------------ BOOK ------------------------- */}
            <div className="relative" style={{ perspective: '2400px' }}>
              <div className="relative grid grid-cols-1 overflow-hidden rounded-[0.6rem] shadow-book sm:grid-cols-2">
                {/* Verso: illustration */}
                <div className="relative aspect-[5/6] bg-inverse sm:aspect-auto sm:min-h-[26rem]">
                  <svg
                    viewBox="0 0 300 360"
                    className="absolute inset-0 size-full"
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                  >
                    <Motif motif={theme.motif} palette={theme.palette} />
                    {spread.figure !== 'none' && (
                      <g
                        transform={`translate(96 ${
                          spread.figure === 'high' ? 150 : spread.figure === 'low' ? 214 : 182
                        }) scale(1.1)`}
                      >
                        <HeroChild
                          look={draft.look}
                          outfit={theme.palette.accent}
                          outfitDeep={theme.palette.deep}
                          animate={!still}
                        />
                      </g>
                    )}
                  </svg>
                  {/* Gutter shadow: where the sewn binding pulls the paper in. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-black/35"
                  />
                  <span className="absolute bottom-3 left-4 text-[0.6rem] font-semibold tracking-[0.2em] text-white/45">
                    BOOKMOJO
                  </span>
                </div>

                {/* Recto: text */}
                <Page spread={spread} fill={fill} />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-black/15 sm:block"
                />
              </div>

              {/* Turning leaf */}
              {turning && (
                <div
                  key={turn.key}
                  aria-hidden="true"
                  className={cx(
                    'pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 origin-left overflow-hidden rounded-r-[0.6rem] sm:block',
                    turn.dir === 1 ? 'page-turn-fwd' : 'page-turn-back',
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Page spread={overlaySpread} fill={fill} />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/0 via-black/5 to-black/25" />
                </div>
              )}
            </div>

            {/* ----------------------------- CONTROLS ---------------------- */}
            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="btn btn-tonal btn-icon disabled:opacity-30"
                aria-label="Previous spread"
              >
                <Chevron size={18} className="rotate-180" />
              </button>

              <div className="flex flex-1 items-center gap-2" role="tablist" aria-label="Spreads">
                {SPREADS.map((s, i) => (
                  <button
                    key={s.id}
                    role="tab"
                    type="button"
                    aria-selected={i === index}
                    onClick={() => go(i > index ? 1 : -1)}
                    className="group flex flex-1 flex-col gap-1.5 py-1 text-left"
                  >
                    <span
                      className={cx(
                        'h-[3px] w-full rounded-full transition-colors duration-300',
                        i === index
                          ? 'bg-ink'
                          : i < index
                            ? 'bg-strong'
                            : 'bg-hairline group-hover:bg-strong',
                      )}
                    />
                    <span
                      className={cx(
                        'hidden text-[0.68rem] font-semibold transition-colors sm:block',
                        i === index ? 'text-ink' : 'text-ink-muted',
                      )}
                    >
                      {s.role}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                disabled={index === SPREADS.length - 1}
                className="btn btn-tonal btn-icon disabled:opacity-30"
                aria-label="Next spread"
              >
                <Chevron size={18} />
              </button>
            </div>

            {/* Caption explains what this spread proves. */}
            <p
              className="mt-6 max-w-[58ch] text-small text-ink-soft"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="font-semibold text-ink">{spread.role}. </span>
              {spread.caption}
            </p>

            <Reveal y={14} className="mt-10">
              <OrderButton
                intent="sample"
                label="Ask for your own sample pages"
                sublabel="We will send them into the chat, free"
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** A single recto, typeset like a printed page: generous measure, real folio,
 *  drop cap on the opening spread only. */
function Page({
  spread,
  fill,
}: {
  spread: (typeof SPREADS)[number];
  fill: (text: string) => string;
}) {
  const isDedication = spread.id === 'dedication';
  return (
    <div
      className={cx(
        'relative flex flex-col bg-[#fdfaf3] px-7 py-9 text-[#241f28] sm:px-10 sm:py-12',
        isDedication ? 'justify-center' : 'justify-start',
      )}
    >
      {/* Paper tooth on the printed page, independent of the page-wide grain. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        style={{ backgroundImage: 'var(--grain-url)', backgroundSize: '160px 160px' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-black/12 to-transparent"
      />

      <div className="relative">
        {spread.heading && (
          <p className="font-display mb-4 text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#8c7f6b]">
            {spread.heading}
          </p>
        )}

        <div
          className={cx(
            'font-display flex flex-col gap-4',
            isDedication
              ? 'items-center text-center text-[1.35rem] leading-[1.5] italic'
              : 'text-[0.98rem] leading-[1.75] sm:text-[1.04rem]',
          )}
          style={{ fontVariationSettings: "'SOFT' 50, 'WONK' 1" }}
        >
          {spread.paragraphs.map((p, i) => (
            <p
              key={i}
              className={
                !isDedication && i === 0
                  ? 'first-letter:float-left first-letter:mr-2.5 first-letter:mt-1.5 first-letter:text-[3.6rem] first-letter:leading-[0.72] first-letter:font-semibold first-letter:text-[#b06a12]'
                  : undefined
              }
            >
              {fill(p)}
            </p>
          ))}
        </div>
      </div>

      <p className="relative mt-auto pt-8 text-center text-[0.68rem] tabular-nums text-[#a2947e]">
        {spread.folio}
      </p>
    </div>
  );
}
