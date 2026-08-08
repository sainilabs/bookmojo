import { BRAND, GUARANTEE, PRICING, PROOF } from '@/lib/config';
import { formatINR } from '@/lib/utils';
import type { FaqItem } from '@/types';

/**
 * FAQ doubles as the objection-handling layer directly above the final CTA.
 * The first four entries are the questions our own chat transcripts show people
 * asking *before* they will start an order — so they are answered first, in the
 * order they are asked, rather than buried under logistics.
 *
 * Localisation note: the payment and delivery answers carry the questions an
 * Indian buyer actually has — UPI, GST, COD, PIN-code serviceability — rather
 * than translated versions of questions a Western buyer would ask.
 */
export const FAQS: readonly FaqItem[] = [
  {
    group: 'Ordering',
    q: 'Why WhatsApp instead of a normal checkout?',
    a: `Because a personalised book needs a conversation. A web form cannot ask a follow-up question when you upload a photo, spot that a name has an unusual spelling, or notice the book is a birthday gift for Saturday. In chat we can. It also means no account, no password and no forgotten cart — the average order takes about ${PROOF.avgOrderMinutes} minutes, and your receipt stays in a thread you already check twenty times a day.`,
  },
  {
    group: 'Ordering',
    q: 'Do I have to talk to a person?',
    a: `Not unless you want to. The guided assistant handles the whole order and understands typed answers as well as taps. If anything is unusual — a tricky spelling, a tight deadline, a custom dedication — say so and a human from our studio in ${BRAND.studio} picks up the same thread, usually within a couple of minutes during opening hours.`,
  },
  {
    group: 'Ordering',
    q: 'What exactly will you ask me?',
    a: 'Five things: your child’s first name as it should be printed, their age, English or Hindi, the story world, and what they look like (a photo or a few taps). A dedication and the delivery address come after you have approved the preview. That is the entire process.',
  },
  {
    group: 'The book',
    q: 'Can I see the book before I pay?',
    a: 'Always, and this is the part we will not compromise on. We send the finished personalised cover plus two interior spreads into the chat, with your child’s name and character already in place. You can request changes as many times as you like. No money is taken and nothing goes to print until you approve it.',
  },
  {
    group: 'The book',
    q: 'Is the story actually rewritten, or is my child’s name just dropped in?',
    a: 'Rewritten. Each story world is an original manuscript by our authors with branching passages that change according to age band, reading level, character and the details you give us — the plot beats, sentence length and vocabulary all shift. A four-year-old’s Banyan and a nine-year-old’s Banyan are genuinely different books.',
  },
  {
    group: 'The book',
    q: 'Is the Hindi edition translated or written in Hindi?',
    a: 'Written. A Hindi author writes the edition from the same story brief rather than translating the English line by line, because rhyme, rhythm and read-aloud cadence do not survive translation — and a bedtime book lives or dies on how it sounds out loud. It is typeset in Devanagari with proper matra spacing, not a default web font.',
  },
  {
    group: 'The book',
    q: 'How do you match my child’s appearance?',
    a: 'Send a photo and an illustrator matches skin tone, hair colour and style, glasses and hearing aids by hand — we do not run your photo through a generator, and we delete it once the book ships. Prefer not to send one? Choose from six skin tones and six hair styles in the chat and describe the rest.',
  },
  {
    group: 'The book',
    q: 'What is the book physically like?',
    a: `A 210 × 250mm hardcover: 170gsm uncoated FSC® stock, litho-printed in ${BRAND.press} with soy-based inks, foil-stamped title, sewn binding with a linen spine so it opens flat, and a rigid gift box. Ages 2–3 get thicker board pages with rounded corners. It is built to survive a decade of Indian summers and one determined toddler.`,
  },
  {
    group: 'Delivery',
    q: 'How long does it take?',
    a: `${PROOF.productionDays} working days to write, illustrate, proof and print, then ${PROOF.metroDeliveryDays} days to metros and 4–6 days elsewhere. Tracking arrives in the same chat. If you are up against a birthday, tell us the date and we will confirm before you pay whether we can make it.`,
  },
  {
    group: 'Delivery',
    q: 'Do you deliver to my PIN code?',
    a: `We ship to ${PROOF.pincodes} PIN codes across India with tracked courier included in the price, and to ${PROOF.countries} countries for families sending gifts home. If you are unsure, send us your PIN in the chat and we will confirm in seconds before you pay anything.`,
  },
  {
    group: 'Delivery',
    q: 'It is a surprise. Can you time the delivery?',
    a: 'Yes. Tell the chat the date and we will hold the parcel and land it on the morning you choose, in unbranded outer packaging with no pricing anywhere inside. You get a heads-up the day before so nobody opens the door at the wrong moment.',
  },
  {
    group: 'Payment',
    q: 'Is paying through a chat safe?',
    a: 'You never send card or UPI details in a message. The chat sends a one-time encrypted checkout link on our payment provider’s own page, where UPI, cards, net banking and wallets are all accepted. We do not see or store your payment details, and the link expires once used.',
  },
  {
    group: 'Payment',
    q: 'Do you offer cash on delivery?',
    a: 'No, and it is worth explaining why. Every book is written and printed for one child and cannot be resold, so a refused COD parcel is a total loss for us. Instead of pricing that risk into everyone’s book, we keep the price lower and ask for prepayment — after you have seen and approved the actual cover, so you know exactly what you are paying for.',
  },
  {
    group: 'Payment',
    q: 'What does it cost, and what if we do not love it?',
    a: `${formatINR(PRICING.hardcover)} for the hardcover, gift box, GST and tracked delivery — no per-page or per-name surcharges and nothing added at the last step. ${GUARANTEE.headline}: for ${GUARANTEE.window} after delivery, if it is not something you would keep for twenty years we reprint it or refund you, and you keep the first copy either way. A GST invoice comes with every order.`,
  },
];

export const FAQ_GROUPS = ['Ordering', 'The book', 'Delivery', 'Payment'] as const;
