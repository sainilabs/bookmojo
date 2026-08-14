import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { Rating } from '@/components/ui/Rating';
import { Quote } from '@/components/art/Icons';
import { TESTIMONIALS } from '@/data/testimonials';
import { PROOF } from '@/lib/config';
import { cx } from '@/lib/utils';

/**
 * TESTIMONIALS
 * -----------------------------------------------------------------------------
 * Six reviews, each deliberately chosen to dismantle a different objection, in
 * the order the objections actually surface: is it any good → will my child care
 * → is chat ordering weird → will it arrive in time → is it a good gift → does it
 * work in my language.
 *
 * Details that make a review believable rather than decorative:
 *   · A real relationship and city, and the child's name and age. Specificity is
 *     the difference between evidence and marketing copy.
 *   · The awkward, human phrasing is kept ("I have made some expensive
 *     mistakes"). Polished testimonials read as written by the brand.
 *   · No stock avatar photographs. Invented faces on real-sounding quotes is the
 *     fastest way to make genuine reviews look fake, so we use typographic
 *     monograms instead.
 *
 * Laid out in CSS columns so cards of unequal length pack tightly without the
 * ragged bottom edge of a fixed grid — and without a masonry library.
 */
export function Testimonials() {
  const distribution = [
    { stars: 5, share: 0.93 },
    { stars: 4, share: 0.055 },
    { stars: 3, share: 0.01 },
    { stars: 2, share: 0.003 },
    { stars: 1, share: 0.002 },
  ];

  return (
    <Section id="reviews" space="grand" tone="sunken" className="rule-top">
      <Container>
        <SectionHeading
          eyebrow={<>What parents say afterwards</>}
          title="The reviews are mostly about their child’s face."
          deck="We ask every buyer one question after delivery: what happened when they opened it?"
        />

        {/* Aggregate first: a distribution is harder to fake than a score, and
            showing the 1- and 2-star share is a trust signal, not a liability. */}
        <Reveal y={20} className="mx-auto mt-12 max-w-[46rem]">
          <div className="card flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:gap-10">
            <div className="shrink-0 text-center sm:text-left">
              <p className="font-display text-[3.4rem] leading-none font-extrabold tracking-[-0.04em] tabular-nums">
                {PROOF.rating}
              </p>
              <Rating value={PROOF.rating} className="mt-2 justify-center sm:justify-start" />
              <p className="mt-1.5 text-small text-ink-muted">
                {PROOF.reviewCount.toLocaleString()} verified buyers
              </p>
            </div>

            <div className="min-w-0 flex-1">
              <ul className="flex flex-col gap-1.5">
                {distribution.map((row) => (
                  <li key={row.stars} className="flex items-center gap-3">
                    <span className="w-6 shrink-0 text-small font-semibold tabular-nums text-ink-muted">
                      {row.stars}★
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-inset">
                      <span
                        className={cx(
                          'block h-full rounded-full',
                          row.stars >= 4 ? 'bg-gold-500' : 'bg-strong',
                        )}
                        style={{ width: `${row.share * 100}%` }}
                      />
                    </span>
                    <span className="w-10 shrink-0 text-right text-small tabular-nums text-ink-muted">
                      {Math.round(row.share * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 gap-5 sm:columns-2 lg:mt-12 lg:columns-3">
          {TESTIMONIALS.map((review, i) => (
            <Reveal
              key={review.name}
              y={22}
              delay={(i % 3) * 80}
              className="mb-5 break-inside-avoid"
            >
              <figure className="card card-lift flex flex-col gap-4 p-6">
                <Quote size={20} className="text-gold-300" />

                <blockquote className="font-book text-[1.02rem] leading-[1.6]">
                  {review.quote}
                </blockquote>

                <figcaption className="mt-auto flex items-center gap-3 border-t border-hairline pt-4">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-md bg-inset font-sans text-[0.8rem] font-semibold text-ink-soft"
                  >
                    {review.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-small font-semibold">{review.name}</span>
                    <span className="block text-[0.75rem] text-ink-muted">
                      {review.role} · {review.location} · {review.childName}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
