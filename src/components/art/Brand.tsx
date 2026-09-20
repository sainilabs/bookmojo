/**
 * WORDMARK
 * -----------------------------------------------------------------------------
 * An illustrated mark — two children rising out of an open book — beside the
 * wordmark set in the same display face as page headings.
 *
 * The mark is the illustration half of the supplied artwork only; the lockup's own
 * bubble lettering is cropped away and the name stays as live text. Text scales
 * with the type ramp, stays crisp in both themes, can be selected and read aloud,
 * and keeps the asset small enough to load on every page — none of which a picture
 * of the name would do.
 *
 * Deriving the crop needed measurement, not an eyeball: the illustration and the
 * lettering touch, with the thinnest row at 790 carrying 39 opaque pixels, and the
 * lettering's yellow accent strokes rise into that row at x 1102-1144 while the
 * illustration never passes x 983. Everything right of 1050 is therefore dropped.
 * Cutting higher instead clipped the book's lower edge.
 *
 * Sized in one place: the mark is landscape, so it is driven by height with the
 * width left to follow, and the intrinsic dimensions are declared so the nav does
 * not reflow while it loads.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={`${import.meta.env.BASE_URL}logo-mark.png`}
        alt=""
        aria-hidden="true"
        width={180}
        height={127}
        className="h-10 w-auto shrink-0"
      />
      {!compact && (
        <span className="font-display text-[1.3rem] leading-none font-extrabold tracking-[-0.035em]">
          KidMojo
        </span>
      )}
    </span>
  );
}
