import type { SVGProps } from 'react';

/**
 * ICONOGRAPHY
 * -----------------------------------------------------------------------------
 * One family, drawn to a single spec: 24px grid, 1.6px stroke, round caps and
 * joins, no fills. The restrained line style stays legible beside both the
 * editorial serif and the neutral interface typography.
 *
 * Icons are inline SVG components, not a font or a sprite: they inherit
 * `currentColor`, cost nothing at runtime, and never cause a layout shift while
 * an icon font loads.
 *
 * All icons are decorative by default (`aria-hidden`) because in this product
 * every icon sits next to a real text label. Icons are never the only carrier
 * of meaning.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 24, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** WhatsApp glyph is filled and brand-accurate — recognition beats consistency
 *  for the one mark that identifies the ordering channel. */
export function WhatsAppMark({ size = 24, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.9-.95 1.08-.17.18-.35.2-.65.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.89-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.44s1.05 2.83 1.2 3.03c.15.2 2.06 3.29 5.02 4.48 2.45.99 2.95.79 3.48.74.53-.05 1.71-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.6 2 2.17 6.42 2.17 11.85c0 1.74.46 3.44 1.32 4.94L2 22.5l5.86-1.53a9.85 9.85 0 0 0 4.18.93h.01c5.43 0 9.86-4.42 9.86-9.85C21.91 6.42 17.48 2 12.04 2Zm0 17.98h-.01a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.09.81.83-3.02-.19-.31a8.11 8.11 0 0 1-1.25-4.32c0-4.51 3.68-8.19 8.2-8.19a8.15 8.15 0 0 1 8.18 8.2c0 4.51-3.68 8.15-8.2 8.15Z" />
    </svg>
  );
}

export const Sparkle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.2l1.7 4.6 4.6 1.7-4.6 1.7-1.7 4.6-1.7-4.6L5.7 9.5l4.6-1.7L12 3.2Z" />
    <path d="M18.6 16.2l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
  </Icon>
);

export const Star = ({ size = 24, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    <path d="M12 2.6l2.83 5.9 6.47.86-4.72 4.5 1.18 6.44L12 17.2l-5.76 3.1 1.18-6.44-4.72-4.5 6.47-.86L12 2.6Z" />
  </svg>
);

export const Check = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12.6l4.7 4.7L19.8 6.7" />
  </Icon>
);

export const CheckCircle = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.2 12.4l2.6 2.6 5-5.4" />
  </Icon>
);

export const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12h14" />
    <path d="M13 6.5l5.5 5.5L13 17.5" />
  </Icon>
);

export const ArrowDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.5v14" />
    <path d="M6.5 13l5.5 5.5L17.5 13" />
  </Icon>
);

export const Chevron = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 6l6 6-6 6" />
  </Icon>
);

export const Plus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Icon>
);

export const Lock = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.4" />
    <path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" />
    <path d="M12 14.4v2.2" />
  </Icon>
);

export const Truck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.8 16.5V7.2a1 1 0 0 1 1-1h9.4a1 1 0 0 1 1 1v9.3" />
    <path d="M14.2 9.6h3.3l3.7 3.6v3.3h-2" />
    <circle cx="7" cy="17.8" r="1.9" />
    <circle cx="17" cy="17.8" r="1.9" />
    <path d="M8.9 17.8h6.2" />
  </Icon>
);

export const Printer = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 8.5V4.2h10v4.3" />
    <rect x="3.6" y="8.5" width="16.8" height="7.4" rx="2" />
    <path d="M7 14h10v5.8H7z" />
  </Icon>
);

export const Globe = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.3 9.6h17.4M3.3 14.4h17.4" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
  </Icon>
);

export const Heart = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20s-7.4-4.35-7.4-9.3A4.1 4.1 0 0 1 12 8.3a4.1 4.1 0 0 1 7.4 2.4c0 4.95-7.4 9.3-7.4 9.3Z" />
  </Icon>
);

export const Gift = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.8 10.4h16.4v9.4H3.8z" />
    <path d="M2.8 6.6h18.4v3.8H2.8zM12 6.6v13.2" />
    <path d="M12 6.6S10.9 3 8.8 3a2 2 0 0 0 0 3.6M12 6.6S13.1 3 15.2 3a2 2 0 0 1 0 3.6" />
  </Icon>
);

export const Camera = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.4 8.8h3l1.4-2.2h6.4l1.4 2.2h3a1 1 0 0 1 1 1v8.4a1 1 0 0 1-1 1H3.4a1 1 0 0 1-1-1V9.8a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13.6" r="3.3" />
  </Icon>
);

export const Clock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.2V12l3.4 2" />
  </Icon>
);

export const Feather = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19.5 4.5c-2.4-1.6-6.2-.5-8.6 1.9-2 2-2.4 4.6-2.6 7.4l-3.8 3.8" />
    <path d="M4.5 19.5l4-4M11 12.5h5M13.5 9h4" />
  </Icon>
);

export const BookGlyph = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 5.2A1.6 1.6 0 0 1 5.6 3.6H10a2.2 2.2 0 0 1 2 1.2 2.2 2.2 0 0 1 2-1.2h4.4A1.6 1.6 0 0 1 20 5.2v11.4a1.6 1.6 0 0 1-1.6 1.6H14a2.2 2.2 0 0 0-2 1.2 2.2 2.2 0 0 0-2-1.2H5.6A1.6 1.6 0 0 1 4 16.6z" />
    <path d="M12 6.4v13" />
  </Icon>
);

export const Sun = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
  </Icon>
);

export const Moon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Icon>
);

export const Play = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 5.6l10 6.4-10 6.4z" />
  </Icon>
);

export const Pause = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 5.5v13M15 5.5v13" />
  </Icon>
);

export const Replay = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12a8 8 0 1 0 2.6-5.9" />
    <path d="M4 4.2v4.4h4.4" />
  </Icon>
);

export const Menu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7.5h16M4 12h16M4 16.5h11" />
  </Icon>
);

export const Close = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.2 6.2l11.6 11.6M17.8 6.2L6.2 17.8" />
  </Icon>
);

export const Shield = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.2l7 2.6v5.6c0 4.2-2.9 7.4-7 9.4-4.1-2-7-5.2-7-9.4V5.8z" />
    <path d="M9 12.2l2.2 2.2 4-4.2" />
  </Icon>
);

export const Leaf = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.6 19.4C3 14 6 6.8 19.4 4.6 17.2 18 10 21 4.6 19.4Z" />
    <path d="M8 16c2.4-3.6 5.2-6 9-8" />
  </Icon>
);

export const Quote = ({ size = 24, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    <path d="M9.4 5.6c-3.3 1.3-5.4 4.2-5.4 7.9 0 3 1.7 4.9 4 4.9 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.2-3.1-3.2-.3 0-.6 0-.8.1.3-1.6 1.5-3 3.1-3.8l-1.3-2.5Zm9.2 0c-3.3 1.3-5.4 4.2-5.4 7.9 0 3 1.7 4.9 4 4.9 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.2-3.1-3.2-.3 0-.6 0-.8.1.3-1.6 1.5-3 3.1-3.8l-1.3-2.5Z" />
  </svg>
);
