import { BRAND, GUARANTEE, PRICING, PROOF } from '@/lib/config';
import { formatINR } from '@/lib/utils';
import type { FaqItem } from '@/types';

/**
 * FAQ doubles as the objection-handling layer directly above the final CTA.
 * The first entries are the questions our own chat transcripts show people
 * asking *before* they will start an order.
 *
 * Answers are held to two or three sentences. An FAQ is scanned, not read — a
 * five-sentence answer reads as defensive, and the detail that matters gets
 * buried in the middle of it. Anything longer than this belongs in a
 * conversation, which is the whole point of the business.
 */
export const FAQS: readonly FaqItem[] = [
  {
    group: 'Ordering',
    q: 'Why WhatsApp instead of a normal checkout?',
    a: `Because a personalised book needs a conversation. A form cannot ask a follow-up when a name has an unusual spelling or the gift is for Saturday. No account, no cart — about ${PROOF.avgOrderMinutes} minutes, and the receipt stays in a thread you already check.`,
  },
  {
    group: 'Ordering',
    q: 'Do I have to talk to a person?',
    a: `Not unless you want to. The assistant handles the whole order and understands typing as well as taps. For anything unusual, a human from our ${BRAND.studio} studio picks up the same thread.`,
  },
  {
    group: 'Ordering',
    q: 'What exactly will you ask me?',
    a: 'Five things: their first name, age, English or Hindi, the story world, and what they look like. Dedication and address come after you approve the preview.',
  },
  {
    group: 'The book',
    q: 'Can I see the book before I pay?',
    a: 'Always. We send the finished cover and two interior spreads into the chat, with your child already in them. Change anything as often as you like — nothing is charged or printed until you approve it.',
  },
  {
    group: 'The book',
    q: 'Is the story rewritten, or is the name just dropped in?',
    a: 'Rewritten. Plot beats, sentence length and vocabulary all shift with age band, reading level and the details you give us. A four-year-old’s Banyan and a nine-year-old’s Banyan are different books.',
  },
  {
    group: 'The book',
    q: 'Is the Hindi edition translated or written in Hindi?',
    a: 'Written. A Hindi author works from the same story brief, because rhyme and read-aloud cadence do not survive translation. Typeset in Devanagari with proper matra spacing.',
  },
  {
    group: 'The book',
    q: 'How do you match my child’s appearance?',
    a: 'An illustrator matches skin tone, hair, glasses, hearing aids and a patka by hand from your photo — no generator, and we delete the photo once it ships. Or pick from the options in the chat.',
  },
  {
    group: 'The book',
    q: 'What is the book physically like?',
    a: `A 210 × 250mm hardcover on 170gsm uncoated FSC® stock, litho-printed in ${BRAND.press}, foil-stamped, sewn with a linen spine so it opens flat, in a rigid gift box. Ages 2–3 get board pages with rounded corners.`,
  },
  {
    group: 'Delivery',
    q: 'How long does it take?',
    a: `${PROOF.productionDays} working days to make, then ${PROOF.metroDeliveryDays} days to metros and 4–6 elsewhere. Up against a birthday? Tell us the date and we confirm before you pay.`,
  },
  {
    group: 'Delivery',
    q: 'Do you deliver to my PIN code?',
    a: `${PROOF.pincodes} PIN codes across India, plus ${PROOF.countries} countries for gifts sent home. Send us your PIN and we confirm in seconds.`,
  },
  {
    group: 'Delivery',
    q: 'It is a surprise. Can you time the delivery?',
    a: 'Yes. Name the date and we hold the parcel, then land it that morning — unbranded outer packaging, no pricing inside, and a heads-up to you the day before.',
  },
  {
    group: 'Payment',
    q: 'Is paying through a chat safe?',
    a: 'You never send payment details in a message. The chat sends a one-time link to our payment provider’s own page for UPI, cards, net banking or wallets. We never see or store your details.',
  },
  {
    group: 'Payment',
    q: 'Do you offer cash on delivery?',
    a: 'No, and here is why: every book is made for one child and cannot be resold, so a refused parcel is a total loss. Rather than price that into everyone’s book, we ask for prepayment — after you have approved the cover.',
  },
  {
    group: 'Payment',
    q: 'What does it cost, and what if we do not love it?',
    a: `${formatINR(PRICING.hardcover)} for the hardcover, including the gift box, GST and tracked delivery. Nothing is added at the last step. There is also a ${formatINR(PRICING.digital)} digital edition — the same story, sent to your phone — and what you pay for it comes off the printed book if you upgrade. ${GUARANTEE.headline}, for ${GUARANTEE.window} after delivery.`,
  },
];

export const FAQ_GROUPS = ['Ordering', 'The book', 'Delivery', 'Payment'] as const;
