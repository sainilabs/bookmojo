import { Container, Reveal } from '@/components/ui/Layout';
import { LinkButton, OrderButton } from '@/components/ui/Button';
import { Typewriter } from '@/components/ui/Typewriter';
import { Clock, Lock } from '@/components/art/Icons';
import { THEMES } from '@/data/catalogue';
import { PROOF } from '@/lib/config';

/** Derived, not hand-listed, so adding a seventh story to the catalogue puts its
 *  role in the hero automatically — and, more importantly, so the hero can never
 *  advertise a role we have no manuscript for. */
const HERO_ROLES = THEMES.map((t) => t.role);

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
 * Performance: the hero product image is eagerly loaded because it appears in
 * the first viewport and is a likely LCP candidate on wider screens.
 */
export function Hero() {
  return (
    // Top padding clears the fixed header AND the announcement strip above it
    // (h-9 bar + h-20 nav = 116px), so the badge is never tucked under either.
    <section id="top" className="relative isolate overflow-hidden border-b border-hairline pt-32 pb-16 sm:pt-36 lg:pt-44 lg:pb-24">
      {/* A single quiet grid gives the hero structure without competing with
          the product artwork. No nested grid, glow field, grain or illustration
          behind the interface. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-35 night:opacity-25"
        style={{
          backgroundImage: [
            'linear-gradient(to right, var(--jade-300) 1px, transparent 1px)',
            'linear-gradient(to bottom, var(--jade-300) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '64px 64px',
          maskImage: 'linear-gradient(to bottom, #000 0%, #000 58%, transparent 100%)',
        }}
      />

      <Container>
        {/* mdlg (62rem), not lg. At 1024px-class laptop widths the inner viewport
            lands just under Tailwind's lg breakpoint, so the hero stayed single
            column and the book — the one thing worth looking at — fell below the
            fold while the right half of the screen sat empty. */}
        <div className="grid items-center gap-14 mdlg:grid-cols-[1.05fr_0.95fr] mdlg:gap-8 3xl:gap-20">
          {/* ---------------------------------------------------------------- */}
          <div className="max-w-[38rem] mdlg:max-w-none">
            <Reveal y={14} delay={40}>
              <p className="mb-4 text-small font-bold tracking-[0.12em] text-verdant-600 uppercase night:text-verdant-500">
                Personalised storybooks for children
              </p>
            </Reveal>

            {/* "The gift where…", not "Tonight,…". The old opener promised same-night
                delivery of a physical hardcover that takes 5–7 days to print and
                2–3 more to ship — the page contradicted itself in its own first
                line, and the first line is the one a buyer checks hardest.
                "Gift" also sets the right budget: a parent compares this to a
                birthday present, not to a ₹300 picture book.

                The accent phrase is held on one line; at this measure it used to
                split "your child" across a break, which read as an accident
                rather than as emphasis. */}
            <Reveal y={22} delay={80} as="h1" className="max-w-[18ch] text-display-1">
              The gift where{' '}
              {/* 500 is the display step: 3.23:1, legal here because this is
                  display-1 and nowhere near body size. The sub-line below uses 600
                  for exactly that reason. */}
              <span className="whitespace-nowrap text-verdant-500">
                your child
              </span>{' '}
              is the hero.
            </Reveal>

            {/* One line, deliberately.

                "become", not "as". "See X as Y" is the idiom for regarding someone
                a certain way — "I see him as a leader" is an opinion, not an
                observation. It quietly turned our promise into a suggestion that
                the parent adjust their imagination. "See X become Y" is literal:
                something happens and you watch it happen.

                "their own storybook", not "their storybook". The possessive is the
                whole product — not a book about them, a book that belongs to them —
                and "own" is what stops it reading as a book that already exists.

                Note for whoever edits this next: the hardcover, the WhatsApp
                channel and "no account" all used to live in this line and are no
                longer stated above the fold. They are still on the page (trust row
                immediately below, HowItWorks, FinalCta), so nothing is unsupported,
                but the hero now sells the feeling only. If conversion softens, this
                is the first place to add one short factual clause back.

                TYPEWRITER TREATMENT. Monospace, full-strength ink and a blinking
                caret, which does three things a plain sub-line could not: it reads
                as something being written rather than marketed, which is exactly
                what we sell; the caret implies the story is still unfinished and
                waiting on the name field directly below it; and the mono/sans
                contrast against a Figtree headline separates the two lines so they
                stop looking like one paragraph broken in half.

                What rotates is one role per REAL STORY, read straight off the
                catalogue — never a hand-kept list here. A list in this file would
                drift, and the way it drifts is by advertising a role we have no
                manuscript for, which is the same failure as the old "Tonight"
                headline: a promise the rest of the site cannot keep.

                The prefix is "become", not "become the hero of". "The hero of an
                astronaut" is not a sentence; "become an astronaut" is. Each role
                therefore carries its own article and full stop, so the phrase and
                the prefix always agree without a helper.

                Sans and `text-lead`, not monospace at body size. The typewriter
                MOTION stays — that is what sells a story being written — but the
                typewriter FONT went, because it was shrinking the line to the size
                of a caption. This is the second most important sentence on the
                page; it should be set like a lead paragraph, which is what the
                token is for.

                `text-ink`, not `#000`. The token is the strongest text colour the
                system has (#17262c on paper) and at this size it reads as black,
                but it FLIPS: in Bedtime it becomes near-white. A literal black
                would be invisible against that theme's near-black field.

                min-h is load-bearing, not padding. The roles differ in length, which
                moves the wrap point: one line at this measure on desktop, two on a
                narrow phone. Without a reserved box the paragraph would breathe in
                and out and drag the name field and CTA with it on every rotation. */}
            <Reveal y={18} delay={160}>
              <p className="mt-4 flex min-h-[3.3rem] max-w-[46ch] flex-wrap items-start gap-x-[0.4ch] text-lead font-medium text-ink sm:min-h-[1.95rem]">
                <span>See your child become</span>
                <Typewriter
                  phrases={HERO_ROLES}
                  className="font-semibold text-verdant-600 night:text-verdant-500"
                />
              </p>
            </Reveal>

            {/* Two explicit routes: self-serve on the site or assisted ordering
                in WhatsApp. Personal details belong in the configurator below,
                where their purpose and privacy terms can be explained. */}
            <Reveal y={18} delay={220} className="mt-5">
              <div className="flex max-w-[34rem] flex-col gap-3 sm:flex-row">
                <LinkButton href="#create" variant="ink" size="lg" className="justify-center">
                  Build your book
                </LinkButton>
                <OrderButton intent="hero" label="Order on WhatsApp" className="justify-center" />
              </div>
            </Reveal>

            <Reveal y={16} delay={300}>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {[
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
          <Reveal
            y={30}
            delay={140}
            scale={0.96}
            className="relative flex justify-center mdlg:justify-end"
          >
            <img
              src={`${import.meta.env.BASE_URL}hero-book.png`}
              alt="A child holding a personalised Aman Scientist Dreams storybook"
              width={1154}
              height={1363}
              fetchPriority="high"
              className="h-auto w-full max-w-[31rem] object-contain"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
