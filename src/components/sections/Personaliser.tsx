import { useMemo } from 'react';
import { Container, Reveal, Section, SectionHeading } from '@/components/ui/Layout';
import { ChoiceGroup, NameField, type Choice } from '@/components/ui/Controls';
import { OrderButton } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Rating';
import { Book3D } from '@/components/art/BookCover';
import { Check, Sparkle } from '@/components/art/Icons';
import {
  AGE_BANDS,
  HAIR_COLOURS,
  HAIR_STYLES,
  LANGUAGES,
  SKIN_TONES,
  THEMES,
  THEME_BY_ID,
  recommendedThemes,
} from '@/data/catalogue';
import { useDraft } from '@/hooks/useDraft';
import { cx, formatName, possessive } from '@/lib/utils';
import type { AgeBand, HairId, LanguageCode } from '@/types';

/**
 * INTERACTIVE PERSONALISATION PREVIEW
 * -----------------------------------------------------------------------------
 * The commercial engine of the page.
 *
 * The bet: a visitor who has spent ninety seconds choosing their child's hair
 * and reading the opening line of *their* story is a fundamentally different
 * prospect from one who has read a features list. They have invested effort,
 * they have seen the artefact, and the endowment effect is doing the selling.
 * Every decision below serves that.
 *
 * · NOTHING IS GATED. No email wall in front of the preview. A wall would lift
 *   lead capture and destroy the emotional beat that actually drives the order.
 * · The five controls are exactly the five questions WhatsApp asks, in the same
 *   order. So this section is simultaneously the demo, the pre-fill, and an
 *   honest disclosure of the entire ordering process.
 * · A completion meter is shown because a partially-filled progress indicator is
 *   one of the most reliable nudges in interface design — but it counts real
 *   choices, and it never blocks the CTA. Manufactured urgency would erode the
 *   trust the rest of the page spends its time building.
 * · The opening line of the story renders live with the child's name in it. This
 *   is the emotional payoff and the proof of the product's core claim (the story
 *   is written around them) delivered in the same gesture.
 * · The preview column is sticky on desktop so the artefact never leaves the
 *   viewport while choices are being made — cause and effect stay adjacent.
 */
export function Personaliser() {
  const { draft, update, updateLook, isPersonalised } = useDraft();
  const theme = THEME_BY_ID.get(draft.themeId) ?? THEMES[0]!;
  const name = formatName(draft.childName);
  const recommended = useMemo(() => recommendedThemes(draft.age), [draft.age]);

  const ageOptions: Array<Choice<AgeBand>> = AGE_BANDS.map((band) => ({
    value: band.id,
    label: band.label,
    hint: band.note.split(',')[1]?.trim(),
  }));

  const languageOptions: Array<Choice<LanguageCode>> = LANGUAGES.map((lang) => ({
    value: lang.code,
    label: lang.native,
    hint: lang.note,
  }));

  const hairStyleOptions: Array<Choice<HairId>> = HAIR_STYLES.map((style) => ({
    value: style.id,
    label: style.label,
  }));

  /** Counts genuine choices, not steps walked past. */
  const done = [
    Boolean(name),
    true, // age always has a considered default
    true, // language always has a considered default
    Boolean(draft.themeId),
    true, // look always has a considered default
  ].filter(Boolean).length;

  const opening = theme.opening.replaceAll('{name}', name || 'your child');

  return (
    /* overflow-x-clip, NOT overflow-hidden. `hidden` turns this section into a
       scroll container, which silently breaks the sticky preview column below —
       the book un-sticks, scrolls away, and leaves the right half of the section
       empty. `clip` gives the same horizontal clipping without creating a scroll
       container, so sticky keeps working. */
    <Section id="create" space="grand" className="overflow-x-clip">
      <Container>
        <SectionHeading
          eyebrow={
            <>
              <Sparkle size={14} /> Step one, and it is the fun one
            </>
          }
          title={
            <>
              Build the cover now.
              <br />
              Decide about buying later.
            </>
          }
          deck="Five choices, no sign-up. One tap carries them into WhatsApp and we pick up from there."
        />

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16 3xl:gap-24">
          {/* ------------------------------ CONTROLS ------------------------ */}
          <Reveal y={24} className="order-2 lg:order-1">
            <div className="flex items-center justify-between gap-4 border-b border-hairline pb-4">
              <p className="eyebrow eyebrow-green">Your choices</p>
              <div className="flex items-center gap-3">
                <span className="text-small font-semibold tabular-nums text-ink-muted">
                  {done} of 5
                </span>
                <div
                  className="h-1.5 w-24 overflow-hidden rounded-full bg-inset"
                  role="progressbar"
                  aria-valuenow={done}
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-label="Personalisation progress"
                >
                  <div
                    className="h-full rounded-full bg-verdant-500 transition-[width] duration-500 ease-[var(--ease-spring)]"
                    style={{ width: `${(done / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-9">
              <NameField
                label="1 · Their first name"
                value={draft.childName}
                onChange={(childName) => update({ childName })}
                placeholder="Aarav, Meera, Ishaan…"
                hint="Exactly as it should be printed."
              />

              <ChoiceGroup
                legend="2 · Age"
                options={ageOptions}
                value={draft.age}
                onChange={(age) => update({ age })}
                columns={4}
                note={AGE_BANDS.find((b) => b.id === draft.age)?.note}
              />

              <ChoiceGroup
                legend="3 · Language"
                options={languageOptions}
                value={draft.language}
                onChange={(language) => update({ language })}
                columns={2}
                note="Written by an author in that language, never machine-translated."
              />

              {/* Theme is a custom control rather than a chip group: the choice
                  is emotional and needs the promise line to be legible at the
                  moment of choosing, not hidden in a tooltip. */}
              <fieldset className="min-w-0 border-0 p-0">
                <legend className="eyebrow mb-2.5">4 · Story world</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {THEMES.map((option) => {
                    const selected = option.id === draft.themeId;
                    const fits = recommended.some((t) => t.id === option.id);
                    return (
                      <label
                        key={option.id}
                        className={cx(
                          'group relative flex cursor-pointer gap-3 rounded-md border p-3 transition-all duration-200',
                          selected
                            ? 'border-ink bg-raised shadow-e2'
                            : 'border-hairline bg-raised/50 hover:border-strong',
                        )}
                      >
                        <input
                          type="radio"
                          name="story-world"
                          value={option.id}
                          checked={selected}
                          onChange={() => update({ themeId: option.id })}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className="mt-0.5 size-9 shrink-0 rounded-md shadow-e1"
                          style={{
                            background: `linear-gradient(150deg, ${option.palette.deep}, ${option.palette.base} 60%, ${option.palette.accent})`,
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-[0.95rem] leading-tight font-semibold">
                              {option.name}
                            </span>
                            {selected && (
                              <Check size={14} className="shrink-0 text-verdant-600" aria-hidden />
                            )}
                          </span>
                          <span className="mt-0.5 block text-[0.78rem] leading-snug text-ink-muted">
                            {option.promise}
                          </span>
                          {fits && (
                            <span className="mt-1.5 inline-block text-[0.68rem] font-bold tracking-wide uppercase text-gold-700 night:text-gold-500">
                              Written for {draft.age}s
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="flex flex-col gap-5">
                <p className="eyebrow eyebrow-purple">5 · What they look like</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <ChoiceGroup
                    legend="Skin tone"
                    options={SKIN_TONES.map((tone) => ({
                      value: tone.hex,
                      label: tone.label,
                      swatch: tone.hex,
                    }))}
                    value={draft.look.skin}
                    onChange={(skin) => updateLook({ skin })}
                    variant="swatch"
                  />
                  <ChoiceGroup
                    legend="Hair colour"
                    options={HAIR_COLOURS.map((c) => ({
                      value: c.hex,
                      label: c.label,
                      swatch: c.hex,
                    }))}
                    value={draft.look.hair}
                    onChange={(hair) => updateLook({ hair })}
                    variant="swatch"
                  />
                </div>
                <ChoiceGroup
                  legend="Hair style"
                  options={hairStyleOptions}
                  value={draft.look.hairStyle}
                  onChange={(hairStyle) => updateLook({ hairStyle })}
                  columns={6}
                  note="Or send a photo in the chat — an illustrator matches it by hand."
                />
              </div>
            </div>
          </Reveal>

          {/* ------------------------------ PREVIEW ------------------------- */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-28">
              <Reveal y={24} scale={0.97} className="flex flex-col items-center">
                <div className="flex items-center gap-2 self-start">
                  <Pill tone="verdant">
                    <span
                      aria-hidden="true"
                      className="size-1.5 animate-pulse rounded-full bg-verdant-500"
                    />
                    Live preview
                  </Pill>
                  <Pill tone="outline">Not yet ordered</Pill>
                </div>

                <div
                  className="mt-6 flex w-full justify-center"
                  /* Announce cover changes once, politely — a screen reader user
                     otherwise gets no feedback that their choice did anything. */
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <Book3D draft={draft} width={330} />
                </div>

                {/* Live opening line: the proof that the story is written around
                    them, delivered as an experience instead of a claim. */}
                <div className="card mt-10 w-full max-w-[28rem] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-hairline bg-sunken px-5 py-2.5">
                    <span className="eyebrow !text-[0.65rem]">Page one</span>
                    <span className="text-[0.68rem] font-semibold text-ink-muted">
                      {theme.name}
                    </span>
                  </div>
                  <p className="font-book px-6 py-6 text-[1.05rem] leading-[1.7] first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-book first-letter:text-[3.2rem] first-letter:leading-[0.8] first-letter:font-semibold first-letter:text-gold-600">
                    {opening}
                  </p>
                  <p className="border-t border-hairline bg-sunken px-6 py-3 text-[0.72rem] text-ink-muted">
                    Sample opening · rewritten for age {draft.age}
                  </p>
                </div>

                <div className="mt-8 w-full max-w-[28rem]">
                  <OrderButton
                    intent="preview"
                    block
                    label={
                      isPersonalised ? `Send ${possessive(name)} details` : 'Continue on WhatsApp'
                    }
                    sublabel={
                      isPersonalised
                        ? 'Your five choices travel with you'
                        : 'We will ask the five questions above'
                    }
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
