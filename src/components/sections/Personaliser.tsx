import { useEffect, useState } from 'react';
import { Container, Reveal, Section } from '@/components/ui/Layout';
import { ChoiceGroup, NameField, type Choice } from '@/components/ui/Controls';
import { OrderButton } from '@/components/ui/Button';
import { Book3D } from '@/components/art/BookCover';
import { Camera, Check, Lock } from '@/components/art/Icons';
import {
  AGE_BANDS,
  HAIR_COLOURS,
  HAIR_STYLES,
  LANGUAGES,
  SKIN_TONES,
  THEMES,
  THEME_BY_ID,
} from '@/data/catalogue';
import { useDraft } from '@/hooks/useDraft';
import { PRICING } from '@/lib/config';
import { cx, formatINR, formatName, possessive } from '@/lib/utils';
import type { AgeBand, BookFormat, ChildGender, HairId, LanguageCode } from '@/types';

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
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const theme = THEME_BY_ID.get(draft.themeId) ?? THEMES[0]!;
  const name = formatName(draft.childName);

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

  const genderOptions: Array<Choice<ChildGender>> = [
    { value: 'girl', label: 'Girl' },
    { value: 'boy', label: 'Boy' },
  ];

  const formatOptions: Array<Choice<BookFormat>> = [
    {
      value: 'hardcover',
      label: `Hardcover · ${formatINR(PRICING.hardcover)}`,
      hint: '210 × 250mm · gift box',
    },
    {
      value: 'digital',
      label: `Digital · ${formatINR(PRICING.digital)}`,
      hint: 'Delivered to your phone',
    },
  ];

  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview],
  );

  const choosePhoto = (file: File | null) => {
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const opening = theme.opening.replaceAll('{name}', name || 'your child');

  return (
    /* overflow-x-clip, NOT overflow-hidden. `hidden` turns this section into a
       scroll container, which silently breaks the sticky preview column below —
       the book un-sticks, scrolls away, and leaves the right half of the section
       empty. `clip` gives the same horizontal clipping without creating a scroll
       container, so sticky keeps working. */
    <Section
      id="create"
      space="grand"
      className="overflow-x-clip pt-10 sm:pt-12 lg:pt-14"
    >
      <Container>
        <div className="grid items-start gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] 3xl:gap-x-20">
          {/* ------------------------------ PREVIEW ------------------------- */}
          <div className="order-2 lg:order-1 lg:row-span-2">
            <div className="lg:sticky lg:top-28">
              <Reveal y={24} scale={0.97} className="flex flex-col items-center">
                <div className="w-full border-b border-hairline pb-4">
                  <p className="eyebrow eyebrow-green">Book preview</p>
                </div>

                <div
                  className="flex min-h-[31rem] w-full items-center justify-center bg-sunken px-6 py-10 sm:px-10"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <Book3D draft={draft} width={400} />
                </div>

                <div className="card mt-6 w-full overflow-hidden">
                  <div className="flex items-center justify-between border-b border-hairline bg-sunken px-5 py-2.5">
                    <span className="eyebrow !text-[0.65rem]">Inside preview · Page one</span>
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
              </Reveal>
            </div>
          </div>

          {/* -------------------------- PRODUCT DETAILS -------------------- */}
          <Reveal y={18} className="order-1 lg:order-2">
            <p className="eyebrow eyebrow-green">Personalised storybook · Ages 2–12</p>
            <h2 className="mt-3 text-[2rem] leading-tight font-extrabold sm:text-[2.25rem] lg:whitespace-nowrap xl:text-[2.5rem]">
              A storybook made for your child
            </h2>
            <p className="mt-4 max-w-[48ch] text-lead text-ink-soft">
              Add their name, photo and favourite story. Preview every choice before placing your order.
            </p>

            <p className="mt-4 text-base text-red-600">
              Starting from{' '}
              <strong className="font-semibold tracking-wide">
                Rs. {PRICING.digital.toFixed(2)}
              </strong>
            </p>
          </Reveal>

          {/* ------------------------------ CONTROLS ------------------------ */}
          <Reveal y={24} className="order-3 lg:order-3">
            <div className="flex flex-col gap-7">
              <NameField
                label="Child’s First Name For Storybook"
                value={draft.childName}
                onChange={(childName) => update({ childName })}
                placeholder="Aarav, Meera, Ishaan…"
                hint="Exactly as it should be printed."
              />

              <ChoiceGroup
                legend="Child Gender"
                options={genderOptions}
                value={draft.gender}
                onChange={(gender) => update({ gender })}
                columns={2}
              />

              <ChoiceGroup
                legend="Child’s Current Age"
                options={ageOptions}
                value={draft.age}
                onChange={(age) => update({ age })}
                columns={4}
                note={AGE_BANDS.find((b) => b.id === draft.age)?.note}
              />

              <div className="flex flex-col gap-2">
                <p className="text-base font-normal leading-snug text-ink">Upload Child Photo</p>
                <label className="group grid min-h-32 cursor-pointer place-items-center rounded-md border border-dashed border-strong bg-sunken px-5 py-5 text-center transition-colors hover:border-verdant-500 hover:bg-jade-50/50">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="user"
                    className="sr-only"
                    onChange={(event) => choosePhoto(event.target.files?.[0] ?? null)}
                  />
                  {photoPreview ? (
                    <span className="flex items-center gap-4 text-left">
                      <img
                        src={photoPreview}
                        alt="Selected child preview"
                        className="size-20 rounded-md object-cover shadow-e1"
                      />
                      <span>
                        <strong className="block text-small text-ink">{photo?.name}</strong>
                        <span className="mt-1 block text-small text-ink-muted">
                          Tap to choose a different photo
                        </span>
                      </span>
                    </span>
                  ) : (
                    <span>
                      <Camera size={26} className="mx-auto text-verdant-600" aria-hidden />
                      <strong className="mt-2 block text-small text-ink">Choose a clear solo photo</strong>
                      <span className="mt-1 block text-small text-ink-muted">
                        Front-facing, smiling, no sunglasses or cap · JPG, PNG or WebP
                      </span>
                    </span>
                  )}
                </label>
                <p className="flex items-start gap-2 rounded-md bg-jade-50 px-3 py-2.5 text-small text-jade-700 night:bg-jade-900/30 night:text-jade-200">
                  <Lock size={15} className="mt-0.5 shrink-0" aria-hidden />
                  <span>
                    <strong>Privacy protected.</strong> This preview stays on your device. When ordered,
                    photos are used only to create the book and deleted within 7 days of delivery.
                  </span>
                </p>
              </div>

              <div className="border-b border-hairline pt-3 pb-4">
                <p className="text-base font-normal leading-snug text-ink">Book Details</p>
              </div>

              <ChoiceGroup
                legend="Language"
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
                <legend className="mb-2.5 text-base font-normal leading-snug text-ink">
                  Story World (Optional)
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {THEMES.map((option) => {
                    const selected = option.id === draft.themeId;
                    return (
                      <label
                        key={option.id}
                        className={cx(
                          'group relative flex min-h-12 cursor-pointer items-center justify-center rounded-md border px-4 py-3 text-center transition-all duration-200',
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
                        <span className="flex items-center justify-center gap-2 text-[0.95rem] leading-tight">
                          {option.name}
                          {selected && (
                            <Check size={14} className="shrink-0 text-verdant-600" aria-hidden />
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <ChoiceGroup
                legend="Book Format"
                options={formatOptions}
                value={draft.bookFormat}
                onChange={(bookFormat) => update({ bookFormat })}
                columns={2}
                note={
                  draft.bookFormat === 'hardcover'
                    ? 'Gift box, GST and tracked delivery are included.'
                    : 'Upgrade to hardcover later and we deduct the digital edition price.'
                }
              />

              <div className="flex flex-col gap-5">
                <p className="text-base font-normal leading-snug text-ink">
                  Optional · Fine-Tune Their Illustrated Look
                </p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <ChoiceGroup
                    legend="Skin Tone"
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
                    legend="Hair Colour"
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
                  legend="Hair Style"
                  options={hairStyleOptions}
                  value={draft.look.hairStyle}
                  onChange={(hairStyle) => updateLook({ hairStyle })}
                  columns={6}
                  note="Or send a photo in the chat — an illustrator matches it by hand."
                />
              </div>

              <OrderButton
                intent="preview"
                note={photo ? 'I have selected a child photo and will attach it in this chat.' : undefined}
                block
                label={
                  isPersonalised ? `Continue ${possessive(name)} order` : 'Continue order on WhatsApp'
                }
                sublabel="Your selected details will be included"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
