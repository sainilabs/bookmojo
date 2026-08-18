import { HowItWorks } from '@/components/sections/HowItWorks';
import { Spreads } from '@/components/sections/Spreads';
import { WhyParents } from '@/components/sections/WhyParents';
import { Craft } from '@/components/sections/Craft';
import { Delivery } from '@/components/sections/Delivery';
import { Testimonials } from '@/components/sections/Testimonials';
import { FinalCta } from '@/components/sections/FinalCta';

/** Deferred page sections kept together for a future longer page composition. */
export function SectionGroup3() {
  return (
    <>
      <HowItWorks />
      <Spreads />
      <WhyParents />
      <Craft />
      <Delivery />
      <Testimonials />
      <FinalCta />
    </>
  );
}