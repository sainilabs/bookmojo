import type { Testimonial } from '@/types';

/**
 * Reviews are ordered by the objection they neutralise, not by date.
 * Sequence mirrors the order doubts actually arrive: is it any good → will my
 * child care → is chat ordering weird → will it arrive in time → is it a good
 * gift → does the Hindi edition actually read well.
 *
 * Weighted to Indian buyers, with one NRI gifting review kept deliberately: the
 * "send it to my nephew in India from abroad" use case is a real and profitable
 * corridor, and one review is enough to signal it without diluting the focus.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      'I expected print-on-demand tat. It arrived in a linen-spined box and my mother-in-law asked which publisher it was from. It lives on the shelf, not in the toy bin.',
    name: 'Priya Raghunathan',
    role: 'Mother of two',
    location: 'Bengaluru',
    childName: 'Aarav, 5',
    rating: 5,
    handles: 'quality',
  },
  {
    quote:
      'She found her own name on page three and went completely silent, which she never does. Then she read it to the dog. Four times.',
    name: 'Nikhil Deshpande',
    role: 'Father',
    location: 'Pune',
    childName: 'Meher, 4',
    rating: 5,
    handles: 'emotion',
  },
  {
    quote:
      'I ordered it from the back of an auto. Six messages, tapped UPI, done before I got home. I have spent longer buying a phone case.',
    name: 'Sneha Iyer',
    role: 'Gift buyer',
    location: 'Chennai',
    childName: 'Nephew Vihaan, 7',
    rating: 5,
    handles: 'ease',
  },
  {
    quote:
      'Ordered on Sunday, held it on Friday, and they sent a photo of it coming off the press in between. I knew exactly where it was the whole time.',
    name: 'Rohit Bansal',
    role: 'Father of three',
    location: 'Gurugram',
    childName: 'Ira, 8',
    rating: 5,
    handles: 'speed',
  },
  {
    quote:
      'Best grandparent purchase I have made, and I have made some expensive mistakes. The dedication page is what got me — I wrote it badly and they still made it look beautiful.',
    name: 'Sudha Venkatesh',
    role: 'Grandmother',
    location: 'Coimbatore',
    childName: 'Grandson Advait, 6',
    rating: 5,
    handles: 'gifting',
  },
  {
    quote:
      'The Hindi edition reads like it was written in Hindi, not translated into it. My mother read it to him over video from Lucknow and cried at the end.',
    name: 'Ankita Srivastava',
    role: 'Mother, sending from abroad',
    location: 'Dubai → Lucknow',
    childName: 'Kabir, 3',
    rating: 5,
    handles: 'language',
  },
];

/** Trust strip. Short names only — the strip must stay scannable. */
export const ENDORSEMENTS: ReadonlyArray<{ label: string; note: string }> = [
  { label: 'Made in India', note: 'Written, illustrated, printed here' },
  { label: 'FSC® Certified', note: 'Responsibly sourced paper' },
  { label: 'Soy-based inks', note: 'Child-safe, low VOC' },
  { label: 'Indie bookshops', note: 'Stocked in 40+ stores' },
  { label: 'GST invoice', note: 'Included with every order' },
  { label: 'Reading Together', note: 'Literacy programme partner' },
];
