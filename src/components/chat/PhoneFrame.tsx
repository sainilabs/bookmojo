import type { ReactNode } from 'react';
import { BRAND } from '@/lib/config';
import { Check } from '@/components/art/Icons';

/**
 * PHONE FRAME
 * -----------------------------------------------------------------------------
 * A device shell drawn entirely in CSS — no screenshot, no mockup PNG.
 *
 * Why it matters that this is real markup and not an image:
 *   · The conversation inside is live, personalised and scrollable, so it cannot
 *     be a picture.
 *   · Screenshots of chat UIs age instantly and look fake at 2×. Vector-drawn
 *     chrome stays sharp and can be re-themed with the rest of the page.
 *   · Zero bytes on the wire and zero layout shift.
 *
 * Fidelity is deliberate but restrained: enough WhatsApp signal (header colour,
 * bubble geometry, tick marks, wallpaper) that a user instantly recognises the
 * app they are about to open, without pretending to be a pixel-perfect clone.
 * Recognition reduces the perceived risk of the click.
 */
export function PhoneFrame({
  children,
  status = 'online',
  className,
}: {
  children: ReactNode;
  status?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div
        className="relative mx-auto w-full max-w-[22rem] rounded-[2.6rem] p-[0.42rem] shadow-e4"
        style={{
          background: 'linear-gradient(155deg, #4a4550, #16131c 40%, #34303c)',
        }}
      >
        {/* Side hardware */}
        <span
          aria-hidden="true"
          className="absolute -right-[2px] top-[24%] h-14 w-[3px] rounded-r-sm bg-[#3a3542]"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[2px] top-[20%] h-8 w-[3px] rounded-l-sm bg-[#3a3542]"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[2px] top-[31%] h-12 w-[3px] rounded-l-sm bg-[#3a3542]"
        />

        <div className="relative overflow-hidden rounded-[2.2rem] bg-[var(--chat-canvas)]">
          {/* Status bar + conversation header */}
          <div className="relative" style={{ background: 'var(--chat-header)' }}>
            <div className="flex items-center justify-between px-6 pt-2.5 pb-1 text-[0.62rem] font-semibold text-white/85">
              <span className="tabular-nums">21:47</span>
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-black/85"
              />
              <span className="flex items-center gap-1.5" aria-hidden="true">
                {/* Signal + battery, drawn rather than typed: status-bar glyphs
                    live in private-use ranges and render as tofu off-platform. */}
                <svg viewBox="0 0 14 10" className="h-2.5 w-3.5" fill="currentColor">
                  <rect x="0" y="6.5" width="2.4" height="3.5" rx="0.6" />
                  <rect x="3.8" y="4.5" width="2.4" height="5.5" rx="0.6" />
                  <rect x="7.6" y="2.5" width="2.4" height="7.5" rx="0.6" />
                  <rect x="11.4" y="0.5" width="2.4" height="9.5" rx="0.6" opacity="0.4" />
                </svg>
                <svg viewBox="0 0 26 12" className="h-2.5 w-5" fill="none">
                  <rect
                    x="0.7"
                    y="0.7"
                    width="21"
                    height="10.6"
                    rx="3"
                    stroke="currentColor"
                    strokeOpacity="0.55"
                    strokeWidth="1.2"
                  />
                  <rect x="2.4" y="2.4" width="14" height="7.2" rx="1.8" fill="currentColor" />
                  <path d="M23.6 4.2v3.6a2 2 0 0 0 0-3.6Z" fill="currentColor" fillOpacity="0.6" />
                </svg>
              </span>
            </div>

            <div className="flex items-center gap-3 px-3.5 pb-3">
              <span aria-hidden="true" className="text-white/70">
                ‹
              </span>
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f2c14e] text-[0.8rem] font-bold text-[#1a1520]"
              >
                BM
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-white">
                  BookMojo
                  <span
                    aria-hidden="true"
                    className="grid size-3.5 place-items-center rounded-full bg-[#25d366] text-[#075e54]"
                    title="Verified business"
                  >
                    <Check size={9} strokeWidth={3.4} />
                  </span>
                </span>
                <span className="block truncate text-[0.66rem] text-white/70">{status}</span>
              </span>
              <span aria-hidden="true" className="text-white/60">
                ⋮
              </span>
            </div>
          </div>

          {/* Wallpaper: sparse doodles, low contrast, so bubbles stay dominant. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[4.6rem] opacity-[0.07]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' fill='none' stroke='%23000' stroke-width='2'%3E%3Ccircle cx='24' cy='28' r='7'/%3E%3Cpath d='M62 18l6 12-12 0z'/%3E%3Cpath d='M92 40h16v14H92z'/%3E%3Cpath d='M18 78c8-8 18-8 26 0'/%3E%3Ccircle cx='84' cy='92' r='9'/%3E%3Cpath d='M46 104h20'/%3E%3C/svg%3E\")",
              backgroundSize: '120px 120px',
            }}
          />

          <div className="relative">{children}</div>

          {/* Composer. Non-interactive by design: this is a depiction, and a
              fake input that swallowed keystrokes would be a usability trap. */}
          <div
            className="flex items-center gap-2 border-t border-[var(--chat-line)] px-3 py-2.5"
            style={{ background: 'var(--chat-canvas)' }}
            aria-hidden="true"
          >
            <span className="flex h-9 flex-1 items-center rounded-full bg-[var(--chat-in)] px-3.5 text-[0.74rem] text-[var(--chat-in-ink)] opacity-45">
              Message
            </span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--chat-btn)] text-[var(--chat-btn-ink)]">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                <path d="M3 20.5l18-8.5L3 3.5l3.6 7.1L15 12l-8.4 1.4z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[0.7rem] text-ink-muted">
        A depiction of the real conversation · {BRAND.whatsappDisplay}
      </p>
    </div>
  );
}
