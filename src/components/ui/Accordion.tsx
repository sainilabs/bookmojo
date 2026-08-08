import { useId, useState } from 'react';
import { cx } from '@/lib/utils';
import { Plus } from '@/components/art/Icons';

/**
 * FAQ ACCORDION
 * -----------------------------------------------------------------------------
 * Built on native <button> + aria-expanded rather than <details>, because we
 * need a controlled single-open group and an animated height, and <details>
 * gives neither reliably across browsers.
 *
 * Deliberately NOT accordion-exclusive-by-default in spirit: opening one closes
 * the others, which keeps a 12-question list scannable, but every panel remains
 * in the DOM so in-page find (Ctrl+F) and search-engine crawlers still see the
 * answers. Hiding FAQ copy from crawlers is a needless SEO sacrifice.
 *
 * Height animates via grid-template-rows 0fr → 1fr, which animates smoothly
 * without measuring the content or hard-coding a max-height that will be wrong
 * the moment the copy changes.
 */
export interface AccordionItem {
  q: string;
  a: string;
}

export function Accordion({
  items,
  className,
  onOpen,
}: {
  items: readonly AccordionItem[];
  className?: string;
  onOpen?: (question: string) => void;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId().replace(/:/g, '');

  return (
    <div className={cx('divide-y divide-hairline border-y border-hairline', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        const btnId = `${base}-btn-${i}`;
        return (
          <div key={item.q}>
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  if (!isOpen) onOpen?.(item.q);
                }}
                className={cx(
                  'group flex w-full items-start gap-4 py-5 text-left transition-colors',
                  'hover:text-gold-700 night:hover:text-gold-500',
                )}
              >
                <span className="font-display flex-1 text-[1.0625rem] leading-snug font-semibold sm:text-title">
                  {item.q}
                </span>
                <span
                  className={cx(
                    'mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300',
                    isOpen
                      ? 'border-transparent bg-inverse text-ink-inverse rotate-45'
                      : 'border-strong text-ink-muted group-hover:border-ink group-hover:text-ink',
                  )}
                  aria-hidden="true"
                >
                  <Plus size={15} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p
                  className={cx(
                    'max-w-[62ch] pb-6 pr-10 text-ink-soft transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
