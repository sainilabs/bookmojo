import type { HairId, HeroLook } from '@/types';

/**
 * THE HERO
 * -----------------------------------------------------------------------------
 * A cut-paper child assembled from the same shape vocabulary as the motifs, so
 * the figure belongs to the world it is standing in.
 *
 * Two constraints shaped this drawing:
 *   1. It must read at 44px (theme rail) and at 400px (hero cover). So: no fine
 *      detail, no facial expression beyond two eyes and a blush — silhouette
 *      does the work.
 *   2. It must represent any child without becoming a caricature of one. The
 *      face is intentionally near-neutral; identity is carried by skin tone,
 *      hair colour and hair style, which are the three attributes parents
 *      actually check for before they will pay.
 *
 * Drawn in a local 100 × 130 space and positioned by the caller.
 */

interface HeroChildProps {
  look: HeroLook;
  /** Cloak/outfit colour — inherited from the story world's accent. */
  outfit: string;
  outfitDeep: string;
  /** Slight idle sway. Disabled automatically by the global motion policy. */
  animate?: boolean;
}

export function HeroChild({ look, outfit, outfitDeep, animate = true }: HeroChildProps) {
  const { skin, hair, hairStyle } = look;

  return (
    <g style={animate ? { animation: 'float 5.5s var(--ease-in-out) infinite' } : undefined}>
      {/* Contact shadow anchors the figure to the ground plane. */}
      <ellipse cx="50" cy="127" rx="30" ry="5" fill="#000" opacity="0.18" />

      {/* Legs */}
      <rect x="38" y="96" width="8" height="28" rx="4" fill={skin} />
      <rect x="54" y="96" width="8" height="28" rx="4" fill={skin} />
      <rect x="34" y="118" width="16" height="8" rx="4" fill={outfitDeep} />
      <rect x="50" y="118" width="16" height="8" rx="4" fill={outfitDeep} />

      {/* Cloak: one wedge, one ribbon fold. The fold is what stops it reading
          as a triangle. */}
      <path d="M50 52c16 0 26 14 30 48H20c4-34 14-48 30-48Z" fill={outfit} />
      <path d="M50 52c8 0 14 4 18 12-6 22-6 44-4 56H36c2-12 2-34-4-56 4-8 10-12 18-12Z" fill={outfitDeep} opacity="0.32" />

      {/* Arms */}
      <rect x="14" y="62" width="8" height="26" rx="4" fill={skin} transform="rotate(-14 18 62)" />
      <rect x="78" y="62" width="8" height="26" rx="4" fill={skin} transform="rotate(14 82 62)" />

      {/* Head */}
      <circle cx="50" cy="36" r="21" fill={skin} />
      {/* Ears */}
      <circle cx="28" cy="38" r="4.4" fill={skin} />
      <circle cx="72" cy="38" r="4.4" fill={skin} />

      <Hair style={hairStyle} colour={hair} />

      {/* Face: two dots, two blushes. Nothing more. */}
      <circle cx="43" cy="37" r="2.4" fill="#241d1f" />
      <circle cx="57" cy="37" r="2.4" fill="#241d1f" />
      <path d="M45.5 45q4.5 4 9 0" stroke="#241d1f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="43" r="4" fill="#e07a6a" opacity="0.3" />
      <circle cx="64" cy="43" r="4" fill="#e07a6a" opacity="0.3" />
    </g>
  );
}

function Hair({ style, colour }: { style: HairId; colour: string }) {
  switch (style) {
    case 'curls':
      return (
        <g fill={colour}>
          <circle cx="34" cy="24" r="10" />
          <circle cx="48" cy="16" r="11.5" />
          <circle cx="63" cy="23" r="9.5" />
          <circle cx="28" cy="34" r="7" />
          <circle cx="72" cy="33" r="6.5" />
          <path d="M31 30a19 19 0 0 1 38-1c-6-7-32-7-38 1Z" />
        </g>
      );
    case 'braids':
      return (
        <g fill={colour}>
          <path d="M29 32a21 21 0 0 1 42 0c-6-12-36-12-42 0Z" />
          <path d="M50 15a21 21 0 0 1 21 17H29A21 21 0 0 1 50 15Z" />
          <g>
            <rect x="22" y="34" width="8" height="30" rx="4" />
            <circle cx="26" cy="66" r="4.6" />
            <rect x="70" y="34" width="8" height="30" rx="4" />
            <circle cx="74" cy="66" r="4.6" />
          </g>
        </g>
      );
    case 'short':
      return (
        <g fill={colour}>
          <path d="M50 13a22 22 0 0 1 22 21c-3-4-8-6-14-6-9 0-13 4-16 8-4-5-9-7-14-7-1 0-2 0-3 .4A22 22 0 0 1 50 13Z" />
        </g>
      );
    case 'long':
      return (
        <g fill={colour}>
          <path d="M50 13a22 22 0 0 1 22 22v4c0-8-6-13-11-14-4 4-7 6-11 6s-7-2-11-6c-5 1-11 6-11 14v-4A22 22 0 0 1 50 13Z" />
          <path d="M27 32c-4 22-4 40-1 52h10c-3-14-3-34-1-50Z" />
          <path d="M73 32c4 22 4 40 1 52H64c3-14 3-34 1-50Z" />
        </g>
      );
    case 'buzz':
      return (
        <g fill={colour}>
          <path d="M50 14a21 21 0 0 1 20.6 17.4C66 26 58 23 50 23s-16 3-20.6 8.4A21 21 0 0 1 50 14Z" />
        </g>
      );
    /* Patka: the cloth tied over a joora. The knot is drawn showing through in
       the child's own hair colour, so the option still personalises rather than
       just placing a generic hat on the head. */
    case 'patka':
      return (
        <g>
          <circle cx="50" cy="12" r="7.5" fill={colour} />
          <path
            d="M50 13c12.5 0 21.5 9 22 20.2.1 2.4-1.7 3.8-4 3.8H32c-2.3 0-4.1-1.4-4-3.8C28.5 22 37.5 13 50 13Z"
            fill="#efe7d6"
          />
          <path d="M50 13c3.2 0 5.6 1.7 6.6 4.2-4.4 1.5-8.8 1.5-13.2 0C44.4 14.7 46.8 13 50 13Z" fill="#e2d8c2" />
          <path d="M29.5 33.5c10.5-5.6 30.5-5.6 41 0" stroke="#d0c4aa" strokeWidth="1.2" fill="none" />
        </g>
      );
    default:
      return null;
  }
}
