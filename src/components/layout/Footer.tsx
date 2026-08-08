import { Container } from '@/components/ui/Layout';
import { Logo } from '@/components/art/Brand';
import { WhatsAppMark } from '@/components/art/Icons';
import { Rating } from '@/components/ui/Rating';
import { whatsappHref } from '@/lib/whatsapp';
import { BRAND, NAV_LINKS, PROOF } from '@/lib/config';
// BRAND carries the studio and press locations used in the blurb below.
import { LANGUAGES } from '@/data/catalogue';

/**
 * FOOTER
 * -----------------------------------------------------------------------------
 * Kept deliberately small. A sprawling sitemap footer on a single-page,
 * single-action site is theatre: it implies pages that do not exist and gives a
 * visitor who reached the bottom somewhere to go other than the one place we
 * want them.
 *
 * What it does carry is the boring, load-bearing trust material: a real contact
 * route, the languages we actually print, and the legal links a cautious buyer
 * checks before paying a stranger on WhatsApp. Their absence is noticed; their
 * presence is barely registered. That asymmetry is why they are here.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-paper">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          <div className="max-w-[30ch]">
            <Logo />
            <p className="mt-4 text-small text-ink-soft">
              Personalised hardcover storybooks, written around one child and ordered in a single
              conversation. Written in {BRAND.studio}, printed in {BRAND.press}, delivered to{' '}
              {PROOF.pincodes} PIN codes.
            </p>
            <Rating value={PROOF.rating} count={PROOF.reviewCount} className="mt-5" />
          </div>

          <nav aria-label="Sections">
            <h2 className="eyebrow mb-4">This page</h2>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-small text-ink-soft transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow mb-4">We print in</h2>
            <ul className="flex flex-col gap-2.5">
              {LANGUAGES.map((lang) => (
                <li key={lang.code} className="text-small text-ink-soft">
                  {lang.native}
                  <span className="text-ink-muted"> · {lang.note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-small text-ink-muted">
              Prices include GST and tracked delivery across India.
            </p>
          </div>

          <div>
            <h2 className="eyebrow mb-4">Talk to us</h2>
            <a
              href={whatsappHref({ intent: 'help' })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-small font-semibold text-verdant-600 transition-colors hover:text-verdant-700 night:text-verdant-500"
            >
              <WhatsAppMark size={16} />
              {BRAND.whatsappDisplay}
            </a>
            <p className="mt-2 text-small text-ink-muted">{BRAND.supportHours}</p>
            <a
              href={`mailto:${BRAND.email}`}
              className="mt-4 inline-block text-small text-ink-soft transition-colors hover:text-ink"
            >
              {BRAND.email}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-hairline py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-ink-muted">
            © {year} BookMojo Studio Ltd. Illustrations and manuscripts are original works.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {['Privacy', 'Terms', 'Refunds & guarantee', 'Accessibility'].map((item) => (
              <li key={item}>
                <a
                  href="#top"
                  className="text-small text-ink-muted underline decoration-hairline underline-offset-4 transition-colors hover:text-ink"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
