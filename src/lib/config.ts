/**
 * Single source of truth for brand facts, commercial claims and channel wiring.
 *
 * Anything a marketer or founder might want to change without touching a
 * component lives here. Claims are typed so a number can never silently drift
 * out of sync between the hero, the proof bar and the footer — inconsistent
 * social proof is one of the fastest ways to lose a buyer's trust.
 *
 * MARKET: India. Every number, place and payment rail below is chosen for an
 * Indian buyer, because a page that quotes dollars, names a London courier and
 * puts Apple Pay first tells that buyer the product was not built for them.
 */

export const BRAND = {
  name: 'BookMojo',
  tagline: 'Your child, the hero of their own book.',
  /** E.164, digits only — required format for wa.me deep links. */
  whatsappNumber: '919876543210',
  whatsappDisplay: '+91 98765 43210',
  email: 'hello@bookmojo.in',
  supportHours: 'Replies in ~2 min, 9am–11pm IST',
  /** Sivakasi is India's offset children's-book printing centre; naming the town
   *  is a credibility signal to anyone in publishing and harmless to everyone
   *  else. Vague "made with love" copy earns nothing. */
  studio: 'Bengaluru',
  press: 'Sivakasi, Tamil Nadu',
} as const;

export const PROOF = {
  booksDelivered: 41_820,
  booksDeliveredLabel: '41,800+',
  rating: 4.9,
  reviewCount: 2148,
  /** Reach stated the way an Indian buyer checks it: does it come to my PIN? */
  pincodes: '19,000+',
  /** Kept small and secondary — the NRI gifting corridor is real revenue but
   *  it is not the headline for this market. */
  countries: 14,
  repeatBuyerRate: 0.38,
  avgOrderMinutes: 4,
  productionDays: '5–7',
  metroDeliveryDays: '2–3',
} as const;

export const PRICING = {
  currency: 'INR',
  symbol: '₹',
  hardcover: 1499,
  hardcoverCompare: 1999,
  giftBoxIncluded: true,
  /** Shipping and GST are inside the price. In a market trained on surprise
   *  delivery charges at the last step, saying so early is a conversion feature. */
  shippingIncluded: true,
  gstIncluded: true,
} as const;

export const GUARANTEE = {
  headline: 'Love it or we reprint it',
  detail:
    "If the book that arrives isn't something you'd keep on the shelf for twenty years, we reprint or refund it. You keep the first copy either way.",
  window: '30 days',
} as const;

/** In-page navigation. Order mirrors the intended scroll narrative. */
export const NAV_LINKS = [
  { id: 'create', label: 'Create yours' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'themes', label: 'Stories' },
  { id: 'craft', label: 'The craft' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
] as const;
