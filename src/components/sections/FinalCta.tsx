import { Container, Reveal, Section } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { Book3D } from '@/components/art/BookCover';
import { Check, Clock, Lock, Shield } from '@/components/art/Icons';
import { GUARANTEE, PRICING, PROOF } from '@/lib/config';
import { useDraft } from '@/hooks/useDraft';
import { formatINR, formatName, possessive } from '@/lib/utils';

/**
 * FINAL CTA
 * -----------------------------------------------------------------------------
 * The close. Three jobs, in this order:
 *
 * 1. PRICE, PLAINLY. This is the only place the full price story appears, and it
 *    appears with everything that is included and nothing that is not. Hiding
 *    price until the chat would be the single fastest way to poison a
 *    conversational funnel: a buyer who feels the number was withheld stops
 *    trusting the channel. The ₹199 digital edition is stated here too, but
 *    subordinated — see the note on the price pane below.
 * 2. REVERSE THE RISK. Guarantee, no-charge-before-approval, and free shipping
 *    sit adjacent to the button, where the hesitation actually occurs.
 * 3. ONE ACTION. No secondary CTA, no newsletter, no "browse more". Every
 *    alternative at the close leaks intent that the whole page was built to
 *    concentrate.
 *
 * The visitor's own personalised cover is shown again here. What they configured
 * forty minutes of scroll ago is the most persuasive image we have, and by now it
 * feels like theirs.
 */
export function FinalCta() {
  const { draft, isPersonalised } = useDraft();
  const name = formatName(draft.childName);

  /* Six items, not eight. A list this close to the button is scanned in about a
     second; past six the extra lines stop being read and start being volume. */
  const included = [
    'Hardcover, foil-stamped, 210 × 250mm',
    'Written and illustrated for your child',
    'English or Hindi',
    'Rigid gift box',
    'Tracked delivery + GST',
    'Unlimited changes before printing',
  ];

  return (
    <Section id="final-cta" space="grand" tone="inverse" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(48rem 32rem at 18% 10%, color-mix(in oklab, var(--gold-500) 18%, transparent), transparent 70%)',
        }}
      />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal y={14} className="eyebrow !text-ink-inverse-muted">
              One conversation away
            </Reveal>

            <Reveal y={22} delay={70} as="h2" className="mt-4 text-display-1">
              {isPersonalised ? (
                <>
                  Let’s make
                  <br />
                  <span className="text-gold-300">{possessive(name)}</span> book.
                </>
              ) : (
                <>
                  Tell us their
                  <br />
                  name. We’ll do
                  <br />
                  <span className="text-gold-300">the rest.</span>
                </>
              )}
            </Reveal>

            <Reveal y={18} delay={140}>
              <p className="mt-6 max-w-[38ch] text-lead text-ink-inverse-soft">
                Five questions, approve the cover, done in {PROOF.avgOrderMinutes} minutes.
              </p>
            </Reveal>

            {/* Price, stated fully. Two tiers, deliberately unequal in weight. */}
            <Reveal y={18} delay={200} className="mt-9">
              <div className="glass glass-inverse rounded-xl p-6 sm:p-7">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                  <p className="font-display text-[2.75rem] leading-none font-extrabold tracking-[-0.03em] tabular-nums">
                    {formatINR(PRICING.hardcover)}
                  </p>
                  <p className="text-small text-ink-inverse-muted">
                    <s className="opacity-70">{formatINR(PRICING.hardcoverCompare)}</s> · GST and
                    delivery included · no per-page or per-name extras
                  </p>
                </div>

                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-small text-ink-inverse-soft">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-verdant-500"
                        strokeWidth={2.4}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* The digital edition sits below the rule at body-text size, not
                    as a second price card. Giving the two tiers equal visual
                    weight would turn a gift decision into a spec comparison, and
                    the cheaper option always wins that. Here it reads as a way in
                    for someone not ready to spend ₹1,499 — which is most of the
                    market. */}
                <div className="mt-6 border-t border-inverse-line pt-5">
                  <p className="text-small text-ink-inverse-soft">
                    <span className="font-semibold text-ink-inverse">
                      Not ready for the hardcover? {formatINR(PRICING.digital)} digital edition.
                    </span>{' '}
                    The same story, written for the same child, sent to your phone — nothing to
                    ship, nothing to wait for. Put it towards the printed book later.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal y={18} delay={260} className="mt-7">
              <OrderButton
                intent="final"
                label={isPersonalised ? `Start ${possessive(name)} book` : 'Start your book'}
                sublabel="No account · nothing charged until you approve"
              />

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { icon: Lock, text: 'UPI, card or net banking' },
                  { icon: Shield, text: `${GUARANTEE.headline} · ${GUARANTEE.window}` },
                  { icon: Clock, text: 'Cancel free before approval' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-small text-ink-inverse-soft">
                    <Icon size={16} className="shrink-0 text-verdant-500" />
                    {text}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal
            y={30}
            delay={160}
            scale={0.96}
            className="flex justify-center lg:justify-end"
          >
            <Book3D draft={draft} width={330} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
