import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Rating';
import { Camera, Gift, Printer, Truck, WhatsAppMark } from '@/components/art/Icons';
import { PROOF } from '@/lib/config';
import { useDraft } from '@/hooks/useDraft';
import { formatName, possessive } from '@/lib/utils';

/**
 * DELIVERY PROCESS
 * -----------------------------------------------------------------------------
 * This section is not a shipping policy. It is about the gap between paying and
 * holding, which for a made-to-order gift is where nearly all post-purchase
 * anxiety lives — and where refund requests are actually generated.
 *
 * So instead of listing stages again (HowItWorks already did that), we show what
 * ARRIVES IN THE CHAT at each stage. The promise is not "we ship in 5–7 days",
 * it is "you will never have to ask where it is". Proactive updates in a thread
 * the buyer already checks is a genuine structural advantage of ordering over
 * WhatsApp, and it deserves its own argument.
 *
 * The gift-timing feature is given a card of its own because for grandparents
 * and gift buyers — a large share of orders — it is the deciding detail.
 */

export function Delivery() {
  const { draft, isPersonalised } = useDraft();
  const name = formatName(draft.childName);
  const book = isPersonalised ? `${possessive(name)} book` : 'the book';

  const beats = [
    {
      icon: Printer,
      when: 'Day 1',
      title: 'In the studio',
      message: `Writer assigned. ${
        isPersonalised ? name : 'Your hero'
      } is officially in the manuscript.`,
    },
    {
      icon: Camera,
      when: `Day ${PROOF.productionDays.split('–')[0]}`,
      title: 'Off the press',
      message: `📸 Here is ${book}, before the gift box goes on.`,
    },
    {
      icon: Truck,
      when: 'Next day',
      title: 'Tracked and moving',
      message: 'Blue Dart picked it up. Live tracking is in this chat — tap any time.',
    },
    {
      icon: Gift,
      when: 'Arrival',
      title: 'On the doorstep',
      message: 'Out for delivery, before 1pm. Want me to hold it for a date instead?',
    },
  ] as const;

  return (
    <Section space="grand">
      <Container>
        <SectionHeading
          eyebrow={
            <>
              <Truck size={14} /> Getting it to you
            </>
          }
          title="You will never have to ask where it is."
          deck={`Made in ${PROOF.productionDays} days, then ${PROOF.metroDeliveryDays} to metros and 4–6 elsewhere. Every stage arrives as a message — including a photo of the real book.`}
        />

        <ol className="relative mt-10 grid gap-6 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {beats.map((beat, i) => (
            <Reveal as="li" key={beat.title} y={24} delay={i * 90} className="h-full">
              <article className="card flex h-full flex-col gap-4 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-[0.7rem] bg-inset text-ink-soft"
                  >
                    <beat.icon size={19} />
                  </span>
                  <Pill tone="outline">{beat.when}</Pill>
                </div>

                <h3 className="text-[1.05rem] font-semibold">{beat.title}</h3>

                {/* The actual notification, as it appears on their phone. */}
                <div className="mt-auto rounded-[0.85rem] rounded-tl-sm bg-[var(--chat-out)] px-3 py-2.5 text-[0.78rem] leading-snug text-[var(--chat-out-ink)] shadow-e1">
                  <span className="mb-1 flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.08em] uppercase opacity-60">
                    <WhatsAppMark size={10} /> BookMojo
                  </span>
                  {beat.message}
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <Reveal y={20} className="lg:col-span-2">
            <article className="card flex h-full flex-col gap-5 bg-sunken p-7 sm:flex-row sm:items-center sm:p-8">
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-[0.85rem] bg-gold-50 text-gold-700"
              >
                <Gift size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-title">Keeping it a surprise</h3>
                <p className="mt-2 text-small text-ink-soft">
                  Name the date and we land it that morning. Unbranded packaging, no pricing inside,
                  and a heads-up to you the day before.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal y={20} delay={90}>
            <article className="card flex h-full flex-col justify-between gap-5 p-7">
              <div>
                <p className="font-display text-[2.4rem] leading-none font-semibold tabular-nums">
                  {PROOF.pincodes}
                </p>
                <p className="mt-2 text-small text-ink-soft">
                  PIN codes across India, courier and GST already in the price. Plus{' '}
                  {PROOF.countries} countries for gifts sent home.
                </p>
              </div>
              <OrderButton intent="faq" size="sm" label="Check your PIN code" />
            </article>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
