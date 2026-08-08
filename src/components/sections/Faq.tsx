import { useMemo, useState } from 'react';
import { Container, Reveal, Section } from '@/components/ui/Layout';
import { Accordion } from '@/components/ui/Accordion';
import { OrderButton } from '@/components/ui/Button';
import { WhatsAppMark } from '@/components/art/Icons';
import { FAQS, FAQ_GROUPS } from '@/data/faq';
import { BRAND } from '@/lib/config';
import { track } from '@/lib/analytics';
import { cx } from '@/lib/utils';

/**
 * FAQ
 * -----------------------------------------------------------------------------
 * Positioned directly above the final CTA, because this is the objection-handling
 * layer and objections must be cleared in the moment before the ask, not
 * three screens earlier.
 *
 * Two structural decisions:
 * · Grouped with filters rather than presented as a twelve-item wall. "Ordering"
 *   is the default group because the WhatsApp mechanic is the unusual part of
 *   this business and therefore the most-asked. "All" is available but not
 *   default — a wall of questions reads as a product with a lot of problems.
 * · The escape hatch is a real conversation, not a contact form. Every unanswered
 *   question is a lost order, and the same channel that takes the order can
 *   answer it, which is the whole thesis of the business.
 */
export function Faq() {
  const [group, setGroup] = useState<(typeof FAQ_GROUPS)[number] | 'All'>('Ordering');

  const items = useMemo(
    () => (group === 'All' ? FAQS : FAQS.filter((f) => f.group === group)),
    [group],
  );

  const tabs = ['All', ...FAQ_GROUPS] as const;

  return (
    <Section id="faq" space="grand">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 3xl:gap-24">
          {/* ---------------------------- ASIDE ---------------------------- */}
          <div>
            <Reveal y={14} className="eyebrow">
              Before you start
            </Reveal>
            <Reveal y={20} delay={70} as="h2" className="mt-4 text-display-2">
              Everything people
              <br />
              ask us first.
            </Reveal>
            <Reveal y={18} delay={140}>
              <p className="mt-5 max-w-[38ch] text-lead text-ink-soft">
                Honest answers, including the ones about paying inside a chat app. If your question
                is not here, it is a two-minute conversation away.
              </p>
            </Reveal>

            <Reveal y={20} delay={200} className="mt-8 lg:sticky lg:top-28">
              <div className="card flex flex-col gap-4 bg-sunken p-6">
                <span className="grid size-11 place-items-center rounded-[0.8rem] bg-verdant-50 text-verdant-700">
                  <WhatsAppMark size={20} />
                </span>
                <div>
                  <p className="font-display text-title">Ask a real person</p>
                  <p className="mt-1.5 text-small text-ink-soft">
                    {BRAND.supportHours}. Asking a question does not start an order and does not
                    put you on a list.
                  </p>
                </div>
                <OrderButton intent="faq" size="md" label="Ask on WhatsApp" block />
              </div>
            </Reveal>
          </div>

          {/* ----------------------------- LIST ---------------------------- */}
          <div className="min-w-0">
            <Reveal y={16}>
              <div
                role="tablist"
                aria-label="Question categories"
                className="rail-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2"
              >
                {tabs.map((tab) => {
                  const active = tab === group;
                  const count =
                    tab === 'All' ? FAQS.length : FAQS.filter((f) => f.group === tab).length;
                  return (
                    <button
                      key={tab}
                      role="tab"
                      type="button"
                      aria-selected={active}
                      onClick={() => setGroup(tab)}
                      className={cx(
                        'btn btn-sm shrink-0 whitespace-nowrap',
                        active ? 'btn-ink' : 'btn-tonal',
                      )}
                    >
                      {tab}
                      <span
                        className={cx(
                          'text-[0.7rem] tabular-nums',
                          active ? 'opacity-60' : 'text-ink-muted',
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal y={20} delay={80} className="mt-6">
              {/* Keyed on the group so the accordion resets its open item when
                  the filter changes — leaving item 3 open after a filter change
                  makes the list feel broken. */}
              <Accordion
                key={group}
                items={items}
                onOpen={(question) => track('faq_open', { question, group })}
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
