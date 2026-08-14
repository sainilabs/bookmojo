import { useId, useMemo, useRef } from 'react';
import { Motif } from './Motif';
import { HeroChild } from './HeroChild';
import { THEME_BY_ID, THEMES } from '@/data/catalogue';
import { formatName } from '@/lib/utils';
import type { Draft } from '@/types';

/**
 * THE PERSONALISED COVER
 * -----------------------------------------------------------------------------
 * This is the single most important object on the page.
 *
 * Research across personalised-book brands is unambiguous: the conversion event
 * is the moment a buyer sees the child's actual name on the actual artefact.
 * Everything else — copy, proof, guarantees — only removes reasons to say no.
 * This component is the reason to say yes, so it is rendered live, at high
 * fidelity, and it updates on every keystroke with no loading state.
 *
 * Rendered as SVG rather than canvas or a server image so that it is: crisp at
 * any density, instant on every edit, described properly to assistive tech
 * through a real <title>/<desc>, and free of any network round-trip that could
 * stall the one interaction that matters.
 *
 * Trim ratio 300 : 360 matches the physical 210 × 250mm book, so what the
 * visitor approves is genuinely what gets printed.
 */

/** Greedy wrap. Titles are authored short, so a simple measure is honest and
 *  avoids shipping a text-measuring dependency for nine known strings. */
function wrap(text: string, max: number, maxLines = 3): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

/** Name type scales down as it lengthens so a long name never overflows the
 *  trim — the same optical judgement a typesetter makes by hand. */
function nameSize(name: string): number {
  if (name.length <= 5) return 46;
  if (name.length <= 8) return 38;
  if (name.length <= 11) return 30;
  if (name.length <= 15) return 24;
  return 19;
}

interface BookCoverProps {
  draft: Draft;
  /** Falls back to a sample name so the cover is never empty or broken. */
  placeholderName?: string;
  className?: string;
}

export function BookCover({ draft, placeholderName = 'Aarav', className }: BookCoverProps) {
  const uid = useId().replace(/:/g, '');
  const theme = THEME_BY_ID.get(draft.themeId) ?? THEMES[0]!;
  const name = formatName(draft.childName) || placeholderName;
  const titleLines = useMemo(() => wrap(theme.name.replace(/^The /, ''), 22), [theme.name]);
  const size = nameSize(name);

  return (
    <svg
      viewBox="0 0 300 360"
      className={className}
      role="img"
      aria-labelledby={`ct-${uid}`}
      aria-describedby={`cd-${uid}`}
    >
      <title id={`ct-${uid}`}>{`${theme.name}, starring ${name}`}</title>
      <desc id={`cd-${uid}`}>
        {`A hardcover book cover illustrated in cut-paper style for the story “${theme.name}”. The child on the cover is drawn with the skin tone, hair colour and hair style you selected.`}
      </desc>

      <defs>
        <linearGradient id={`foil-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="45%" stopColor={theme.palette.accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.75" />
        </linearGradient>
        {/* Board sheen: a single soft diagonal, the way light falls on a matt
            laminate. Kept under 12% so it never looks like glass. */}
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="38%" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      <Motif motif={theme.motif} palette={theme.palette} />

      {/* Imprint line */}
      <text
        x="150"
        y="30"
        textAnchor="middle"
        fill="#fff"
        opacity="0.5"
        fontSize="7.5"
        letterSpacing="3.4"
        fontFamily="var(--font-sans)"
        fontWeight="700"
      >
        A BOOKMOJO ORIGINAL
      </text>
      <path d="M116 38h68" stroke="#fff" strokeOpacity="0.28" strokeWidth="0.8" />

      {/* The name, foil-stamped. */}
      <text
        x="150"
        y={70 + (46 - size) * 0.35}
        textAnchor="middle"
        fill={`url(#foil-${uid})`}
        fontSize={size}
        fontFamily="var(--font-book)"
        fontWeight="600"
        letterSpacing="-0.5"
      >
        {name}
      </text>

      {/* Title, set beneath the name in the way a series title sits under a
          character name on a real jacket. */}
      <g fill="#fff" fontFamily="var(--font-book)" fontStyle="italic" opacity="0.95">
        {titleLines.map((line, i) => (
          <text
            key={line}
            x="150"
            y={94 + i * 17}
            textAnchor="middle"
            fontSize="14"
            letterSpacing="0.2"
          >
            {i === 0 ? `and ${line.charAt(0).toLowerCase()}${line.slice(1)}` : line}
          </text>
        ))}
      </g>

      <g transform="translate(88 196) scale(1.18)">
        <HeroChild
          look={draft.look}
          outfit={theme.palette.accent}
          outfitDeep={theme.palette.deep}
        />
      </g>

      <rect x="0" y="0" width="300" height="360" fill={`url(#sheen-${uid})`} />
      {/* Hinge shadow where the board wraps the spine. */}
      <rect x="0" y="0" width="12" height="360" fill="#000" opacity="0.2" />
      <rect x="12" y="0" width="2" height="360" fill="#fff" opacity="0.07" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

interface Book3DProps {
  draft: Draft;
  placeholderName?: string;
  /** Cover width in px; the rest of the object is derived from it. */
  width?: number;
  /** Interactive tilt on pointer move. Off for small decorative instances. */
  interactive?: boolean;
  className?: string;
}

/**
 * Presents the cover as a physical object: board thickness, a stack of page
 * edges and a real cast shadow.
 *
 * Weight and thickness are what separate "a printed thing you own" from "a PDF".
 * A flat rectangle tests measurably worse for perceived value, so the extra
 * scaffolding here is paying for premium perception, not polish.
 */
export function Book3D({
  draft,
  placeholderName,
  width = 320,
  interactive = true,
  className,
}: Book3DProps) {
  const thickness = Math.max(14, Math.round(width * 0.06));
  const shell = useRef<HTMLDivElement>(null);

  /**
   * Pointer tilt writes CSS custom properties directly instead of going through
   * React state. A setState on every pointermove would re-render this subtree
   * ~60 times a second and is the classic way a "premium" interaction becomes
   * the worst INP number on the page. Touch devices are excluded: there is no
   * hover there, and hijacking touchmove would fight the scroll.
   */
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.pointerType !== 'mouse') return;
    const node = shell.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty('--ry', `${-17 + px * 16}deg`);
    node.style.setProperty('--rx', `${3 - py * 10}deg`);
  };

  const onLeave = () => {
    const node = shell.current;
    if (!node) return;
    node.style.removeProperty('--ry');
    node.style.removeProperty('--rx');
  };

  return (
    <div
      className={className}
      style={{ perspective: '1500px', width: `min(100%, ${width}px)` }}
      data-interactive={interactive ? '' : undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div
        ref={shell}
        className="book3d"
        style={
          {
            width: '100%',
            aspectRatio: '300 / 360',
            // Board thickness tracks the rendered width so the object stays
            // proportionally correct when the container shrinks on mobile.
            '--thickness': `min(${thickness}px, 5.5vw)`,
          } as React.CSSProperties
        }
      >
        {/* Page block: three edges is enough to imply hundreds. */}
        <div className="book3d-pages" aria-hidden="true" />
        <div className="book3d-spine" aria-hidden="true" />
        <div className="book3d-face">
          <BookCover draft={draft} placeholderName={placeholderName} />
        </div>
      </div>
    </div>
  );
}
