import { useCallback, useState } from 'react';
import { Container } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { Logo } from '@/components/art/Brand';
import { Close, Menu, Moon, Sun } from '@/components/art/Icons';
import { ANNOUNCEMENT, NAV_LINKS, PROOF } from '@/lib/config';
import { useTheme } from '@/hooks/useTheme';
import { useEscape, useScrollLock, useScrolledPast, useScrollSpy } from '@/hooks/useUi';
import { cx } from '@/lib/utils';

const IDS = NAV_LINKS.map((l) => l.id);

/**
 * NAVIGATION
 * -----------------------------------------------------------------------------
 * Behaviour, and why:
 *
 * · Transparent over the hero, then condensing to an opaque blurred bar past
 *   80px. A bar that is solid from the first pixel steals contrast from the
 *   headline, which is the one thing that has to land instantly.
 * · The order CTA is present in the header at every breakpoint, including
 *   mobile, where it collapses to a compact green pill. Buyers who arrive
 *   already convinced should never have to scroll to find the button.
 * · Scroll-spy underlines the current section. On a single long page this is
 *   the only orientation cue the visitor gets, and losing your place is a
 *   common reason for abandonment on pages this length.
 * · The mobile sheet traps focus, locks background scroll, closes on Escape and
 *   restores focus to the trigger. Half-built mobile menus are the most common
 *   accessibility failure on marketing sites.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const condensed = useScrolledPast(80);
  const active = useScrollSpy(IDS);
  const { theme, toggle } = useTheme();

  const close = useCallback(() => setOpen(false), []);
  useScrollLock(open);
  useEscape(open, close);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable btn btn-ink btn-sm fixed left-4 top-4 z-100"
      >
        Skip to content
      </a>

      {/* At the top the nav is invisible chrome so the headline owns the screen.
          Past 80px it lifts into a floating glass capsule — the iOS toolbar
          convention, and it reads as an object over the page rather than a band
          welded to the top of it. */}
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-all duration-[380ms] ease-[var(--ease-spring)]',
          condensed ? 'pt-2.5 sm:pt-3.5' : 'pt-0',
        )}
      >
        {/* ANNOUNCEMENT STRIP.
            Lives inside the fixed header rather than as its own block at the top
            of the document, because the header is `position: fixed` — a normal
            sibling above it would simply be covered.

            It collapses on scroll, which is the point: the nav's whole design is
            to detach into a floating capsule past 80px, and a full-bleed band
            still welded to the top of the viewport would fight that. So the strip
            is a greeting, shown once, and then it gets out of the way.

            bg-inverse (deep jade), not verdant. Verdant is reserved for the
            WhatsApp channel across the entire site — spending it on a decorative
            band would make the one colour that means "this is the order button"
            mean nothing. */}
        <div
          className={cx(
            'overflow-hidden bg-inverse transition-all duration-[380ms] ease-[var(--ease-spring)]',
            condensed ? 'h-0 opacity-0' : 'h-9 opacity-100',
          )}
        >
          <p className="flex h-9 items-center justify-center px-4 text-center text-[0.78rem] font-medium text-ink-inverse-soft">
            <span className="truncate">{ANNOUNCEMENT}</span>
          </p>
        </div>

        <Container>
          <nav
            aria-label="Main"
            className={cx(
              'flex items-center gap-4 transition-all duration-[380ms] ease-[var(--ease-spring)]',
              condensed
                ? 'glass glass-thick h-14 rounded-full pl-4 pr-2 sm:h-16 sm:pl-5 sm:pr-2.5'
                : 'h-20 rounded-full',
            )}
          >
            <a
              href="#top"
              className="shrink-0 rounded-lg transition-opacity hover:opacity-80"
              aria-label="BookMojo, home"
            >
              <Logo />
            </a>

            <ul className="ml-6 hidden flex-1 items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active === link.id ? 'true' : undefined}
                    className={cx(
                      'relative rounded-full px-3 py-2 text-small font-semibold transition-colors',
                      active === link.id ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cx(
                        'absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-gold-500 transition-transform duration-300',
                        active === link.id ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={toggle} />

              <span className="hidden text-small text-ink-muted xl:inline">
                {PROOF.booksDeliveredLabel} books delivered
              </span>

              <OrderButton
                intent="nav"
                size="sm"
                label={<span className="hidden sm:inline">Start your book</span>}
                className="max-sm:aspect-square max-sm:!px-0"
              />

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                className="btn btn-tonal btn-icon lg:hidden"
              >
                <Menu size={20} />
                <span className="sr-only">Open menu</span>
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        className={cx(
          'fixed inset-0 z-60 lg:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <div
          onClick={close}
          className={cx(
            'absolute inset-0 bg-inverse/45 backdrop-blur-sm transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cx(
            'glass glass-thick absolute inset-x-2 top-2 rounded-[1.75rem] p-5 pb-8 transition-transform duration-[380ms] ease-[var(--ease-spring)]',
            open ? 'translate-y-0' : '-translate-y-[130%]',
          )}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button type="button" onClick={close} className="btn btn-tonal btn-icon">
              <Close size={20} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <ul className="mt-6 flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <li key={link.id} className="border-b border-hairline last:border-0">
                <a
                  href={`#${link.id}`}
                  onClick={close}
                  className="flex items-baseline justify-between py-4 text-[1.15rem] font-semibold"
                >
                  {link.label}
                  <span className="text-micro font-sans font-bold text-ink-muted tabular-nums">
                    0{i + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <OrderButton
            intent="nav"
            block
            className="mt-6"
            label="Start your book"
            sublabel="No account · about 4 minutes"
          />
        </div>
      </div>
    </>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: 'day' | 'night'; onToggle: () => void }) {
  const isNight = theme === 'night';
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={isNight}
      className="btn btn-tonal btn-icon"
      title={isNight ? 'Switch to daylight' : 'Switch to bedtime'}
    >
      <span className="relative grid size-5 place-items-center">
        <Sun
          size={18}
          className={cx(
            'absolute transition-all duration-300',
            isNight ? 'scale-50 opacity-0 rotate-90' : 'scale-100 opacity-100',
          )}
        />
        <Moon
          size={18}
          className={cx(
            'absolute transition-all duration-300',
            isNight ? 'scale-100 opacity-100' : 'scale-50 opacity-0 -rotate-90',
          )}
        />
      </span>
      <span className="sr-only">{isNight ? 'Bedtime theme, on' : 'Bedtime theme, off'}</span>
    </button>
  );
}
