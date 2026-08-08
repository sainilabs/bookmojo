import { Children, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useUi';

/**
 * Infinite proof rail.
 *
 * Duplicated content is `aria-hidden` so assistive tech reads each item once.
 * With reduced motion the animation is replaced by a real horizontal scroll
 * container rather than being frozen — a static, clipped marquee hides content
 * from the people who asked for less movement, which fails the point of the
 * preference.
 */
export function Marquee({
  children,
  className,
  speed = 46,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
}) {
  const still = useReducedMotion();
  const items = Children.toArray(children);

  if (still) {
    return (
      <div
        className={cx('rail-scroll flex gap-8 overflow-x-auto pb-2', className)}
        role="list"
        tabIndex={0}
      >
        {items.map((child, i) => (
          <div role="listitem" key={i} className="shrink-0">
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cx('mask-x-fade group overflow-hidden', className)} style={{ '--fade': '8%' } as React.CSSProperties}>
      {/* Exactly two identical halves: the -50% keyframe then loops seamlessly.
          Hover pauses the rail so a slow reader can finish an item. */}
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {[0, 1].map((half) => (
          <div
            key={half}
            className="flex shrink-0 items-center gap-8 pr-8"
            aria-hidden={half === 1 ? 'true' : undefined}
          >
            {items.map((child, i) => (
              <div key={i} className="shrink-0">
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
