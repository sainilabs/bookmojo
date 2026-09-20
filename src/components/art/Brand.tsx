/**
 * WORDMARK
 * -----------------------------------------------------------------------------
 * Two halves of the supplied lockup, kept as separate files rather than one image:
 * the illustration (children rising out of an open book) and the bubble lettering.
 * Splitting them lets the mark show on its own where the name would not fit, and
 * lets each be sized independently against the nav.
 *
 * Cutting them apart needed measurement, not an eyeball. The halves touch — the
 * thinnest row is 790, carrying 39 opaque pixels — and the lettering's yellow
 * accent strokes rise to about row 745 at x 1102-1144, while in those same rows the
 * book's lower tip is still present around x 596-657. Neither half is a plain
 * rectangle, so each is reassembled from the regions where the other is absent,
 * using x 1050 as the divide: the illustration never passes x 983.
 *
 * The lettering carries the brand name, so it takes real alt text. The illustration
 * is decorative beside it and is hidden from assistive tech. In the nav the anchor
 * already has its own label, which takes precedence over both.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  const base = import.meta.env.BASE_URL;

  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={`${base}logo-mark.png`}
        alt=""
        aria-hidden="true"
        width={180}
        height={127}
        className="h-10 w-auto shrink-0"
      />
      {!compact && (
        <img
          src={`${base}logo-wordmark.png`}
          alt="KidMojo"
          width={320}
          height={98}
          className="h-[1.6rem] w-auto shrink-0"
        />
      )}
    </span>
  );
}
