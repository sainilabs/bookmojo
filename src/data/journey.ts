import { LANGUAGES, THEME_BY_ID } from './catalogue';
import { PRICING, PROOF } from '@/lib/config';
import { formatINR, formatName, possessive } from '@/lib/utils';
import type { Draft } from '@/types';

/**
 * THE WHATSAPP ORDERING SCRIPT
 * -----------------------------------------------------------------------------
 * This is not decoration. It is a disclosure device.
 *
 * The single largest objection to "order over WhatsApp" is uncertainty about
 * what happens after the click: how many questions, how long, and — the real
 * fear — how payment works in a chat window. So the page replays the actual
 * conversation, stage by stage, with the visitor's own personalisation
 * substituted in, and it names the number of questions up front.
 *
 * Messages are authored as data so copy can be tuned by the growth team and
 * kept in lockstep with the live automation without touching a component.
 */

export type Msg =
  | { kind: 'in'; text: string }
  | { kind: 'out'; text: string }
  | { kind: 'chips'; label: string; options: string[]; chosen: number }
  | { kind: 'summary'; rows: Array<[string, string]>; total: string }
  | { kind: 'payment'; total: string; methods: string[] }
  | { kind: 'receipt'; id: string; total: string }
  | { kind: 'tracker'; steps: Array<{ label: string; state: 'done' | 'active' | 'todo' }> }
  | { kind: 'shipment'; courier: string; code: string; eta: string };

export interface Stage {
  id: string;
  /** Rail label — short enough for a mobile step indicator. */
  label: string;
  title: string;
  /** The reassurance this stage is responsible for delivering. */
  reassurance: string;
  /** Honest time cost. Naming it removes the "this will take forever" fear. */
  eta: string;
  /** 'you' = visitor is answering, 'us' = BookMojo is working. */
  actor: 'you' | 'us';
  messages: Msg[];
}

export function buildJourney(draft: Draft): Stage[] {
  const name = formatName(draft.childName) || 'Aarav';
  const theme = THEME_BY_ID.get(draft.themeId);
  const themeName = theme?.name ?? 'The Night the Terrace Grew Stars';
  const language = LANGUAGES.find((l) => l.code === draft.language)?.label ?? 'English';
  const total = formatINR(PRICING.hardcover);

  return [
    {
      id: 'details',
      label: 'Details',
      title: 'Five questions. That is the whole form.',
      reassurance: 'No account, no password. Type or tap the suggested replies.',
      eta: '~90 seconds',
      actor: 'you',
      messages: [
        {
          kind: 'in',
          text: `Hello. I’ll build the book with you right here. Five quick questions — type a reply or tap an option.\n\n1. What is your child’s first name, exactly as it should be printed?`,
        },
        { kind: 'out', text: name },
        {
          kind: 'in',
          text: `${name}. Lovely. 2. How old is ${name}? This sets the reading level and page count.`,
        },
        {
          kind: 'chips',
          label: 'Age',
          options: ['2–3', '4–5', '6–8', '9–12'],
          chosen: ['2-3', '4-5', '6-8', '9-12'].indexOf(draft.age),
        },
        { kind: 'in', text: '3. Should the book be printed in English or Hindi?' },
        {
          kind: 'chips',
          label: 'Language',
          options: ['English', 'हिन्दी'],
          chosen: Math.max(0, ['English', 'Hindi'].indexOf(language)),
        },
      ],
    },
    {
      id: 'story',
      label: 'Story',
      title: 'Choose the world. We handle the writing.',
      reassurance: 'Each world is a real manuscript, rewritten around your answers.',
      eta: '~60 seconds',
      actor: 'you',
      messages: [
        {
          kind: 'in',
          text: `4. Here are the three stories that fit ${name} best. I’ve sent a sample page for each.`,
        },
        {
          kind: 'chips',
          label: 'Story world',
          options: [themeName, 'The Banyan That Remembered', 'Nine Moons Past Sriharikota'],
          chosen: 0,
        },
        {
          kind: 'in',
          text: `5. Last one — what does ${name} look like? Send a photo and I’ll match skin tone, hair and glasses, or pick from the illustrated options.`,
        },
        { kind: 'out', text: 'photo.jpg attached' },
        {
          kind: 'in',
          text: `Got it — matched. Want to add a private dedication on the first page? This is optional, and you can skip it.`,
        },
        {
          kind: 'out',
          text: `For ${name}, who asks the best questions. Love, Mumma & Papa`,
        },
      ],
    },
    {
      id: 'review',
      label: 'Review',
      title: 'See it before you pay.',
      reassurance:
        'The real cover plus two spreads. Change anything. Nothing is charged until you approve.',
      eta: 'Instant',
      actor: 'us',
      messages: [
        { kind: 'in', text: `Here is ${possessive(name)} book. Have a look before anything else.` },
        {
          kind: 'summary',
          rows: [
            ['Hero', name],
            ['Age / reading level', `${draft.age} years`],
            ['Story', themeName],
            ['Language', language],
            ['Format', 'Hardcover · linen spine · gift box'],
          ],
          total,
        },
        {
          kind: 'in',
          text: 'Approve it, or tell me what to change — spelling, story, hair colour, anything.',
        },
        { kind: 'out', text: 'Approved. It’s perfect.' },
      ],
    },
    {
      id: 'payment',
      label: 'Payment',
      title: 'Paid on a secure page, not in the chat.',
      reassurance: 'A one-time encrypted link. Payment details never appear in a message.',
      eta: '~40 seconds',
      actor: 'you',
      messages: [
        {
          kind: 'in',
          text: 'Where should we deliver it? Address, city, PIN code — one message is fine.',
        },
        { kind: 'out', text: 'B-402, Ashoka Residency, Koramangala 5th Block, Bengaluru 560095' },
        {
          /* UPI first, and not as a token gesture: it is how most of this market
             actually pays. Leading with Apple Pay would signal that the page was
             built for somewhere else and localised afterwards. */
          kind: 'payment',
          total,
          methods: ['UPI', 'Card', 'Net banking', 'Wallets'],
        },
        {
          kind: 'in',
          text: 'Secure one-time payment link. Nothing is stored in this chat. GST and tracked delivery are already in the price.',
        },
      ],
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      title: 'A receipt you can find again.',
      reassurance: 'It lives in a thread you already check. No hunting through email.',
      eta: 'Instant',
      actor: 'us',
      messages: [
        { kind: 'receipt', id: 'BM-8241', total },
        {
          kind: 'in',
          text: `Payment received — thank you. ${possessive(name)} book is going to our studio now. I’ll message you at every stage, and you can reply here any time.`,
        },
      ],
    },
    {
      id: 'production',
      label: 'Made',
      title: 'Watch it being made.',
      reassurance: 'Illustrated, proofed by a human, printed. You get a photo off the press.',
      eta: `${PROOF.productionDays} days`,
      actor: 'us',
      messages: [
        {
          kind: 'tracker',
          steps: [
            { label: 'Manuscript personalised', state: 'done' },
            { label: 'Illustrations matched', state: 'done' },
            { label: 'Proofread by an editor', state: 'done' },
            { label: 'Printing · litho, 170gsm', state: 'active' },
            { label: 'Foiling & hardcover binding', state: 'todo' },
          ],
        },
        {
          kind: 'in',
          text: 'Off the press this morning. Here is the finished book before the gift box goes on.',
        },
      ],
    },
    {
      id: 'delivery',
      label: 'Delivered',
      title: 'Tracked to the door.',
      reassurance: 'Live tracking in the same thread, and a heads-up the day before.',
      eta: `${PROOF.metroDeliveryDays} days`,
      actor: 'us',
      messages: [
        { kind: 'shipment', courier: 'Blue Dart', code: 'BM8241KA', eta: 'Tomorrow, before 1pm' },
        {
          kind: 'in',
          text: `Out for delivery. If it’s a surprise, I can hold it for a date you choose — just say the word.`,
        },
        { kind: 'out', text: 'She has not put it down. Thank you.' },
      ],
    },
  ];
}
