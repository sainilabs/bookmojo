import { DraftProvider } from '@/hooks/useDraft';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StickyCta } from '@/components/layout/StickyCta';
import { Hero } from '@/components/sections/Hero';
import { Personaliser } from '@/components/sections/Personaliser';
import { Journey } from '@/components/sections/Journey';
import { Themes } from '@/components/sections/Themes';
import { Faq } from '@/components/sections/Faq';

/**
 * PAGE COMPOSITION
 * -----------------------------------------------------------------------------
 * The active page is intentionally short: create the book, watch the ordering
 * journey, choose a world, then clear final questions. Deferred sections are
 * preserved in SectionGroup3.tsx for a future longer version of the page.
 */
export default function App() {
  return (
    <DraftProvider>
      <Navbar />

      {/* pb on mobile clears the floating bar so nothing is ever trapped under it. */}
      <main id="main" className="pb-20 sm:pb-0">
        <Hero />
        <Personaliser />
        <Journey />
        <Themes />
        <Faq />
      </main>

      <Footer />
      <StickyCta />
    </DraftProvider>
  );
}
