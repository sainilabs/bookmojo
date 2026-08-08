import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { Check, Feather, Printer, Truck, WhatsAppMark } from '@/components/art/Icons';
import { PROOF } from '@/lib/config';

/**
 * HOW IT WORKS
 * -----------------------------------------------------------------------------
 * Four steps, because four is where comprehension peaks: three hides the
 * approval step (which is our best trust asset), and six starts to read as
 * effort. Two of the four are things WE do, which is the point — the visitor's
 * total workload is two steps long.
 *
 * Each step carries an explicit time cost and an explicit "who does this".
 * Vague process diagrams ("we work our magic!") raise anxiety in exactly the
 * buyer who is deciding whether a chat-based order is trustworthy.
 *
 * The connecting thread is drawn as a stitched line — the binding of a book —
 * and it draws itself on scroll. That is the one piece of decorative motion on
 * the page, and it earns its place by encoding direction and sequence.
 */

const STEPS = [
  {
    n: 1,
    icon: WhatsAppMark,
    who: 'You',
    time: '~4 min',
    title: 'Answer five questions in a chat',
    body: 'Name, age, English or Hindi, story world, and what they look like. Tap or type.',
  },
  {
    n: 2,
    icon: Check,
    who: 'You',
    time: '~1 min',
    title: 'Approve the real cover and two pages',
    body: 'The actual artwork, in the chat. Change anything. Nothing is charged until you say yes.',
  },
  {
    n: 3,
    icon: Printer,
    who: 'Us',
    time: `${PROOF.productionDays} days`,
    title: 'A human writes, illustrates and proofs it',
    body: 'Then litho-printed and hardcover bound. We send you a photo off the press.',
  },
  {
    n: 4,
    icon: Truck,
    who: 'Us',
    time: `${PROOF.metroDeliveryDays} days`,
    title: 'It arrives boxed, tracked and gift-ready',
    body: 'Rigid gift box, no pricing inside. Tracking lands in the same chat.',
  },
] as const;

export function HowItWorks() {
  return (
    <Section id="how-it-works" tone="sunken" className="rule-top">
      <Container>
        <SectionHeading
          eyebrow={
            <>
              <Feather size={14} /> The whole process
            </>
          }
          title="Two things for you to do. Two for us."
          deck={`About ${PROOF.avgOrderMinutes} minutes of your time, and the book is in your hands inside ten days.`}
        />

        <ol className="relative mt-16 grid gap-10 sm:gap-12 lg:mt-24 lg:grid-cols-4 lg:gap-8">
          {/* The stitched thread. Absolute, decorative, hidden from AT. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[1.4rem] top-4 bottom-8 w-px lg:left-0 lg:right-0 lg:top-[1.45rem] lg:bottom-auto lg:h-px lg:w-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(var(--stitch-dir, to bottom), var(--l-strong) 0 6px, transparent 6px 12px)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, var(--l-strong) 0 6px, transparent 6px 12px)',
              backgroundSize: '100% 1px',
              backgroundPosition: '0 1.45rem',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.n}
              y={22}
              delay={i * 110}
              className="relative flex gap-5 lg:flex-col lg:gap-6"
            >
              <div className="relative z-10 flex shrink-0 flex-col items-center gap-2 lg:flex-row lg:gap-3">
                <span
                  className={`grid size-11 place-items-center rounded-full border-2 shadow-e1 ${
                    step.who === 'You'
                      ? 'border-verdant-600 bg-verdant-50 text-verdant-700 night:border-verdant-500 night:text-verdant-600'
                      : 'border-strong bg-raised text-ink-soft'
                  }`}
                >
                  <step.icon size={19} />
                </span>
                <span className="font-display text-small font-semibold text-ink-muted tabular-nums">
                  0{step.n}
                </span>
              </div>

              <div className="min-w-0 pb-2">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.1em] uppercase ${
                      step.who === 'You'
                        ? 'bg-verdant-50 text-verdant-700'
                        : 'bg-inset text-ink-muted'
                    }`}
                  >
                    {step.who}
                  </span>
                  <span className="text-[0.68rem] font-bold tracking-[0.08em] uppercase text-ink-muted">
                    {step.time}
                  </span>
                </div>
                <h3 className="text-[1.15rem] leading-snug font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-[34ch] text-small text-ink-soft">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal y={16} delay={200} className="mt-14 flex flex-col items-center gap-3">
          <OrderButton
            intent="hero"
            label="Start step one"
            sublabel="Opens WhatsApp · nothing to pay yet"
          />
          <p className="text-small text-ink-muted">
            Or{' '}
            <a
              href="#journey"
              className="font-semibold underline decoration-gold-500 decoration-2 underline-offset-4"
            >
              watch the whole conversation
            </a>{' '}
            first.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
