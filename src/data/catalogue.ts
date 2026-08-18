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
 * Nine original Indian career adventures. Each profession is experienced
 * through a real story problem in a recognisable place, rather than presented
 * as a costume or career poster. Stable IDs preserve saved customer drafts.
 */
export const THEMES: readonly StoryTheme[] = [
  {
    id: 'lane-four',
    name: 'Little Police Officer',
    promise: 'An Indian police adventure about courage, clues and helping others',
    blurb:
      'At a busy Jaipur mela, a child becomes the youngest police officer on duty and follows a trail of tiny clues to reunite a lost visitor with their family.',
    ages: ['4-5', '6-8'],
    palette: { base: '#2B4468', accent: '#E8C170', deep: '#152438' },
    motif: 'city',
    opening:
      'The Jaipur mela was full of music and colour, but {name} was the first to notice the small handprint beside the police tent.',
    role: 'a police officer.',
    popular: true,
  },
  {
    id: 'gulmohar',
    name: 'Little Doctor',
    promise: 'A caring doctor story set in a warm Indian neighbourhood',
    blurb:
      'When the neighbourhood clinic becomes busy after the first monsoon rain, one young doctor listens carefully, helps every patient and discovers what kindness can heal.',
    ages: ['2-3', '4-5'],
    palette: { base: '#1F6B63', accent: '#F4C9B0', deep: '#0D3A35' },
    motif: 'forest',
    opening:
      'The first patient at Gulmohar Clinic arrived before breakfast, and Doctor {name} was already waiting with a bright red stethoscope.',
    role: 'a doctor.',
    popular: true,
  },
  {
    id: 'nala-bridge',
    name: 'Little Engineer',
    promise: 'An Indian engineering adventure about building a safer way home',
    blurb:
      'Heavy monsoon rain has damaged the village footbridge. With careful measurements, a clever design and help from the community, a young engineer builds a stronger crossing.',
    ages: ['6-8', '9-12'],
    palette: { base: '#8A4A22', accent: '#F0D08A', deep: '#4A2410' },
    motif: 'dream',
    opening:
      'The monsoon river was rising, and {name} had one notebook, three bamboo poles and the beginning of a very good engineering plan.',
    role: 'an engineer.',
  },
  {
    id: 'chandni',
    name: 'Little Scientist',
    promise: 'A joyful Indian science story filled with questions and experiments',
    role: 'a scientist.',
    blurb:
      'On a sunny terrace, a young scientist turns everyday Indian objects into a weather station and solves the mystery of why the evening rain keeps arriving early.',
    ages: ['2-3', '4-5'],
    palette: { base: '#2E3A70', accent: '#F0C060', deep: '#161E44' },
    motif: 'stars',
    opening:
      'By eight in the morning, Scientist {name} had made a rain gauge from a steel tumbler and asked seven questions nobody else had thought to ask.',
    popular: true,
  },
  {
    id: 'backwater',
    name: 'Little Archaeologist',
    promise: 'An Indian history adventure about discovering and protecting the past',
    role: 'an archaeologist.',
    blurb:
      'A forgotten map leads through Hampi’s stone pathways to a hidden stepwell. Its carvings hold a message that only a patient young archaeologist can understand.',
    ages: ['4-5', '6-8'],
    palette: { base: '#0E5A57', accent: '#E8A54A', deep: '#06322F' },
    motif: 'dream',
    opening:
      'The map in Hampi had one mark nobody could explain, until {name} turned it towards the morning sun and saw a staircase appear.',
  },
  {
    id: 'banyan',
    name: 'Little Forest Officer',
    promise: 'An Indian wildlife story about protecting animals and their home',
    role: 'a forest officer.',
    blurb:
      'A frightened langur is stranded near an old banyan as a summer storm approaches. A young forest officer must read the tracks and guide it safely home.',
    ages: ['4-5', '6-8'],
    palette: { base: '#2F6146', accent: '#E5B33C', deep: '#163720' },
    motif: 'forest',
    opening:
      'Forest Officer {name} found the first pawprint beside the banyan just as the wind began to bend its highest branches.',
    popular: true,
  },
  {
    id: 'sriharikota',
    name: 'Little Astronaut',
    promise: 'An Indian space mission beyond the Moon and back again',
    role: 'an astronaut.',
    blurb:
      'From India’s spaceport at Sriharikota, a young astronaut launches on a daring mission to repair a research satellite and bring its discovery safely home.',
    ages: ['6-8', '9-12'],
    palette: { base: '#362A6B', accent: '#6FD3D9', deep: '#1B1244' },
    motif: 'space',
    opening:
      'Mission control counted down in three languages, and Astronaut {name} smiled as the rocket rose above the Bay of Bengal.',
  },
  {
    id: 'karkhana',
    name: 'Little Inventor',
    promise: 'An Indian invention story about imagination, failure and trying again',
    role: 'an inventor.',
    blurb:
      'Inside a tiny Chandni Chowk workshop, a young inventor builds a machine that can cool the whole lane without electricity and learns why the best ideas need many attempts.',
    ages: ['9-12'],
    palette: { base: '#6B2F4E', accent: '#F0AE8A', deep: '#3A1428' },
    motif: 'dream',
    opening:
      'By lunchtime, Inventor {name} had collected two bicycle wheels, one broken fan and exactly enough courage to test the idea again.',
  },
];

export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));

/** Age-aware recommendation used by the personaliser to nudge, never to block. */
export function recommendedThemes(age: AgeBand): readonly StoryTheme[] {
  return THEMES.filter((t) => t.ages.includes(age));
}
