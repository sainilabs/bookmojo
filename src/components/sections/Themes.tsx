import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { OrderButton } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Rating';
import { ArrowRight, BookGlyph, Check } from '@/components/art/Icons';
import { AGE_BANDS, THEMES } from '@/data/catalogue';
import { useDraft } from '@/hooks/useDraft';
import { track } from '@/lib/analytics';
import { whatsappHref } from '@/lib/whatsapp';
import { cx, formatName } from '@/lib/utils';

const THEME_ARTWORK: Record<string, string> = {
  'lane-four': 'theme-lane-four.webp',
  gulmohar: 'theme-gulmohar.webp',
  'nala-bridge': 'theme-nala-bridge.webp',
  chandni: 'aman-scientist-cover.webp',
  backwater: 'theme-backwater.webp',
  banyan: 'theme-banyan.webp',
  sriharikota: 'theme-sriharikota.webp',
  karkhana: 'theme-karkhana.webp',
};

/**
 * STORY WORLDS
 * -----------------------------------------------------------------------------
 * The strategic idea: every card renders the SAME child — theirs, with the skin
 * tone and hair they picked upstairs — in nine different worlds.
 *
 * A generic catalogue asks the visitor to imagine the personalisation. This
 * shows it nine times over, which turns browsing into a second wave of the same
 * emotional payoff that drove the preview. It also quietly proves the artwork is
 * genuinely generated rather than a stock cover with a name plate on it.
 *
 * Cards lead with the PROMISE ("for the child who…") rather than the plot,
 * because parents self-identify with a description of their kid far faster than
 * with a synopsis. The synopsis sits one line down, for the ones who read on.
 *
 * Selecting a world writes to the shared draft and opens a prefilled WhatsApp
 * hand-off, keeping every catalogue path inside the primary ordering flow.
 */
export function Themes() {
  const { draft, update, isPersonalised } = useDraft();
  const name = formatName(draft.childName);
  const asset = (file: string) => `${import.meta.env.BASE_URL}images/storybook/${file}`;

  const choose = (themeId: string) => {
    update({ themeId });
    track('theme_open', { theme: themeId });
  };

  return (
    <Section id="themes" space="grand">
      <Container>
        <SectionHeading
          eyebrow={
            <>
              <BookGlyph size={14} /> Eight original worlds
            </>
          }
          title={
            isPersonalised ? (
              <>
                Eight stories. Same hero:
                <br />
                <span className="text-verdant-500">{name}</span>.
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
                <a
                  href={whatsappHref({
                    intent: 'theme',
                    draft: { ...draft, themeId: theme.id },
                    note: `I chose ${theme.name}.`,
                  })}
                  target="_blank"
                  rel="noopener"
                  onClick={() => choose(theme.id)}
                  aria-label={`Choose ${theme.name} and continue on WhatsApp`}
                  className={cx(
                    'card card-lift flex h-full flex-col overflow-hidden',
                    selected && '!border-ink shadow-e3',
                  )}
                >
                  <div className="relative overflow-hidden border-b border-hairline bg-sunken">
                    <div className="mx-auto w-[62%] pt-8">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-ink shadow-book">
                        <img
                          src={asset(THEME_ARTWORK[theme.id]!)}
                          alt={`Illustration for ${theme.name}, featuring a young Indian child as ${theme.role}`}
                          width="600"
                          height="900"
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 via-black/25 to-transparent px-3 pb-10 pt-3 text-center text-white">
                          <p className="font-book text-[0.9rem] leading-tight font-semibold text-balance">
                            {theme.name}
                          </p>
                          {name && (
                            <p className="mt-1 text-[0.55rem] font-bold tracking-[0.12em] uppercase text-white/80">
                              Starring {name}
                            </p>
                          )}
                        </div>
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
                      <span
                        className="btn btn-tonal btn-sm group"
                      >
                        {selected ? 'Continue on WhatsApp' : 'Choose on WhatsApp'}
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </a>
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
