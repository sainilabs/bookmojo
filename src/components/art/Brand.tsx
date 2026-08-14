/**
 * WORDMARK
 * -----------------------------------------------------------------------------
 * A monogram, not a mascot. The glyph is an open book whose two pages also read
 * as a crescent and a rising sun — the two halves of "bedtime story" and
 * "childhood". It stays legible at 20px in a nav and as a 32px favicon, which a
 * detailed illustrated logo would not.
 *
 * The wordmark uses the same restrained editorial serif as page headings, while
 * the monogram carries recognition at small sizes.
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
        <span className="font-display text-[1.3rem] leading-none font-extrabold tracking-[-0.035em]">
          BookMojo
        </span>
      )}
    </span>
  );
}
