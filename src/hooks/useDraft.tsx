import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { HAIR_COLOURS, SKIN_TONES, THEME_BY_ID, recommendedThemes } from '@/data/catalogue';
import { track } from '@/lib/analytics';
import type { Draft } from '@/types';

/**
 * DRAFT STATE — the spine of the whole page.
 *
 * The visitor personalises once, in the preview, and every CTA on the page
 * inherits it: the sticky bar addresses their child by name, the WhatsApp
 * simulation replays their choices, and the hand-off message arrives
 * pre-filled so the automation can skip questions it already knows.
 *
 * It is deliberately held in one context rather than lifted per-section. The
 * payoff is the *illusion of memory* — the page appears to know who you are
 * shopping for, which is the same mechanism that makes the finished book work.
 *
 * Persistence is localStorage-only. Nothing leaves the device until the visitor
 * chooses to send the message themselves.
 */

const STORAGE_KEY = 'bookmojo:draft:v1';

const DEFAULT_DRAFT: Draft = {
  childName: '',
  gender: 'girl',
  age: '4-5',
  language: 'en',
  themeId: 'chandni',
  bookFormat: 'hardcover',
  look: {
    skin: SKIN_TONES[2]!.hex,
    hair: HAIR_COLOURS[1]!.hex,
    hairStyle: 'curls',
  },
};

interface DraftContextValue {
  draft: Draft;
  /** True once the visitor has typed a name — the personalisation switch. */
  isPersonalised: boolean;
  update: (patch: Partial<Draft>) => void;
  updateLook: (patch: Partial<Draft['look']>) => void;
  reset: () => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

function readStored(): Draft {
  if (typeof localStorage === 'undefined') return DEFAULT_DRAFT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DRAFT;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    // Validate against the live catalogue: a theme could have been retired
    // since the visitor's last session.
    const themeId =
      parsed.themeId && THEME_BY_ID.has(parsed.themeId) ? parsed.themeId : DEFAULT_DRAFT.themeId;
    return {
      ...DEFAULT_DRAFT,
      ...parsed,
      themeId,
      look: { ...DEFAULT_DRAFT.look, ...parsed.look },
    };
  } catch {
    return DEFAULT_DRAFT;
  }
}

export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);

  // Read after mount so the first paint is never blocked by storage access.
  useEffect(() => {
    setDraft(readStored());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* private mode */
    }
  }, [draft]);

  const update = useCallback((patch: Partial<Draft>) => {
    setDraft((current) => {
      const next = { ...current, ...patch };

      // Changing the age band can orphan the chosen story. Rather than showing
      // a validation error, quietly move to the best-fitting world and let the
      // UI explain why — friction removed instead of surfaced.
      if (patch.age && patch.age !== current.age) {
        const stillValid = THEME_BY_ID.get(next.themeId)?.ages.includes(patch.age);
        if (!stillValid) {
          const fallback = recommendedThemes(patch.age)[0];
          if (fallback) next.themeId = fallback.id;
        }
      }

      track('preview_edit', { field: Object.keys(patch).join(',') });
      return next;
    });
  }, []);

  const updateLook = useCallback((patch: Partial<Draft['look']>) => {
    setDraft((current) => ({ ...current, look: { ...current.look, ...patch } }));
    track('preview_edit', { field: 'look' });
  }, []);

  const reset = useCallback(() => setDraft(DEFAULT_DRAFT), []);

  const isPersonalised = draft.childName.trim().length > 0;

  useEffect(() => {
    if (isPersonalised) track('preview_complete', { theme: draft.themeId, age: draft.age });
  }, [isPersonalised, draft.themeId, draft.age]);

  const value = useMemo<DraftContextValue>(
    () => ({ draft, isPersonalised, update, updateLook, reset }),
    [draft, isPersonalised, update, updateLook, reset],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft(): DraftContextValue {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('useDraft must be used inside <DraftProvider>');
  return ctx;
}
