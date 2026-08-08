import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { Printer } from '@/components/art/Icons';
import { BRAND, GUARANTEE } from '@/lib/config';

/**
 * PREMIUM PRINTING QUALITY
 * -----------------------------------------------------------------------------
 * The objection this section exists to kill: "personalised = print-on-demand =
 * flimsy". It is the objection that stops a gift buyer, and it cannot be
 * answered with the word "premium".
 *
 * So we answer it the way a manufacturer would: an exploded cross-section of the
 * actual construction, with real specifications. Numbers — 170gsm, 210 × 250mm,
 * FSC®, soy-based, sewn — are load-bearing. A buyer who does not know what
 * 170gsm means still reads it as "these people know their materials", and the
 * one who does know is convinced outright.
 *
 * The diagram is annotated SVG rather than a product photograph on purpose: a
 * photo shows one book, a cross-section explains every book, and it cannot be
 * mistaken for stock imagery.
 */

/** Detail copy is pre-broken into lines: SVG text does not wrap, and hand-set
 *  line breaks are more reliable (and cheaper) than a foreignObject. */
const LAYERS = [
  {
    label: 'Foil-stamped title',
    detail: ['Warm gold, struck under heat so', 'the name catches the light'],
    fill: '#e6b45c',
    stroke: '#b3873c',
  },
  {
    label: 'Hardcover board, 2.5mm',
    detail: ['Wrapped and turned in by hand,', 'square-cornered'],
    fill: '#3a3040',
    stroke: '#241d29',
  },
  {
    label: '170gsm uncoated stock',
    detail: ['FSC® certified, matte, no glare', 'under a bedside lamp'],
    fill: '#f6efe0',
    stroke: '#d9cbb2',
  },
  {
    label: 'Litho, soy-based inks',
    detail: ['Six-colour offset. Low VOC and', 'safe for chewing age'],
    fill: '#c8763a',
    stroke: '#96551f',
  },
  {
    label: 'Sewn signatures, linen spine',
    detail: ['Thread-sewn so it opens flat', 'and does not shed pages'],
    fill: '#6b4ea8',
    stroke: '#4a3179',
  },
] as const;

const SPECS = [
  ['Trim size', '210 × 250 mm portrait'],
  ['Extent', '12 to 24 spreads, by age band'],
  ['Cover', 'Hardcover board, foil-stamped, matte laminate'],
  ['Paper', '170gsm uncoated FSC® text, 2.5mm board'],
  ['Binding', 'Thread-sewn sections, linen-wrapped spine'],
  ['Languages', 'English or Hindi, set in Devanagari where needed'],
  ['Ages 2–3', 'Board pages, 3mm, rounded corners'],
  ['Printed in', `${BRAND.press} — India's children's-book press town`],
  ['Packaging', 'Rigid gift box, unbranded outer, no pricing inside'],
  ['Proofing', 'Read by a human editor before it goes to plate'],
] as const;

export function Craft() {
  return (
    <Section id="craft" space="grand" tone="sunken" className="rule-top">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-20">
          {/* --------------------------- DIAGRAM ---------------------------- */}
          <Reveal y={26} scale={0.97} className="order-2 lg:order-1">
            <div className="card overflow-hidden bg-raised p-6 sm:p-8">
              <p className="eyebrow mb-6">Cross-section, actual construction</p>

              <svg viewBox="0 0 420 330" className="w-full" role="img" aria-labelledby="craft-title">
                <title id="craft-title">
                  An exploded diagram of a BookMojo hardcover, showing five layers: foil-stamped
                  title, 2.5mm hardcover board, 170gsm uncoated FSC paper, soy-based litho inks, and
                  thread-sewn signatures with a linen spine.
                </title>

                {LAYERS.map((layer, i) => {
                  const y = 26 + i * 54;
                  return (
                    <g
                      key={layer.label}
                      style={{
                        animation: `float ${6 + i * 0.6}s var(--ease-in-out) ${i * 0.35}s infinite`,
                      }}
                    >
                      {/* Each sheet is drawn as a parallelogram: the same slab
                          seen in three-quarter view, stacked with air between. */}
                      <path
                        d={`M20 ${y + 34} L120 ${y} L232 ${y} L132 ${y + 34} Z`}
                        fill={layer.fill}
                        stroke={layer.stroke}
                        strokeWidth="1.2"
                      />
                      <path
                        d={`M20 ${y + 34} L132 ${y + 34} L132 ${y + 42} L20 ${y + 42} Z`}
                        fill={layer.stroke}
                        opacity="0.85"
                      />
                      {/* Leader line out to the label. */}
                      <path
                        d={`M232 ${y + 2} L268 ${y + 2}`}
                        stroke="var(--l-strong)"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      <circle cx="268" cy={y + 2} r="2.6" fill="var(--c-ink)" />
                      <text
                        x="278"
                        y={y}
                        fontSize="11.5"
                        fontWeight="700"
                        fill="var(--c-ink)"
                        fontFamily="var(--font-sans)"
                      >
                        {layer.label}
                      </text>
                      <text
                        x="278"
                        y={y + 15}
                        fontSize="9.5"
                        fill="var(--c-ink-muted)"
                        fontFamily="var(--font-sans)"
                      >
                        {layer.detail.map((line, li) => (
                          <tspan key={line} x="278" dy={li === 0 ? 0 : 11}>
                            {line}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Reveal>

          {/* ---------------------------- COPY ------------------------------ */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="start"
              eyebrow={
                <>
                  <Printer size={14} /> The craft
                </>
              }
              title="Printed like a bookshop book, because it is one."
              deck={`We print litho on uncoated stock and sew the signatures in ${BRAND.press} — the same presses that make the trade children's hardcovers you already own. It costs more than print-on-demand and it is the reason these end up on shelves instead of in the toy bin.`}
            />

            <Reveal y={20} delay={120} className="mt-9">
              <dl className="divide-y divide-hairline border-y border-hairline">
                {SPECS.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                    <dt className="w-40 shrink-0 text-small font-bold tracking-[0.04em] uppercase text-ink-muted">
                      {k}
                    </dt>
                    <dd className="text-small">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal y={18} delay={200} className="mt-8">
              <div className="card flex flex-col gap-4 bg-raised p-6 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-title">{GUARANTEE.headline}</p>
                  <p className="mt-1.5 text-small text-ink-soft">{GUARANTEE.detail}</p>
                </div>
                <OrderButton
                  intent="faq"
                  size="md"
                  label="Ask about materials"
                  className="shrink-0"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
