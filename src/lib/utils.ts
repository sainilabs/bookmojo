/** Conditional className joiner. Deliberately tiny — no runtime dependency. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  let out = '';
  for (const p of parts) {
    if (!p) continue;
    out = out ? `${out} ${p}` : p;
  }
  return out;
}

/**
 * Title-cases a free-text child name for display on the book cover.
 * Handles the cases that actually show up in orders: hyphenated (Mary-Kate),
 * apostrophes (D'Angelo) and prefixes (McKenzie is left as typed).
 */
export function formatName(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';
  return trimmed.replace(
    /(^|[\s\-'’])(\p{L})/gu,
    (_m, sep: string, ch: string) => sep + ch.toLocaleUpperCase(),
  );
}

/** Possessive form that respects names already ending in s (Charles' / Mia's). */
export function possessive(name: string): string {
  if (!name) return '';
  return /s$/i.test(name) ? `${name}’` : `${name}’s`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rupee formatting with the Indian digit grouping (2,2,3 — so 1,499 and
 * 1,49,900, not 149,900). `en-IN` handles the lakh/crore grouping natively;
 * hand-rolling a comma every three digits is the classic tell that a product was
 * localised by find-and-replace.
 */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Indian number grouping for counts (reviews, books, PIN codes). */
export function formatCount(value: number): string {
  return value.toLocaleString('en-IN');
}

/** Deterministic index from a string — keeps generated art stable per name. */
export function hashIndex(seed: string, length: number): number {
  if (length <= 0) return 0;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % length;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
