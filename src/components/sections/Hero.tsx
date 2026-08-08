import { Container, Reveal } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Book3D } from '@/components/art/BookCover';
import { Aurora, ScribbleArrow } from '@/components/art/Brand';
import { ArrowDown, Camera, Clock, Feather, Lock } from '@/components/art/Icons';
import { useDraft } from '@/hooks/useDraft';
import { PROOF } from '@/lib/config';
import { formatName, possessive } from '@/lib/utils';

/**
 * HERO
 * -----------------------------------------------------------------------------
 * The hero has exactly one job: make a parent feel the last page of the book
 * before they have read the first, and then hand them the shortest possible
 * path to owning it.
 *
 * Structural decisions:
 *
 * · The headline is a promise about the CHILD, not a description of the product.
 *   "Personalised children's books" describes a category; "the hero of the story
 *   has your name" describes a moment. Category headlines are why most of this
 *   market looks interchangeable.
 *
 * · There is one input above the fold and it asks for one thing. Every extra
 *   field here would trade an emotional payoff for a form. The cover updates on
 *   keystroke, so the visitor's first interaction produces a visible, personal
 *   result in under a second — the strongest opening any commerce page can make.
 *
 * · The CTA cluster is one primary action plus one low-commitment alternative
 *   ("see how ordering works"). Two equal CTAs split intent; a primary plus an
 *   escape hatch captures both the ready and the wary.
 *
 * · Trust markers sit directly beneath the button, not further down the page.
 *   The three shown are the three objections that block the first click: cost
 *   of committing, safety of paying in chat, and how long it takes.
 *
 * Performance: the LCP element is the headline text, not the illustration.
 * Everything visual here is inline SVG and CSS gradients — zero image requests
 * in the critical path, so LCP is bound by font swap alone.
 */
export function Hero() {
  const { draft, update, isPersonalised } = useDraft();
  const name = formatName(draft.childName);

  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
      {/* Pulled back for the near-white field. The blobs were previously being
          absorbed by a tinted paper; against white they carry much further, and
          at the old strength they turned a crisp field into a coloured one. */}
      <Aurora className="pointer-events-none absolute inset-0 -z-10 opacity-45 night:opacity-40" />
      {/* Faint baseline grid: a printer's registration mark, not decoration. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-55 night:opacity-40"
        style={{
          /**
           * One grid, one line weight, one cell size.
           *
           * Presence comes entirely from the LINE COLOUR — jade-300 rather than
           * the hairline token, which at 1.09:1 against paper was effectively
           * invisible. Reaching for a second, denser grid to create texture is
           * the wrong lever: it fights the headline for attention and starts to
           * read as a wireframe rather than as a surface.
           *
           * 64px cell: large enough that the type sits ON the grid instead of
           * inside it, small enough to still register as ruled stock.
           */
          backgroundImage: [
            'linear-gradient(to right, var(--jade-300) 1px, transparent 1px)',
            'linear-gradient(to bottom, var(--jade-300) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '64px 64px',
          /* Elliptical and pushed further out than a circle: the grid should
             still be present behind the book on the right, and behind the CTA,
             not only under the headline. */
          maskImage: 'radial-gradient(120% 95% at 50% 26%, #000 38%, transparent 84%)',
        }}
      />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 3xl:gap-20">
          {/* ---------------------------------------------------------------- */}
          <div className="max-w-[38rem] lg:max-w-none">
            <Reveal y={14} className="inline-flex flex-wrap items-center gap-x-4 gap-y-2">
              <Rating count={PROOF.reviewCount} />
              <span className="hidden h-4 w-px bg-strong sm:block" />
              <span className="text-small font-semibold text-ink-soft">
                {PROOF.booksDeliveredLabel} books on shelves across India
              </span>
            </Reveal>

            <Reveal y={22} delay={80} as="h1" className="mt-6 text-display-1">
              Tonight, the hero
              <br />
              of the story has{' '}
              <span className="marker whitespace-nowrap">
                {isPersonalised ? possessive(name) : 'your child’s'}
              </span>
              <br />
              <span className="quill">name.</span>
            </Reveal>

            <Reveal y={18} delay={160}>
              <p className="mt-6 max-w-[42ch] text-lead text-ink-soft">
                Original hardcover storybooks written around one child. Ordered in a single WhatsApp
                conversation — no forms, no account.
              </p>
            </Reveal>

            {/* One field. One result. */}
            <Reveal y={18} delay={220} className="mt-8">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex max-w-[30rem] flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <label htmlFor="hero-name" className="sr-only">
                    Your child’s first name
                  </label>
                  <input
                    id="hero-name"
                    type="text"
                    value={draft.childName}
                    onChange={(e) => update({ childName: e.target.value })}
                    placeholder="Type their name…"
                    maxLength={20}
                    autoComplete="off"
                    spellCheck={false}
                    className="font-display h-14 w-full rounded-full border-2 border-strong bg-raised pl-5 pr-12 text-[1.15rem] font-semibold shadow-e1 outline-none transition-colors placeholder:font-normal placeholder:italic placeholder:text-ink-muted/60 hover:border-ink/40 focus:border-clay-500"
                  />
                  <Feather
                    size={18}
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-ink-muted"
                  />
                </div>
                <OrderButton
                  intent="hero"
                  label={isPersonalised ? `Make ${possessive(name)} book` : 'Start their book'}
                  className="shrink-0"
                />
              </form>
              <p className="mt-3 flex items-center gap-2 text-small text-ink-muted">
                <span
                  aria-hidden="true"
                  className="inline-block size-1.5 animate-pulse rounded-full bg-verdant-500"
                />
                {isPersonalised
                  ? 'Keep it, or design the whole book below.'
                  : 'The cover updates as you type. Nothing is sent yet.'}
              </p>
            </Reveal>

            <Reveal y={16} delay={300}>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-hairline pt-6">
                {[
                  { icon: Camera, text: 'See it before you pay' },
                  { icon: Lock, text: 'UPI on a secure page' },
                  { icon: Clock, text: `Printed in ${PROOF.productionDays} days` },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-small font-medium text-ink-soft">
                    <Icon size={17} className="shrink-0 text-verdant-600 night:text-verdant-500" />
                    {text}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ---------------------------------------------------------------- */}
          <Reveal y={30} delay={140} scale={0.96} className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <Book3D draft={draft} width={362} className="relative z-10" />

              {/* Annotations. Positioned as call-outs on a physical object so
                  the eye reads them as notes on the book, not UI chrome. */}
              <Annotation className="-left-4 top-[16%] sm:-left-10" delay={520}>
                Their name, foil-stamped
              </Annotation>
              <Annotation className="-right-2 top-[46%] sm:-right-8" delay={640} align="right">
                Illustrated to match your photo
              </Annotation>
              <Annotation className="bottom-[8%] -left-2 sm:-left-8" delay={760}>
                Hardcover · linen spine
              </Annotation>

              <div className="pointer-events-none absolute -bottom-6 -right-2 hidden rotate-6 text-gold-500 lg:block">
                <ScribbleArrow className="w-20 opacity-70" flip />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal y={12} delay={400} className="mt-14 flex justify-center lg:mt-20">
          <a
            href="#create"
            className="btn btn-quiet group flex-col !gap-1 text-micro font-bold tracking-[0.14em] uppercase"
          >
            Design it yourself
            <ArrowDown
              size={18}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </a>
        </Reveal>
      </Container>
    </section>
  );
}

function Annotation({
  children,
  className,
  delay = 0,
  align = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  align?: 'left' | 'right';
}) {
  return (
    <Reveal
      y={10}
      delay={delay}
      className={`pointer-events-none absolute z-20 hidden sm:block ${className ?? ''}`}
    >
      <span
        className={`glass glass-thin flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.7rem] font-semibold ${
          align === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-500" />
        {children}
      </span>
    </Reveal>
  );
}
