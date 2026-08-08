import { BRAND } from './config';
import { LANGUAGES, THEMES } from '@/data/catalogue';
import { formatName } from './utils';
import type { Draft } from '@/types';

/**
 * WHATSAPP HAND-OFF
 * -----------------------------------------------------------------------------
 * The research finding that shaped this file: click-to-WhatsApp funnels rarely
 * fail at the click, they fail in the first ten seconds of the chat — the user
 * arrives at an empty thread, has to invent an opening line, and leaves.
 *
 * So every CTA on this page ships a pre-written first message. Two consequences:
 *   1. The visitor never faces a blank input. Zero-effort start.
 *   2. Whatever they configured in the on-page preview arrives as structured
 *      text the automation can parse, so the bot skips questions it already
 *      knows the answer to. Fewer turns = higher completion.
 *
 * `intent` tags the entry point so the automation can open in the right
 * register (a gift buyer needs different first questions than a returning
 * parent) and so attribution is readable in analytics.
 */

export type Intent =
  | 'hero'
  | 'nav'
  | 'sticky'
  | 'preview'
  | 'theme'
  | 'gift'
  | 'faq'
  | 'final'
  | 'sample'
  | 'help';

const OPENERS: Record<Intent, string> = {
  hero: 'Hi BookMojo! I’d like to create a personalised book.',
  nav: 'Hi BookMojo! I’d like to start a book.',
  sticky: 'Hi BookMojo! I’m ready to create my book.',
  preview: 'Hi BookMojo! I designed a preview on your site — here are the details:',
  theme: 'Hi BookMojo! I’d like a book in this story world:',
  gift: 'Hi BookMojo! I’m buying this as a gift and would love some help choosing.',
  faq: 'Hi BookMojo! I have a question before I order.',
  final: 'Hi BookMojo! Let’s make my child’s book.',
  sample: 'Hi BookMojo! Could you send me sample pages before I order?',
  help: 'Hi BookMojo! I need a hand with an order.',
};

function draftLines(draft: Partial<Draft>): string[] {
  const lines: string[] = [];
  const name = draft.childName ? formatName(draft.childName) : '';
  if (name) lines.push(`• Child’s name: ${name}`);
  if (draft.age) lines.push(`• Age: ${draft.age} years`);
  if (draft.language) {
    const lang = LANGUAGES.find((l) => l.code === draft.language);
    if (lang) lines.push(`• Language: ${lang.label}`);
  }
  if (draft.themeId) {
    const theme = THEMES.find((t) => t.id === draft.themeId);
    if (theme) lines.push(`• Story: ${theme.name}`);
  }
  if (draft.look) lines.push('• Character look: chosen in the preview');
  return lines;
}

export interface HandoffOptions {
  intent: Intent;
  draft?: Partial<Draft> | null;
  /** Extra context, e.g. the exact FAQ question or theme name they tapped. */
  note?: string;
}

/** Builds the human-readable message body sent into the chat. */
export function buildMessage({ intent, draft, note }: HandoffOptions): string {
  const parts: string[] = [OPENERS[intent]];
  if (note) parts.push(note);

  const lines = draft ? draftLines(draft) : [];
  if (lines.length) {
    parts.push(lines.join('\n'));
    if (lines.length >= 4) {
      parts.push('Ready for the next step whenever you are.');
    }
  }
  return parts.join('\n\n');
}

/**
 * wa.me is used over api.whatsapp.com because it resolves natively to the
 * installed app on mobile and to WhatsApp Web on desktop without an interstitial.
 */
export function whatsappHref(options: HandoffOptions): string {
  const text = encodeURIComponent(buildMessage(options));
  return `https://wa.me/${BRAND.whatsappNumber}?text=${text}`;
}
