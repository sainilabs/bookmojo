/**
 * INTERIOR SPREADS
 * -----------------------------------------------------------------------------
 * Four spreads, chosen to answer four different doubts:
 *   1. Does the dedication page look cheap?      → the gift objection
 *   2. Is the writing any good?                  → the quality objection
 *   3. Is the personalisation more than a name?  → the "gimmick" objection
 *   4. Does it end well?                         → the emotional payoff
 *
 * Text is authored with {name} placeholders so the sample the visitor reads is
 * about their own child. A generic sample page is a wasted opportunity: it asks
 * the reader to do the imaginative work the product is supposed to do for them.
 */
export interface Spread {
  id: string;
  /** Folio label printed in the gutter, as on a real page. */
  folio: string;
  /** What this spread is proving to the buyer. */
  role: string;
  heading?: string;
  paragraphs: string[];
  /** Vertical placement of the illustrated figure, as a % of the page. */
  figure: 'centre' | 'low' | 'high' | 'none';
  caption: string;
}

export const SPREADS: readonly Spread[] = [
  {
    id: 'dedication',
    folio: 'i',
    role: 'The dedication page',
    paragraphs: [
      'For {name},',
      'who asks the best questions and never accepts the first answer.',
      'Love, Mumma & Papa',
    ],
    figure: 'none',
    caption:
      'Set by hand in the story’s own typeface. This is the page dadi photographs.',
  },
  {
    id: 'opening',
    folio: '3',
    role: 'How it is written',
    heading: 'Chapter one',
    paragraphs: [
      'Everyone else had gone down for the night, but {name} stayed up on the terrace — because somebody had to count the stars, and tonight it was {name}’s turn.',
      'The trouble with counting stars is that they move. Not quickly. Not so you would notice. But by the time you reach four hundred, the ones you started with have quietly shuffled along, and you have to begin again.',
      '{name} did not mind beginning again. {name} had the whole night, and a charpai still warm from the afternoon.',
    ],
    figure: 'high',
    caption:
      'Sentence length, vocabulary and page count all shift with their age band.',
  },
  {
    id: 'personal',
    folio: '11',
    role: 'Personalisation beyond the name',
    heading: 'The four hundred and first',
    paragraphs: [
      'The four hundred and first star was not where it should have been. It was lower. Closer. And it was, {name} noticed, exactly the colour of the lamp Nani leaves burning beside the door all night.',
      '“Oh,” said {name}, out loud, to nobody at all. “Oh, I see.”',
    ],
    figure: 'centre',
    caption:
      'Their looks, age, language and the details you mention are woven through the whole book.',
  },
  {
    id: 'ending',
    folio: '31',
    role: 'The last page',
    paragraphs: [
      'And every single one of them, all four hundred and one, was a light somebody had left burning for {name}.',
      'So sleep now, {name}. The counting can wait.',
    ],
    figure: 'low',
    caption:
      'Every story lands on the same feeling: you are known, and you are loved.',
  },
];
