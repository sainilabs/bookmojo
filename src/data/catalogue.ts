import type { AgeBand, HairId, Language, StoryTheme } from '@/types';

export const AGE_BANDS: ReadonlyArray<{ id: AgeBand; label: string; note: string }> = [
  { id: '2-3', label: '2–3', note: 'Board-thick pages, 12 spreads' },
  { id: '4-5', label: '4–5', note: 'Read-aloud rhythm, 16 spreads' },
  { id: '6-8', label: '6–8', note: 'First solo read, 20 spreads' },
  { id: '9-12', label: '9–12', note: 'Chaptered, 24 spreads' },
];

/**
 * English is the default rather than Hindi, which is a deliberate call and not
 * an oversight: our buyer is an urban Indian parent or gift-buyer aged 25–45
 * transacting online, and that cohort reads product pages in English. Hindi is
 * given equal visual weight as the second option because a large share of those
 * same buyers want the BOOK in Hindi even when they shop in English — the
 * language of the purchase and the language of the bedtime story are different
 * decisions, and the UI should not conflate them.
 */
export const LANGUAGES: readonly Language[] = [
  { code: 'en', label: 'English', native: 'English', note: 'Indian English spellings' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', note: 'Devanagari, written not translated' },
];

/**
 * Character options.
 *
 * Six skin tones and six hair styles is a deliberate floor, not a ceiling.
 * Personalised-book buyers abandon at the character step when their child is
 * not representable — inclusive defaults are a conversion feature before they
 * are anything else. Tones are spaced across the Fitzpatrick range rather than
 * clustered, so every child lands near a good match.
 */
/**
 * Skin tone labels are worth care in an Indian context.
 *
 * "Porcelain" makes a European tone the neutral reference point. "Wheatish" is
 * the opposite problem — it carries the whole weight of matrimonial-advert
 * colourism, and no parent should meet that word while choosing how their child
 * will be drawn. So every option is named after a warm material, with no implied
 * ladder from best to worst.
 */
export const SKIN_TONES: ReadonlyArray<{ id: string; hex: string; label: string }> = [
  { id: 's1', hex: '#F7D9BE', label: 'Ivory' },
  { id: 's2', hex: '#EFC08F', label: 'Sand' },
  { id: 's3', hex: '#D9975F', label: 'Honey' },
  { id: 's4', hex: '#B3703C', label: 'Amber' },
  { id: 's5', hex: '#8A4E28', label: 'Chestnut' },
  { id: 's6', hex: '#5C3018', label: 'Cocoa' },
];

export const HAIR_COLOURS: ReadonlyArray<{ id: string; hex: string; label: string }> = [
  { id: 'h1', hex: '#1E1A18', label: 'Ink black' },
  { id: 'h2', hex: '#4A2C1C', label: 'Chocolate' },
  { id: 'h3', hex: '#8A5A2B', label: 'Chestnut' },
  { id: 'h4', hex: '#C98A3E', label: 'Honey blonde' },
  { id: 'h5', hex: '#B44A2A', label: 'Copper' },
  { id: 'h6', hex: '#8C8C97', label: 'Silver' },
];

/**
 * "Head wrap" was replaced by "Patka" — the cloth tied over a joora that Sikh
 * boys wear. A personalisation flow that cannot draw a Sikh child is broken for
 * a meaningful share of Indian families, and it fails at the exact step where
 * they were deciding to trust us. Two plaits are named as such rather than
 * "braids", which is not what anyone here calls them.
 */
export const HAIR_STYLES: ReadonlyArray<{ id: HairId; label: string }> = [
  { id: 'curls', label: 'Curls' },
  { id: 'braids', label: 'Two plaits' },
  { id: 'short', label: 'Short' },
  { id: 'long', label: 'Long' },
  { id: 'buzz', label: 'Buzz cut' },
  { id: 'patka', label: 'Patka' },
];

/**
 * Story worlds.
 *
 * Each theme leads with a PROMISE (how the child feels on the last page) rather
 * than a plot summary. Parents buy the emotional outcome; the plot is only
 * evidence that the outcome is credible.
 */
/**
 * SIX STORY WORLDS, SET WHERE THE CHILD ACTUALLY LIVES.
 *
 * The earlier set — a wood called Whisperwood, a museum with a curator, a
 * skyline of pigeons — was competently written and completely foreign. An Indian
 * seven-year-old does not walk past that wood on the way to school. The single
 * most valuable thing a personalised book can do is put the child somewhere they
 * recognise, so the specifics here are deliberate and local: a summer terrace and
 * a charpai, backwaters the colour of strong tea, the banyan at the end of the
 * lane, a local train that has never been late, a launch pad on the Bay of
 * Bengal, a workshop down a gali behind the clock tower.
 *
 * These are original stories drawn from ordinary Indian life rather than
 * retellings of mythology. That is a choice: myth is already well served, it
 * carries religious specificity that would exclude some families, and a child
 * finds it far stranger to be written into the Mahabharata than onto their own
 * roof.
 *
 * Palettes moved with them — indigo, haldi, terracotta, brass, peacock — instead
 * of the cooler European storybook range they started in.
 */
export const THEMES: readonly StoryTheme[] = [
  {
    id: 'chandni',
    name: 'The Night the Terrace Grew Stars',
    promise: 'For the child who does not want the day to end',
    blurb:
      'A hot April night on the terrace, a charpai still warm from the afternoon, and a sky that turns out to have been keeping count of everyone who has ever been loved.',
    ages: ['2-3', '4-5'],
    palette: { base: '#2E3A70', accent: '#F0C060', deep: '#161E44' },
    motif: 'stars',
    opening:
      'Everyone else had gone down for the night, but {name} stayed up on the terrace — because somebody had to count the stars, and tonight it was {name}’s turn.',
    popular: true,
  },
  {
    id: 'backwater',
    name: 'The Temple Under the Backwaters',
    promise: 'For the child who asks one more question about everything',
    blurb:
      'Past the fourth bend of the canal, under water the colour of strong tea, there is a temple that has been waiting four hundred years for somebody who is not afraid of the dark.',
    ages: ['4-5', '6-8'],
    palette: { base: '#0E5A57', accent: '#E8A54A', deep: '#06322F' },
    motif: 'ocean',
    opening:
      'The backwaters had kept one secret for four hundred years, and they chose a Tuesday — and {name} — to finally tell it.',
  },
  {
    id: 'banyan',
    name: 'The Banyan That Remembered Everything',
    promise: 'For the child learning that brave is not the same as unafraid',
    blurb:
      'The old banyan at the end of the lane has been listening for two hundred years. What it finally says out loud is small, and kind, and exactly what they needed to hear.',
    ages: ['4-5', '6-8'],
    palette: { base: '#2F6146', accent: '#E5B33C', deep: '#163720' },
    motif: 'forest',
    opening:
      '{name} was not the tallest thing standing under the banyan, or the fastest, or the loudest. {name} was simply the one who walked in.',
    popular: true,
  },
  {
    id: 'local',
    name: 'The Morning the 7:04 Was Late',
    promise: 'For the child who fixes things nobody asked them to fix',
    blurb:
      'The local has not been late in ninety years. This morning it is eleven minutes behind, the crows have strong opinions about it, and the only person who has noticed is nine years old.',
    ages: ['6-8', '9-12'],
    palette: { base: '#A6402C', accent: '#F3D08A', deep: '#5E2118' },
    motif: 'city',
    opening:
      'At 7:15 in the morning, eleven minutes later than it had been for ninety years, {name} was the only person on the platform who looked up.',
  },
  {
    id: 'sriharikota',
    name: 'Nine Moons Past Sriharikota',
    promise: 'For the child who wants to know what is past the last page',
    blurb:
      'A one-seat expedition from a launch pad on the Bay of Bengal, a stowaway who eats star charts, and a decision that only a child would be brave enough to make.',
    ages: ['6-8', '9-12'],
    palette: { base: '#362A6B', accent: '#6FD3D9', deep: '#1B1244' },
    motif: 'space',
    opening:
      'Mission control had exactly one instruction for {name}, and {name} had already decided not to follow it.',
  },
  {
    id: 'karkhana',
    name: 'The Workshop of Almost',
    promise: 'For the child who is quietly making something',
    blurb:
      'Down a gali behind the clock tower is a workshop holding every idea the world nearly had. The last shelf is empty, and there is a small brass plate on it with their name already engraved.',
    ages: ['9-12'],
    palette: { base: '#6B2F4E', accent: '#F0AE8A', deep: '#3A1428' },
    motif: 'dream',
    opening:
      'The old man in the workshop had been waiting for {name} for a very long time, which was strange, because {name} had never told anybody about the idea.',
  },
];

export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));

/** Age-aware recommendation used by the personaliser to nudge, never to block. */
export function recommendedThemes(age: AgeBand): readonly StoryTheme[] {
  return THEMES.filter((t) => t.ages.includes(age));
}
