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
  /** GIFT, not book. A parent's annual book budget for one child is roughly
   *  ₹2,000 (NSS 2025); their gifting budget is not. Sold as a book this is
   *  priced at a year's worth of books. Sold as a gift it is priced normally. */
  tagline: 'The gift where your child is the hero.',
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

/** The strip above the nav. One line, one fact, no dismiss button.
 *  Kept here because it is the most-edited string on the site — seasonal offers,
 *  festive cutoffs, a pause on orders — and none of that should require opening
 *  a component. */
export const ANNOUNCEMENT =
  '70% OFF on personalised storybooks';

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
  /** The printed book is the gift and stays the hero of every price surface.
   *  The digital edition exists to widen the top of the funnel, not to be the
   *  offer: roughly 10–12% of Indian households can spend ₹199 on a whim,
   *  against 2–3% for a ₹1,499 gift. Lead with ₹199 and we sell a PDF. */
  digital: 199,
  giftBoxIncluded: true,
  /** Shipping and GST are inside the price. In a market trained on surprise
   *  delivery charges at the last step, saying so early is a conversion feature. */
  shippingIncluded: true,
  gstIncluded: true,
} as const;

export const GUARANTEE = {
  headline: 'Love it or we reprint it',
  detail: 'Not shelf-worthy? We reprint or refund. You keep the first copy.',
  window: '30 days',
} as const;

/** In-page navigation. Order mirrors the intended scroll narrative. */
export const NAV_LINKS = [
  { id: 'create', label: 'Create yours' },
  { id: 'journey', label: 'How it works' },
  { id: 'themes', label: 'Stories' },
  { id: 'faq', label: 'FAQ' },
] as const;
