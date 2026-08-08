import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { Heart, Feather, Gift, Leaf, Shield, Sparkle } from '@/components/art/Icons';
import { PROOF } from '@/lib/config';
import { useDraft } from '@/hooks/useDraft';
import { cx, formatName, possessive } from '@/lib/utils';

/**
 * WHY PARENTS LOVE BOOKMOJO
 * -----------------------------------------------------------------------------
 * The emotional value proposition, argued rather than asserted.
 *
 * Every card here does the same job in a different register: it converts a
 * feature into a consequence for the child. "Personalised" is a feature.
 * "They see themselves as the kind of person a story happens to" is the reason
 * anybody pays for it. Benefit-led copy outperforms feature-led copy in this
 * category precisely because the buyer is not the user.
 *
 * The layout is an asymmetric bento rather than an even 3×2 grid. Equal cards
 * imply equal importance and flatten the argument; here the lead card gets twice
 * the area because it carries the one claim the whole brand rests on.
 */
export function WhyParents() {
  const { draft, isPersonalised } = useDraft();
  const name = formatName(draft.childName);
  const who = isPersonalised ? name : 'your child';

  return (
    <Section space="grand">
      <Container>
        <SectionHeading
          eyebrow={
            <>
              <Heart size={14} /> Why it lands
            </>
          }
          title="A book about them changes how they read it."
          deck="A child who finds themselves inside a story stops being an audience and becomes a participant. Everything else is paper and ink."
        />

        {/* 4 × 2 on desktop: the lead card occupies a 2 × 2 block, the four
            supporting cards fill the remaining 2 × 2. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-4 lg:grid-rows-2">
          {/* Lead card, double height on desktop. */}
          <Reveal
            y={26}
            className="lg:col-span-2 lg:row-span-2"
          >
            <article className="card relative flex h-full flex-col justify-between overflow-hidden bg-inverse p-8 text-ink-inverse sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    'radial-gradient(38rem 26rem at 88% 8%, color-mix(in oklab, var(--gold-500) 34%, transparent), transparent 68%), radial-gradient(30rem 26rem at 4% 96%, color-mix(in oklab, var(--clay-500) 40%, transparent), transparent 70%)',
                }}
              />
              <div className="relative">
                <span className="eyebrow !text-white/50">
                  <Sparkle size={14} /> The whole idea
                </span>
                <h3
                  className="mt-5 max-w-[24ch] text-display-3"
                  style={{ fontVariationSettings: "'SOFT' 50, 'WONK' 1" }}
                >
                  “Wait — that’s <span className="text-gold-300">me</span>.”
                </h3>
                <p className="mt-5 max-w-[40ch] text-lead text-white/70">
                  It happens around page three, and you can watch it happen. Children read a story
                  about themselves more slowly, more carefully, and far more often.
                </p>
              </div>

              <div className="relative mt-10 grid gap-6 border-t border-white/12 pt-7 sm:grid-cols-3">
                {[
                  { v: '9×', l: `Times ${who} will ask for it again`, s: 'parent-reported, first month' },
                  { v: `${Math.round(PROOF.repeatBuyerRate * 100)}%`, l: 'Order a second book', s: 'usually for a sibling' },
                  { v: '20 yrs', l: 'Built to survive', s: 'sewn binding, board pages' },
                ].map((stat) => (
                  <div key={stat.l}>
                    <p className="font-display text-[1.9rem] leading-none font-semibold tabular-nums text-gold-300">
                      {stat.v}
                    </p>
                    <p className="mt-1.5 text-small font-semibold">{stat.l}</p>
                    <p className="text-small text-white/50">{stat.s}</p>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>

          {[
            {
              icon: Feather,
              title: 'They want to read it',
              body: `${
                isPersonalised ? `${possessive(name)} name` : 'Their name'
              } on the cover beats any reward chart, and the reading level is set to their age band.`,
              tone: 'gold' as const,
            },
            {
              icon: Gift,
              title: 'A gift nobody else gives',
              body: 'Rigid gift box, no pricing inside. The one present that is not in a charity bag by spring.',
              tone: 'clay' as const,
            },
            {
              icon: Shield,
              title: 'Made by people',
              body: 'An author, an illustrator, an editor. Your photo never goes near a generator, and it is deleted the day the book ships.',
              tone: 'verdant' as const,
            },
            {
              icon: Leaf,
              title: 'Made to be kept',
              body: 'FSC® 170gsm uncoated stock, soy inks, sewn linen spine so it opens flat.',
              tone: 'neutral' as const,
            },
          ].map((card, i) => (
            <Reveal key={card.title} y={22} delay={80 + i * 70}>
              <article className="card card-lift flex h-full flex-col gap-4 p-7">
                <span
                  className={cx(
                    'grid size-11 place-items-center rounded-[0.8rem]',
                    card.tone === 'gold' && 'bg-gold-50 text-gold-700',
                    card.tone === 'clay' && 'bg-clay-50 text-clay-700',
                    card.tone === 'verdant' && 'bg-verdant-50 text-verdant-700',
                    card.tone === 'neutral' && 'bg-inset text-ink-soft',
                  )}
                  aria-hidden="true"
                >
                  <card.icon size={20} />
                </span>
                <h3 className="text-title">{card.title}</h3>
                <p className="text-small text-ink-soft">{card.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
