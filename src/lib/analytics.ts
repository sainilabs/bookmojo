/**
 * Thin, vendor-agnostic event sink.
 *
 * The whole business outcome of this page is a single event — "opened WhatsApp"
 * — so it is worth instrumenting properly from day one. Events are pushed to a
 * dataLayer if a tag manager is present and otherwise dropped silently: no
 * network calls, no third-party script in the critical path, no consent
 * problem until a real vendor is wired in.
 */

type EventName =
  | 'whatsapp_open'
  | 'preview_edit'
  | 'preview_complete'
  | 'journey_step_view'
  | 'theme_open'
  | 'spread_turn'
  | 'faq_open'
  | 'theme_toggle';

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

export function track(name: EventName, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as DataLayerWindow;
  w.dataLayer?.push({ event: name, ...payload });
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, payload);
  }
}
