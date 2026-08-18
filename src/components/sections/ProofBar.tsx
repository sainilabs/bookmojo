import { Container, Reveal } from '@/components/ui/Layout';
import { Marquee } from '@/components/ui/Marquee';
import { ENDORSEMENTS } from '@/data/testimonials';
import { CheckCircle, Globe, Heart, Leaf, Shield } from '@/components/art/Icons';
import { GUARANTEE, PROOF } from '@/lib/config';

/**
 * PROOF BAR
 * -----------------------------------------------------------------------------
 * Placed immediately under the hero because that is where the first doubt lands:
 * "this looks lovely, but who are these people?"
 *
 * Composition is deliberate:
 *   · Four numbers, each answering a different question — scale, satisfaction,
 *     reach, and whether people come back. Repeat-purchase rate is the strongest
 *     of the four for a gift product and is almost never shown, which is exactly
 *     why we show it.
 *   · Then a slow rail of third-party and material credentials. These are weak
 *     individually and strong in aggregate, so they belong in a rail rather than
 *     taking up four cards of vertical space.
 *   · Figures are tabular-nums and set in the display face so they read as
 *     typography rather than as a dashboard.
 *
 * No logos of publications we were "featured in". Unverifiable badges cost
 * credibility with exactly the sceptical, high-intent buyer we most want.
 */
export function ProofBar() {
  const stats = [
    { value: 'Preview first', label: 'See the book before ordering', icon: Heart },
    { value: 'Secure UPI', label: 'Pay on a secure page', icon: CheckCircle },
    { value: 'Free shipping', label: 'Included across India', icon: Globe },
    { value: `${PROOF.productionDays} days`, label: 'Printed after approval', icon: Leaf },
  ];

  return (
    <section aria-label="Trust and credentials" className="border-y border-hairline bg-sunken">
      <Container>
        <div className="grid grid-cols-2 gap-y-8 py-10 sm:py-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              y={16}
              delay={i * 70}
              className="flex flex-col gap-1 lg:border-l lg:border-hairline lg:pl-6 lg:first:border-0 lg:first:pl-0"
            >
              <span className="font-display text-[1.45rem] leading-tight font-extrabold sm:text-[1.7rem]">
                {stat.value}
              </span>
              <span className="max-w-[18ch] text-small text-ink-muted">{stat.label}</span>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-hairline py-6 lg:flex-row lg:items-center lg:gap-10">
          <p className="flex shrink-0 items-center gap-2.5 text-small font-semibold">
            <Shield size={18} className="text-verdant-600 night:text-verdant-500" />
            {GUARANTEE.headline}
            <span className="font-medium text-ink-muted">· {GUARANTEE.window}</span>
          </p>

          <Marquee className="min-w-0 flex-1" speed={52}>
            {ENDORSEMENTS.map((item) => (
              <div key={item.label} className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-[0.95rem] font-semibold">{item.label}</span>
                <span className="text-small text-ink-muted">{item.note}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </Container>
    </section>
  );
}
