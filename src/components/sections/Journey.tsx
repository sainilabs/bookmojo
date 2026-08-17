import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Container, Reveal, Section } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { PhoneFrame } from '@/components/chat/PhoneFrame';
import { ChatMessage, TypingBubble } from '@/components/chat/ChatMessage';
import { Pause, Play, Replay, WhatsAppMark } from '@/components/art/Icons';
import { buildJourney } from '@/data/journey';
import { useDraft } from '@/hooks/useDraft';
import { useInView } from '@/hooks/useReveal';
import { useReducedMotion } from '@/hooks/useUi';
import { track } from '@/lib/analytics';
import { cx } from '@/lib/utils';

/**
 * WHATSAPP ORDERING JOURNEY
 * -----------------------------------------------------------------------------
 * The section that has to defeat the single biggest objection on this page:
 * "ordering a £34 keepsake through a chat app sounds sketchy."
 *
 * The strategy is radical transparency. Rather than describing the flow, we
 * replay it — every question, the review step, the payment artefact, the
 * production tracker, the courier card — with the visitor's own personalisation
 * substituted in. By the time they reach the CTA they have already been through
 * the purchase once, and there is nothing left to be surprised by.
 *
 * Interaction design:
 * · Autoplays only once scrolled into view, so nothing animates off-screen and
 *   nothing competes for attention during the hero.
 * · Playback is controllable — pause, replay, jump to any stage. An animation a
 *   user cannot stop is a dark pattern, and a prospect who wants to re-read the
 *   payment stage is the most valuable reader on the page.
 * · Under `prefers-reduced-motion` the whole transcript renders at once and
 *   autoplay is disabled. The information is identical; only the choreography
 *   is dropped.
 * · The stage rail is a real tablist with arrow-key support, so the entire
 *   simulation is operable from a keyboard.
 *
 * Timings (900ms typing, 620ms send) were tuned to read as a brisk real
 * conversation. Slower feels like waiting; faster stops registering as dialogue.
 */
const TYPING_MS = 900;
const SEND_MS = 620;
const STAGE_GAP_MS = 1500;

export function Journey() {
  const { draft } = useDraft();
  const stages = useMemo(() => buildJourney(draft), [draft]);
  const still = useReducedMotion();

  const [stageIndex, setStageIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const stage = stages[stageIndex]!;
  const messages = stage.messages;
  const scroller = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);

  /* threshold 0, not 0.25: the sentinel is a zero-height marker, and a ratio
     threshold on a zero-area box never resolves in some engines. */
  const sentinel = useInView<HTMLDivElement>(() => setStarted(true), { threshold: 0 });

  useEffect(() => {
    if (!started) return;
    if (still) {
      setStep(messages.length);
      return;
    }
    setPlaying(true);
  }, [started, still, messages.length]);

  const goToStage = useCallback(
    (index: number, autoplay = true) => {
      setStageIndex(index);
      setStep(still ? stages[index]!.messages.length : 0);
      setTyping(false);
      setPlaying(!still && autoplay);
      track('journey_step_view', { stage: stages[index]!.id, manual: true });
    },
    [stages, still],
  );

  /* Playback engine. One timer at a time; cleared on every dependency change so
     a stage jump can never leave an orphaned timeout running. */
  useEffect(() => {
    if (!playing || still) return;

    if (step >= messages.length) {
      const id = window.setTimeout(() => {
        if (stageIndex < stages.length - 1) {
          const next = stageIndex + 1;
          setStageIndex(next);
          setStep(0);
          track('journey_step_view', { stage: stages[next]!.id, manual: false });
        } else {
          setPlaying(false);
        }
      }, STAGE_GAP_MS);
      return () => window.clearTimeout(id);
    }

    const next = messages[step]!;
    const fromUs = next.kind !== 'out' && next.kind !== 'chips';

    if (fromUs && !typing) {
      setTyping(true);
      const id = window.setTimeout(() => setTyping(false), TYPING_MS);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => setStep((s) => s + 1), fromUs ? 120 : SEND_MS);
    return () => window.clearTimeout(id);
  }, [playing, still, step, typing, messages, stageIndex, stages]);

  /* Keep the newest message in view without yanking the whole page. */
  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: still ? 'auto' : 'smooth' });
  }, [step, typing, still]);

  const onTabKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    const delta = map[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = (stageIndex + delta + stages.length) % stages.length;
    goToStage(next);
    const buttons = tabs.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[next]?.focus();
  };

  const visible = messages.slice(0, step);
  const overallProgress = ((stageIndex + step / Math.max(messages.length, 1)) / stages.length) * 100;

  return (
    /* overflow-x-clip rather than overflow-hidden: `hidden` would make this
       section a scroll container and break the sticky phone column. */
    <Section
      id="journey"
      tone="inverse"
      space="grand"
      className="overflow-x-clip before:hidden [--color-ink-inverse-muted:#5e5b73] [--color-ink-inverse-soft:#48465c] [--color-ink-inverse:#171426] [--color-inverse-hover:#665aa624] [--color-inverse-line:#51487938] [--color-inverse-raised:#ffffff94] [--color-inverse:#e2ddf4]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-44 bg-gradient-to-b from-sunken via-sunken/55 to-transparent sm:h-56"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-t from-paper to-transparent sm:h-36"
      />
      {/* Inverse surface: this section is a night-time scene and the phone is
          the light source. It also creates the strongest possible break in the
          page rhythm at the exact point we need full attention. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(60rem 40rem at 78% 30%, color-mix(in oklab, var(--jade-500) 18%, transparent), transparent 72%)',
        }}
      />

      <Container className="relative">
        <div ref={sentinel} />

        <div className="max-w-[46rem]">
          <Reveal y={12} className="eyebrow">
            <WhatsAppMark size={14} /> The ordering conversation
          </Reveal>
          <Reveal y={20} delay={70} as="h2" className="mt-4 text-display-2">
            Watch the entire order happen.
            <br />
            <span className="text-ink-inverse-muted">Then decide.</span>
          </Reveal>
          <Reveal y={18} delay={140}>
            <p className="mt-5 max-w-[46ch] text-lead text-ink-inverse-soft">
              The real flow, with your choices in it. Nothing is hidden behind the click.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 3xl:gap-24">
          {/* ------------------------------- RAIL --------------------------- */}
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <div
                className="h-1 flex-1 overflow-hidden rounded-full bg-inverse-hover"
                role="progressbar"
                aria-valuenow={Math.round(overallProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Journey progress"
              >
                <div
                  className="h-full rounded-full bg-verdant-500 transition-[width] duration-500 ease-linear"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              {/* Playback controls read as a physical transport cluster rather
                  than two loose icons — the glass capsule groups them. */}
              <div className="glass glass-inverse flex shrink-0 items-center gap-1 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className="btn btn-quiet btn-icon-sm text-ink-inverse-soft hover:!bg-inverse-hover hover:text-ink-inverse"
                  disabled={still}
                  aria-label={playing ? 'Pause the conversation' : 'Play the conversation'}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => goToStage(0)}
                  className="btn btn-quiet btn-icon-sm text-ink-inverse-soft hover:!bg-inverse-hover hover:text-ink-inverse"
                  aria-label="Start the conversation again"
                >
                  <Replay size={16} />
                </button>
              </div>
            </div>

            <div
              ref={tabs}
              role="tablist"
              aria-label="Ordering stages"
              aria-orientation="vertical"
              onKeyDown={onTabKey}
              className="mt-6 flex flex-col"
            >
              {stages.map((s, i) => {
                const active = i === stageIndex;
                const complete = i < stageIndex;
                return (
                  <div key={s.id} className="border-b border-inverse-line last:border-0">
                    <button
                      role="tab"
                      type="button"
                      id={`stage-tab-${s.id}`}
                      aria-selected={active}
                      aria-controls="stage-panel"
                      tabIndex={active ? 0 : -1}
                      onClick={() => goToStage(i)}
                      className="group flex w-full items-center gap-4 py-4 text-left"
                    >
                      <span
                        aria-hidden="true"
                        className={cx(
                          'grid size-8 shrink-0 place-items-center rounded-full border text-[0.7rem] font-bold tabular-nums transition-all duration-300',
                          active && 'border-verdant-500 bg-verdant-500 text-[#06230f] scale-105',
                          complete && 'border-verdant-500/40 bg-verdant-500/15 text-verdant-500',
                          !active && !complete && 'border-inverse-line text-ink-inverse-muted',
                        )}
                      >
                        {complete ? '✓' : i + 1}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={cx(
                            'font-sans block text-[1rem] leading-tight font-semibold transition-colors',
                            active ? 'text-ink-inverse' : 'text-ink-inverse-muted group-hover:text-ink-inverse-soft',
                          )}
                        >
                          {s.title}
                        </span>
                      </span>

                      <span
                        className={cx(
                          'shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.08em] uppercase transition-colors',
                          s.actor === 'you'
                            ? 'bg-verdant-500/15 text-verdant-500'
                            : 'bg-inverse-raised text-ink-inverse-muted',
                        )}
                      >
                        {s.actor === 'you' ? 'You' : 'Us'} · {s.eta}
                      </span>
                    </button>

                    {/* Expanding reassurance. The rail is not just navigation —
                        each stage's copy answers that stage's specific fear. */}
                    <div
                      className="grid transition-[grid-template-rows] duration-[400ms] ease-[var(--ease-out)]"
                      style={{ gridTemplateRows: active ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[54ch] pb-5 pl-12 text-small text-ink-inverse-soft">
                          {s.reassurance}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Reveal y={16} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <OrderButton
                intent="final"
                label="Do this for real"
                sublabel="Opens WhatsApp · about 4 minutes"
              />
              <p className="max-w-[22ch] text-small text-ink-inverse-muted">
                Nothing is charged before you approve the cover.
              </p>
            </Reveal>
          </div>

          {/* ------------------------------ PHONE --------------------------- */}
          <div className="lg:sticky lg:top-28 lg:w-[22rem]">
            <PhoneFrame status={typing ? 'typing…' : 'online · replies in ~2 min'}>
              <div
                ref={scroller}
                id="stage-panel"
                role="tabpanel"
                aria-labelledby={`stage-tab-${stage.id}`}
                aria-live="polite"
                className="rail-scroll flex h-[27rem] flex-col justify-end gap-2 overflow-y-auto px-3 py-4"
              >
                <div className="flex flex-col items-start gap-2">
                  <span className="mx-auto rounded-md bg-black/[0.06] px-2 py-0.5 text-[0.6rem] font-medium text-[var(--chat-in-ink)] opacity-60">
                    {stage.label}
                  </span>
                  {visible.map((msg, i) => (
                    <div
                      key={`${stage.id}-${i}`}
                      className={cx(
                        'flex w-full',
                        msg.kind === 'out' || msg.kind === 'chips' ? 'justify-end' : 'justify-start',
                      )}
                      style={
                        still
                          ? undefined
                          : { animation: 'msg-in 260ms var(--ease-spring) both' }
                      }
                    >
                      <ChatMessage msg={msg} />
                    </div>
                  ))}
                  {typing && <TypingBubble />}
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </Container>
    </Section>
  );
}
