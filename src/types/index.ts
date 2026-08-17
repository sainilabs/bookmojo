export type AgeBand = '2-3' | '4-5' | '6-8' | '9-12';

export type ChildGender = 'girl' | 'boy';

export type BookFormat = 'hardcover' | 'digital';

/**
 * Two languages only.
 *
 * Offering six looked generous and was actually a liability: every language on
 * the list is a promise that a native-speaking author is available, and a
 * six-way choice at the point of purchase is a decision the buyer did not ask
 * for. English and Hindi cover the overwhelming majority of Indian buyers, and
 * a two-option control reads as a confident product rather than a menu.
 */
export type LanguageCode = 'en' | 'hi';

export interface Language {
  code: LanguageCode;
  label: string;
  native: string;
  /** Shown under the option — what the buyer is actually choosing. */
  note: string;
}

export interface StoryTheme {
  id: string;
  name: string;
  /** One-line promise: what the child *feels* by the last page. */
  promise: string;
  /**
   * What the child BECOMES in this story, phrased to complete the sentence
   * "See your child become ___" — so it carries its own article and full stop.
   *
   * It lives on the theme rather than in a list inside the hero on purpose. The
   * hero rotates these, and a hand-maintained list there would eventually
   * advertise a role we have no story for. Tying the role to the manuscript
   * means the claim cannot outlive the product.
   */
  role: string;
  blurb: string;
  /** Ages the manuscript is written for. Drives the age-aware recommendation. */
  ages: AgeBand[];
  /** Cover palette, as three token-independent hexes for the generated art. */
  palette: { base: string; accent: string; deep: string };
  motif: MotifId;
  /** Opening line, with {name} interpolated live in the preview. */
  opening: string;
  popular?: boolean;
}

export type MotifId = 'stars' | 'ocean' | 'forest' | 'city' | 'space' | 'dream';

export type HairId = 'curls' | 'braids' | 'short' | 'long' | 'buzz' | 'patka';

export interface HeroLook {
  skin: string;
  hair: string;
  hairStyle: HairId;
}

/** The visitor's in-progress personalisation. Persisted, never sent anywhere
 *  except into the WhatsApp message they choose to send. */
export interface Draft {
  childName: string;
  gender: ChildGender;
  age: AgeBand;
  language: LanguageCode;
  themeId: string;
  bookFormat: BookFormat;
  look: HeroLook;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
  childName: string;
  rating: 5 | 4;
  /** Which objection this review dismantles. Used to order them for CRO. */
  handles: 'quality' | 'speed' | 'emotion' | 'gifting' | 'ease' | 'language';
}

export interface FaqItem {
  q: string;
  a: string;
  /** Grouping keeps the accordion scannable instead of a 14-item wall. */
  group: 'Ordering' | 'The book' | 'Delivery' | 'Payment';
}
