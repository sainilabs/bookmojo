/**
 * WORDMARK
 * -----------------------------------------------------------------------------
 * A monogram, not a mascot. The glyph is an open book whose two pages also read
 * as a crescent and a rising sun — the two halves of "bedtime story" and
 * "childhood". It stays legible at 20px in a nav and as a 32px favicon, which a
 * detailed illustrated logo would not.
 *
 * The wordmark is set in Fraunces with WONK on: the quirked letterforms are the
 * brand's signature, so the logo and the headlines are visibly the same voice.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="relative grid size-9 shrink-0 place-items-center rounded-[0.7rem] bg-inverse text-ink-inverse ring-1 ring-gold-500/30"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          {/* Book gutter */}
          <path d="M12 6.4v13.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Left board */}
          <path
            d="M12 6.4C10.4 4.8 7.8 4.2 4.6 4.4v13c3.2-.2 5.8.4 7.4 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Right board */}
          <path
            d="M12 6.4c1.6-1.6 4.2-2.2 7.4-2v13c-3.2-.2-5.8.4-7.4 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* The star that doubles as a page-mark */}
          <path
            d="M12 1.6l1.05 2.2 2.2 1.05-2.2 1.05L12 8.1l-1.05-2.2-2.2-1.05 2.2-1.05z"
            fill="var(--gold-500)"
          />
        </svg>
      </span>
      {!compact && (
        <span
          className="font-display text-[1.28rem] leading-none font-semibold tracking-[-0.03em]"
          style={{ fontVariationSettings: "'SOFT' 40, 'WONK' 1" }}
        >
          BookMojo
        </span>
      )}
    </span>
  );
}

/**
 * Fixed paper-grain layer. One composited texture for the whole document rather
 * than per-section overlays — cheaper, and it makes the page feel like a single
 * printed sheet instead of stacked panels.
 */
export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

/**
 * Hand-drawn arrow, used exactly twice on the page to point at the two moments
 * we most want noticed. Scarcity is the point: a page full of hand-drawn arrows
 * is a page with no emphasis.
 */
export function ScribbleArrow({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 96 64"
      className={className}
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M4 8c18 2 34 12 44 26 3 4 5 9 6 15"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="120"
        strokeDashoffset="0"
      />
      <path
        d="M43 44c4 3 8 5 11 5 2-4 4-8 8-11"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Soft blurred colour field behind the hero. Pure CSS gradients in an absolutely
 * positioned layer: no image, and no paint cost after the first frame.
 *
 * Composition is brass warmth on the left, eau de nil across the right and
 * bottom. Two jade fields against one brass: enough gold in the top-left corner
 * — where the eye enters — to say "gift", without the warm blobs burying the
 * brand hue the way an earlier gold+clay pairing did.
 */
export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      {/* Brass is held at 32%, not 50%: at half strength this blob tinted the
          entire hero warm and cancelled out the green in the surface beneath it.
          It is a highlight in one corner, not a wash. */}
      <div
        className="absolute -top-[18%] -left-[10%] size-[40rem] rounded-full opacity-32 blur-[90px] animate-drift"
        style={{
          background: 'radial-gradient(circle at 30% 30%, var(--gold-300), transparent 65%)',
        }}
      />
      <div
        className="absolute -right-[14%] top-[6%] size-[38rem] rounded-full opacity-45 blur-[100px] animate-float"
        style={{
          background: 'radial-gradient(circle at 60% 40%, var(--jade-300), transparent 68%)',
        }}
      />
      <div
        className="absolute bottom-[-24%] left-[28%] size-[34rem] rounded-full opacity-35 blur-[110px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--jade-300), transparent 70%)',
        }}
      />
    </div>
  );
}
