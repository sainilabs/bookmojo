import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Rating';
import { BookCover } from '@/components/art/BookCover';
import { ArrowRight, BookGlyph, Check } from '@/components/art/Icons';
import { AGE_BANDS, THEMES } from '@/data/catalogue';
import { useDraft } from '@/hooks/useDraft';
import { track } from '@/lib/analytics';
import { cx, formatName } from '@/lib/utils';

/**
 * STORY WORLDS
 * -----------------------------------------------------------------------------
 * The strategic idea: every card renders the SAME child — theirs, with the skin
 * tone and hair they picked upstairs — in six different worlds.
 *
 * A generic catalogue asks the visitor to imagine the personalisation. This
 * shows it six times over, which turns browsing into a second wave of the same
 * emotional payoff that drove the preview. It also quietly proves the artwork is
 * genuinely generated rather than a stock cover with a name plate on it.
 *
 * Cards lead with the PROMISE ("for the child who…") rather than the plot,
 * because parents self-identify with a description of their kid far faster than
 * with a synopsis. The synopsis sits one line down, for the ones who read on.
 *
 * Selecting a world writes to the shared draft and returns the visitor to the
 * preview rather than opening a product page — there are no product pages here,
 * and every path has to funnel back to the one conversion surface.
 */
export function Themes() {
  const { draft, update, isPersonalised } = useDraft();
  const name = formatName(draft.childName);

  const choose = (themeId: string) => {
    update({ themeId });
    track('theme_open', { theme: themeId });
    document.getElementById('create')?.scrollIntoView({ block: 'start' });
  };

  return (
    <Section id="themes" space="grand">
      <Container>
        <SectionHeading
          eyebrow={
            <>
              <BookGlyph size={14} /> Six original worlds
            </>
          }
          title={
            isPersonalised ? (
              <>
                Six stories. Same hero:
                <br />
                <span className="quill">{name}</span>.
              </>
            ) : (
              <>
                Choose the world.
                <br />
                We write your child into it.
              </>
            )
          }
          deck="Original stories set where your child actually lives — a summer terrace, the banyan at the end of the lane, a launch pad on the Bay of Bengal."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {THEMES.map((theme, i) => {
            const selected = theme.id === draft.themeId;
            const ages = theme.ages
              .map((a) => AGE_BANDS.find((b) => b.id === a)?.label ?? a)
              .join(' · ');

            return (
              <Reveal
                as="li"
                key={theme.id}
                y={26}
                delay={(i % 3) * 90}
                scale={0.98}
                className="h-full"
              >
                <article
                  className={cx(
                    'card card-lift flex h-full flex-col overflow-hidden',
                    selected && '!border-ink shadow-e3',
                  )}
                >
                  {/* Cover, rendered with the visitor's own character. */}
                  <div className="relative overflow-hidden border-b border-hairline bg-sunken">
                    <div className="mx-auto w-[62%] pt-8">
                      <div className="overflow-hidden rounded-[3px] shadow-book">
                        <BookCover
                          draft={{ ...draft, themeId: theme.id }}
                          className="block w-full"
                        />
                      </div>
                    </div>
                    <div className="h-8" />

                    {theme.popular && (
                      <span className="absolute left-4 top-4">
                        <Pill tone="gold">Most chosen</Pill>
                      </span>
                    )}
                    {selected && (
                      <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-inverse px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.08em] uppercase text-ink-inverse">
                        <Check size={12} strokeWidth={3} /> In your preview
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-gold-700 night:text-gold-500">
                      {theme.promise}
                    </p>
                    <h3 className="mt-2.5 text-title">{theme.name}</h3>
                    <p className="mt-3 flex-1 text-small text-ink-soft">{theme.blurb}</p>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-hairline pt-4">
                      <span className="text-small font-semibold text-ink-muted">Ages {ages}</span>
                      <button
                        type="button"
                        onClick={() => choose(theme.id)}
                        className="btn btn-tonal btn-sm group"
                        aria-label={`Put ${name || 'your child'} in ${theme.name}`}
                      >
                        {selected ? 'Selected' : 'Try this world'}
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal y={16} className="mt-14 flex flex-col items-center gap-3 text-center">
          <p className="max-w-[40ch] text-ink-soft">
            Not sure which one? Tell us about your child in the chat and we will suggest the fit.
          </p>
          <OrderButton
            intent="gift"
            label="Ask us which story fits"
            sublabel="A human replies during opening hours"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
