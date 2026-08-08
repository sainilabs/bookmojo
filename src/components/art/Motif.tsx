import { useId } from 'react';
import type { MotifId, StoryTheme } from '@/types';

/**
 * ILLUSTRATION STYLE — "cut paper, overprinted"
 * -----------------------------------------------------------------------------
 * The visual language is layered paper shapes with slightly misregistered
 * overprint blooms, the way a two-colour riso or letterpress job behaves when
 * the plates are a hair out of line.
 *
 * Why this and not the obvious cartoon vector look:
 *   · Cartoon illustration signals "screen content" and, to parents, "cheap".
 *     Cut paper signals a made object, which is what they are buying.
 *   · Flat shapes with no gradients scale to any density, print-match the real
 *     litho artwork, and stay legible at 40px in the theme rail.
 *   · Every motif is drawn from the same 6-shape vocabulary (arc, disc, wedge,
 *     ribbon, dot-field, silhouette), so six very different story worlds still
 *     read as one brand.
 *
 * Everything is procedural SVG: no image requests, nothing to lazy-load, no
 * layout shift, and the palette is driven by the theme token rather than baked
 * into an asset.
 */

interface MotifProps {
  motif: MotifId;
  palette: StoryTheme['palette'];
}

/** Deterministic pseudo-random field so star/bubble placement is stable across
 *  renders (a re-randomising sky would flicker on every state change). */
function field(count: number, seed: number) {
  const points: Array<{ x: number; y: number; r: number; o: number }> = [];
  let s = seed;
  const next = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  for (let i = 0; i < count; i += 1) {
    points.push({
      x: 8 + next() * 284,
      y: 8 + next() * 210,
      r: 0.8 + next() * 2.4,
      o: 0.35 + next() * 0.65,
    });
  }
  return points;
}

export function Motif({ motif, palette }: MotifProps) {
  const uid = useId().replace(/:/g, '');
  const { base, accent, deep } = palette;

  return (
    <g>
      <defs>
        {/* Overprint bloom: the misregistration that sells the print metaphor. */}
        <filter id={`bloom-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <clipPath id={`frame-${uid}`}>
          <rect x="0" y="0" width="300" height="360" rx="4" />
        </clipPath>
      </defs>

      <g clipPath={`url(#frame-${uid})`}>
        {/* Ground colour + a vertical deepening so the top of every cover has
            the weight that keeps foil titles readable. */}
        <rect x="0" y="0" width="300" height="360" fill={base} />
        <rect x="0" y="0" width="300" height="150" fill={deep} opacity="0.55" />
        <ellipse
          cx="150"
          cy="120"
          rx="150"
          ry="90"
          fill={accent}
          opacity="0.16"
          filter={`url(#bloom-${uid})`}
        />

        {motif === 'stars' && <Stars accent={accent} deep={deep} />}
        {motif === 'ocean' && <Ocean accent={accent} deep={deep} />}
        {motif === 'forest' && <Forest accent={accent} deep={deep} />}
        {motif === 'city' && <City accent={accent} deep={deep} />}
        {motif === 'space' && <Space accent={accent} deep={deep} uid={uid} />}
        {motif === 'dream' && <Dream accent={accent} deep={deep} />}
      </g>
    </g>
  );
}

/* -------------------------------------------------------------------------- */

function Stars({ accent, deep }: { accent: string; deep: string }) {
  const pts = field(34, 7717);
  return (
    <g>
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill="#fff"
          opacity={p.o}
          style={{
            animation: `twinkle ${2.6 + (i % 5) * 0.5}s var(--ease-in-out) ${i * 0.11}s infinite`,
          }}
        />
      ))}
      {/* Crescent, drawn as two discs rather than a path so the "cut" edge is
          geometrically exact. */}
      <g>
        <circle cx="228" cy="66" r="26" fill={accent} />
        <circle cx="216" cy="58" r="24" fill={deep} opacity="0.96" />
      </g>
      {/* Rooftops: the town asleep below. */}
      <path
        d="M0 268h44l14-22 16 22h40l18-26 20 26h46l16-20 18 20h36l16-16 16 16v92H0z"
        fill={deep}
      />
      <g fill={accent} opacity="0.9">
        <rect x="26" y="286" width="9" height="11" rx="1.5" />
        <rect x="96" y="292" width="9" height="11" rx="1.5" />
        <rect x="182" y="284" width="9" height="11" rx="1.5" />
        <rect x="248" y="290" width="9" height="11" rx="1.5" />
      </g>
      <path d="M0 300h300" stroke={accent} strokeWidth="1" opacity="0.2" />
      {/* Three small stars as a rule under the skyline. Drawn, not typed, so
          the mark is identical on every platform. */}
      <g fill={accent} opacity="0.5" transform="translate(150 322)">
        {[-16, 0, 16].map((dx) => (
          <path
            key={dx}
            d={`M${dx} -5 l1.6 3.4 l3.4 1.6 l-3.4 1.6 l-1.6 3.4 l-1.6 -3.4 l-3.4 -1.6 l3.4 -1.6 z`}
          />
        ))}
      </g>
    </g>
  );
}

function Ocean({ accent, deep }: { accent: string; deep: string }) {
  const bubbles = field(18, 4242);
  return (
    <g>
      {/* Stacked wave ribbons — the same arc shape repeated at three scales. */}
      <path d="M-10 150c60-26 110 20 170-4s110-30 150-6v60H-10z" fill={deep} opacity="0.5" />
      <path d="M-10 190c70-24 120 22 180-2s100-26 140-4v56H-10z" fill={deep} opacity="0.72" />
      <path d="M-10 232c58-20 118 20 176 0s96-22 144-2v130H-10z" fill={deep} />
      {bubbles.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={40 + b.y * 0.5}
          r={b.r * 1.6}
          fill="#fff"
          opacity={b.o * 0.45}
          style={{ animation: `float ${5 + (i % 4)}s var(--ease-in-out) ${i * 0.2}s infinite` }}
        />
      ))}
      {/* Sunken spires of the kingdom. */}
      <g fill={accent} opacity="0.92">
        <path d="M108 250l12-52 12 52z" />
        <path d="M150 254l16-70 16 70z" />
        <path d="M196 252l11-44 11 44z" />
        <circle cx="166" cy="176" r="5" />
      </g>
      <ellipse cx="150" cy="300" rx="120" ry="10" fill="#fff" opacity="0.07" />
    </g>
  );
}

function Forest({ accent, deep }: { accent: string; deep: string }) {
  const trees = [
    { x: 34, h: 132, w: 46 },
    { x: 92, h: 174, w: 58 },
    { x: 160, h: 146, w: 50 },
    { x: 220, h: 190, w: 62 },
    { x: 276, h: 120, w: 42 },
  ];
  return (
    <g>
      <circle cx="66" cy="70" r="30" fill={accent} opacity="0.85" />
      {/* Wedge canopies, three per trunk. */}
      {trees.map((t, i) => (
        <g key={i} opacity={i % 2 ? 0.95 : 0.8}>
          <rect x={t.x - 3} y={360 - t.h * 0.35} width="6" height={t.h * 0.35} fill={deep} />
          <path
            d={`M${t.x} ${360 - t.h} L${t.x + t.w / 2} ${360 - t.h * 0.58} L${t.x - t.w / 2} ${
              360 - t.h * 0.58
            } Z`}
            fill={deep}
          />
          <path
            d={`M${t.x} ${360 - t.h * 0.86} L${t.x + t.w * 0.6} ${360 - t.h * 0.42} L${
              t.x - t.w * 0.6
            } ${360 - t.h * 0.42} Z`}
            fill={deep}
          />
          <path
            d={`M${t.x} ${360 - t.h * 0.7} L${t.x + t.w * 0.7} ${360 - t.h * 0.26} L${
              t.x - t.w * 0.7
            } ${360 - t.h * 0.26} Z`}
            fill={deep}
          />
        </g>
      ))}
      {/* Fireflies. */}
      {field(12, 991).map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={150 + p.y * 0.45}
          r="2.2"
          fill={accent}
          style={{ animation: `twinkle ${2.2 + (i % 4) * 0.6}s var(--ease-in-out) ${i * 0.3}s infinite` }}
        />
      ))}
      <path d="M0 316q75-16 150 0t150 0v44H0z" fill={deep} opacity="0.9" />
    </g>
  );
}

function City({ accent, deep }: { accent: string; deep: string }) {
  const blocks = [
    { x: 6, w: 40, h: 120 },
    { x: 52, w: 30, h: 176 },
    { x: 88, w: 46, h: 142 },
    { x: 140, w: 34, h: 200 },
    { x: 180, w: 44, h: 156 },
    { x: 230, w: 28, h: 188 },
    { x: 264, w: 32, h: 130 },
  ];
  return (
    <g>
      <circle cx="248" cy="62" r="24" fill={accent} opacity="0.9" />
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={360 - b.h} width={b.w} height={b.h} fill={deep} rx="2" />
          {Array.from({ length: Math.floor(b.h / 26) }).map((_, r) =>
            Array.from({ length: Math.max(1, Math.floor(b.w / 14)) }).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={b.x + 5 + c * 14}
                y={360 - b.h + 12 + r * 26}
                width="6"
                height="9"
                rx="1"
                fill={accent}
                opacity={(r + c + i) % 3 === 0 ? 0.85 : 0.22}
              />
            )),
          )}
        </g>
      ))}
      {/* The eleven-minutes-slow clock. */}
      <g transform="translate(150 96)">
        <circle r="30" fill="#fff" opacity="0.94" />
        <circle r="30" fill="none" stroke={deep} strokeWidth="3" />
        <path d="M0 0v-18M0 0l12 8" stroke={deep} strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Space({ accent, deep, uid }: { accent: string; deep: string; uid: string }) {
  const stars = field(40, 3131);
  return (
    <g>
      <defs>
        <radialGradient id={`glow-${uid}`}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.6" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {stars.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y * 1.35}
          r={p.r * 0.8}
          fill="#fff"
          opacity={p.o}
          style={{ animation: `twinkle ${3 + (i % 6) * 0.4}s var(--ease-in-out) ${i * 0.07}s infinite` }}
        />
      ))}
      <circle cx="150" cy="228" r="120" fill={`url(#glow-${uid})`} />
      {/* Ringed planet: disc + wedge ribbon. */}
      <circle cx="150" cy="240" r="74" fill={deep} />
      <path d="M150 166a74 74 0 0 0-52 126" stroke={accent} strokeWidth="3" fill="none" opacity="0.5" />
      <circle cx="122" cy="212" r="12" fill={accent} opacity="0.28" />
      <circle cx="182" cy="262" r="18" fill={accent} opacity="0.18" />
      <ellipse
        cx="150"
        cy="240"
        rx="118"
        ry="26"
        fill="none"
        stroke={accent}
        strokeWidth="7"
        opacity="0.75"
        transform="rotate(-14 150 240)"
      />
      <g style={{ animation: 'float 6s var(--ease-in-out) infinite' }}>
        <path d="M56 92l7 13 13 7-13 7-7 13-7-13-13-7 13-7z" fill={accent} />
      </g>
    </g>
  );
}

function Dream({ accent, deep }: { accent: string; deep: string }) {
  return (
    <g>
      {/* Gallery arches — the museum of nearly-had ideas. */}
      {[42, 150, 258].map((x, i) => (
        <g key={x} opacity={i === 1 ? 1 : 0.7}>
          <path
            d={`M${x - 40} 300V194a40 40 0 0 1 80 0v106z`}
            fill={deep}
            opacity={i === 1 ? 0.95 : 0.65}
          />
          <path
            d={`M${x - 26} 300V196a26 26 0 0 1 52 0v104z`}
            fill={accent}
            opacity={i === 1 ? 0.35 : 0.16}
          />
        </g>
      ))}
      {/* Floating unfinished things. */}
      <g fill={accent} opacity="0.85">
        <circle
          cx="76"
          cy="92"
          r="9"
          style={{ animation: 'drift 11s var(--ease-in-out) infinite' }}
        />
        <rect
          x="196"
          y="70"
          width="18"
          height="18"
          rx="4"
          transform="rotate(18 205 79)"
          style={{ animation: 'drift 14s var(--ease-in-out) 1s infinite' }}
        />
        <path
          d="M148 60l8 16 8-16-8-14z"
          style={{ animation: 'float 8s var(--ease-in-out) infinite' }}
        />
      </g>
      <rect x="0" y="300" width="300" height="60" fill={deep} />
      <path d="M0 300h300" stroke={accent} strokeWidth="1.5" opacity="0.45" />
      {/* The brass plaque with a name already on it. */}
      <rect x="126" y="316" width="48" height="16" rx="2" fill={accent} opacity="0.9" />
    </g>
  );
}
