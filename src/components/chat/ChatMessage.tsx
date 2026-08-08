import { Check, Lock, Truck } from '@/components/art/Icons';
import type { Msg } from '@/data/journey';
import { cx } from '@/lib/utils';

/**
 * MESSAGE RENDERER
 * -----------------------------------------------------------------------------
 * Seven message types, not one.
 *
 * The brief was explicit that this must not be "just chat bubbles", and there is
 * a real reason beyond craft: the objections we need to answer are structural,
 * not conversational. "How do I pay?" is answered by seeing a secure-checkout
 * card, not by reading a sentence about one. "Will I know where my book is?" is
 * answered by a tracker. So each stage of the funnel gets a purpose-built
 * artefact, exactly as the live automation sends it.
 *
 * Every artefact is rendered from data, so the growth team can change the script
 * without a designer, and the depiction cannot drift from the real flow.
 */
export function ChatMessage({ msg, delivered = true }: { msg: Msg; delivered?: boolean }) {
  switch (msg.kind) {
    case 'in':
      return (
        <div className="bubble bubble-in whitespace-pre-line">
          <span>{msg.text}</span>
          <Timestamp />
        </div>
      );

    case 'out':
      return (
        <div className="bubble bubble-out whitespace-pre-line">
          <span>{msg.text}</span>
          <Timestamp ticks={delivered} />
        </div>
      );

    /* Quick-reply chips. The chosen one is visibly selected: this is what tells
       the visitor "you will mostly be tapping, not typing". */
    case 'chips':
      return (
        <div className="flex w-full flex-col items-end gap-1.5">
          <span className="sr-only">{`${msg.label}: ${msg.options[msg.chosen] ?? msg.options[0]} selected`}</span>
          <div className="flex flex-wrap justify-end gap-1.5" aria-hidden="true">
            {msg.options.map((option, i) => (
              <span
                key={option}
                className={cx(
                  'rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold transition-colors',
                  i === msg.chosen
                    ? 'border-transparent bg-[#0b7c43] text-white shadow-sm'
                    : 'border-black/12 bg-[var(--chat-in)] text-[var(--chat-in-ink)] opacity-65',
                )}
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      );

    /* Order summary: the pre-payment review artefact. */
    case 'summary':
      return (
        <div className="w-[88%] self-start overflow-hidden rounded-xl bg-[var(--chat-in)] text-[var(--chat-in-ink)] shadow-sm">
          <div className="flex items-center justify-between bg-black/[0.055] px-3 py-2">
            <span className="text-[0.62rem] font-bold tracking-[0.1em] uppercase opacity-70">
              Your book
            </span>
            <span className="rounded-full bg-[#0b7c43]/12 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-[#0b7c43]">
              Preview
            </span>
          </div>
          <dl className="divide-y divide-black/[0.07] px-3">
            {msg.rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 py-1.5">
                <dt className="text-[0.7rem] opacity-60">{k}</dt>
                <dd className="max-w-[62%] text-right text-[0.72rem] font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex items-center justify-between bg-black/[0.055] px-3 py-2">
            <span className="text-[0.7rem] font-semibold">Total, all in</span>
            <span className="text-[0.85rem] font-bold tabular-nums">{msg.total}</span>
          </div>
        </div>
      );

    /* Payment: the single highest-anxiety moment in a chat-based purchase, so it
       gets the most explicit artefact on the page. */
    case 'payment':
      return (
        <div className="w-[88%] self-start overflow-hidden rounded-xl border border-black/10 bg-[var(--chat-in)] text-[var(--chat-in-ink)] shadow-sm">
          <div className="flex items-center gap-2 border-b border-black/[0.08] px-3 py-2">
            <Lock size={14} className="text-[#0b7c43]" />
            <span className="text-[0.68rem] font-bold">Secure checkout link</span>
            <span className="ml-auto text-[0.6rem] opacity-55">expires in 30 min</span>
          </div>
          <div className="px-3 py-3">
            <p className="text-[0.65rem] opacity-60">Amount due</p>
            <p className="font-display text-[1.5rem] leading-none font-semibold tabular-nums">
              {msg.total}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {msg.methods.map((method) => (
                <span
                  key={method}
                  className="rounded-md border border-black/10 bg-black/[0.03] px-2 py-1 text-[0.65rem] font-semibold"
                >
                  {method}
                </span>
              ))}
            </div>
            <span className="mt-3 flex h-9 items-center justify-center rounded-lg bg-[#0b7c43] text-[0.75rem] font-bold text-white">
              Pay securely
            </span>
            <p className="mt-2 text-[0.6rem] leading-snug opacity-55">
              Opens our payment provider. Card details are never sent in this chat and we never
              store them.
            </p>
          </div>
        </div>
      );

    case 'receipt':
      return (
        <div className="w-[80%] self-start overflow-hidden rounded-xl bg-[var(--chat-in)] text-[var(--chat-in-ink)] shadow-sm">
          <div className="flex items-center gap-2.5 px-3 py-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#0b7c43] text-white">
              <Check size={16} strokeWidth={2.6} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.74rem] font-bold">Payment confirmed</span>
              <span className="block text-[0.65rem] opacity-60">
                Order {msg.id} · {msg.total} · receipt saved to this chat
              </span>
            </span>
          </div>
        </div>
      );

    /* Production tracker: turns a 5–7 day wait from a void into a process. */
    case 'tracker':
      return (
        <div className="w-[90%] self-start overflow-hidden rounded-xl bg-[var(--chat-in)] px-3 py-3 text-[var(--chat-in-ink)] shadow-sm">
          <p className="text-[0.62rem] font-bold tracking-[0.1em] uppercase opacity-65">
            In production
          </p>
          <ol className="mt-2.5 flex flex-col gap-0">
            {msg.steps.map((step, i) => (
              <li key={step.label} className="flex gap-2.5">
                <span className="relative flex w-4 shrink-0 flex-col items-center">
                  <span
                    className={cx(
                      'mt-1 size-2.5 shrink-0 rounded-full',
                      step.state === 'done' && 'bg-[#0b7c43]',
                      step.state === 'active' &&
                        'bg-[#e08a2e] ring-3 ring-[#e08a2e]/25 animate-pulse',
                      step.state === 'todo' && 'bg-black/15',
                    )}
                  />
                  {i < msg.steps.length - 1 && (
                    <span
                      className={cx(
                        'w-px flex-1',
                        step.state === 'done' ? 'bg-[#0b7c43]/40' : 'bg-black/12',
                      )}
                    />
                  )}
                </span>
                <span
                  className={cx(
                    'pb-2.5 text-[0.72rem] leading-snug',
                    step.state === 'todo' ? 'opacity-45' : 'font-semibold',
                  )}
                >
                  {step.label}
                  {step.state === 'active' && (
                    <span className="ml-1.5 text-[0.6rem] font-bold uppercase text-[#b06a12]">
                      now
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      );

    case 'shipment':
      return (
        <div className="w-[88%] self-start overflow-hidden rounded-xl bg-[var(--chat-in)] text-[var(--chat-in-ink)] shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-black/[0.08] px-3 py-2">
            <Truck size={15} className="text-[#0b7c43]" />
            <span className="text-[0.7rem] font-bold">{msg.courier}</span>
            <span className="ml-auto font-mono text-[0.62rem] opacity-60">{msg.code}</span>
          </div>
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {['Printed', 'Boxed', 'In transit', 'Out for delivery', 'Delivered'].map((s, i) => (
                <span
                  key={s}
                  className={cx(
                    'h-1.5 flex-1 rounded-full',
                    i < 4 ? 'bg-[#0b7c43]' : 'bg-black/12',
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-[0.72rem] font-semibold">Out for delivery</p>
            <p className="text-[0.65rem] opacity-60">Arriving {msg.eta}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

function Timestamp({ ticks = false }: { ticks?: boolean }) {
  return (
    <span
      className="float-right ml-2 mt-1 flex translate-y-0.5 items-center gap-0.5 text-[0.58rem] opacity-55"
      aria-hidden="true"
    >
      21:47
      {ticks && (
        <svg viewBox="0 0 18 12" className="w-3.5" fill="none" stroke="#34b7f1" strokeWidth="1.6">
          <path d="M1 6.6l3 3L9.5 3" strokeLinecap="round" />
          <path d="M7 6.6l3 3L16.5 3" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

/** Three-dot typing indicator. The cue that makes a scripted replay read as a
 *  live conversation rather than a slideshow. */
export function TypingBubble() {
  return (
    <div className="bubble bubble-in flex items-center gap-1 py-2.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-current opacity-40"
          style={{ animation: `twinkle 1.1s var(--ease-in-out) ${i * 0.16}s infinite` }}
        />
      ))}
    </div>
  );
}
