import { DraftProvider } from '@/hooks/useDraft';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StickyCta } from '@/components/layout/StickyCta';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { Personaliser } from '@/components/sections/Personaliser';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Journey } from '@/components/sections/Journey';
import { Themes } from '@/components/sections/Themes';
import { Spreads } from '@/components/sections/Spreads';
import { WhyParents } from '@/components/sections/WhyParents';
import { Craft } from '@/components/sections/Craft';
import { Delivery } from '@/components/sections/Delivery';
import { Testimonials } from '@/components/sections/Testimonials';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';

/**
 * PAGE COMPOSITION
 * -----------------------------------------------------------------------------
 * The section order is the argument, and it follows the emotional sequence the
 * brief set out: curiosity → imagination → trust → excitement → confidence →
 * purchase.
 *
 *   Hero          curiosity. A promise about their child, and one input.
 *   ProofBar      "who are you?" answered before the first doubt hardens.
 *   Personaliser  imagination. They build the artefact and own it.
 *   HowItWorks    the mechanism, in four honest steps.
 *   Journey       trust. The entire purchase replayed, including payment.
 *   Themes        excitement. Their child, nine times over.
 *   Spreads       the interior — is the writing and printing any good?
 *   WhyParents    why it works on a child, argued not asserted.
 *   Craft         materials and specifications. Kills "print-on-demand tat".
 *   Delivery      the gap between paying and holding.
 *   Testimonials  other people already took this risk.
 *   Faq           last objections, cleared immediately before the ask.
 *   FinalCta      confidence → purchase. Price stated plainly, one action.
 *
 * Proof is deliberately distributed rather than pooled in one testimonial block:
 * each section carries the evidence for its own claim, where the doubt occurs.
 *
 * Surface tones alternate (paper → sunken → inverse) to give a long page a
 * detectable pulse, with the two inverse sections landing on the two moments
 * that need total attention: the WhatsApp journey and the close.
 */
export default function App() {
  return (
    <DraftProvider>
      <Navbar />

      {/* pb on mobile clears the floating bar so nothing is ever trapped under it. */}
      <main id="main" className="pb-20 sm:pb-0">
        <Hero />
        <ProofBar />
        <Personaliser />
        <HowItWorks />
        <Journey />
        <Themes />
        <Spreads />
        <WhyParents />
        <Craft />
        <Delivery />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <StickyCta />
    </DraftProvider>
  );
}
