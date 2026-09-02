import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { Quote } from '@/components/art/Icons';
import { TESTIMONIALS } from '@/data/testimonials';

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
  return (
    <Section id="reviews" space="grand" tone="sunken" className="rule-top">
      <Container>
        <SectionHeading
          eyebrow={<>What parents say afterwards</>}
          title="The reviews are mostly about their child’s face."
          deck="We ask every buyer one question after delivery: what happened when they opened it?"
        />

        <div className="mt-12 gap-5 sm:columns-2 lg:columns-3">
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
