import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { createContext, useState, useEffect, useCallback, useMemo, useContext, useRef, useId, Children } from "react";
const AGE_BANDS = [
  { id: "2-3", label: "2–3", note: "Board-thick pages, 12 spreads" },
  { id: "4-5", label: "4–5", note: "Read-aloud rhythm, 16 spreads" },
  { id: "6-8", label: "6–8", note: "First solo read, 20 spreads" },
  { id: "9-12", label: "9–12", note: "Chaptered, 24 spreads" }
];
const LANGUAGES = [
  { code: "en", label: "English", native: "English", note: "Indian English spellings" },
  { code: "hi", label: "Hindi", native: "हिन्दी", note: "Devanagari, written not translated" }
];
const SKIN_TONES = [
  { id: "s1", hex: "#F7D9BE", label: "Ivory" },
  { id: "s2", hex: "#EFC08F", label: "Sand" },
  { id: "s3", hex: "#D9975F", label: "Honey" },
  { id: "s4", hex: "#B3703C", label: "Amber" },
  { id: "s5", hex: "#8A4E28", label: "Chestnut" },
  { id: "s6", hex: "#5C3018", label: "Cocoa" }
];
const HAIR_COLOURS = [
  { id: "h1", hex: "#1E1A18", label: "Ink black" },
  { id: "h2", hex: "#4A2C1C", label: "Chocolate" },
  { id: "h3", hex: "#8A5A2B", label: "Chestnut" },
  { id: "h4", hex: "#C98A3E", label: "Honey blonde" },
  { id: "h5", hex: "#B44A2A", label: "Copper" },
  { id: "h6", hex: "#8C8C97", label: "Silver" }
];
const HAIR_STYLES = [
  { id: "curls", label: "Curls" },
  { id: "braids", label: "Two plaits" },
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
  { id: "buzz", label: "Buzz cut" },
  { id: "patka", label: "Patka" }
];
const THEMES = [
  {
    id: "chandni",
    name: "The Night the Terrace Grew Stars",
    promise: "For the child who does not want the day to end",
    blurb: "A hot April night on the terrace, a charpai still warm from the afternoon, and a sky that turns out to have been keeping count of everyone who has ever been loved.",
    ages: ["2-3", "4-5"],
    palette: { base: "#2E3A70", accent: "#F0C060", deep: "#161E44" },
    motif: "stars",
    opening: "Everyone else had gone down for the night, but {name} stayed up on the terrace — because somebody had to count the stars, and tonight it was {name}’s turn.",
    popular: true
  },
  {
    id: "backwater",
    name: "The Temple Under the Backwaters",
    promise: "For the child who asks one more question about everything",
    blurb: "Past the fourth bend of the canal, under water the colour of strong tea, there is a temple that has been waiting four hundred years for somebody who is not afraid of the dark.",
    ages: ["4-5", "6-8"],
    palette: { base: "#0E5A57", accent: "#E8A54A", deep: "#06322F" },
    motif: "ocean",
    opening: "The backwaters had kept one secret for four hundred years, and they chose a Tuesday — and {name} — to finally tell it."
  },
  {
    id: "banyan",
    name: "The Banyan That Remembered Everything",
    promise: "For the child learning that brave is not the same as unafraid",
    blurb: "The old banyan at the end of the lane has been listening for two hundred years. What it finally says out loud is small, and kind, and exactly what they needed to hear.",
    ages: ["4-5", "6-8"],
    palette: { base: "#2F6146", accent: "#E5B33C", deep: "#163720" },
    motif: "forest",
    opening: "{name} was not the tallest thing standing under the banyan, or the fastest, or the loudest. {name} was simply the one who walked in.",
    popular: true
  },
  {
    id: "local",
    name: "The Morning the 7:04 Was Late",
    promise: "For the child who fixes things nobody asked them to fix",
    blurb: "The local has not been late in ninety years. This morning it is eleven minutes behind, the crows have strong opinions about it, and the only person who has noticed is nine years old.",
    ages: ["6-8", "9-12"],
    palette: { base: "#A6402C", accent: "#F3D08A", deep: "#5E2118" },
    motif: "city",
    opening: "At 7:15 in the morning, eleven minutes later than it had been for ninety years, {name} was the only person on the platform who looked up."
  },
  {
    id: "sriharikota",
    name: "Nine Moons Past Sriharikota",
    promise: "For the child who wants to know what is past the last page",
    blurb: "A one-seat expedition from a launch pad on the Bay of Bengal, a stowaway who eats star charts, and a decision that only a child would be brave enough to make.",
    ages: ["6-8", "9-12"],
    palette: { base: "#362A6B", accent: "#6FD3D9", deep: "#1B1244" },
    motif: "space",
    opening: "Mission control had exactly one instruction for {name}, and {name} had already decided not to follow it."
  },
  {
    id: "karkhana",
    name: "The Workshop of Almost",
    promise: "For the child who is quietly making something",
    blurb: "Down a gali behind the clock tower is a workshop holding every idea the world nearly had. The last shelf is empty, and there is a small brass plate on it with their name already engraved.",
    ages: ["9-12"],
    palette: { base: "#6B2F4E", accent: "#F0AE8A", deep: "#3A1428" },
    motif: "dream",
    opening: "The old man in the workshop had been waiting for {name} for a very long time, which was strange, because {name} had never told anybody about the idea."
  }
];
const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));
function recommendedThemes(age) {
  return THEMES.filter((t) => t.ages.includes(age));
}
function track(name, payload = {}) {
  if (typeof window === "undefined") return;
  const w = window;
  w.dataLayer?.push({ event: name, ...payload });
}
const STORAGE_KEY$1 = "bookmojo:draft:v1";
const DEFAULT_DRAFT = {
  childName: "",
  age: "4-5",
  language: "en",
  themeId: "chandni",
  look: {
    skin: SKIN_TONES[2].hex,
    hair: HAIR_COLOURS[1].hex,
    hairStyle: "curls"
  }
};
const DraftContext = createContext(null);
function readStored() {
  if (typeof localStorage === "undefined") return DEFAULT_DRAFT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY$1);
    if (!raw) return DEFAULT_DRAFT;
    const parsed = JSON.parse(raw);
    const themeId = parsed.themeId && THEME_BY_ID.has(parsed.themeId) ? parsed.themeId : DEFAULT_DRAFT.themeId;
    return {
      ...DEFAULT_DRAFT,
      ...parsed,
      themeId,
      look: { ...DEFAULT_DRAFT.look, ...parsed.look }
    };
  } catch {
    return DEFAULT_DRAFT;
  }
}
function DraftProvider({ children }) {
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  useEffect(() => {
    setDraft(readStored());
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY$1, JSON.stringify(draft));
    } catch {
    }
  }, [draft]);
  const update = useCallback((patch) => {
    setDraft((current) => {
      const next = { ...current, ...patch };
      if (patch.age && patch.age !== current.age) {
        const stillValid = THEME_BY_ID.get(next.themeId)?.ages.includes(patch.age);
        if (!stillValid) {
          const fallback = recommendedThemes(patch.age)[0];
          if (fallback) next.themeId = fallback.id;
        }
      }
      track("preview_edit", { field: Object.keys(patch).join(",") });
      return next;
    });
  }, []);
  const updateLook = useCallback((patch) => {
    setDraft((current) => ({ ...current, look: { ...current.look, ...patch } }));
    track("preview_edit", { field: "look" });
  }, []);
  const reset = useCallback(() => setDraft(DEFAULT_DRAFT), []);
  const isPersonalised = draft.childName.trim().length > 0;
  useEffect(() => {
    if (isPersonalised) track("preview_complete", { theme: draft.themeId, age: draft.age });
  }, [isPersonalised, draft.themeId, draft.age]);
  const value = useMemo(
    () => ({ draft, isPersonalised, update, updateLook, reset }),
    [draft, isPersonalised, update, updateLook, reset]
  );
  return /* @__PURE__ */ jsx(DraftContext.Provider, { value, children });
}
function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used inside <DraftProvider>");
  return ctx;
}
function Logo({ compact = false }) {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2.5", children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": "true",
        className: "relative grid size-9 shrink-0 place-items-center rounded-[0.7rem] bg-inverse text-ink-inverse ring-1 ring-gold-500/30",
        children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "size-5", fill: "none", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("path", { d: "M12 6.4v13.2", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12 6.4C10.4 4.8 7.8 4.2 4.6 4.4v13c3.2-.2 5.8.4 7.4 2",
              stroke: "currentColor",
              strokeWidth: "1.5",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12 6.4c1.6-1.6 4.2-2.2 7.4-2v13c-3.2-.2-5.8.4-7.4 2",
              stroke: "currentColor",
              strokeWidth: "1.5",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M12 1.6l1.05 2.2 2.2 1.05-2.2 1.05L12 8.1l-1.05-2.2-2.2-1.05 2.2-1.05z",
              fill: "var(--gold-500)"
            }
          )
        ] })
      }
    ),
    !compact && /* @__PURE__ */ jsx(
      "span",
      {
        className: "font-display text-[1.28rem] leading-none font-semibold tracking-[-0.03em]",
        style: { fontVariationSettings: "'SOFT' 40, 'WONK' 1" },
        children: "BookMojo"
      }
    )
  ] });
}
function Grain() {
  return /* @__PURE__ */ jsx("div", { className: "grain", "aria-hidden": "true" });
}
function ScribbleArrow({ className, flip = false }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 96 64",
      className,
      fill: "none",
      "aria-hidden": "true",
      style: flip ? { transform: "scaleX(-1)" } : void 0,
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4 8c18 2 34 12 44 26 3 4 5 9 6 15",
            stroke: "currentColor",
            strokeWidth: "2.2",
            strokeLinecap: "round",
            strokeDasharray: "120",
            strokeDashoffset: "0"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M43 44c4 3 8 5 11 5 2-4 4-8 8-11",
            stroke: "currentColor",
            strokeWidth: "2.2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
function Aurora({ className }) {
  return /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute -top-[18%] -left-[10%] size-[40rem] rounded-full opacity-32 blur-[90px] animate-drift",
        style: {
          background: "radial-gradient(circle at 30% 30%, var(--gold-300), transparent 65%)"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute -right-[14%] top-[6%] size-[38rem] rounded-full opacity-45 blur-[100px] animate-float",
        style: {
          background: "radial-gradient(circle at 60% 40%, var(--jade-300), transparent 68%)"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute bottom-[-24%] left-[28%] size-[34rem] rounded-full opacity-35 blur-[110px]",
        style: {
          background: "radial-gradient(circle at 50% 50%, var(--jade-300), transparent 70%)"
        }
      }
    )
  ] });
}
function cx(...parts) {
  let out = "";
  for (const p of parts) {
    if (!p) continue;
    out = out ? `${out} ${p}` : p;
  }
  return out;
}
function formatName(raw) {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return trimmed.replace(
    /(^|[\s\-'’])(\p{L})/gu,
    (_m, sep, ch) => sep + ch.toLocaleUpperCase()
  );
}
function possessive(name) {
  if (!name) return "";
  return /s$/i.test(name) ? `${name}’` : `${name}’s`;
}
function formatINR(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
let observer = null;
const tracked = /* @__PURE__ */ new WeakSet();
function getObserver() {
  if (typeof IntersectionObserver === "undefined") return null;
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.dataset.reveal = "in";
        observer?.unobserve(entry.target);
      }
    },
    {
      // Fire slightly before the element is fully on screen so the motion has
      // finished by the time it reaches comfortable reading position.
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08
    }
  );
  return observer;
}
function useReveal({
  delay = 0,
  y,
  scale
} = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.reveal = "";
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
    if (y !== void 0) el.style.setProperty("--reveal-y", `${y}px`);
    if (scale !== void 0) el.style.setProperty("--reveal-s", String(scale));
    const io = getObserver();
    if (!io) {
      el.dataset.reveal = "in";
      return;
    }
    if (!tracked.has(el)) tracked.add(el);
    io.observe(el);
    return () => io.unobserve(el);
  }, [delay, y, scale]);
  return ref;
}
function useInView(onEnter, { once = true, threshold = 0.25 } = {}) {
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      onEnter();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        if (once && fired.current) return;
        fired.current = true;
        onEnter();
        if (once) io.disconnect();
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold]);
  return ref;
}
function Container({
  children,
  className,
  width = "shell"
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cx(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        width === "shell" && "max-w-[84rem]",
        width === "reading" && "max-w-[46rem]",
        width === "wide" && "max-w-[104rem]",
        className
      ),
      children
    }
  );
}
function Section({
  id,
  children,
  className,
  space = "normal",
  tone = "paper",
  label,
  as: Tag = "section"
}) {
  return /* @__PURE__ */ jsx(
    Tag,
    {
      id,
      "aria-label": label,
      "data-tone": tone,
      className: cx(
        "relative",
        space === "tight" && "py-14 sm:py-16",
        space === "normal" && "py-20 sm:py-28 lg:py-32",
        space === "grand" && "py-24 sm:py-32 lg:py-44",
        tone === "paper" && "bg-paper",
        tone === "sunken" && "bg-sunken",
        tone === "inverse" && "bg-inverse text-ink-inverse",
        className
      ),
      children
    }
  );
}
function Reveal({
  children,
  className,
  as: Tag = "div",
  ...options
}) {
  const ref = useReveal(options);
  return /* @__PURE__ */ jsx(Tag, { ref, className, children });
}
function SectionHeading({
  eyebrow,
  title,
  deck,
  align = "center",
  tight = false,
  id
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cx(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left"
      ),
      children: [
        eyebrow && /* @__PURE__ */ jsx(Reveal, { y: 12, className: "eyebrow", children: eyebrow }),
        /* @__PURE__ */ jsx(Reveal, { y: 18, delay: 60, children: /* @__PURE__ */ jsx(
          "h2",
          {
            id,
            className: cx(
              tight ? "text-display-3" : "text-display-2",
              "max-w-[26ch] text-balance-tight",
              align === "center" && "mx-auto"
            ),
            children: title
          }
        ) }),
        deck && /* @__PURE__ */ jsx(Reveal, { y: 18, delay: 120, children: /* @__PURE__ */ jsx(
          "p",
          {
            className: cx(
              "text-lead text-ink-soft max-w-[52ch]",
              align === "center" && "mx-auto"
            ),
            children: deck
          }
        ) })
      ]
    }
  );
}
const BRAND = {
  /** E.164, digits only — required format for wa.me deep links. */
  whatsappNumber: "919876543210",
  whatsappDisplay: "+91 98765 43210",
  email: "hello@bookmojo.in",
  supportHours: "Replies in ~2 min, 9am–11pm IST",
  /** Sivakasi is India's offset children's-book printing centre; naming the town
   *  is a credibility signal to anyone in publishing and harmless to everyone
   *  else. Vague "made with love" copy earns nothing. */
  studio: "Bengaluru",
  press: "Sivakasi, Tamil Nadu"
};
const PROOF = {
  booksDeliveredLabel: "41,800+",
  rating: 4.9,
  reviewCount: 2148,
  /** Reach stated the way an Indian buyer checks it: does it come to my PIN? */
  pincodes: "19,000+",
  /** Kept small and secondary — the NRI gifting corridor is real revenue but
   *  it is not the headline for this market. */
  countries: 14,
  repeatBuyerRate: 0.38,
  avgOrderMinutes: 4,
  productionDays: "5–7",
  metroDeliveryDays: "2–3"
};
const PRICING = {
  hardcover: 1499,
  hardcoverCompare: 1999
};
const GUARANTEE = {
  headline: "Love it or we reprint it",
  detail: "Not shelf-worthy? We reprint or refund. You keep the first copy.",
  window: "30 days"
};
const NAV_LINKS = [
  { id: "create", label: "Create yours" },
  { id: "how-it-works", label: "How it works" },
  { id: "themes", label: "Stories" },
  { id: "craft", label: "The craft" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" }
];
const OPENERS = {
  hero: "Hi BookMojo! I’d like to create a personalised book.",
  nav: "Hi BookMojo! I’d like to start a book.",
  sticky: "Hi BookMojo! I’m ready to create my book.",
  preview: "Hi BookMojo! I designed a preview on your site — here are the details:",
  theme: "Hi BookMojo! I’d like a book in this story world:",
  gift: "Hi BookMojo! I’m buying this as a gift and would love some help choosing.",
  faq: "Hi BookMojo! I have a question before I order.",
  final: "Hi BookMojo! Let’s make my child’s book.",
  sample: "Hi BookMojo! Could you send me sample pages before I order?",
  help: "Hi BookMojo! I need a hand with an order."
};
function draftLines(draft) {
  const lines = [];
  const name = draft.childName ? formatName(draft.childName) : "";
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
  if (draft.look) lines.push("• Character look: chosen in the preview");
  return lines;
}
function buildMessage({ intent, draft, note }) {
  const parts = [OPENERS[intent]];
  if (note) parts.push(note);
  const lines = draft ? draftLines(draft) : [];
  if (lines.length) {
    parts.push(lines.join("\n"));
    if (lines.length >= 4) {
      parts.push("Ready for the next step whenever you are.");
    }
  }
  return parts.join("\n\n");
}
function whatsappHref(options) {
  const text2 = encodeURIComponent(buildMessage(options));
  return `https://wa.me/${BRAND.whatsappNumber}?text=${text2}`;
}
function Icon({ size = 24, children, ...rest }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.6,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      ...rest,
      children
    }
  );
}
function WhatsAppMark({ size = 24, ...rest }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "currentColor",
      "aria-hidden": "true",
      focusable: "false",
      ...rest,
      children: [
        /* @__PURE__ */ jsx("path", { d: "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.9-.95 1.08-.17.18-.35.2-.65.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.89-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.44s1.05 2.83 1.2 3.03c.15.2 2.06 3.29 5.02 4.48 2.45.99 2.95.79 3.48.74.53-.05 1.71-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.57-.35Z" }),
        /* @__PURE__ */ jsx("path", { d: "M12.04 2C6.6 2 2.17 6.42 2.17 11.85c0 1.74.46 3.44 1.32 4.94L2 22.5l5.86-1.53a9.85 9.85 0 0 0 4.18.93h.01c5.43 0 9.86-4.42 9.86-9.85C21.91 6.42 17.48 2 12.04 2Zm0 17.98h-.01a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.09.81.83-3.02-.19-.31a8.11 8.11 0 0 1-1.25-4.32c0-4.51 3.68-8.19 8.2-8.19a8.15 8.15 0 0 1 8.18 8.2c0 4.51-3.68 8.15-8.2 8.15Z" })
      ]
    }
  );
}
const Sparkle = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M12 3.2l1.7 4.6 4.6 1.7-4.6 1.7-1.7 4.6-1.7-4.6L5.7 9.5l4.6-1.7L12 3.2Z" }),
  /* @__PURE__ */ jsx("path", { d: "M18.6 16.2l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" })
] });
const Star = ({ size = 24, ...rest }) => /* @__PURE__ */ jsx(
  "svg",
  {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    focusable: "false",
    ...rest,
    children: /* @__PURE__ */ jsx("path", { d: "M12 2.6l2.83 5.9 6.47.86-4.72 4.5 1.18 6.44L12 17.2l-5.76 3.1 1.18-6.44-4.72-4.5 6.47-.86L12 2.6Z" })
  }
);
const Check = (p) => /* @__PURE__ */ jsx(Icon, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M4.5 12.6l4.7 4.7L19.8 6.7" }) });
const CheckCircle = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ jsx("path", { d: "M8.2 12.4l2.6 2.6 5-5.4" })
] });
const ArrowRight = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M4.5 12h14" }),
  /* @__PURE__ */ jsx("path", { d: "M13 6.5l5.5 5.5L13 17.5" })
] });
const ArrowDown = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M12 4.5v14" }),
  /* @__PURE__ */ jsx("path", { d: "M6.5 13l5.5 5.5L17.5 13" })
] });
const Chevron = (p) => /* @__PURE__ */ jsx(Icon, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M9 6l6 6-6 6" }) });
const Plus = (p) => /* @__PURE__ */ jsx(Icon, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M12 5.5v13M5.5 12h13" }) });
const Lock = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("rect", { x: "4.5", y: "10.5", width: "15", height: "9.5", rx: "2.4" }),
  /* @__PURE__ */ jsx("path", { d: "M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" }),
  /* @__PURE__ */ jsx("path", { d: "M12 14.4v2.2" })
] });
const Truck = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M2.8 16.5V7.2a1 1 0 0 1 1-1h9.4a1 1 0 0 1 1 1v9.3" }),
  /* @__PURE__ */ jsx("path", { d: "M14.2 9.6h3.3l3.7 3.6v3.3h-2" }),
  /* @__PURE__ */ jsx("circle", { cx: "7", cy: "17.8", r: "1.9" }),
  /* @__PURE__ */ jsx("circle", { cx: "17", cy: "17.8", r: "1.9" }),
  /* @__PURE__ */ jsx("path", { d: "M8.9 17.8h6.2" })
] });
const Printer = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M7 8.5V4.2h10v4.3" }),
  /* @__PURE__ */ jsx("rect", { x: "3.6", y: "8.5", width: "16.8", height: "7.4", rx: "2" }),
  /* @__PURE__ */ jsx("path", { d: "M7 14h10v5.8H7z" })
] });
const Globe = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ jsx("path", { d: "M3.3 9.6h17.4M3.3 14.4h17.4" }),
  /* @__PURE__ */ jsx("path", { d: "M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" })
] });
const Heart = (p) => /* @__PURE__ */ jsx(Icon, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M12 20s-7.4-4.35-7.4-9.3A4.1 4.1 0 0 1 12 8.3a4.1 4.1 0 0 1 7.4 2.4c0 4.95-7.4 9.3-7.4 9.3Z" }) });
const Gift = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M3.8 10.4h16.4v9.4H3.8z" }),
  /* @__PURE__ */ jsx("path", { d: "M2.8 6.6h18.4v3.8H2.8zM12 6.6v13.2" }),
  /* @__PURE__ */ jsx("path", { d: "M12 6.6S10.9 3 8.8 3a2 2 0 0 0 0 3.6M12 6.6S13.1 3 15.2 3a2 2 0 0 1 0 3.6" })
] });
const Camera = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M3.4 8.8h3l1.4-2.2h6.4l1.4 2.2h3a1 1 0 0 1 1 1v8.4a1 1 0 0 1-1 1H3.4a1 1 0 0 1-1-1V9.8a1 1 0 0 1 1-1Z" }),
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "13.6", r: "3.3" })
] });
const Clock = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ jsx("path", { d: "M12 7.2V12l3.4 2" })
] });
const Feather = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M19.5 4.5c-2.4-1.6-6.2-.5-8.6 1.9-2 2-2.4 4.6-2.6 7.4l-3.8 3.8" }),
  /* @__PURE__ */ jsx("path", { d: "M4.5 19.5l4-4M11 12.5h5M13.5 9h4" })
] });
const BookGlyph = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M4 5.2A1.6 1.6 0 0 1 5.6 3.6H10a2.2 2.2 0 0 1 2 1.2 2.2 2.2 0 0 1 2-1.2h4.4A1.6 1.6 0 0 1 20 5.2v11.4a1.6 1.6 0 0 1-1.6 1.6H14a2.2 2.2 0 0 0-2 1.2 2.2 2.2 0 0 0-2-1.2H5.6A1.6 1.6 0 0 1 4 16.6z" }),
  /* @__PURE__ */ jsx("path", { d: "M12 6.4v13" })
] });
const Sun = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
  /* @__PURE__ */ jsx("path", { d: "M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" })
] });
const Moon = (p) => /* @__PURE__ */ jsx(Icon, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" }) });
const Play = (p) => /* @__PURE__ */ jsx(Icon, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M8 5.6l10 6.4-10 6.4z" }) });
const Pause = (p) => /* @__PURE__ */ jsx(Icon, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M9 5.5v13M15 5.5v13" }) });
const Replay = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M4 12a8 8 0 1 0 2.6-5.9" }),
  /* @__PURE__ */ jsx("path", { d: "M4 4.2v4.4h4.4" })
] });
const Menu = (p) => /* @__PURE__ */ jsx(Icon, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M4 7.5h16M4 12h16M4 16.5h11" }) });
const Close = (p) => /* @__PURE__ */ jsx(Icon, { ...p, children: /* @__PURE__ */ jsx("path", { d: "M6.2 6.2l11.6 11.6M17.8 6.2L6.2 17.8" }) });
const Shield = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M12 3.2l7 2.6v5.6c0 4.2-2.9 7.4-7 9.4-4.1-2-7-5.2-7-9.4V5.8z" }),
  /* @__PURE__ */ jsx("path", { d: "M9 12.2l2.2 2.2 4-4.2" })
] });
const Leaf = (p) => /* @__PURE__ */ jsxs(Icon, { ...p, children: [
  /* @__PURE__ */ jsx("path", { d: "M4.6 19.4C3 14 6 6.8 19.4 4.6 17.2 18 10 21 4.6 19.4Z" }),
  /* @__PURE__ */ jsx("path", { d: "M8 16c2.4-3.6 5.2-6 9-8" })
] });
const Quote = ({ size = 24, ...rest }) => /* @__PURE__ */ jsx(
  "svg",
  {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    focusable: "false",
    ...rest,
    children: /* @__PURE__ */ jsx("path", { d: "M9.4 5.6c-3.3 1.3-5.4 4.2-5.4 7.9 0 3 1.7 4.9 4 4.9 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.2-3.1-3.2-.3 0-.6 0-.8.1.3-1.6 1.5-3 3.1-3.8l-1.3-2.5Zm9.2 0c-3.3 1.3-5.4 4.2-5.4 7.9 0 3 1.7 4.9 4 4.9 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.2-3.1-3.2-.3 0-.6 0-.8.1.3-1.6 1.5-3 3.1-3.8l-1.3-2.5Z" })
  }
);
const SIZES = { sm: "btn-sm", md: "", lg: "btn-lg" };
const VARIANTS = {
  order: "btn-order",
  ink: "btn-ink",
  tonal: "btn-tonal",
  quiet: "btn-quiet"
};
function OrderButton({
  intent,
  note,
  size = "lg",
  label = "Start on WhatsApp",
  sublabel,
  block = false,
  className,
  variant = "order"
}) {
  const { draft, isPersonalised } = useDraft();
  const options = { intent, draft: isPersonalised ? draft : null, note };
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: whatsappHref(options),
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: () => track("whatsapp_open", {
        intent,
        personalised: isPersonalised,
        theme: draft.themeId
      }),
      className: cx(
        "btn group",
        VARIANTS[variant],
        SIZES[size],
        block && "w-full",
        sublabel ? "flex-col !gap-0 py-2.5" : null,
        className
      ),
      "aria-label": `${typeof label === "string" ? label : "Start your book on WhatsApp"} — opens WhatsApp at ${BRAND.whatsappDisplay}`,
      children: sublabel ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 font-semibold", children: [
          /* @__PURE__ */ jsx(WhatsAppMark, { size: 19, className: "shrink-0" }),
          label
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[0.7rem] font-medium tracking-wide opacity-80", children: sublabel })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(WhatsAppMark, { size: size === "sm" ? 16 : 19, className: "shrink-0" }),
        label
      ] })
    }
  );
}
const STORAGE_KEY = "bookmojo:theme";
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "day";
    return document.documentElement.dataset.theme ?? "day";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
    }
  }, [theme]);
  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
    }
    if (stored) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setTheme(e.matches ? "night" : "day");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "day" ? "night" : "day";
      track("theme_toggle", { to: next });
      return next;
    });
  }, []);
  return { theme, toggle };
}
function useMediaQuery(query, fallback = false) {
  const [matches, setMatches] = useState(
    () => typeof window === "undefined" ? fallback : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
function useScrolledPast(px) {
  const [passed, setPassed] = useState(false);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setPassed(window.scrollY > px);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [px]);
  return passed;
}
function useScrollSpy(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el) => Boolean(el));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.2, 0.5] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const previous = body.style.cssText;
    const offset = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (offset > 0) body.style.paddingRight = `${offset}px`;
    return () => {
      body.style.cssText = previous;
    };
  }, [locked]);
}
function useEscape(active, onEscape) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onEscape]);
}
const IDS = NAV_LINKS.map((l) => l.id);
function Navbar() {
  const [open, setOpen] = useState(false);
  const condensed = useScrolledPast(80);
  const active = useScrollSpy(IDS);
  const { theme, toggle } = useTheme();
  const close = useCallback(() => setOpen(false), []);
  useScrollLock(open);
  useEscape(open, close);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "#main",
        className: "sr-only-focusable btn btn-ink btn-sm fixed left-4 top-4 z-100",
        children: "Skip to content"
      }
    ),
    /* @__PURE__ */ jsx(
      "header",
      {
        className: cx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-[380ms] ease-[var(--ease-spring)]",
          condensed ? "pt-2.5 sm:pt-3.5" : "pt-0"
        ),
        children: /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsxs(
          "nav",
          {
            "aria-label": "Main",
            className: cx(
              "flex items-center gap-4 transition-all duration-[380ms] ease-[var(--ease-spring)]",
              condensed ? "glass glass-thick h-14 rounded-full pl-4 pr-2 sm:h-16 sm:pl-5 sm:pr-2.5" : "h-20 rounded-full"
            ),
            children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#top",
                  className: "shrink-0 rounded-lg transition-opacity hover:opacity-80",
                  "aria-label": "BookMojo, home",
                  children: /* @__PURE__ */ jsx(Logo, {})
                }
              ),
              /* @__PURE__ */ jsx("ul", { className: "ml-6 hidden flex-1 items-center gap-1 lg:flex", children: NAV_LINKS.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `#${link.id}`,
                  "aria-current": active === link.id ? "true" : void 0,
                  className: cx(
                    "relative rounded-full px-3 py-2 text-small font-semibold transition-colors",
                    active === link.id ? "text-ink" : "text-ink-muted hover:text-ink"
                  ),
                  children: [
                    link.label,
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        className: cx(
                          "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-gold-500 transition-transform duration-300",
                          active === link.id ? "scale-x-100" : "scale-x-0"
                        )
                      }
                    )
                  ]
                }
              ) }, link.id)) }),
              /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(ThemeToggle, { theme, onToggle: toggle }),
                /* @__PURE__ */ jsxs("span", { className: "hidden text-small text-ink-muted xl:inline", children: [
                  PROOF.booksDeliveredLabel,
                  " books delivered"
                ] }),
                /* @__PURE__ */ jsx(
                  OrderButton,
                  {
                    intent: "nav",
                    size: "sm",
                    label: /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Start your book" }),
                    className: "max-sm:aspect-square max-sm:!px-0"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setOpen(true),
                    "aria-expanded": open,
                    "aria-controls": "mobile-nav",
                    className: "btn btn-tonal btn-icon lg:hidden",
                    children: [
                      /* @__PURE__ */ jsx(Menu, { size: 20 }),
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
                    ]
                  }
                )
              ] })
            ]
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        id: "mobile-nav",
        className: cx(
          "fixed inset-0 z-60 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        ),
        "aria-hidden": !open,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: close,
              className: cx(
                "absolute inset-0 bg-inverse/45 backdrop-blur-sm transition-opacity duration-300",
                open ? "opacity-100" : "opacity-0"
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              role: "dialog",
              "aria-modal": "true",
              "aria-label": "Menu",
              className: cx(
                "glass glass-thick absolute inset-x-2 top-2 rounded-[1.75rem] p-5 pb-8 transition-transform duration-[380ms] ease-[var(--ease-spring)]",
                open ? "translate-y-0" : "-translate-y-[130%]"
              ),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx(Logo, {}),
                  /* @__PURE__ */ jsxs("button", { type: "button", onClick: close, className: "btn btn-tonal btn-icon", children: [
                    /* @__PURE__ */ jsx(Close, { size: 20 }),
                    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close menu" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "mt-6 flex flex-col", children: NAV_LINKS.map((link, i) => /* @__PURE__ */ jsx("li", { className: "border-b border-hairline last:border-0", children: /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `#${link.id}`,
                    onClick: close,
                    className: "font-display flex items-baseline justify-between py-4 text-[1.4rem] font-semibold",
                    children: [
                      link.label,
                      /* @__PURE__ */ jsxs("span", { className: "text-micro font-sans font-bold text-ink-muted tabular-nums", children: [
                        "0",
                        i + 1
                      ] })
                    ]
                  }
                ) }, link.id)) }),
                /* @__PURE__ */ jsx(
                  OrderButton,
                  {
                    intent: "nav",
                    block: true,
                    className: "mt-6",
                    label: "Start your book",
                    sublabel: "No account · about 4 minutes"
                  }
                )
              ]
            }
          )
        ]
      }
    )
  ] });
}
function ThemeToggle({ theme, onToggle }) {
  const isNight = theme === "night";
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: onToggle,
      role: "switch",
      "aria-checked": isNight,
      className: "btn btn-tonal btn-icon",
      title: isNight ? "Switch to daylight" : "Switch to bedtime",
      children: [
        /* @__PURE__ */ jsxs("span", { className: "relative grid size-5 place-items-center", children: [
          /* @__PURE__ */ jsx(
            Sun,
            {
              size: 18,
              className: cx(
                "absolute transition-all duration-300",
                isNight ? "scale-50 opacity-0 rotate-90" : "scale-100 opacity-100"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            Moon,
            {
              size: 18,
              className: cx(
                "absolute transition-all duration-300",
                isNight ? "scale-100 opacity-100" : "scale-50 opacity-0 -rotate-90"
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: isNight ? "Bedtime theme, on" : "Bedtime theme, off" })
      ]
    }
  );
}
function Rating({
  value = PROOF.rating,
  count,
  size = 15,
  className,
  tone = "gold"
}) {
  const rounded = Math.round(value);
  return /* @__PURE__ */ jsxs("span", { className: cx("inline-flex items-center gap-2", className), children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: cx("inline-flex gap-0.5", tone === "gold" && "text-gold-500"),
        "aria-hidden": "true",
        children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Star, { size, className: i < rounded ? "opacity-100" : "opacity-25" }, i))
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "text-small font-semibold tabular-nums", children: [
      value.toFixed(1),
      count !== void 0 && /* @__PURE__ */ jsxs("span", { className: "text-ink-muted font-medium", children: [
        " · ",
        count.toLocaleString(),
        " reviews"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "sr-only-focusable sr-only", children: [
      "Rated ",
      value.toFixed(1),
      " out of 5",
      count !== void 0 ? ` from ${count.toLocaleString()} reviews` : ""
    ] })
  ] });
}
function Pill({
  children,
  tone = "neutral",
  className
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-micro font-bold tracking-[0.08em] uppercase",
        tone === "neutral" && "bg-inset text-ink-soft",
        tone === "gold" && "bg-gold-50 text-gold-700",
        tone === "clay" && "bg-clay-50 text-clay-700",
        tone === "verdant" && "bg-verdant-50 text-verdant-700",
        tone === "outline" && "border border-hairline text-ink-muted",
        className
      ),
      children
    }
  );
}
function Footer() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-hairline bg-paper", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-[30ch]", children: [
        /* @__PURE__ */ jsx(Logo, {}),
        /* @__PURE__ */ jsxs("p", { className: "mt-4 text-small text-ink-soft", children: [
          "Written in ",
          BRAND.studio,
          ", printed in ",
          BRAND.press,
          ", delivered to ",
          PROOF.pincodes,
          " PIN codes."
        ] }),
        /* @__PURE__ */ jsx(Rating, { value: PROOF.rating, count: PROOF.reviewCount, className: "mt-5" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Sections", children: [
        /* @__PURE__ */ jsx("h2", { className: "eyebrow mb-4", children: "This page" }),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-2.5", children: NAV_LINKS.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "a",
          {
            href: `#${link.id}`,
            className: "text-small text-ink-soft transition-colors hover:text-ink",
            children: link.label
          }
        ) }, link.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "eyebrow mb-4", children: "We print in" }),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-2.5", children: LANGUAGES.map((lang) => /* @__PURE__ */ jsxs("li", { className: "text-small text-ink-soft", children: [
          lang.native,
          /* @__PURE__ */ jsxs("span", { className: "text-ink-muted", children: [
            " · ",
            lang.note
          ] })
        ] }, lang.code)) }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-small text-ink-muted", children: "GST and delivery included." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "eyebrow mb-4", children: "Talk to us" }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: whatsappHref({ intent: "help" }),
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-2 text-small font-semibold text-verdant-600 transition-colors hover:text-verdant-700 night:text-verdant-500",
            children: [
              /* @__PURE__ */ jsx(WhatsAppMark, { size: 16 }),
              BRAND.whatsappDisplay
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-small text-ink-muted", children: BRAND.supportHours }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `mailto:${BRAND.email}`,
            className: "mt-4 inline-block text-small text-ink-soft transition-colors hover:text-ink",
            children: BRAND.email
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-t border-hairline py-6 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-small text-ink-muted", children: [
        "© ",
        year,
        " BookMojo Studio Ltd. Illustrations and manuscripts are original works."
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap gap-x-5 gap-y-2", children: ["Privacy", "Terms", "Refunds & guarantee", "Accessibility"].map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        "a",
        {
          href: "#top",
          className: "text-small text-ink-muted underline decoration-hairline underline-offset-4 transition-colors hover:text-ink",
          children: item
        }
      ) }, item)) })
    ] })
  ] }) });
}
function field(count, seed) {
  const points = [];
  let s = seed;
  const next = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  for (let i = 0; i < count; i += 1) {
    points.push({
      x: 8 + next() * 284,
      y: 8 + next() * 210,
      r: 0.8 + next() * 2.4,
      o: 0.35 + next() * 0.65
    });
  }
  return points;
}
function Motif({ motif, palette }) {
  const uid = useId().replace(/:/g, "");
  const { base, accent, deep } = palette;
  return /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsx("filter", { id: `bloom-${uid}`, x: "-20%", y: "-20%", width: "140%", height: "140%", children: /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "9" }) }),
      /* @__PURE__ */ jsx("clipPath", { id: `frame-${uid}`, children: /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "300", height: "360", rx: "4" }) })
    ] }),
    /* @__PURE__ */ jsxs("g", { clipPath: `url(#frame-${uid})`, children: [
      /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "300", height: "360", fill: base }),
      /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "300", height: "150", fill: deep, opacity: "0.55" }),
      /* @__PURE__ */ jsx(
        "ellipse",
        {
          cx: "150",
          cy: "120",
          rx: "150",
          ry: "90",
          fill: accent,
          opacity: "0.16",
          filter: `url(#bloom-${uid})`
        }
      ),
      motif === "stars" && /* @__PURE__ */ jsx(Stars, { accent, deep }),
      motif === "ocean" && /* @__PURE__ */ jsx(Ocean, { accent, deep }),
      motif === "forest" && /* @__PURE__ */ jsx(Forest, { accent, deep }),
      motif === "city" && /* @__PURE__ */ jsx(City, { accent, deep }),
      motif === "space" && /* @__PURE__ */ jsx(Space, { accent, deep, uid }),
      motif === "dream" && /* @__PURE__ */ jsx(Dream, { accent, deep })
    ] })
  ] });
}
function Stars({ accent, deep }) {
  const pts = field(34, 7717);
  return /* @__PURE__ */ jsxs("g", { children: [
    pts.map((p, i) => /* @__PURE__ */ jsx(
      "circle",
      {
        cx: p.x,
        cy: p.y,
        r: p.r,
        fill: "#fff",
        opacity: p.o,
        style: {
          animation: `twinkle ${2.6 + i % 5 * 0.5}s var(--ease-in-out) ${i * 0.11}s infinite`
        }
      },
      i
    )),
    /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("circle", { cx: "228", cy: "66", r: "26", fill: accent }),
      /* @__PURE__ */ jsx("circle", { cx: "216", cy: "58", r: "24", fill: deep, opacity: "0.96" })
    ] }),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M0 268h44l14-22 16 22h40l18-26 20 26h46l16-20 18 20h36l16-16 16 16v92H0z",
        fill: deep
      }
    ),
    /* @__PURE__ */ jsxs("g", { fill: accent, opacity: "0.9", children: [
      /* @__PURE__ */ jsx("rect", { x: "26", y: "286", width: "9", height: "11", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "96", y: "292", width: "9", height: "11", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "182", y: "284", width: "9", height: "11", rx: "1.5" }),
      /* @__PURE__ */ jsx("rect", { x: "248", y: "290", width: "9", height: "11", rx: "1.5" })
    ] }),
    /* @__PURE__ */ jsx("path", { d: "M0 300h300", stroke: accent, strokeWidth: "1", opacity: "0.2" }),
    /* @__PURE__ */ jsx("g", { fill: accent, opacity: "0.5", transform: "translate(150 322)", children: [-16, 0, 16].map((dx) => /* @__PURE__ */ jsx(
      "path",
      {
        d: `M${dx} -5 l1.6 3.4 l3.4 1.6 l-3.4 1.6 l-1.6 3.4 l-1.6 -3.4 l-3.4 -1.6 l3.4 -1.6 z`
      },
      dx
    )) })
  ] });
}
function Ocean({ accent, deep }) {
  const bubbles = field(18, 4242);
  return /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsx("path", { d: "M-10 150c60-26 110 20 170-4s110-30 150-6v60H-10z", fill: deep, opacity: "0.5" }),
    /* @__PURE__ */ jsx("path", { d: "M-10 190c70-24 120 22 180-2s100-26 140-4v56H-10z", fill: deep, opacity: "0.72" }),
    /* @__PURE__ */ jsx("path", { d: "M-10 232c58-20 118 20 176 0s96-22 144-2v130H-10z", fill: deep }),
    bubbles.map((b, i) => /* @__PURE__ */ jsx(
      "circle",
      {
        cx: b.x,
        cy: 40 + b.y * 0.5,
        r: b.r * 1.6,
        fill: "#fff",
        opacity: b.o * 0.45,
        style: { animation: `float ${5 + i % 4}s var(--ease-in-out) ${i * 0.2}s infinite` }
      },
      i
    )),
    /* @__PURE__ */ jsxs("g", { fill: accent, opacity: "0.92", children: [
      /* @__PURE__ */ jsx("path", { d: "M108 250l12-52 12 52z" }),
      /* @__PURE__ */ jsx("path", { d: "M150 254l16-70 16 70z" }),
      /* @__PURE__ */ jsx("path", { d: "M196 252l11-44 11 44z" }),
      /* @__PURE__ */ jsx("circle", { cx: "166", cy: "176", r: "5" })
    ] }),
    /* @__PURE__ */ jsx("ellipse", { cx: "150", cy: "300", rx: "120", ry: "10", fill: "#fff", opacity: "0.07" })
  ] });
}
function Forest({ accent, deep }) {
  const trees = [
    { x: 34, h: 132, w: 46 },
    { x: 92, h: 174, w: 58 },
    { x: 160, h: 146, w: 50 },
    { x: 220, h: 190, w: 62 },
    { x: 276, h: 120, w: 42 }
  ];
  return /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsx("circle", { cx: "66", cy: "70", r: "30", fill: accent, opacity: "0.85" }),
    trees.map((t, i) => /* @__PURE__ */ jsxs("g", { opacity: i % 2 ? 0.95 : 0.8, children: [
      /* @__PURE__ */ jsx("rect", { x: t.x - 3, y: 360 - t.h * 0.35, width: "6", height: t.h * 0.35, fill: deep }),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: `M${t.x} ${360 - t.h} L${t.x + t.w / 2} ${360 - t.h * 0.58} L${t.x - t.w / 2} ${360 - t.h * 0.58} Z`,
          fill: deep
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: `M${t.x} ${360 - t.h * 0.86} L${t.x + t.w * 0.6} ${360 - t.h * 0.42} L${t.x - t.w * 0.6} ${360 - t.h * 0.42} Z`,
          fill: deep
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: `M${t.x} ${360 - t.h * 0.7} L${t.x + t.w * 0.7} ${360 - t.h * 0.26} L${t.x - t.w * 0.7} ${360 - t.h * 0.26} Z`,
          fill: deep
        }
      )
    ] }, i)),
    field(12, 991).map((p, i) => /* @__PURE__ */ jsx(
      "circle",
      {
        cx: p.x,
        cy: 150 + p.y * 0.45,
        r: "2.2",
        fill: accent,
        style: { animation: `twinkle ${2.2 + i % 4 * 0.6}s var(--ease-in-out) ${i * 0.3}s infinite` }
      },
      i
    )),
    /* @__PURE__ */ jsx("path", { d: "M0 316q75-16 150 0t150 0v44H0z", fill: deep, opacity: "0.9" })
  ] });
}
function City({ accent, deep }) {
  const blocks = [
    { x: 6, w: 40, h: 120 },
    { x: 52, w: 30, h: 176 },
    { x: 88, w: 46, h: 142 },
    { x: 140, w: 34, h: 200 },
    { x: 180, w: 44, h: 156 },
    { x: 230, w: 28, h: 188 },
    { x: 264, w: 32, h: 130 }
  ];
  return /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsx("circle", { cx: "248", cy: "62", r: "24", fill: accent, opacity: "0.9" }),
    blocks.map((b, i) => /* @__PURE__ */ jsxs("g", { children: [
      /* @__PURE__ */ jsx("rect", { x: b.x, y: 360 - b.h, width: b.w, height: b.h, fill: deep, rx: "2" }),
      Array.from({ length: Math.floor(b.h / 26) }).map(
        (_, r) => Array.from({ length: Math.max(1, Math.floor(b.w / 14)) }).map((__, c) => /* @__PURE__ */ jsx(
          "rect",
          {
            x: b.x + 5 + c * 14,
            y: 360 - b.h + 12 + r * 26,
            width: "6",
            height: "9",
            rx: "1",
            fill: accent,
            opacity: (r + c + i) % 3 === 0 ? 0.85 : 0.22
          },
          `${r}-${c}`
        ))
      )
    ] }, i)),
    /* @__PURE__ */ jsxs("g", { transform: "translate(150 96)", children: [
      /* @__PURE__ */ jsx("circle", { r: "30", fill: "#fff", opacity: "0.94" }),
      /* @__PURE__ */ jsx("circle", { r: "30", fill: "none", stroke: deep, strokeWidth: "3" }),
      /* @__PURE__ */ jsx("path", { d: "M0 0v-18M0 0l12 8", stroke: deep, strokeWidth: "3", strokeLinecap: "round" })
    ] })
  ] });
}
function Space({ accent, deep, uid }) {
  const stars = field(40, 3131);
  return /* @__PURE__ */ jsxs("g", { children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("radialGradient", { id: `glow-${uid}`, children: [
      /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: accent, stopOpacity: "0.6" }),
      /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: accent, stopOpacity: "0" })
    ] }) }),
    stars.map((p, i) => /* @__PURE__ */ jsx(
      "circle",
      {
        cx: p.x,
        cy: p.y * 1.35,
        r: p.r * 0.8,
        fill: "#fff",
        opacity: p.o,
        style: { animation: `twinkle ${3 + i % 6 * 0.4}s var(--ease-in-out) ${i * 0.07}s infinite` }
      },
      i
    )),
    /* @__PURE__ */ jsx("circle", { cx: "150", cy: "228", r: "120", fill: `url(#glow-${uid})` }),
    /* @__PURE__ */ jsx("circle", { cx: "150", cy: "240", r: "74", fill: deep }),
    /* @__PURE__ */ jsx("path", { d: "M150 166a74 74 0 0 0-52 126", stroke: accent, strokeWidth: "3", fill: "none", opacity: "0.5" }),
    /* @__PURE__ */ jsx("circle", { cx: "122", cy: "212", r: "12", fill: accent, opacity: "0.28" }),
    /* @__PURE__ */ jsx("circle", { cx: "182", cy: "262", r: "18", fill: accent, opacity: "0.18" }),
    /* @__PURE__ */ jsx(
      "ellipse",
      {
        cx: "150",
        cy: "240",
        rx: "118",
        ry: "26",
        fill: "none",
        stroke: accent,
        strokeWidth: "7",
        opacity: "0.75",
        transform: "rotate(-14 150 240)"
      }
    ),
    /* @__PURE__ */ jsx("g", { style: { animation: "float 6s var(--ease-in-out) infinite" }, children: /* @__PURE__ */ jsx("path", { d: "M56 92l7 13 13 7-13 7-7 13-7-13-13-7 13-7z", fill: accent }) })
  ] });
}
function Dream({ accent, deep }) {
  return /* @__PURE__ */ jsxs("g", { children: [
    [42, 150, 258].map((x, i) => /* @__PURE__ */ jsxs("g", { opacity: i === 1 ? 1 : 0.7, children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          d: `M${x - 40} 300V194a40 40 0 0 1 80 0v106z`,
          fill: deep,
          opacity: i === 1 ? 0.95 : 0.65
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: `M${x - 26} 300V196a26 26 0 0 1 52 0v104z`,
          fill: accent,
          opacity: i === 1 ? 0.35 : 0.16
        }
      )
    ] }, x)),
    /* @__PURE__ */ jsxs("g", { fill: accent, opacity: "0.85", children: [
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: "76",
          cy: "92",
          r: "9",
          style: { animation: "drift 11s var(--ease-in-out) infinite" }
        }
      ),
      /* @__PURE__ */ jsx(
        "rect",
        {
          x: "196",
          y: "70",
          width: "18",
          height: "18",
          rx: "4",
          transform: "rotate(18 205 79)",
          style: { animation: "drift 14s var(--ease-in-out) 1s infinite" }
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M148 60l8 16 8-16-8-14z",
          style: { animation: "float 8s var(--ease-in-out) infinite" }
        }
      )
    ] }),
    /* @__PURE__ */ jsx("rect", { x: "0", y: "300", width: "300", height: "60", fill: deep }),
    /* @__PURE__ */ jsx("path", { d: "M0 300h300", stroke: accent, strokeWidth: "1.5", opacity: "0.45" }),
    /* @__PURE__ */ jsx("rect", { x: "126", y: "316", width: "48", height: "16", rx: "2", fill: accent, opacity: "0.9" })
  ] });
}
function HeroChild({ look, outfit, outfitDeep, animate = true }) {
  const { skin, hair, hairStyle } = look;
  return /* @__PURE__ */ jsxs("g", { style: animate ? { animation: "float 5.5s var(--ease-in-out) infinite" } : void 0, children: [
    /* @__PURE__ */ jsx("ellipse", { cx: "50", cy: "127", rx: "30", ry: "5", fill: "#000", opacity: "0.18" }),
    /* @__PURE__ */ jsx("rect", { x: "38", y: "96", width: "8", height: "28", rx: "4", fill: skin }),
    /* @__PURE__ */ jsx("rect", { x: "54", y: "96", width: "8", height: "28", rx: "4", fill: skin }),
    /* @__PURE__ */ jsx("rect", { x: "34", y: "118", width: "16", height: "8", rx: "4", fill: outfitDeep }),
    /* @__PURE__ */ jsx("rect", { x: "50", y: "118", width: "16", height: "8", rx: "4", fill: outfitDeep }),
    /* @__PURE__ */ jsx("path", { d: "M50 52c16 0 26 14 30 48H20c4-34 14-48 30-48Z", fill: outfit }),
    /* @__PURE__ */ jsx("path", { d: "M50 52c8 0 14 4 18 12-6 22-6 44-4 56H36c2-12 2-34-4-56 4-8 10-12 18-12Z", fill: outfitDeep, opacity: "0.32" }),
    /* @__PURE__ */ jsx("rect", { x: "14", y: "62", width: "8", height: "26", rx: "4", fill: skin, transform: "rotate(-14 18 62)" }),
    /* @__PURE__ */ jsx("rect", { x: "78", y: "62", width: "8", height: "26", rx: "4", fill: skin, transform: "rotate(14 82 62)" }),
    /* @__PURE__ */ jsx("circle", { cx: "50", cy: "36", r: "21", fill: skin }),
    /* @__PURE__ */ jsx("circle", { cx: "28", cy: "38", r: "4.4", fill: skin }),
    /* @__PURE__ */ jsx("circle", { cx: "72", cy: "38", r: "4.4", fill: skin }),
    /* @__PURE__ */ jsx(Hair, { style: hairStyle, colour: hair }),
    /* @__PURE__ */ jsx("circle", { cx: "43", cy: "37", r: "2.4", fill: "#241d1f" }),
    /* @__PURE__ */ jsx("circle", { cx: "57", cy: "37", r: "2.4", fill: "#241d1f" }),
    /* @__PURE__ */ jsx("path", { d: "M45.5 45q4.5 4 9 0", stroke: "#241d1f", strokeWidth: "1.8", fill: "none", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("circle", { cx: "36", cy: "43", r: "4", fill: "#e07a6a", opacity: "0.3" }),
    /* @__PURE__ */ jsx("circle", { cx: "64", cy: "43", r: "4", fill: "#e07a6a", opacity: "0.3" })
  ] });
}
function Hair({ style, colour }) {
  switch (style) {
    case "curls":
      return /* @__PURE__ */ jsxs("g", { fill: colour, children: [
        /* @__PURE__ */ jsx("circle", { cx: "34", cy: "24", r: "10" }),
        /* @__PURE__ */ jsx("circle", { cx: "48", cy: "16", r: "11.5" }),
        /* @__PURE__ */ jsx("circle", { cx: "63", cy: "23", r: "9.5" }),
        /* @__PURE__ */ jsx("circle", { cx: "28", cy: "34", r: "7" }),
        /* @__PURE__ */ jsx("circle", { cx: "72", cy: "33", r: "6.5" }),
        /* @__PURE__ */ jsx("path", { d: "M31 30a19 19 0 0 1 38-1c-6-7-32-7-38 1Z" })
      ] });
    case "braids":
      return /* @__PURE__ */ jsxs("g", { fill: colour, children: [
        /* @__PURE__ */ jsx("path", { d: "M29 32a21 21 0 0 1 42 0c-6-12-36-12-42 0Z" }),
        /* @__PURE__ */ jsx("path", { d: "M50 15a21 21 0 0 1 21 17H29A21 21 0 0 1 50 15Z" }),
        /* @__PURE__ */ jsxs("g", { children: [
          /* @__PURE__ */ jsx("rect", { x: "22", y: "34", width: "8", height: "30", rx: "4" }),
          /* @__PURE__ */ jsx("circle", { cx: "26", cy: "66", r: "4.6" }),
          /* @__PURE__ */ jsx("rect", { x: "70", y: "34", width: "8", height: "30", rx: "4" }),
          /* @__PURE__ */ jsx("circle", { cx: "74", cy: "66", r: "4.6" })
        ] })
      ] });
    case "short":
      return /* @__PURE__ */ jsx("g", { fill: colour, children: /* @__PURE__ */ jsx("path", { d: "M50 13a22 22 0 0 1 22 21c-3-4-8-6-14-6-9 0-13 4-16 8-4-5-9-7-14-7-1 0-2 0-3 .4A22 22 0 0 1 50 13Z" }) });
    case "long":
      return /* @__PURE__ */ jsxs("g", { fill: colour, children: [
        /* @__PURE__ */ jsx("path", { d: "M50 13a22 22 0 0 1 22 22v4c0-8-6-13-11-14-4 4-7 6-11 6s-7-2-11-6c-5 1-11 6-11 14v-4A22 22 0 0 1 50 13Z" }),
        /* @__PURE__ */ jsx("path", { d: "M27 32c-4 22-4 40-1 52h10c-3-14-3-34-1-50Z" }),
        /* @__PURE__ */ jsx("path", { d: "M73 32c4 22 4 40 1 52H64c3-14 3-34 1-50Z" })
      ] });
    case "buzz":
      return /* @__PURE__ */ jsx("g", { fill: colour, children: /* @__PURE__ */ jsx("path", { d: "M50 14a21 21 0 0 1 20.6 17.4C66 26 58 23 50 23s-16 3-20.6 8.4A21 21 0 0 1 50 14Z" }) });
    /* Patka: the cloth tied over a joora. The knot is drawn showing through in
       the child's own hair colour, so the option still personalises rather than
       just placing a generic hat on the head. */
    case "patka":
      return /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("circle", { cx: "50", cy: "12", r: "7.5", fill: colour }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M50 13c12.5 0 21.5 9 22 20.2.1 2.4-1.7 3.8-4 3.8H32c-2.3 0-4.1-1.4-4-3.8C28.5 22 37.5 13 50 13Z",
            fill: "#efe7d6"
          }
        ),
        /* @__PURE__ */ jsx("path", { d: "M50 13c3.2 0 5.6 1.7 6.6 4.2-4.4 1.5-8.8 1.5-13.2 0C44.4 14.7 46.8 13 50 13Z", fill: "#e2d8c2" }),
        /* @__PURE__ */ jsx("path", { d: "M29.5 33.5c10.5-5.6 30.5-5.6 41 0", stroke: "#d0c4aa", strokeWidth: "1.2", fill: "none" })
      ] });
    default:
      return null;
  }
}
function wrap(text2, max, maxLines = 3) {
  const words2 = text2.split(" ");
  const lines = [];
  let line = "";
  for (const word of words2) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}
function nameSize(name) {
  if (name.length <= 5) return 46;
  if (name.length <= 8) return 38;
  if (name.length <= 11) return 30;
  if (name.length <= 15) return 24;
  return 19;
}
function BookCover({ draft, placeholderName = "Aarav", className }) {
  const uid = useId().replace(/:/g, "");
  const theme = THEME_BY_ID.get(draft.themeId) ?? THEMES[0];
  const name = formatName(draft.childName) || placeholderName;
  const titleLines = useMemo(() => wrap(theme.name.replace(/^The /, ""), 22), [theme.name]);
  const size = nameSize(name);
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 300 360",
      className,
      role: "img",
      "aria-labelledby": `ct-${uid}`,
      "aria-describedby": `cd-${uid}`,
      children: [
        /* @__PURE__ */ jsx("title", { id: `ct-${uid}`, children: `${theme.name}, starring ${name}` }),
        /* @__PURE__ */ jsx("desc", { id: `cd-${uid}`, children: `A hardcover book cover illustrated in cut-paper style for the story “${theme.name}”. The child on the cover is drawn with the skin tone, hair colour and hair style you selected.` }),
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: `foil-${uid}`, x1: "0", y1: "0", x2: "1", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#fff", stopOpacity: "0.9" }),
            /* @__PURE__ */ jsx("stop", { offset: "45%", stopColor: theme.palette.accent, stopOpacity: "0.95" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#fff", stopOpacity: "0.75" })
          ] }),
          /* @__PURE__ */ jsxs("linearGradient", { id: `sheen-${uid}`, x1: "0", y1: "0", x2: "0.7", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#fff", stopOpacity: "0.16" }),
            /* @__PURE__ */ jsx("stop", { offset: "38%", stopColor: "#fff", stopOpacity: "0.02" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#000", stopOpacity: "0.12" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Motif, { motif: theme.motif, palette: theme.palette }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "150",
            y: "30",
            textAnchor: "middle",
            fill: "#fff",
            opacity: "0.5",
            fontSize: "7.5",
            letterSpacing: "3.4",
            fontFamily: "var(--font-sans)",
            fontWeight: "700",
            children: "A BOOKMOJO ORIGINAL"
          }
        ),
        /* @__PURE__ */ jsx("path", { d: "M116 38h68", stroke: "#fff", strokeOpacity: "0.28", strokeWidth: "0.8" }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "150",
            y: 70 + (46 - size) * 0.35,
            textAnchor: "middle",
            fill: `url(#foil-${uid})`,
            fontSize: size,
            fontFamily: "var(--font-display)",
            fontWeight: "600",
            letterSpacing: "-0.5",
            style: { fontVariationSettings: "'SOFT' 40, 'WONK' 1" },
            children: name
          }
        ),
        /* @__PURE__ */ jsx("g", { fill: "#fff", fontFamily: "var(--font-display)", fontStyle: "italic", opacity: "0.95", children: titleLines.map((line, i) => /* @__PURE__ */ jsx(
          "text",
          {
            x: "150",
            y: 94 + i * 17,
            textAnchor: "middle",
            fontSize: "14",
            letterSpacing: "0.2",
            children: i === 0 ? `and ${line.charAt(0).toLowerCase()}${line.slice(1)}` : line
          },
          line
        )) }),
        /* @__PURE__ */ jsx("g", { transform: "translate(88 196) scale(1.18)", children: /* @__PURE__ */ jsx(
          HeroChild,
          {
            look: draft.look,
            outfit: theme.palette.accent,
            outfitDeep: theme.palette.deep
          }
        ) }),
        /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "300", height: "360", fill: `url(#sheen-${uid})` }),
        /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "12", height: "360", fill: "#000", opacity: "0.2" }),
        /* @__PURE__ */ jsx("rect", { x: "12", y: "0", width: "2", height: "360", fill: "#fff", opacity: "0.07" })
      ]
    }
  );
}
function Book3D({
  draft,
  placeholderName,
  width = 320,
  interactive = true,
  className
}) {
  const thickness = Math.max(14, Math.round(width * 0.06));
  const shell = useRef(null);
  const onMove = (e) => {
    if (!interactive || e.pointerType !== "mouse") return;
    const node = shell.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--ry", `${-17 + px * 16}deg`);
    node.style.setProperty("--rx", `${3 - py * 10}deg`);
  };
  const onLeave = () => {
    const node = shell.current;
    if (!node) return;
    node.style.removeProperty("--ry");
    node.style.removeProperty("--rx");
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className,
      style: { perspective: "1500px", width: `min(100%, ${width}px)` },
      "data-interactive": interactive ? "" : void 0,
      onPointerMove: onMove,
      onPointerLeave: onLeave,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: shell,
          className: "book3d",
          style: {
            width: "100%",
            aspectRatio: "300 / 360",
            // Board thickness tracks the rendered width so the object stays
            // proportionally correct when the container shrinks on mobile.
            "--thickness": `min(${thickness}px, 5.5vw)`
          },
          children: [
            /* @__PURE__ */ jsx("div", { className: "book3d-pages", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("div", { className: "book3d-spine", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("div", { className: "book3d-face", children: /* @__PURE__ */ jsx(BookCover, { draft, placeholderName }) })
          ]
        }
      )
    }
  );
}
const DISMISS_KEY = "bookmojo:sticky-dismissed";
function StickyCta() {
  const { draft, isPersonalised } = useDraft();
  const passedHero = useScrolledPast(760);
  const [dismissed, setDismissed] = useState(true);
  const [atClose, setAtClose] = useState(false);
  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);
  useEffect(() => {
    const target = document.getElementById("final-cta");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setAtClose(entries.some((e) => e.isIntersecting)),
      { rootMargin: "-10% 0px -10% 0px" }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);
  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
    }
  };
  const visible = passedHero && !dismissed && !atClose;
  const name = formatName(draft.childName);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cx(
        "fixed inset-x-0 bottom-0 z-40 transition-all duration-[420ms] ease-[var(--ease-spring)] sm:inset-x-auto sm:right-6 sm:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0 sm:translate-y-8"
      ),
      "aria-hidden": !visible,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: cx(
            "glass flex items-center gap-3 p-3",
            /* Square top corners on mobile where it is docked to the viewport
               edge; a full capsule on desktop where it genuinely floats. */
            "rounded-t-[1.35rem] sm:w-[24rem] sm:rounded-[1.35rem] sm:p-4"
          ),
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 shrink-0 overflow-hidden rounded-[3px] shadow-e2 sm:w-14", children: /* @__PURE__ */ jsx(BookCover, { draft, className: "block w-full" }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-small font-semibold", children: isPersonalised ? `${possessive(name)} book is ready to make` : "Your book, in about 4 minutes" }),
              /* @__PURE__ */ jsxs("p", { className: "truncate text-[0.72rem] text-ink-muted", children: [
                formatINR(PRICING.hardcover),
                " all in · GST & delivery included"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              OrderButton,
              {
                intent: "sticky",
                size: "sm",
                label: "Start",
                className: "shrink-0"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: dismiss,
                className: "btn btn-quiet btn-icon-sm shrink-0 text-ink-muted",
                tabIndex: visible ? 0 : -1,
                children: [
                  /* @__PURE__ */ jsx(Close, { size: 16 }),
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Hide this bar for now" })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function Hero() {
  const { draft, update, isPersonalised } = useDraft();
  const name = formatName(draft.childName);
  return /* @__PURE__ */ jsxs("section", { id: "top", className: "relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24", children: [
    /* @__PURE__ */ jsx(Aurora, { className: "pointer-events-none absolute inset-0 -z-10 opacity-45 night:opacity-40" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "absolute inset-0 -z-10 opacity-55 night:opacity-40",
        style: {
          /**
           * One grid, one line weight, one cell size.
           *
           * Presence comes entirely from the LINE COLOUR — jade-300 rather than
           * the hairline token, which at 1.09:1 against paper was effectively
           * invisible. Reaching for a second, denser grid to create texture is
           * the wrong lever: it fights the headline for attention and starts to
           * read as a wireframe rather than as a surface.
           *
           * 64px cell: large enough that the type sits ON the grid instead of
           * inside it, small enough to still register as ruled stock.
           */
          backgroundImage: [
            "linear-gradient(to right, var(--jade-300) 1px, transparent 1px)",
            "linear-gradient(to bottom, var(--jade-300) 1px, transparent 1px)"
          ].join(", "),
          backgroundSize: "64px 64px",
          /* Elliptical and pushed further out than a circle: the grid should
             still be present behind the book on the right, and behind the CTA,
             not only under the headline. */
          maskImage: "radial-gradient(120% 95% at 50% 26%, #000 38%, transparent 84%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs(Container, { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 3xl:gap-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-[38rem] lg:max-w-none", children: [
          /* @__PURE__ */ jsxs(Reveal, { y: 14, className: "inline-flex flex-wrap items-center gap-x-4 gap-y-2", children: [
            /* @__PURE__ */ jsx(Rating, { count: PROOF.reviewCount }),
            /* @__PURE__ */ jsx("span", { className: "hidden h-4 w-px bg-strong sm:block" }),
            /* @__PURE__ */ jsxs("span", { className: "text-small font-semibold text-ink-soft", children: [
              PROOF.booksDeliveredLabel,
              " books on shelves across India"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Reveal, { y: 22, delay: 80, as: "h1", className: "mt-6 text-display-1", children: [
            "Tonight, the hero",
            /* @__PURE__ */ jsx("br", {}),
            "of the story has",
            " ",
            /* @__PURE__ */ jsx("span", { className: "marker whitespace-nowrap", children: isPersonalised ? possessive(name) : "your child’s" }),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "quill", children: "name." })
          ] }),
          /* @__PURE__ */ jsx(Reveal, { y: 18, delay: 160, children: /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-[42ch] text-lead text-ink-soft", children: "Original hardcover storybooks written around one child. Ordered in a single WhatsApp conversation — no forms, no account." }) }),
          /* @__PURE__ */ jsxs(Reveal, { y: 18, delay: 220, className: "mt-8", children: [
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: (e) => e.preventDefault(),
                className: "flex max-w-[30rem] flex-col gap-3 sm:flex-row",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                    /* @__PURE__ */ jsx("label", { htmlFor: "hero-name", className: "sr-only", children: "Your child’s first name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        id: "hero-name",
                        type: "text",
                        value: draft.childName,
                        onChange: (e) => update({ childName: e.target.value }),
                        placeholder: "Type their name…",
                        maxLength: 20,
                        autoComplete: "off",
                        spellCheck: false,
                        className: "font-display h-14 w-full rounded-full border-2 border-strong bg-raised pl-5 pr-12 text-[1.15rem] font-semibold shadow-e1 outline-none transition-colors placeholder:font-normal placeholder:italic placeholder:text-ink-muted/60 hover:border-ink/40 focus:border-clay-500"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Feather,
                      {
                        size: 18,
                        className: "pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-ink-muted"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    OrderButton,
                    {
                      intent: "hero",
                      label: isPersonalised ? `Make ${possessive(name)} book` : "Start their book",
                      className: "shrink-0"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-3 flex items-center gap-2 text-small text-ink-muted", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  className: "inline-block size-1.5 animate-pulse rounded-full bg-verdant-500"
                }
              ),
              isPersonalised ? "Keep it, or design the whole book below." : "The cover updates as you type. Nothing is sent yet."
            ] })
          ] }),
          /* @__PURE__ */ jsx(Reveal, { y: 16, delay: 300, children: /* @__PURE__ */ jsx("ul", { className: "mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-hairline pt-6", children: [
            { icon: Camera, text: "See it before you pay" },
            { icon: Lock, text: "UPI on a secure page" },
            { icon: Clock, text: `Printed in ${PROOF.productionDays} days` }
          ].map(({ icon: Icon2, text: text2 }) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-small font-medium text-ink-soft", children: [
            /* @__PURE__ */ jsx(Icon2, { size: 17, className: "shrink-0 text-verdant-600 night:text-verdant-500" }),
            text2
          ] }, text2)) }) })
        ] }),
        /* @__PURE__ */ jsx(Reveal, { y: 30, delay: 140, scale: 0.96, className: "relative flex justify-center lg:justify-end", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Book3D, { draft, width: 362, className: "relative z-10" }),
          /* @__PURE__ */ jsx(Annotation, { className: "-left-4 top-[16%] sm:-left-10", delay: 520, children: "Their name, foil-stamped" }),
          /* @__PURE__ */ jsx(Annotation, { className: "-right-2 top-[46%] sm:-right-8", delay: 640, align: "right", children: "Illustrated to match your photo" }),
          /* @__PURE__ */ jsx(Annotation, { className: "bottom-[8%] -left-2 sm:-left-8", delay: 760, children: "Hardcover · linen spine" }),
          /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -bottom-6 -right-2 hidden rotate-6 text-gold-500 lg:block", children: /* @__PURE__ */ jsx(ScribbleArrow, { className: "w-20 opacity-70", flip: true }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Reveal, { y: 12, delay: 400, className: "mt-14 flex justify-center lg:mt-20", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: "#create",
          className: "btn btn-quiet group flex-col !gap-1 text-micro font-bold tracking-[0.14em] uppercase",
          children: [
            "Design it yourself",
            /* @__PURE__ */ jsx(
              ArrowDown,
              {
                size: 18,
                className: "transition-transform duration-300 group-hover:translate-y-1"
              }
            )
          ]
        }
      ) })
    ] })
  ] });
}
function Annotation({
  children,
  className,
  delay = 0,
  align = "left"
}) {
  return /* @__PURE__ */ jsx(
    Reveal,
    {
      y: 10,
      delay,
      className: `pointer-events-none absolute z-20 hidden sm:block ${className ?? ""}`,
      children: /* @__PURE__ */ jsxs(
        "span",
        {
          className: `glass glass-thin flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.7rem] font-semibold ${align === "right" ? "flex-row-reverse" : ""}`,
          children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "size-1.5 rounded-full bg-gold-500" }),
            children
          ]
        }
      )
    }
  );
}
function Marquee({
  children,
  className,
  speed = 46,
  reverse = false
}) {
  const still = useReducedMotion();
  const items = Children.toArray(children);
  if (still) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: cx("rail-scroll flex gap-8 overflow-x-auto pb-2", className),
        role: "list",
        tabIndex: 0,
        children: items.map((child, i) => /* @__PURE__ */ jsx("div", { role: "listitem", className: "shrink-0", children: child }, i))
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: cx("mask-x-fade group overflow-hidden", className), style: { "--fade": "8%" }, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "flex w-max animate-marquee group-hover:[animation-play-state:paused]",
      style: {
        animationDuration: `${speed}s`,
        animationDirection: reverse ? "reverse" : "normal"
      },
      children: [0, 1].map((half) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "flex shrink-0 items-center gap-8 pr-8",
          "aria-hidden": half === 1 ? "true" : void 0,
          children: items.map((child, i) => /* @__PURE__ */ jsx("div", { className: "shrink-0", children: child }, i))
        },
        half
      ))
    }
  ) });
}
const TESTIMONIALS = [
  {
    quote: "I expected print-on-demand tat. It arrived in a linen-spined box and my mother-in-law asked which publisher it was from. It lives on the shelf, not in the toy bin.",
    name: "Priya Raghunathan",
    role: "Mother of two",
    location: "Bengaluru",
    childName: "Aarav, 5",
    rating: 5,
    handles: "quality"
  },
  {
    quote: "She found her own name on page three and went completely silent, which she never does. Then she read it to the dog. Four times.",
    name: "Nikhil Deshpande",
    role: "Father",
    location: "Pune",
    childName: "Meher, 4",
    rating: 5,
    handles: "emotion"
  },
  {
    quote: "I ordered it from the back of an auto. Six messages, tapped UPI, done before I got home. I have spent longer buying a phone case.",
    name: "Sneha Iyer",
    role: "Gift buyer",
    location: "Chennai",
    childName: "Nephew Vihaan, 7",
    rating: 5,
    handles: "ease"
  },
  {
    quote: "Ordered on Sunday, held it on Friday, and they sent a photo of it coming off the press in between. I knew exactly where it was the whole time.",
    name: "Rohit Bansal",
    role: "Father of three",
    location: "Gurugram",
    childName: "Ira, 8",
    rating: 5,
    handles: "speed"
  },
  {
    quote: "Best grandparent purchase I have made, and I have made some expensive mistakes. The dedication page is what got me — I wrote it badly and they still made it look beautiful.",
    name: "Sudha Venkatesh",
    role: "Grandmother",
    location: "Coimbatore",
    childName: "Grandson Advait, 6",
    rating: 5,
    handles: "gifting"
  },
  {
    quote: "The Hindi edition reads like it was written in Hindi, not translated into it. My mother read it to him over video from Lucknow and cried at the end.",
    name: "Ankita Srivastava",
    role: "Mother, sending from abroad",
    location: "Dubai → Lucknow",
    childName: "Kabir, 3",
    rating: 5,
    handles: "language"
  }
];
const ENDORSEMENTS = [
  { label: "Made in India", note: "Written, illustrated, printed here" },
  { label: "FSC® Certified", note: "Responsibly sourced paper" },
  { label: "Soy-based inks", note: "Child-safe, low VOC" },
  { label: "Indie bookshops", note: "Stocked in 40+ stores" },
  { label: "GST invoice", note: "Included with every order" },
  { label: "Reading Together", note: "Literacy programme partner" }
];
function ProofBar() {
  const stats = [
    { value: PROOF.booksDeliveredLabel, label: "books made", icon: Heart },
    {
      value: `${PROOF.rating}★`,
      label: `${PROOF.reviewCount.toLocaleString()} parents`,
      icon: CheckCircle
    },
    { value: PROOF.pincodes, label: "PIN codes served", icon: Globe },
    {
      value: `${Math.round(PROOF.repeatBuyerRate * 100)}%`,
      label: "buy a second book",
      icon: Leaf
    }
  ];
  return /* @__PURE__ */ jsx("section", { "aria-label": "Trust and credentials", className: "border-y border-hairline bg-sunken", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-y-8 py-10 sm:py-12 lg:grid-cols-4", children: stats.map((stat, i) => /* @__PURE__ */ jsxs(
      Reveal,
      {
        y: 16,
        delay: i * 70,
        className: "flex flex-col gap-1 lg:border-l lg:border-hairline lg:pl-6 lg:first:border-0 lg:first:pl-0",
        children: [
          /* @__PURE__ */ jsx("span", { className: "font-display text-[2rem] leading-none font-semibold tabular-nums sm:text-[2.4rem]", children: stat.value }),
          /* @__PURE__ */ jsx("span", { className: "max-w-[18ch] text-small text-ink-muted", children: stat.label })
        ]
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-t border-hairline py-6 lg:flex-row lg:items-center lg:gap-10", children: [
      /* @__PURE__ */ jsxs("p", { className: "flex shrink-0 items-center gap-2.5 text-small font-semibold", children: [
        /* @__PURE__ */ jsx(Shield, { size: 18, className: "text-verdant-600 night:text-verdant-500" }),
        GUARANTEE.headline,
        /* @__PURE__ */ jsxs("span", { className: "font-medium text-ink-muted", children: [
          "· ",
          GUARANTEE.window
        ] })
      ] }),
      /* @__PURE__ */ jsx(Marquee, { className: "min-w-0 flex-1", speed: 52, children: ENDORSEMENTS.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2 whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("span", { className: "font-display text-[0.95rem] font-semibold", children: item.label }),
        /* @__PURE__ */ jsx("span", { className: "text-small text-ink-muted", children: item.note })
      ] }, item.label)) })
    ] })
  ] }) });
}
function ChoiceGroup({
  legend,
  hideLegend,
  options,
  value,
  onChange,
  variant = "chip",
  columns = 4,
  className,
  note
}) {
  const name = useId();
  return /* @__PURE__ */ jsxs("fieldset", { className: cx("min-w-0 border-0 p-0", className), children: [
    /* @__PURE__ */ jsx(
      "legend",
      {
        className: cx(
          "eyebrow mb-2.5",
          hideLegend && "sr-only"
        ),
        children: legend
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cx(
          variant === "swatch" ? "flex flex-wrap gap-2" : "grid gap-2",
          variant !== "swatch" && columns === 2 && "grid-cols-2",
          variant !== "swatch" && columns === 3 && "grid-cols-3",
          variant !== "swatch" && columns === 4 && "grid-cols-2 xs:grid-cols-4",
          variant !== "swatch" && columns === 6 && "grid-cols-3 xs:grid-cols-6"
        ),
        children: options.map((option) => {
          const selected = option.value === value;
          return /* @__PURE__ */ jsxs(
            "label",
            {
              className: cx(
                "group relative cursor-pointer select-none",
                variant === "swatch" ? "block" : "block"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    name,
                    value: option.value,
                    checked: selected,
                    onChange: () => onChange(option.value),
                    className: "peer sr-only"
                  }
                ),
                variant === "swatch" ? /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: cx(
                      "grid size-11 place-items-center rounded-full transition-all duration-200",
                      "ring-offset-2 ring-offset-raised peer-focus-visible:ring-2 peer-focus-visible:ring-clay-500",
                      selected ? "ring-2 ring-ink" : "ring-1 ring-hairline hover:ring-strong"
                    ),
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "size-8 rounded-full shadow-e1",
                          style: { background: option.swatch },
                          "aria-hidden": "true"
                        }
                      ),
                      selected && /* @__PURE__ */ jsx(
                        Check,
                        {
                          size: 16,
                          className: "absolute text-white mix-blend-difference",
                          "aria-hidden": "true"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: option.label })
                    ]
                  }
                ) : /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: cx(
                      "flex min-h-11 flex-col items-center justify-center rounded-[0.8rem] px-3 py-2 text-center transition-all duration-200",
                      "ring-offset-2 ring-offset-raised peer-focus-visible:ring-2 peer-focus-visible:ring-clay-500",
                      selected ? "bg-inverse text-ink-inverse shadow-e2 font-semibold" : "bg-inset text-ink-soft hover:bg-strong/25 hover:text-ink"
                    ),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-small leading-tight font-semibold", children: option.label }),
                      option.hint && /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: cx(
                            "text-[0.68rem] leading-tight",
                            selected ? "opacity-70" : "text-ink-muted"
                          ),
                          children: option.hint
                        }
                      )
                    ]
                  }
                )
              ]
            },
            option.value
          );
        })
      }
    ),
    note && /* @__PURE__ */ jsx("p", { className: "mt-2.5 text-small text-ink-muted", children: note })
  ] });
}
function NameField({
  value,
  onChange,
  label,
  hint,
  placeholder,
  maxLength = 20
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsx("label", { htmlFor: id, className: "eyebrow", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          id,
          type: "text",
          value,
          onChange: (e) => onChange(e.target.value),
          placeholder,
          maxLength,
          autoComplete: "off",
          spellCheck: false,
          enterKeyHint: "done",
          "aria-describedby": hint ? hintId : void 0,
          className: cx(
            "font-display w-full rounded-[0.9rem] border-2 border-hairline bg-raised px-4 py-3",
            "text-[1.35rem] leading-tight font-semibold tracking-[-0.01em]",
            "transition-colors duration-200 outline-none",
            "placeholder:text-ink-muted/55 placeholder:font-normal placeholder:italic",
            "hover:border-strong focus:border-clay-500"
          )
        }
      ),
      /* @__PURE__ */ jsxs(
        "span",
        {
          className: "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-micro font-semibold tabular-nums text-ink-muted",
          "aria-hidden": "true",
          children: [
            value.length,
            "/",
            maxLength
          ]
        }
      )
    ] }),
    hint && /* @__PURE__ */ jsx("p", { id: hintId, className: "text-small text-ink-muted", children: hint })
  ] });
}
function Personaliser() {
  const { draft, update, updateLook, isPersonalised } = useDraft();
  const theme = THEME_BY_ID.get(draft.themeId) ?? THEMES[0];
  const name = formatName(draft.childName);
  const recommended = useMemo(() => recommendedThemes(draft.age), [draft.age]);
  const ageOptions = AGE_BANDS.map((band) => ({
    value: band.id,
    label: band.label,
    hint: band.note.split(",")[1]?.trim()
  }));
  const languageOptions = LANGUAGES.map((lang) => ({
    value: lang.code,
    label: lang.native,
    hint: lang.note
  }));
  const hairStyleOptions = HAIR_STYLES.map((style) => ({
    value: style.id,
    label: style.label
  }));
  const done = [
    Boolean(name),
    true,
    // age always has a considered default
    true,
    // language always has a considered default
    Boolean(draft.themeId),
    true
    // look always has a considered default
  ].filter(Boolean).length;
  const opening = theme.opening.replaceAll("{name}", name || "your child");
  return /* @__PURE__ */ jsx(Section, { id: "create", space: "grand", className: "overflow-hidden", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        eyebrow: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Sparkle, { size: 14 }),
          " Step one, and it is the fun one"
        ] }),
        title: /* @__PURE__ */ jsxs(Fragment, { children: [
          "Build the cover now.",
          /* @__PURE__ */ jsx("br", {}),
          "Decide about buying later."
        ] }),
        deck: "Five choices, no sign-up. One tap carries them into WhatsApp and we pick up from there."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16 3xl:gap-24", children: [
      /* @__PURE__ */ jsxs(Reveal, { y: 24, className: "order-2 lg:order-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 border-b border-hairline pb-4", children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow !text-ink", children: "Your choices" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-small font-semibold tabular-nums text-ink-muted", children: [
              done,
              " of 5"
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-1.5 w-24 overflow-hidden rounded-full bg-inset",
                role: "progressbar",
                "aria-valuenow": done,
                "aria-valuemin": 0,
                "aria-valuemax": 5,
                "aria-label": "Personalisation progress",
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-verdant-500 transition-[width] duration-500 ease-[var(--ease-spring)]",
                    style: { width: `${done / 5 * 100}%` }
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col gap-9", children: [
          /* @__PURE__ */ jsx(
            NameField,
            {
              label: "1 · Their first name",
              value: draft.childName,
              onChange: (childName) => update({ childName }),
              placeholder: "Aarav, Meera, Ishaan…",
              hint: "Exactly as it should be printed."
            }
          ),
          /* @__PURE__ */ jsx(
            ChoiceGroup,
            {
              legend: "2 · Age",
              options: ageOptions,
              value: draft.age,
              onChange: (age) => update({ age }),
              columns: 4,
              note: AGE_BANDS.find((b) => b.id === draft.age)?.note
            }
          ),
          /* @__PURE__ */ jsx(
            ChoiceGroup,
            {
              legend: "3 · Language",
              options: languageOptions,
              value: draft.language,
              onChange: (language) => update({ language }),
              columns: 2,
              note: "Written by an author in that language, never machine-translated."
            }
          ),
          /* @__PURE__ */ jsxs("fieldset", { className: "min-w-0 border-0 p-0", children: [
            /* @__PURE__ */ jsx("legend", { className: "eyebrow mb-2.5", children: "4 · Story world" }),
            /* @__PURE__ */ jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: THEMES.map((option) => {
              const selected = option.id === draft.themeId;
              const fits = recommended.some((t) => t.id === option.id);
              return /* @__PURE__ */ jsxs(
                "label",
                {
                  className: cx(
                    "group relative flex cursor-pointer gap-3 rounded-[0.9rem] border-2 p-3 transition-all duration-200",
                    selected ? "border-ink bg-raised shadow-e2" : "border-hairline bg-raised/50 hover:border-strong"
                  ),
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "story-world",
                        value: option.id,
                        checked: selected,
                        onChange: () => update({ themeId: option.id }),
                        className: "peer sr-only"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        className: "mt-0.5 size-9 shrink-0 rounded-md shadow-e1",
                        style: {
                          background: `linear-gradient(150deg, ${option.palette.deep}, ${option.palette.base} 60%, ${option.palette.accent})`
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-display text-[0.95rem] leading-tight font-semibold", children: option.name }),
                        selected && /* @__PURE__ */ jsx(Check, { size: 14, className: "shrink-0 text-verdant-600", "aria-hidden": true })
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "mt-0.5 block text-[0.78rem] leading-snug text-ink-muted", children: option.promise }),
                      fits && /* @__PURE__ */ jsxs("span", { className: "mt-1.5 inline-block text-[0.68rem] font-bold tracking-wide uppercase text-gold-700 night:text-gold-500", children: [
                        "Written for ",
                        draft.age,
                        "s"
                      ] })
                    ] })
                  ]
                },
                option.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
            /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "5 · What they look like" }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsx(
                ChoiceGroup,
                {
                  legend: "Skin tone",
                  options: SKIN_TONES.map((tone) => ({
                    value: tone.hex,
                    label: tone.label,
                    swatch: tone.hex
                  })),
                  value: draft.look.skin,
                  onChange: (skin) => updateLook({ skin }),
                  variant: "swatch"
                }
              ),
              /* @__PURE__ */ jsx(
                ChoiceGroup,
                {
                  legend: "Hair colour",
                  options: HAIR_COLOURS.map((c) => ({
                    value: c.hex,
                    label: c.label,
                    swatch: c.hex
                  })),
                  value: draft.look.hair,
                  onChange: (hair) => updateLook({ hair }),
                  variant: "swatch"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              ChoiceGroup,
              {
                legend: "Hair style",
                options: hairStyleOptions,
                value: draft.look.hairStyle,
                onChange: (hairStyle) => updateLook({ hairStyle }),
                columns: 6,
                note: "Or send a photo in the chat — an illustrator matches it by hand."
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "order-1 lg:order-2", children: /* @__PURE__ */ jsx("div", { className: "lg:sticky lg:top-28", children: /* @__PURE__ */ jsxs(Reveal, { y: 24, scale: 0.97, className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 self-start", children: [
          /* @__PURE__ */ jsxs(Pill, { tone: "verdant", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "size-1.5 animate-pulse rounded-full bg-verdant-500"
              }
            ),
            "Live preview"
          ] }),
          /* @__PURE__ */ jsx(Pill, { tone: "outline", children: "Not yet ordered" })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "mt-6 flex w-full justify-center",
            "aria-live": "polite",
            "aria-atomic": "true",
            children: /* @__PURE__ */ jsx(Book3D, { draft, width: 330 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "card mt-10 w-full max-w-[28rem] overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-hairline bg-sunken px-5 py-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "eyebrow !text-[0.65rem]", children: "Page one" }),
            /* @__PURE__ */ jsx("span", { className: "text-[0.68rem] font-semibold text-ink-muted", children: theme.name })
          ] }),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "font-display px-6 py-6 text-[1.05rem] leading-[1.7] first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-[3.2rem] first-letter:leading-[0.8] first-letter:font-semibold first-letter:text-gold-600",
              style: { fontVariationSettings: "'SOFT' 50, 'WONK' 1" },
              children: opening
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "border-t border-hairline bg-sunken px-6 py-3 text-[0.72rem] text-ink-muted", children: [
            "Sample opening · rewritten for age ",
            draft.age
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 w-full max-w-[28rem]", children: /* @__PURE__ */ jsx(
          OrderButton,
          {
            intent: "preview",
            block: true,
            label: isPersonalised ? `Send ${possessive(name)} details` : "Continue on WhatsApp",
            sublabel: isPersonalised ? "Your five choices travel with you" : "We will ask the five questions above"
          }
        ) })
      ] }) }) })
    ] })
  ] }) });
}
const STEPS = [
  {
    n: 1,
    icon: WhatsAppMark,
    who: "You",
    time: "~4 min",
    title: "Answer five questions in a chat",
    body: "Name, age, English or Hindi, story world, and what they look like. Tap or type."
  },
  {
    n: 2,
    icon: Check,
    who: "You",
    time: "~1 min",
    title: "Approve the real cover and two pages",
    body: "The actual artwork, in the chat. Change anything. Nothing is charged until you say yes."
  },
  {
    n: 3,
    icon: Printer,
    who: "Us",
    time: `${PROOF.productionDays} days`,
    title: "A human writes, illustrates and proofs it",
    body: "Then litho-printed and hardcover bound. We send you a photo off the press."
  },
  {
    n: 4,
    icon: Truck,
    who: "Us",
    time: `${PROOF.metroDeliveryDays} days`,
    title: "It arrives boxed, tracked and gift-ready",
    body: "Rigid gift box, no pricing inside. Tracking lands in the same chat."
  }
];
function HowItWorks() {
  return /* @__PURE__ */ jsx(Section, { id: "how-it-works", tone: "sunken", className: "rule-top", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        eyebrow: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Feather, { size: 14 }),
          " The whole process"
        ] }),
        title: "Two things for you to do. Two for us.",
        deck: `About ${PROOF.avgOrderMinutes} minutes of your time, and the book is in your hands inside ten days.`
      }
    ),
    /* @__PURE__ */ jsxs("ol", { className: "relative mt-16 grid gap-10 sm:gap-12 lg:mt-24 lg:grid-cols-4 lg:gap-8", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "pointer-events-none absolute left-[1.4rem] top-4 bottom-8 w-px lg:left-0 lg:right-0 lg:top-[1.45rem] lg:bottom-auto lg:h-px lg:w-full",
          style: {
            backgroundImage: "repeating-linear-gradient(var(--stitch-dir, to bottom), var(--l-strong) 0 6px, transparent 6px 12px)"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-0 hidden lg:block",
          style: {
            backgroundImage: "repeating-linear-gradient(to right, var(--l-strong) 0 6px, transparent 6px 12px)",
            backgroundSize: "100% 1px",
            backgroundPosition: "0 1.45rem",
            backgroundRepeat: "no-repeat"
          }
        }
      ),
      STEPS.map((step, i) => /* @__PURE__ */ jsxs(
        Reveal,
        {
          as: "li",
          y: 22,
          delay: i * 110,
          className: "relative flex gap-5 lg:flex-col lg:gap-6",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex shrink-0 flex-col items-center gap-2 lg:flex-row lg:gap-3", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `grid size-11 place-items-center rounded-full border-2 shadow-e1 ${step.who === "You" ? "border-verdant-600 bg-verdant-50 text-verdant-700 night:border-verdant-500 night:text-verdant-600" : "border-strong bg-raised text-ink-soft"}`,
                  children: /* @__PURE__ */ jsx(step.icon, { size: 19 })
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "font-display text-small font-semibold text-ink-muted tabular-nums", children: [
                "0",
                step.n
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 pb-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-2 flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `rounded-full px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.1em] uppercase ${step.who === "You" ? "bg-verdant-50 text-verdant-700" : "bg-inset text-ink-muted"}`,
                    children: step.who
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-[0.68rem] font-bold tracking-[0.08em] uppercase text-ink-muted", children: step.time })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-[1.15rem] leading-snug font-semibold", children: step.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-[34ch] text-small text-ink-soft", children: step.body })
            ] })
          ]
        },
        step.n
      ))
    ] }),
    /* @__PURE__ */ jsxs(Reveal, { y: 16, delay: 200, className: "mt-14 flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        OrderButton,
        {
          intent: "hero",
          label: "Start step one",
          sublabel: "Opens WhatsApp · nothing to pay yet"
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "text-small text-ink-muted", children: [
        "Or",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "#journey",
            className: "font-semibold underline decoration-gold-500 decoration-2 underline-offset-4",
            children: "watch the whole conversation"
          }
        ),
        " ",
        "first."
      ] })
    ] })
  ] }) });
}
function PhoneFrame({
  children,
  status = "online",
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative mx-auto w-full max-w-[22rem] rounded-[2.6rem] p-[0.42rem] shadow-e4",
        style: {
          background: "linear-gradient(155deg, #4a4550, #16131c 40%, #34303c)"
        },
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "absolute -right-[2px] top-[24%] h-14 w-[3px] rounded-r-sm bg-[#3a3542]"
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "absolute -left-[2px] top-[20%] h-8 w-[3px] rounded-l-sm bg-[#3a3542]"
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "absolute -left-[2px] top-[31%] h-12 w-[3px] rounded-l-sm bg-[#3a3542]"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[2.2rem] bg-[var(--chat-canvas)]", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", style: { background: "var(--chat-header)" }, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 pt-2.5 pb-1 text-[0.62rem] font-semibold text-white/85", children: [
                /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: "21:47" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-black/85"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", "aria-hidden": "true", children: [
                  /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 14 10", className: "h-2.5 w-3.5", fill: "currentColor", children: [
                    /* @__PURE__ */ jsx("rect", { x: "0", y: "6.5", width: "2.4", height: "3.5", rx: "0.6" }),
                    /* @__PURE__ */ jsx("rect", { x: "3.8", y: "4.5", width: "2.4", height: "5.5", rx: "0.6" }),
                    /* @__PURE__ */ jsx("rect", { x: "7.6", y: "2.5", width: "2.4", height: "7.5", rx: "0.6" }),
                    /* @__PURE__ */ jsx("rect", { x: "11.4", y: "0.5", width: "2.4", height: "9.5", rx: "0.6", opacity: "0.4" })
                  ] }),
                  /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 26 12", className: "h-2.5 w-5", fill: "none", children: [
                    /* @__PURE__ */ jsx(
                      "rect",
                      {
                        x: "0.7",
                        y: "0.7",
                        width: "21",
                        height: "10.6",
                        rx: "3",
                        stroke: "currentColor",
                        strokeOpacity: "0.55",
                        strokeWidth: "1.2"
                      }
                    ),
                    /* @__PURE__ */ jsx("rect", { x: "2.4", y: "2.4", width: "14", height: "7.2", rx: "1.8", fill: "currentColor" }),
                    /* @__PURE__ */ jsx("path", { d: "M23.6 4.2v3.6a2 2 0 0 0 0-3.6Z", fill: "currentColor", fillOpacity: "0.6" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3.5 pb-3", children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-white/70", children: "‹" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "grid size-9 shrink-0 place-items-center rounded-full bg-[#f2c14e] text-[0.8rem] font-bold text-[#1a1520]",
                    children: "BM"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1 leading-tight", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[0.82rem] font-semibold text-white", children: [
                    "BookMojo",
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        className: "grid size-3.5 place-items-center rounded-full bg-[#25d366] text-[#075e54]",
                        title: "Verified business",
                        children: /* @__PURE__ */ jsx(Check, { size: 9, strokeWidth: 3.4 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "block truncate text-[0.66rem] text-white/70", children: status })
                ] }),
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-white/60", children: "⋮" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": "true",
                className: "pointer-events-none absolute inset-x-0 bottom-0 top-[4.6rem] opacity-[0.07]",
                style: {
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' fill='none' stroke='%23000' stroke-width='2'%3E%3Ccircle cx='24' cy='28' r='7'/%3E%3Cpath d='M62 18l6 12-12 0z'/%3E%3Cpath d='M92 40h16v14H92z'/%3E%3Cpath d='M18 78c8-8 18-8 26 0'/%3E%3Ccircle cx='84' cy='92' r='9'/%3E%3Cpath d='M46 104h20'/%3E%3C/svg%3E")`,
                  backgroundSize: "120px 120px"
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative", children }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center gap-2 border-t border-black/10 px-3 py-2.5",
                style: { background: "var(--chat-canvas)" },
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "flex h-9 flex-1 items-center rounded-full bg-[var(--chat-in)] px-3.5 text-[0.74rem] text-[var(--chat-in-ink)] opacity-45", children: "Message" }),
                  /* @__PURE__ */ jsx("span", { className: "grid size-9 shrink-0 place-items-center rounded-full bg-[#0b7c43] text-white", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "size-4", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M3 20.5l18-8.5L3 3.5l3.6 7.1L15 12l-8.4 1.4z" }) }) })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "mt-4 text-center text-[0.7rem] text-ink-muted", children: [
      "A depiction of the real conversation · ",
      BRAND.whatsappDisplay
    ] })
  ] });
}
function ChatMessage({ msg, delivered = true }) {
  switch (msg.kind) {
    case "in":
      return /* @__PURE__ */ jsxs("div", { className: "bubble bubble-in whitespace-pre-line", children: [
        /* @__PURE__ */ jsx("span", { children: msg.text }),
        /* @__PURE__ */ jsx(Timestamp, {})
      ] });
    case "out":
      return /* @__PURE__ */ jsxs("div", { className: "bubble bubble-out whitespace-pre-line", children: [
        /* @__PURE__ */ jsx("span", { children: msg.text }),
        /* @__PURE__ */ jsx(Timestamp, { ticks: delivered })
      ] });
    /* Quick-reply chips. The chosen one is visibly selected: this is what tells
       the visitor "you will mostly be tapping, not typing". */
    case "chips":
      return /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-end gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: `${msg.label}: ${msg.options[msg.chosen] ?? msg.options[0]} selected` }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-end gap-1.5", "aria-hidden": "true", children: msg.options.map((option, i) => /* @__PURE__ */ jsx(
          "span",
          {
            className: cx(
              "rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold transition-colors",
              i === msg.chosen ? "border-transparent bg-[#0b7c43] text-white shadow-sm" : "border-black/12 bg-[var(--chat-in)] text-[var(--chat-in-ink)] opacity-65"
            ),
            children: option
          },
          option
        )) })
      ] });
    /* Order summary: the pre-payment review artefact. */
    case "summary":
      return /* @__PURE__ */ jsxs("div", { className: "w-[88%] self-start overflow-hidden rounded-xl bg-[var(--chat-in)] text-[var(--chat-in-ink)] shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-black/[0.055] px-3 py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[0.62rem] font-bold tracking-[0.1em] uppercase opacity-70", children: "Your book" }),
          /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#0b7c43]/12 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-[#0b7c43]", children: "Preview" })
        ] }),
        /* @__PURE__ */ jsx("dl", { className: "divide-y divide-black/[0.07] px-3", children: msg.rows.map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-3 py-1.5", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-[0.7rem] opacity-60", children: k }),
          /* @__PURE__ */ jsx("dd", { className: "max-w-[62%] text-right text-[0.72rem] font-semibold", children: v })
        ] }, k)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-black/[0.055] px-3 py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[0.7rem] font-semibold", children: "Total, all in" }),
          /* @__PURE__ */ jsx("span", { className: "text-[0.85rem] font-bold tabular-nums", children: msg.total })
        ] })
      ] });
    /* Payment: the single highest-anxiety moment in a chat-based purchase, so it
       gets the most explicit artefact on the page. */
    case "payment":
      return /* @__PURE__ */ jsxs("div", { className: "w-[88%] self-start overflow-hidden rounded-xl border border-black/10 bg-[var(--chat-in)] text-[var(--chat-in-ink)] shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-black/[0.08] px-3 py-2", children: [
          /* @__PURE__ */ jsx(Lock, { size: 14, className: "text-[#0b7c43]" }),
          /* @__PURE__ */ jsx("span", { className: "text-[0.68rem] font-bold", children: "Secure checkout link" }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto text-[0.6rem] opacity-55", children: "expires in 30 min" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-3 py-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[0.65rem] opacity-60", children: "Amount due" }),
          /* @__PURE__ */ jsx("p", { className: "font-display text-[1.5rem] leading-none font-semibold tabular-nums", children: msg.total }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: msg.methods.map((method) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "rounded-md border border-black/10 bg-black/[0.03] px-2 py-1 text-[0.65rem] font-semibold",
              children: method
            },
            method
          )) }),
          /* @__PURE__ */ jsx("span", { className: "mt-3 flex h-9 items-center justify-center rounded-lg bg-[#0b7c43] text-[0.75rem] font-bold text-white", children: "Pay securely" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-[0.6rem] leading-snug opacity-55", children: "Opens our payment provider. Card details are never sent in this chat and we never store them." })
        ] })
      ] });
    case "receipt":
      return /* @__PURE__ */ jsx("div", { className: "w-[80%] self-start overflow-hidden rounded-xl bg-[var(--chat-in)] text-[var(--chat-in-ink)] shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 px-3 py-3", children: [
        /* @__PURE__ */ jsx("span", { className: "grid size-8 shrink-0 place-items-center rounded-full bg-[#0b7c43] text-white", children: /* @__PURE__ */ jsx(Check, { size: 16, strokeWidth: 2.6 }) }),
        /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[0.74rem] font-bold", children: "Payment confirmed" }),
          /* @__PURE__ */ jsxs("span", { className: "block text-[0.65rem] opacity-60", children: [
            "Order ",
            msg.id,
            " · ",
            msg.total,
            " · receipt saved to this chat"
          ] })
        ] })
      ] }) });
    /* Production tracker: turns a 5–7 day wait from a void into a process. */
    case "tracker":
      return /* @__PURE__ */ jsxs("div", { className: "w-[90%] self-start overflow-hidden rounded-xl bg-[var(--chat-in)] px-3 py-3 text-[var(--chat-in-ink)] shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[0.62rem] font-bold tracking-[0.1em] uppercase opacity-65", children: "In production" }),
        /* @__PURE__ */ jsx("ol", { className: "mt-2.5 flex flex-col gap-0", children: msg.steps.map((step, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2.5", children: [
          /* @__PURE__ */ jsxs("span", { className: "relative flex w-4 shrink-0 flex-col items-center", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cx(
                  "mt-1 size-2.5 shrink-0 rounded-full",
                  step.state === "done" && "bg-[#0b7c43]",
                  step.state === "active" && "bg-[#e08a2e] ring-3 ring-[#e08a2e]/25 animate-pulse",
                  step.state === "todo" && "bg-black/15"
                )
              }
            ),
            i < msg.steps.length - 1 && /* @__PURE__ */ jsx(
              "span",
              {
                className: cx(
                  "w-px flex-1",
                  step.state === "done" ? "bg-[#0b7c43]/40" : "bg-black/12"
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: cx(
                "pb-2.5 text-[0.72rem] leading-snug",
                step.state === "todo" ? "opacity-45" : "font-semibold"
              ),
              children: [
                step.label,
                step.state === "active" && /* @__PURE__ */ jsx("span", { className: "ml-1.5 text-[0.6rem] font-bold uppercase text-[#b06a12]", children: "now" })
              ]
            }
          )
        ] }, step.label)) })
      ] });
    case "shipment":
      return /* @__PURE__ */ jsxs("div", { className: "w-[88%] self-start overflow-hidden rounded-xl bg-[var(--chat-in)] text-[var(--chat-in-ink)] shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 border-b border-black/[0.08] px-3 py-2", children: [
          /* @__PURE__ */ jsx(Truck, { size: 15, className: "text-[#0b7c43]" }),
          /* @__PURE__ */ jsx("span", { className: "text-[0.7rem] font-bold", children: msg.courier }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto font-mono text-[0.62rem] opacity-60", children: msg.code })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-3 py-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", "aria-hidden": "true", children: ["Printed", "Boxed", "In transit", "Out for delivery", "Delivered"].map((s, i) => /* @__PURE__ */ jsx(
            "span",
            {
              className: cx(
                "h-1.5 flex-1 rounded-full",
                i < 4 ? "bg-[#0b7c43]" : "bg-black/12"
              )
            },
            s
          )) }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-[0.72rem] font-semibold", children: "Out for delivery" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[0.65rem] opacity-60", children: [
            "Arriving ",
            msg.eta
          ] })
        ] })
      ] });
    default:
      return null;
  }
}
function Timestamp({ ticks = false }) {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: "float-right ml-2 mt-1 flex translate-y-0.5 items-center gap-0.5 text-[0.58rem] opacity-55",
      "aria-hidden": "true",
      children: [
        "21:47",
        ticks && /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 18 12", className: "w-3.5", fill: "none", stroke: "#34b7f1", strokeWidth: "1.6", children: [
          /* @__PURE__ */ jsx("path", { d: "M1 6.6l3 3L9.5 3", strokeLinecap: "round" }),
          /* @__PURE__ */ jsx("path", { d: "M7 6.6l3 3L16.5 3", strokeLinecap: "round" })
        ] })
      ]
    }
  );
}
function TypingBubble() {
  return /* @__PURE__ */ jsx("div", { className: "bubble bubble-in flex items-center gap-1 py-2.5", "aria-hidden": "true", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx(
    "span",
    {
      className: "size-1.5 rounded-full bg-current opacity-40",
      style: { animation: `twinkle 1.1s var(--ease-in-out) ${i * 0.16}s infinite` }
    },
    i
  )) });
}
function buildJourney(draft) {
  const name = formatName(draft.childName) || "Aarav";
  const theme = THEME_BY_ID.get(draft.themeId);
  const themeName = theme?.name ?? "The Night the Terrace Grew Stars";
  const language = LANGUAGES.find((l) => l.code === draft.language)?.label ?? "English";
  const total = formatINR(PRICING.hardcover);
  return [
    {
      id: "details",
      label: "Details",
      title: "Five questions. That is the whole form.",
      reassurance: "No account, no password. Type or tap the suggested replies.",
      eta: "~90 seconds",
      actor: "you",
      messages: [
        {
          kind: "in",
          text: `Hello! 👋 I’ll build the book with you right here. Five quick questions — you can type or just tap.

1️⃣ What is your child’s first name, exactly as it should be printed?`
        },
        { kind: "out", text: name },
        {
          kind: "in",
          text: `${name}. Lovely. 2️⃣ How old is ${name}? This sets the reading level and page count.`
        },
        {
          kind: "chips",
          label: "Age",
          options: ["2–3", "4–5", "6–8", "9–12"],
          chosen: ["2-3", "4-5", "6-8", "9-12"].indexOf(draft.age)
        },
        { kind: "in", text: "3️⃣ Should the book be printed in English or Hindi?" },
        {
          kind: "chips",
          label: "Language",
          options: ["English", "हिन्दी"],
          chosen: Math.max(0, ["English", "Hindi"].indexOf(language))
        }
      ]
    },
    {
      id: "story",
      label: "Story",
      title: "Choose the world. We handle the writing.",
      reassurance: "Each world is a real manuscript, rewritten around your answers.",
      eta: "~60 seconds",
      actor: "you",
      messages: [
        {
          kind: "in",
          text: `4️⃣ Here are the three stories that fit ${name} best. I’ve sent a sample page for each. 📖`
        },
        {
          kind: "chips",
          label: "Story world",
          options: [themeName, "The Banyan That Remembered", "Nine Moons Past Sriharikota"],
          chosen: 0
        },
        {
          kind: "in",
          text: `5️⃣ Last one — what does ${name} look like? Send a photo and I’ll match skin tone, hair and glasses, or pick from the illustrated options.`
        },
        { kind: "out", text: "📎 photo.jpg" },
        {
          kind: "in",
          text: `Got it — matched. ✨ Want to add a private dedication on the first page? Grandparents love this one. (Optional, tap skip.)`
        },
        {
          kind: "out",
          text: `For ${name}, who asks the best questions. Love, Mumma & Papa`
        }
      ]
    },
    {
      id: "review",
      label: "Review",
      title: "See it before you pay.",
      reassurance: "The real cover plus two spreads. Change anything. Nothing is charged until you approve.",
      eta: "Instant",
      actor: "us",
      messages: [
        { kind: "in", text: `Here is ${possessive(name)} book. Have a look before anything else.` },
        {
          kind: "summary",
          rows: [
            ["Hero", name],
            ["Age / reading level", `${draft.age} years`],
            ["Story", themeName],
            ["Language", language],
            ["Format", "Hardcover · linen spine · gift box"]
          ],
          total
        },
        {
          kind: "in",
          text: "Tap ✅ to approve, or tell me what to change — spelling, story, hair colour, anything."
        },
        { kind: "out", text: "✅ Approved. It’s perfect." }
      ]
    },
    {
      id: "payment",
      label: "Payment",
      title: "Paid on a secure page, not in the chat.",
      reassurance: "A one-time encrypted link. Payment details never appear in a message.",
      eta: "~40 seconds",
      actor: "you",
      messages: [
        {
          kind: "in",
          text: "Where should we deliver it? Address, city, PIN code — one message is fine."
        },
        { kind: "out", text: "B-402, Ashoka Residency, Koramangala 5th Block, Bengaluru 560095" },
        {
          /* UPI first, and not as a token gesture: it is how most of this market
             actually pays. Leading with Apple Pay would signal that the page was
             built for somewhere else and localised afterwards. */
          kind: "payment",
          total,
          methods: ["UPI", "Card", "Net banking", "Wallets"]
        },
        {
          kind: "in",
          text: "🔒 Secure one-time link. Nothing is stored in this chat. GST and tracked delivery are already in the price."
        }
      ]
    },
    {
      id: "confirmed",
      label: "Confirmed",
      title: "A receipt you can find again.",
      reassurance: "It lives in a thread you already check. No hunting through email.",
      eta: "Instant",
      actor: "us",
      messages: [
        { kind: "receipt", id: "BM-8241", total },
        {
          kind: "in",
          text: `Payment received — thank you! 🎉 ${possessive(name)} book is going to our studio now. I’ll message you at every stage, and you can reply here any time.`
        }
      ]
    },
    {
      id: "production",
      label: "Made",
      title: "Watch it being made.",
      reassurance: "Illustrated, proofed by a human, printed. You get a photo off the press.",
      eta: `${PROOF.productionDays} days`,
      actor: "us",
      messages: [
        {
          kind: "tracker",
          steps: [
            { label: "Manuscript personalised", state: "done" },
            { label: "Illustrations matched", state: "done" },
            { label: "Proofread by an editor", state: "done" },
            { label: "Printing · litho, 170gsm", state: "active" },
            { label: "Foiling & hardcover binding", state: "todo" }
          ]
        },
        {
          kind: "in",
          text: "📸 Off the press this morning. Here she is before the gift box goes on."
        }
      ]
    },
    {
      id: "delivery",
      label: "Delivered",
      title: "Tracked to the door.",
      reassurance: "Live tracking in the same thread, and a heads-up the day before.",
      eta: `${PROOF.metroDeliveryDays} days`,
      actor: "us",
      messages: [
        { kind: "shipment", courier: "Blue Dart", code: "BM8241KA", eta: "Tomorrow, before 1pm" },
        {
          kind: "in",
          text: `Out for delivery. 📦 If it’s a surprise, I can hold it for a date you choose — just say the word.`
        },
        { kind: "out", text: "She has not put it down. Thank you. 🥹" }
      ]
    }
  ];
}
const TYPING_MS = 900;
const SEND_MS = 620;
const STAGE_GAP_MS = 1500;
function Journey() {
  const { draft } = useDraft();
  const stages = useMemo(() => buildJourney(draft), [draft]);
  const still = useReducedMotion();
  const [stageIndex, setStageIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const stage = stages[stageIndex];
  const messages = stage.messages;
  const scroller = useRef(null);
  const tabs = useRef(null);
  const sentinel = useInView(() => setStarted(true), { threshold: 0 });
  useEffect(() => {
    if (!started) return;
    if (still) {
      setStep(messages.length);
      return;
    }
    setPlaying(true);
  }, [started, still, messages.length]);
  const goToStage = useCallback(
    (index, autoplay = true) => {
      setStageIndex(index);
      setStep(still ? stages[index].messages.length : 0);
      setTyping(false);
      setPlaying(!still && autoplay);
      track("journey_step_view", { stage: stages[index].id, manual: true });
    },
    [stages, still]
  );
  useEffect(() => {
    if (!playing || still) return;
    if (step >= messages.length) {
      const id2 = window.setTimeout(() => {
        if (stageIndex < stages.length - 1) {
          const next2 = stageIndex + 1;
          setStageIndex(next2);
          setStep(0);
          track("journey_step_view", { stage: stages[next2].id, manual: false });
        } else {
          setPlaying(false);
        }
      }, STAGE_GAP_MS);
      return () => window.clearTimeout(id2);
    }
    const next = messages[step];
    const fromUs = next.kind !== "out" && next.kind !== "chips";
    if (fromUs && !typing) {
      setTyping(true);
      const id2 = window.setTimeout(() => setTyping(false), TYPING_MS);
      return () => window.clearTimeout(id2);
    }
    const id = window.setTimeout(() => setStep((s) => s + 1), fromUs ? 120 : SEND_MS);
    return () => window.clearTimeout(id);
  }, [playing, still, step, typing, messages, stageIndex, stages]);
  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: still ? "auto" : "smooth" });
  }, [step, typing, still]);
  const onTabKey = (e) => {
    const map = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1
    };
    const delta = map[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = (stageIndex + delta + stages.length) % stages.length;
    goToStage(next);
    const buttons = tabs.current?.querySelectorAll('[role="tab"]');
    buttons?.[next]?.focus();
  };
  const visible = messages.slice(0, step);
  const overallProgress = (stageIndex + step / Math.max(messages.length, 1)) / stages.length * 100;
  return /* @__PURE__ */ jsxs(Section, { id: "journey", tone: "inverse", space: "grand", className: "overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 opacity-40",
        style: {
          background: "radial-gradient(60rem 40rem at 78% 30%, color-mix(in oklab, var(--w-500) 26%, transparent), transparent 70%), radial-gradient(50rem 40rem at 12% 70%, color-mix(in oklab, var(--clay-500) 32%, transparent), transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs(Container, { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { ref: sentinel }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-[46rem]", children: [
        /* @__PURE__ */ jsxs(Reveal, { y: 12, className: "eyebrow !text-white/55", children: [
          /* @__PURE__ */ jsx(WhatsAppMark, { size: 14 }),
          " The ordering conversation"
        ] }),
        /* @__PURE__ */ jsxs(Reveal, { y: 20, delay: 70, as: "h2", className: "mt-4 text-display-2", children: [
          "Watch the entire order happen.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-white/55", children: "Then decide." })
        ] }),
        /* @__PURE__ */ jsx(Reveal, { y: 18, delay: 140, children: /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-[46ch] text-lead text-white/70", children: "The real flow, with your choices in it. Nothing is hidden behind the click." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 3xl:gap-24", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-1 flex-1 overflow-hidden rounded-full bg-white/12",
                role: "progressbar",
                "aria-valuenow": Math.round(overallProgress),
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-label": "Journey progress",
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-verdant-500 transition-[width] duration-500 ease-linear",
                    style: { width: `${overallProgress}%` }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "glass glass-onDark flex shrink-0 items-center gap-1 rounded-full p-1", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setPlaying((p) => !p),
                  className: "btn btn-quiet btn-icon-sm text-white/75 hover:!bg-white/12 hover:text-white",
                  disabled: still,
                  "aria-label": playing ? "Pause the conversation" : "Play the conversation",
                  children: playing ? /* @__PURE__ */ jsx(Pause, { size: 16 }) : /* @__PURE__ */ jsx(Play, { size: 16 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => goToStage(0),
                  className: "btn btn-quiet btn-icon-sm text-white/75 hover:!bg-white/12 hover:text-white",
                  "aria-label": "Start the conversation again",
                  children: /* @__PURE__ */ jsx(Replay, { size: 16 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: tabs,
              role: "tablist",
              "aria-label": "Ordering stages",
              "aria-orientation": "vertical",
              onKeyDown: onTabKey,
              className: "mt-6 flex flex-col",
              children: stages.map((s, i) => {
                const active = i === stageIndex;
                const complete = i < stageIndex;
                return /* @__PURE__ */ jsxs("div", { className: "border-b border-white/10 last:border-0", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      role: "tab",
                      type: "button",
                      id: `stage-tab-${s.id}`,
                      "aria-selected": active,
                      "aria-controls": "stage-panel",
                      tabIndex: active ? 0 : -1,
                      onClick: () => goToStage(i),
                      className: "group flex w-full items-center gap-4 py-4 text-left",
                      children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            "aria-hidden": "true",
                            className: cx(
                              "grid size-8 shrink-0 place-items-center rounded-full border text-[0.7rem] font-bold tabular-nums transition-all duration-300",
                              active && "border-verdant-500 bg-verdant-500 text-[#06230f] scale-105",
                              complete && "border-verdant-500/40 bg-verdant-500/15 text-verdant-500",
                              !active && !complete && "border-white/20 text-white/45"
                            ),
                            children: complete ? "✓" : i + 1
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: cx(
                              "font-display block text-[1.05rem] leading-tight font-semibold transition-colors",
                              active ? "text-white" : "text-white/55 group-hover:text-white/85"
                            ),
                            children: s.title
                          }
                        ) }),
                        /* @__PURE__ */ jsxs(
                          "span",
                          {
                            className: cx(
                              "shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.08em] uppercase transition-colors",
                              s.actor === "you" ? "bg-verdant-500/15 text-verdant-500" : "bg-white/8 text-white/50"
                            ),
                            children: [
                              s.actor === "you" ? "You" : "Us",
                              " · ",
                              s.eta
                            ]
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "grid transition-[grid-template-rows] duration-[400ms] ease-[var(--ease-out)]",
                      style: { gridTemplateRows: active ? "1fr" : "0fr" },
                      children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx("p", { className: "max-w-[54ch] pb-5 pl-12 text-small text-white/65", children: s.reassurance }) })
                    }
                  )
                ] }, s.id);
              })
            }
          ),
          /* @__PURE__ */ jsxs(Reveal, { y: 16, className: "mt-10 flex flex-col gap-4 sm:flex-row sm:items-center", children: [
            /* @__PURE__ */ jsx(
              OrderButton,
              {
                intent: "final",
                label: "Do this for real",
                sublabel: "Opens WhatsApp · about 4 minutes"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "max-w-[22ch] text-small text-white/55", children: "Nothing is charged before you approve the cover." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:sticky lg:top-28 lg:w-[22rem]", children: /* @__PURE__ */ jsx(PhoneFrame, { status: typing ? "typing…" : "online · replies in ~2 min", children: /* @__PURE__ */ jsx(
          "div",
          {
            ref: scroller,
            id: "stage-panel",
            role: "tabpanel",
            "aria-labelledby": `stage-tab-${stage.id}`,
            "aria-live": "polite",
            className: "rail-scroll flex h-[27rem] flex-col justify-end gap-2 overflow-y-auto px-3 py-4",
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "mx-auto rounded-md bg-black/[0.06] px-2 py-0.5 text-[0.6rem] font-medium text-[var(--chat-in-ink)] opacity-60", children: stage.label }),
              visible.map((msg, i) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: cx(
                    "flex w-full",
                    msg.kind === "out" || msg.kind === "chips" ? "justify-end" : "justify-start"
                  ),
                  style: still ? void 0 : { animation: "msg-in 260ms var(--ease-spring) both" },
                  children: /* @__PURE__ */ jsx(ChatMessage, { msg })
                },
                `${stage.id}-${i}`
              )),
              typing && /* @__PURE__ */ jsx(TypingBubble, {})
            ] })
          }
        ) }) })
      ] })
    ] })
  ] });
}
function Themes() {
  const { draft, update, isPersonalised } = useDraft();
  const name = formatName(draft.childName);
  const choose = (themeId) => {
    update({ themeId });
    track("theme_open", { theme: themeId });
    document.getElementById("create")?.scrollIntoView({ block: "start" });
  };
  return /* @__PURE__ */ jsx(Section, { id: "themes", space: "grand", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        eyebrow: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(BookGlyph, { size: 14 }),
          " Six original worlds"
        ] }),
        title: isPersonalised ? /* @__PURE__ */ jsxs(Fragment, { children: [
          "Six stories. Same hero:",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "quill", children: name }),
          "."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "Choose the world.",
          /* @__PURE__ */ jsx("br", {}),
          "We write your child into it."
        ] }),
        deck: "Original stories set where your child actually lives — a summer terrace, the banyan at the end of the lane, a launch pad on the Bay of Bengal."
      }
    ),
    /* @__PURE__ */ jsx("ul", { className: "mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8", children: THEMES.map((theme, i) => {
      const selected = theme.id === draft.themeId;
      const ages = theme.ages.map((a) => AGE_BANDS.find((b) => b.id === a)?.label ?? a).join(" · ");
      return /* @__PURE__ */ jsx(
        Reveal,
        {
          as: "li",
          y: 26,
          delay: i % 3 * 90,
          scale: 0.98,
          className: "h-full",
          children: /* @__PURE__ */ jsxs(
            "article",
            {
              className: cx(
                "card card-lift flex h-full flex-col overflow-hidden",
                selected && "!border-ink shadow-e3"
              ),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden border-b border-hairline bg-sunken", children: [
                  /* @__PURE__ */ jsx("div", { className: "mx-auto w-[62%] pt-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-[3px] shadow-book", children: /* @__PURE__ */ jsx(
                    BookCover,
                    {
                      draft: { ...draft, themeId: theme.id },
                      className: "block w-full"
                    }
                  ) }) }),
                  /* @__PURE__ */ jsx("div", { className: "h-8" }),
                  theme.popular && /* @__PURE__ */ jsx("span", { className: "absolute left-4 top-4", children: /* @__PURE__ */ jsx(Pill, { tone: "gold", children: "Most chosen" }) }),
                  selected && /* @__PURE__ */ jsxs("span", { className: "absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-inverse px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.08em] uppercase text-ink-inverse", children: [
                    /* @__PURE__ */ jsx(Check, { size: 12, strokeWidth: 3 }),
                    " In your preview"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[0.72rem] font-bold tracking-[0.1em] uppercase text-gold-700 night:text-gold-500", children: theme.promise }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-2.5 text-title", children: theme.name }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 flex-1 text-small text-ink-soft", children: theme.blurb }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-between gap-3 border-t border-hairline pt-4", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-small font-semibold text-ink-muted", children: [
                      "Ages ",
                      ages
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => choose(theme.id),
                        className: "btn btn-tonal btn-sm group",
                        "aria-label": `Put ${name || "your child"} in ${theme.name}`,
                        children: [
                          selected ? "Selected" : "Try this world",
                          /* @__PURE__ */ jsx(
                            ArrowRight,
                            {
                              size: 15,
                              className: "transition-transform duration-300 group-hover:translate-x-0.5"
                            }
                          )
                        ]
                      }
                    )
                  ] })
                ] })
              ]
            }
          )
        },
        theme.id
      );
    }) }),
    /* @__PURE__ */ jsxs(Reveal, { y: 16, className: "mt-14 flex flex-col items-center gap-3 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "max-w-[40ch] text-ink-soft", children: "Not sure which one? Tell us about your child in the chat and we will suggest the fit." }),
      /* @__PURE__ */ jsx(
        OrderButton,
        {
          intent: "gift",
          label: "Ask us which story fits",
          sublabel: "A human replies during opening hours"
        }
      )
    ] })
  ] }) });
}
const SPREADS = [
  {
    id: "dedication",
    folio: "i",
    role: "The dedication page",
    paragraphs: [
      "For {name},",
      "who asks the best questions and never accepts the first answer.",
      "Love, Mumma & Papa"
    ],
    figure: "none",
    caption: "Set by hand in the story’s own typeface. This is the page dadi photographs."
  },
  {
    id: "opening",
    folio: "3",
    role: "How it is written",
    heading: "Chapter one",
    paragraphs: [
      "Everyone else had gone down for the night, but {name} stayed up on the terrace — because somebody had to count the stars, and tonight it was {name}’s turn.",
      "The trouble with counting stars is that they move. Not quickly. Not so you would notice. But by the time you reach four hundred, the ones you started with have quietly shuffled along, and you have to begin again.",
      "{name} did not mind beginning again. {name} had the whole night, and a charpai still warm from the afternoon."
    ],
    figure: "high",
    caption: "Sentence length, vocabulary and page count all shift with their age band."
  },
  {
    id: "personal",
    folio: "11",
    role: "Personalisation beyond the name",
    heading: "The four hundred and first",
    paragraphs: [
      "The four hundred and first star was not where it should have been. It was lower. Closer. And it was, {name} noticed, exactly the colour of the lamp Nani leaves burning beside the door all night.",
      "“Oh,” said {name}, out loud, to nobody at all. “Oh, I see.”"
    ],
    figure: "centre",
    caption: "Their looks, age, language and the details you mention are woven through the whole book."
  },
  {
    id: "ending",
    folio: "31",
    role: "The last page",
    paragraphs: [
      "And every single one of them, all four hundred and one, was a light somebody had left burning for {name}.",
      "So sleep now, {name}. The counting can wait."
    ],
    figure: "low",
    caption: "Every story lands on the same feeling: you are known, and you are loved."
  }
];
function Spreads() {
  const { draft } = useDraft();
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState(null);
  const busy = useRef(false);
  const theme = THEME_BY_ID.get(draft.themeId) ?? THEMES[0];
  const name = formatName(draft.childName) || "Ava";
  const spread = SPREADS[index];
  const previous = SPREADS[Math.max(0, index - 1)];
  const go = useCallback(
    (dir) => {
      const next = index + dir;
      if (next < 0 || next >= SPREADS.length) return;
      if (busy.current) return;
      setIndex(next);
      track("spread_turn", { to: SPREADS[next].id });
      if (still) return;
      busy.current = true;
      setTurn({ dir, key: Date.now() });
      window.setTimeout(() => {
        busy.current = false;
        setTurn(null);
      }, 640);
    },
    [index, still]
  );
  useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      if (target?.closest("[data-spread-viewer]") == null) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);
  const fill = (text2) => text2.replaceAll("{name}", name);
  const turning = turn !== null;
  const overlaySpread = turn?.dir === 1 ? previous : spread;
  return /* @__PURE__ */ jsx(Section, { space: "grand", tone: "sunken", className: "rule-top overflow-hidden", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        eyebrow: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Feather, { size: 14 }),
          " Inside the book"
        ] }),
        title: "Turn the pages before you buy them.",
        deck: "Four spreads from a real BookMojo, with your child's name already in the text."
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        "data-spread-viewer": true,
        tabIndex: -1,
        className: "mt-14 lg:mt-20",
        "aria-roledescription": "book preview",
        children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[62rem]", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", style: { perspective: "2400px" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "relative grid grid-cols-1 overflow-hidden rounded-[0.6rem] shadow-book sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative aspect-[5/6] bg-inverse sm:aspect-auto sm:min-h-[26rem]", children: [
                /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    viewBox: "0 0 300 360",
                    className: "absolute inset-0 size-full",
                    preserveAspectRatio: "xMidYMid slice",
                    "aria-hidden": "true",
                    children: [
                      /* @__PURE__ */ jsx(Motif, { motif: theme.motif, palette: theme.palette }),
                      spread.figure !== "none" && /* @__PURE__ */ jsx(
                        "g",
                        {
                          transform: `translate(96 ${spread.figure === "high" ? 150 : spread.figure === "low" ? 214 : 182}) scale(1.1)`,
                          children: /* @__PURE__ */ jsx(
                            HeroChild,
                            {
                              look: draft.look,
                              outfit: theme.palette.accent,
                              outfitDeep: theme.palette.deep,
                              animate: !still
                            }
                          )
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-black/35"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "absolute bottom-3 left-4 text-[0.6rem] font-semibold tracking-[0.2em] text-white/45", children: "BOOKMOJO" })
              ] }),
              /* @__PURE__ */ jsx(Page, { spread, fill }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  "aria-hidden": "true",
                  className: "pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-black/15 sm:block"
                }
              )
            ] }),
            turning && /* @__PURE__ */ jsxs(
              "div",
              {
                "aria-hidden": "true",
                className: cx(
                  "pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 origin-left overflow-hidden rounded-r-[0.6rem] sm:block",
                  turn.dir === 1 ? "page-turn-fwd" : "page-turn-back"
                ),
                style: { backfaceVisibility: "hidden" },
                children: [
                  /* @__PURE__ */ jsx(Page, { spread: overlaySpread, fill }),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-l from-black/0 via-black/5 to-black/25" })
                ]
              },
              turn.key
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => go(-1),
                disabled: index === 0,
                className: "btn btn-tonal btn-icon disabled:opacity-30",
                "aria-label": "Previous spread",
                children: /* @__PURE__ */ jsx(Chevron, { size: 18, className: "rotate-180" })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center gap-2", role: "tablist", "aria-label": "Spreads", children: SPREADS.map((s, i) => /* @__PURE__ */ jsxs(
              "button",
              {
                role: "tab",
                type: "button",
                "aria-selected": i === index,
                onClick: () => go(i > index ? 1 : -1),
                className: "group flex flex-1 flex-col gap-1.5 py-1 text-left",
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cx(
                        "h-[3px] w-full rounded-full transition-colors duration-300",
                        i === index ? "bg-ink" : i < index ? "bg-strong" : "bg-hairline group-hover:bg-strong"
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cx(
                        "hidden text-[0.68rem] font-semibold transition-colors sm:block",
                        i === index ? "text-ink" : "text-ink-muted"
                      ),
                      children: s.role
                    }
                  )
                ]
              },
              s.id
            )) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => go(1),
                disabled: index === SPREADS.length - 1,
                className: "btn btn-tonal btn-icon disabled:opacity-30",
                "aria-label": "Next spread",
                children: /* @__PURE__ */ jsx(Chevron, { size: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "p",
            {
              className: "mt-6 max-w-[58ch] text-small text-ink-soft",
              "aria-live": "polite",
              "aria-atomic": "true",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "font-semibold text-ink", children: [
                  spread.role,
                  ". "
                ] }),
                spread.caption
              ]
            }
          ),
          /* @__PURE__ */ jsx(Reveal, { y: 14, className: "mt-10", children: /* @__PURE__ */ jsx(
            OrderButton,
            {
              intent: "sample",
              label: "Ask for your own sample pages",
              sublabel: "We will send them into the chat, free"
            }
          ) })
        ] })
      }
    )
  ] }) });
}
function Page({
  spread,
  fill
}) {
  const isDedication = spread.id === "dedication";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cx(
        "relative flex flex-col bg-[#fdfaf3] px-7 py-9 text-[#241f28] sm:px-10 sm:py-12",
        isDedication ? "justify-center" : "justify-start"
      ),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply",
            style: { backgroundImage: "var(--grain-url)", backgroundSize: "160px 160px" }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-black/12 to-transparent"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          spread.heading && /* @__PURE__ */ jsx("p", { className: "font-display mb-4 text-[0.68rem] font-bold tracking-[0.22em] uppercase text-[#8c7f6b]", children: spread.heading }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cx(
                "font-display flex flex-col gap-4",
                isDedication ? "items-center text-center text-[1.35rem] leading-[1.5] italic" : "text-[0.98rem] leading-[1.75] sm:text-[1.04rem]"
              ),
              style: { fontVariationSettings: "'SOFT' 50, 'WONK' 1" },
              children: spread.paragraphs.map((p, i) => /* @__PURE__ */ jsx(
                "p",
                {
                  className: !isDedication && i === 0 ? "first-letter:float-left first-letter:mr-2.5 first-letter:mt-1.5 first-letter:text-[3.6rem] first-letter:leading-[0.72] first-letter:font-semibold first-letter:text-[#b06a12]" : void 0,
                  children: fill(p)
                },
                i
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "relative mt-auto pt-8 text-center text-[0.68rem] tabular-nums text-[#a2947e]", children: spread.folio })
      ]
    }
  );
}
function WhyParents() {
  const { draft, isPersonalised } = useDraft();
  const name = formatName(draft.childName);
  const who = isPersonalised ? name : "your child";
  return /* @__PURE__ */ jsx(Section, { space: "grand", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        eyebrow: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Heart, { size: 14 }),
          " Why it lands"
        ] }),
        title: "A book about them changes how they read it.",
        deck: "A child who finds themselves inside a story stops being an audience and becomes a participant. Everything else is paper and ink."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-20 lg:grid-cols-4 lg:grid-rows-2", children: [
      /* @__PURE__ */ jsx(
        Reveal,
        {
          y: 26,
          className: "lg:col-span-2 lg:row-span-2",
          children: /* @__PURE__ */ jsxs("article", { className: "card relative flex h-full flex-col justify-between overflow-hidden bg-inverse p-8 text-ink-inverse sm:p-10", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": "true",
                className: "pointer-events-none absolute inset-0 opacity-60",
                style: {
                  background: "radial-gradient(38rem 26rem at 88% 8%, color-mix(in oklab, var(--gold-500) 34%, transparent), transparent 68%), radial-gradient(30rem 26rem at 4% 96%, color-mix(in oklab, var(--clay-500) 40%, transparent), transparent 70%)"
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs("span", { className: "eyebrow !text-white/50", children: [
                /* @__PURE__ */ jsx(Sparkle, { size: 14 }),
                " The whole idea"
              ] }),
              /* @__PURE__ */ jsxs(
                "h3",
                {
                  className: "mt-5 max-w-[24ch] text-display-3",
                  style: { fontVariationSettings: "'SOFT' 50, 'WONK' 1" },
                  children: [
                    "“Wait — that’s ",
                    /* @__PURE__ */ jsx("span", { className: "text-gold-300", children: "me" }),
                    ".”"
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-[40ch] text-lead text-white/70", children: "It happens around page three, and you can watch it happen. Children read a story about themselves more slowly, more carefully, and far more often." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "relative mt-10 grid gap-6 border-t border-white/12 pt-7 sm:grid-cols-3", children: [
              { v: "9×", l: `Times ${who} will ask for it again`, s: "parent-reported, first month" },
              { v: `${Math.round(PROOF.repeatBuyerRate * 100)}%`, l: "Order a second book", s: "usually for a sibling" },
              { v: "20 yrs", l: "Built to survive", s: "sewn binding, board pages" }
            ].map((stat) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-display text-[1.9rem] leading-none font-semibold tabular-nums text-gold-300", children: stat.v }),
              /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-small font-semibold", children: stat.l }),
              /* @__PURE__ */ jsx("p", { className: "text-small text-white/50", children: stat.s })
            ] }, stat.l)) })
          ] })
        }
      ),
      [
        {
          icon: Feather,
          title: "They want to read it",
          body: `${isPersonalised ? `${possessive(name)} name` : "Their name"} on the cover beats any reward chart, and the reading level is set to their age band.`,
          tone: "gold"
        },
        {
          icon: Gift,
          title: "A gift nobody else gives",
          body: "Rigid gift box, no pricing inside. The one present that is not in a charity bag by spring.",
          tone: "clay"
        },
        {
          icon: Shield,
          title: "Made by people",
          body: "An author, an illustrator, an editor. Your photo never goes near a generator, and it is deleted the day the book ships.",
          tone: "verdant"
        },
        {
          icon: Leaf,
          title: "Made to be kept",
          body: "FSC® 170gsm uncoated stock, soy inks, sewn linen spine so it opens flat.",
          tone: "neutral"
        }
      ].map((card, i) => /* @__PURE__ */ jsx(Reveal, { y: 22, delay: 80 + i * 70, children: /* @__PURE__ */ jsxs("article", { className: "card card-lift flex h-full flex-col gap-4 p-7", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cx(
              "grid size-11 place-items-center rounded-[0.8rem]",
              card.tone === "gold" && "bg-gold-50 text-gold-700",
              card.tone === "clay" && "bg-clay-50 text-clay-700",
              card.tone === "verdant" && "bg-verdant-50 text-verdant-700",
              card.tone === "neutral" && "bg-inset text-ink-soft"
            ),
            "aria-hidden": "true",
            children: /* @__PURE__ */ jsx(card.icon, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsx("h3", { className: "text-title", children: card.title }),
        /* @__PURE__ */ jsx("p", { className: "text-small text-ink-soft", children: card.body })
      ] }) }, card.title))
    ] })
  ] }) });
}
const LAYERS = [
  {
    label: "Foil-stamped title",
    detail: ["Warm gold, struck under heat so", "the name catches the light"],
    fill: "#e6b45c",
    stroke: "#b3873c"
  },
  {
    label: "Hardcover board, 2.5mm",
    detail: ["Wrapped and turned in by hand,", "square-cornered"],
    fill: "#3a3040",
    stroke: "#241d29"
  },
  {
    label: "170gsm uncoated stock",
    detail: ["FSC® certified, matte, no glare", "under a bedside lamp"],
    fill: "#f6efe0",
    stroke: "#d9cbb2"
  },
  {
    label: "Litho, soy-based inks",
    detail: ["Six-colour offset. Low VOC and", "safe for chewing age"],
    fill: "#c8763a",
    stroke: "#96551f"
  },
  {
    label: "Sewn signatures, linen spine",
    detail: ["Thread-sewn so it opens flat", "and does not shed pages"],
    fill: "#6b4ea8",
    stroke: "#4a3179"
  }
];
const SPECS = [
  ["Trim size", "210 × 250 mm portrait"],
  ["Extent", "12 to 24 spreads, by age band"],
  ["Cover", "Hardcover board, foil-stamped, matte laminate"],
  ["Paper", "170gsm uncoated FSC® text, 2.5mm board"],
  ["Binding", "Thread-sewn sections, linen-wrapped spine"],
  ["Languages", "English or Hindi, set in Devanagari where needed"],
  ["Ages 2–3", "Board pages, 3mm, rounded corners"],
  ["Printed in", `${BRAND.press} — India's children's-book press town`],
  ["Packaging", "Rigid gift box, unbranded outer, no pricing inside"],
  ["Proofing", "Read by a human editor before it goes to plate"]
];
function Craft() {
  return /* @__PURE__ */ jsx(Section, { id: "craft", space: "grand", tone: "sunken", className: "rule-top", children: /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-20", children: [
    /* @__PURE__ */ jsx(Reveal, { y: 26, scale: 0.97, className: "order-2 lg:order-1", children: /* @__PURE__ */ jsxs("div", { className: "card overflow-hidden bg-raised p-6 sm:p-8", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow mb-6", children: "Cross-section, actual construction" }),
      /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 420 330", className: "w-full", role: "img", "aria-labelledby": "craft-title", children: [
        /* @__PURE__ */ jsx("title", { id: "craft-title", children: "An exploded diagram of a BookMojo hardcover, showing five layers: foil-stamped title, 2.5mm hardcover board, 170gsm uncoated FSC paper, soy-based litho inks, and thread-sewn signatures with a linen spine." }),
        LAYERS.map((layer, i) => {
          const y = 26 + i * 54;
          return /* @__PURE__ */ jsxs(
            "g",
            {
              style: {
                animation: `float ${6 + i * 0.6}s var(--ease-in-out) ${i * 0.35}s infinite`
              },
              children: [
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: `M20 ${y + 34} L120 ${y} L232 ${y} L132 ${y + 34} Z`,
                    fill: layer.fill,
                    stroke: layer.stroke,
                    strokeWidth: "1.2"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: `M20 ${y + 34} L132 ${y + 34} L132 ${y + 42} L20 ${y + 42} Z`,
                    fill: layer.stroke,
                    opacity: "0.85"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: `M232 ${y + 2} L268 ${y + 2}`,
                    stroke: "var(--l-strong)",
                    strokeWidth: "1",
                    strokeDasharray: "3 3"
                  }
                ),
                /* @__PURE__ */ jsx("circle", { cx: "268", cy: y + 2, r: "2.6", fill: "var(--c-ink)" }),
                /* @__PURE__ */ jsx(
                  "text",
                  {
                    x: "278",
                    y,
                    fontSize: "11.5",
                    fontWeight: "700",
                    fill: "var(--c-ink)",
                    fontFamily: "var(--font-sans)",
                    children: layer.label
                  }
                ),
                /* @__PURE__ */ jsx(
                  "text",
                  {
                    x: "278",
                    y: y + 15,
                    fontSize: "9.5",
                    fill: "var(--c-ink-muted)",
                    fontFamily: "var(--font-sans)",
                    children: layer.detail.map((line, li) => /* @__PURE__ */ jsx("tspan", { x: "278", dy: li === 0 ? 0 : 11, children: line }, line))
                  }
                )
              ]
            },
            layer.label
          );
        })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "order-1 lg:order-2", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          align: "start",
          eyebrow: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Printer, { size: 14 }),
            " The craft"
          ] }),
          title: "Printed like a bookshop book, because it is one.",
          deck: `Litho on uncoated stock, signatures sewn in ${BRAND.press} — the same presses behind the children's hardcovers you already own.`
        }
      ),
      /* @__PURE__ */ jsx(Reveal, { y: 20, delay: 120, className: "mt-9", children: /* @__PURE__ */ jsx("dl", { className: "divide-y divide-hairline border-y border-hairline", children: SPECS.map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 py-3 sm:flex-row sm:gap-6", children: [
        /* @__PURE__ */ jsx("dt", { className: "w-40 shrink-0 text-small font-bold tracking-[0.04em] uppercase text-ink-muted", children: k }),
        /* @__PURE__ */ jsx("dd", { className: "text-small", children: v })
      ] }, k)) }) }),
      /* @__PURE__ */ jsx(Reveal, { y: 18, delay: 200, className: "mt-8", children: /* @__PURE__ */ jsxs("div", { className: "card flex flex-col gap-4 bg-raised p-6 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-title", children: GUARANTEE.headline }),
          /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-small text-ink-soft", children: GUARANTEE.detail })
        ] }),
        /* @__PURE__ */ jsx(
          OrderButton,
          {
            intent: "faq",
            size: "md",
            label: "Ask about materials",
            className: "shrink-0"
          }
        )
      ] }) })
    ] })
  ] }) }) });
}
function Delivery() {
  const { draft, isPersonalised } = useDraft();
  const name = formatName(draft.childName);
  const book = isPersonalised ? `${possessive(name)} book` : "the book";
  const beats = [
    {
      icon: Printer,
      when: "Day 1",
      title: "In the studio",
      message: `Writer assigned. ${isPersonalised ? name : "Your hero"} is officially in the manuscript.`
    },
    {
      icon: Camera,
      when: `Day ${PROOF.productionDays.split("–")[0]}`,
      title: "Off the press",
      message: `📸 Here is ${book}, before the gift box goes on.`
    },
    {
      icon: Truck,
      when: "Next day",
      title: "Tracked and moving",
      message: "Blue Dart picked it up. Live tracking is in this chat — tap any time."
    },
    {
      icon: Gift,
      when: "Arrival",
      title: "On the doorstep",
      message: "Out for delivery, before 1pm. Want me to hold it for a date instead?"
    }
  ];
  return /* @__PURE__ */ jsx(Section, { space: "grand", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        eyebrow: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Truck, { size: 14 }),
          " Getting it to you"
        ] }),
        title: "You will never have to ask where it is.",
        deck: `Made in ${PROOF.productionDays} days, then ${PROOF.metroDeliveryDays} to metros and 4–6 elsewhere. Every stage arrives as a message — including a photo of the real book.`
      }
    ),
    /* @__PURE__ */ jsx("ol", { className: "relative mt-14 grid gap-6 lg:mt-20 lg:grid-cols-4 lg:gap-5", children: beats.map((beat, i) => /* @__PURE__ */ jsx(Reveal, { as: "li", y: 24, delay: i * 90, className: "h-full", children: /* @__PURE__ */ jsxs("article", { className: "card flex h-full flex-col gap-4 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "grid size-10 place-items-center rounded-[0.7rem] bg-inset text-ink-soft",
            children: /* @__PURE__ */ jsx(beat.icon, { size: 19 })
          }
        ),
        /* @__PURE__ */ jsx(Pill, { tone: "outline", children: beat.when })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-[1.05rem] font-semibold", children: beat.title }),
      /* @__PURE__ */ jsxs("div", { className: "mt-auto rounded-[0.85rem] rounded-tl-sm bg-[var(--chat-out)] px-3 py-2.5 text-[0.78rem] leading-snug text-[var(--chat-out-ink)] shadow-e1", children: [
        /* @__PURE__ */ jsxs("span", { className: "mb-1 flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.08em] uppercase opacity-60", children: [
          /* @__PURE__ */ jsx(WhatsAppMark, { size: 10 }),
          " BookMojo"
        ] }),
        beat.message
      ] })
    ] }) }, beat.title)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-5 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Reveal, { y: 20, className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("article", { className: "card flex h-full flex-col gap-5 bg-sunken p-7 sm:flex-row sm:items-center sm:p-8", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "grid size-12 shrink-0 place-items-center rounded-[0.85rem] bg-gold-50 text-gold-700",
            children: /* @__PURE__ */ jsx(Gift, { size: 22 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-title", children: "Keeping it a surprise" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-small text-ink-soft", children: "Name the date and we land it that morning. Unbranded packaging, no pricing inside, and a heads-up to you the day before." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Reveal, { y: 20, delay: 90, children: /* @__PURE__ */ jsxs("article", { className: "card flex h-full flex-col justify-between gap-5 p-7", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-[2.4rem] leading-none font-semibold tabular-nums", children: PROOF.pincodes }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-small text-ink-soft", children: [
            "PIN codes across India, courier and GST already in the price. Plus",
            " ",
            PROOF.countries,
            " countries for gifts sent home."
          ] })
        ] }),
        /* @__PURE__ */ jsx(OrderButton, { intent: "faq", size: "sm", label: "Check your PIN code" })
      ] }) })
    ] })
  ] }) });
}
function Testimonials() {
  const distribution = [
    { stars: 5, share: 0.93 },
    { stars: 4, share: 0.055 },
    { stars: 3, share: 0.01 },
    { stars: 2, share: 3e-3 },
    { stars: 1, share: 2e-3 }
  ];
  return /* @__PURE__ */ jsx(Section, { id: "reviews", space: "grand", tone: "sunken", className: "rule-top", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        eyebrow: /* @__PURE__ */ jsx(Fragment, { children: "What parents say afterwards" }),
        title: "The reviews are mostly about their child’s face.",
        deck: "We ask every buyer one question after delivery: what happened when they opened it?"
      }
    ),
    /* @__PURE__ */ jsx(Reveal, { y: 20, className: "mx-auto mt-12 max-w-[46rem]", children: /* @__PURE__ */ jsxs("div", { className: "card flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:gap-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "shrink-0 text-center sm:text-left", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-[3.4rem] leading-none font-semibold tabular-nums", children: PROOF.rating }),
        /* @__PURE__ */ jsx(Rating, { value: PROOF.rating, className: "mt-2 justify-center sm:justify-start" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1.5 text-small text-ink-muted", children: [
          PROOF.reviewCount.toLocaleString(),
          " verified buyers"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1.5", children: distribution.map((row) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "w-6 shrink-0 text-small font-semibold tabular-nums text-ink-muted", children: [
          row.stars,
          "★"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "h-2 flex-1 overflow-hidden rounded-full bg-inset", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: cx(
              "block h-full rounded-full",
              row.stars >= 4 ? "bg-gold-500" : "bg-strong"
            ),
            style: { width: `${row.share * 100}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs("span", { className: "w-10 shrink-0 text-right text-small tabular-nums text-ink-muted", children: [
          Math.round(row.share * 100),
          "%"
        ] })
      ] }, row.stars)) }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 gap-5 sm:columns-2 lg:mt-12 lg:columns-3", children: TESTIMONIALS.map((review, i) => /* @__PURE__ */ jsx(
      Reveal,
      {
        y: 22,
        delay: i % 3 * 80,
        className: "mb-5 break-inside-avoid",
        children: /* @__PURE__ */ jsxs("figure", { className: "card card-lift flex flex-col gap-4 p-6", children: [
          /* @__PURE__ */ jsx(Quote, { size: 20, className: "text-gold-300" }),
          /* @__PURE__ */ jsx(
            "blockquote",
            {
              className: "font-display text-[1.02rem] leading-[1.6]",
              style: { fontVariationSettings: "'SOFT' 50, 'WONK' 1" },
              children: review.quote
            }
          ),
          /* @__PURE__ */ jsxs("figcaption", { className: "mt-auto flex items-center gap-3 border-t border-hairline pt-4", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "grid size-10 shrink-0 place-items-center rounded-full bg-clay-50 font-display text-[0.9rem] font-semibold text-clay-700",
                children: review.name.split(" ").map((part) => part[0]).slice(0, 2).join("")
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-small font-semibold", children: review.name }),
              /* @__PURE__ */ jsxs("span", { className: "block text-[0.75rem] text-ink-muted", children: [
                review.role,
                " · ",
                review.location,
                " · ",
                review.childName
              ] })
            ] })
          ] })
        ] })
      },
      review.name
    )) })
  ] }) });
}
function Accordion({
  items,
  className,
  onOpen
}) {
  const [open, setOpen] = useState(0);
  const base = useId().replace(/:/g, "");
  return /* @__PURE__ */ jsx("div", { className: cx("divide-y divide-hairline border-y border-hairline", className), children: items.map((item, i) => {
    const isOpen = open === i;
    const panelId = `${base}-panel-${i}`;
    const btnId = `${base}-btn-${i}`;
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "m-0", children: /* @__PURE__ */ jsxs(
        "button",
        {
          id: btnId,
          type: "button",
          "aria-expanded": isOpen,
          "aria-controls": panelId,
          onClick: () => {
            setOpen(isOpen ? null : i);
            if (!isOpen) onOpen?.(item.q);
          },
          className: cx(
            "group flex w-full items-start gap-4 py-5 text-left transition-colors",
            "hover:text-gold-700 night:hover:text-gold-500"
          ),
          children: [
            /* @__PURE__ */ jsx("span", { className: "font-display flex-1 text-[1.0625rem] leading-snug font-semibold sm:text-title", children: item.q }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cx(
                  "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300",
                  isOpen ? "border-transparent bg-inverse text-ink-inverse rotate-45" : "border-strong text-ink-muted group-hover:border-ink group-hover:text-ink"
                ),
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsx(Plus, { size: 15 })
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(
        "div",
        {
          id: panelId,
          role: "region",
          "aria-labelledby": btnId,
          className: "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)]",
          style: { gridTemplateRows: isOpen ? "1fr" : "0fr" },
          children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx(
            "p",
            {
              className: cx(
                "max-w-[62ch] pb-6 pr-10 text-ink-soft transition-opacity duration-300",
                isOpen ? "opacity-100" : "opacity-0"
              ),
              children: item.a
            }
          ) })
        }
      )
    ] }, item.q);
  }) });
}
const FAQS = [
  {
    group: "Ordering",
    q: "Why WhatsApp instead of a normal checkout?",
    a: `Because a personalised book needs a conversation. A form cannot ask a follow-up when a name has an unusual spelling or the gift is for Saturday. No account, no cart — about ${PROOF.avgOrderMinutes} minutes, and the receipt stays in a thread you already check.`
  },
  {
    group: "Ordering",
    q: "Do I have to talk to a person?",
    a: `Not unless you want to. The assistant handles the whole order and understands typing as well as taps. For anything unusual, a human from our ${BRAND.studio} studio picks up the same thread.`
  },
  {
    group: "Ordering",
    q: "What exactly will you ask me?",
    a: "Five things: their first name, age, English or Hindi, the story world, and what they look like. Dedication and address come after you approve the preview."
  },
  {
    group: "The book",
    q: "Can I see the book before I pay?",
    a: "Always. We send the finished cover and two interior spreads into the chat, with your child already in them. Change anything as often as you like — nothing is charged or printed until you approve it."
  },
  {
    group: "The book",
    q: "Is the story rewritten, or is the name just dropped in?",
    a: "Rewritten. Plot beats, sentence length and vocabulary all shift with age band, reading level and the details you give us. A four-year-old’s Banyan and a nine-year-old’s Banyan are different books."
  },
  {
    group: "The book",
    q: "Is the Hindi edition translated or written in Hindi?",
    a: "Written. A Hindi author works from the same story brief, because rhyme and read-aloud cadence do not survive translation. Typeset in Devanagari with proper matra spacing."
  },
  {
    group: "The book",
    q: "How do you match my child’s appearance?",
    a: "An illustrator matches skin tone, hair, glasses, hearing aids and a patka by hand from your photo — no generator, and we delete the photo once it ships. Or pick from the options in the chat."
  },
  {
    group: "The book",
    q: "What is the book physically like?",
    a: `A 210 × 250mm hardcover on 170gsm uncoated FSC® stock, litho-printed in ${BRAND.press}, foil-stamped, sewn with a linen spine so it opens flat, in a rigid gift box. Ages 2–3 get board pages with rounded corners.`
  },
  {
    group: "Delivery",
    q: "How long does it take?",
    a: `${PROOF.productionDays} working days to make, then ${PROOF.metroDeliveryDays} days to metros and 4–6 elsewhere. Up against a birthday? Tell us the date and we confirm before you pay.`
  },
  {
    group: "Delivery",
    q: "Do you deliver to my PIN code?",
    a: `${PROOF.pincodes} PIN codes across India, plus ${PROOF.countries} countries for gifts sent home. Send us your PIN and we confirm in seconds.`
  },
  {
    group: "Delivery",
    q: "It is a surprise. Can you time the delivery?",
    a: "Yes. Name the date and we hold the parcel, then land it that morning — unbranded outer packaging, no pricing inside, and a heads-up to you the day before."
  },
  {
    group: "Payment",
    q: "Is paying through a chat safe?",
    a: "You never send payment details in a message. The chat sends a one-time link to our payment provider’s own page for UPI, cards, net banking or wallets. We never see or store your details."
  },
  {
    group: "Payment",
    q: "Do you offer cash on delivery?",
    a: "No, and here is why: every book is made for one child and cannot be resold, so a refused parcel is a total loss. Rather than price that into everyone’s book, we ask for prepayment — after you have approved the cover."
  },
  {
    group: "Payment",
    q: "What does it cost, and what if we do not love it?",
    a: `${formatINR(PRICING.hardcover)} including the gift box, GST and tracked delivery. Nothing is added at the last step. ${GUARANTEE.headline}, for ${GUARANTEE.window} after delivery.`
  }
];
const FAQ_GROUPS = ["Ordering", "The book", "Delivery", "Payment"];
function Faq() {
  const [group, setGroup] = useState("Ordering");
  const items = useMemo(
    () => group === "All" ? FAQS : FAQS.filter((f) => f.group === group),
    [group]
  );
  const tabs = ["All", ...FAQ_GROUPS];
  return /* @__PURE__ */ jsx(Section, { id: "faq", space: "grand", children: /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 3xl:gap-24", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Reveal, { y: 14, className: "eyebrow", children: "Before you start" }),
      /* @__PURE__ */ jsxs(Reveal, { y: 20, delay: 70, as: "h2", className: "mt-4 text-display-2", children: [
        "Everything people",
        /* @__PURE__ */ jsx("br", {}),
        "ask us first."
      ] }),
      /* @__PURE__ */ jsx(Reveal, { y: 18, delay: 140, children: /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-[34ch] text-lead text-ink-soft", children: "Honest answers, including the ones about paying inside a chat app." }) }),
      /* @__PURE__ */ jsx(Reveal, { y: 20, delay: 200, className: "mt-8 lg:sticky lg:top-28", children: /* @__PURE__ */ jsxs("div", { className: "card flex flex-col gap-4 bg-sunken p-6", children: [
        /* @__PURE__ */ jsx("span", { className: "grid size-11 place-items-center rounded-[0.8rem] bg-verdant-50 text-verdant-700", children: /* @__PURE__ */ jsx(WhatsAppMark, { size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-title", children: "Ask a real person" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1.5 text-small text-ink-soft", children: [
            BRAND.supportHours,
            ". Asking does not start an order."
          ] })
        ] }),
        /* @__PURE__ */ jsx(OrderButton, { intent: "faq", size: "md", label: "Ask on WhatsApp", block: true })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx(Reveal, { y: 16, children: /* @__PURE__ */ jsx(
        "div",
        {
          role: "tablist",
          "aria-label": "Question categories",
          className: "rail-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2",
          children: tabs.map((tab) => {
            const active = tab === group;
            const count = tab === "All" ? FAQS.length : FAQS.filter((f) => f.group === tab).length;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                role: "tab",
                type: "button",
                "aria-selected": active,
                onClick: () => setGroup(tab),
                className: cx(
                  "btn btn-sm shrink-0 whitespace-nowrap",
                  active ? "btn-ink" : "btn-tonal"
                ),
                children: [
                  tab,
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cx(
                        "text-[0.7rem] tabular-nums",
                        active ? "opacity-60" : "text-ink-muted"
                      ),
                      children: count
                    }
                  )
                ]
              },
              tab
            );
          })
        }
      ) }),
      /* @__PURE__ */ jsx(Reveal, { y: 20, delay: 80, className: "mt-6", children: /* @__PURE__ */ jsx(
        Accordion,
        {
          items,
          onOpen: (question) => track("faq_open", { question, group })
        },
        group
      ) })
    ] })
  ] }) }) });
}
function FinalCta() {
  const { draft, isPersonalised } = useDraft();
  const name = formatName(draft.childName);
  const included = [
    "Hardcover, foil-stamped, 210 × 250mm",
    "Written and illustrated for your child",
    "English or Hindi",
    "Rigid gift box",
    "Tracked delivery + GST",
    "Unlimited changes before printing"
  ];
  return /* @__PURE__ */ jsxs(Section, { id: "final-cta", space: "grand", tone: "inverse", className: "relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 opacity-70",
        style: {
          background: "radial-gradient(46rem 32rem at 18% 12%, color-mix(in oklab, var(--gold-500) 30%, transparent), transparent 66%), radial-gradient(44rem 34rem at 86% 84%, color-mix(in oklab, var(--clay-500) 42%, transparent), transparent 68%)"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 opacity-45",
        style: {
          backgroundImage: "radial-gradient(circle, rgb(255 255 255 / 0.9) 0.9px, transparent 1px), radial-gradient(circle, rgb(255 255 255 / 0.6) 0.7px, transparent 1px)",
          backgroundSize: "140px 120px, 90px 160px",
          backgroundPosition: "0 0, 40px 60px"
        }
      }
    ),
    /* @__PURE__ */ jsx(Container, { className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Reveal, { y: 14, className: "eyebrow !text-white/50", children: "One conversation away" }),
        /* @__PURE__ */ jsx(Reveal, { y: 22, delay: 70, as: "h2", className: "mt-4 text-display-1", children: isPersonalised ? /* @__PURE__ */ jsxs(Fragment, { children: [
          "Let’s make",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "quill !text-gold-300", children: possessive(name) }),
          " book."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "Tell us their",
          /* @__PURE__ */ jsx("br", {}),
          "name. We’ll do",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "quill !text-gold-300", children: "the rest." })
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { y: 18, delay: 140, children: /* @__PURE__ */ jsxs("p", { className: "mt-6 max-w-[38ch] text-lead text-white/70", children: [
          "Five questions, approve the cover, done in ",
          PROOF.avgOrderMinutes,
          " minutes."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { y: 18, delay: 200, className: "mt-9", children: /* @__PURE__ */ jsxs("div", { className: "glass glass-onDark rounded-[1.5rem] p-6 sm:p-7", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-x-4 gap-y-2", children: [
            /* @__PURE__ */ jsx("p", { className: "font-display text-[3rem] leading-none font-semibold tabular-nums", children: formatINR(PRICING.hardcover) }),
            /* @__PURE__ */ jsxs("p", { className: "text-small text-white/55", children: [
              /* @__PURE__ */ jsx("s", { className: "opacity-70", children: formatINR(PRICING.hardcoverCompare) }),
              " · GST and delivery included · no per-page or per-name extras"
            ] })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mt-5 grid gap-2 sm:grid-cols-2", children: included.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-small text-white/75", children: [
            /* @__PURE__ */ jsx(
              Check,
              {
                size: 15,
                className: "mt-0.5 shrink-0 text-verdant-500",
                strokeWidth: 2.4
              }
            ),
            item
          ] }, item)) })
        ] }) }),
        /* @__PURE__ */ jsxs(Reveal, { y: 18, delay: 260, className: "mt-7", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-block", children: [
            /* @__PURE__ */ jsx(
              OrderButton,
              {
                intent: "final",
                label: isPersonalised ? `Start ${possessive(name)} book` : "Start your book",
                sublabel: "No account · nothing charged until you approve"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute -right-24 -top-6 hidden text-gold-300 lg:block", children: /* @__PURE__ */ jsx(ScribbleArrow, { className: "w-20 rotate-[196deg] opacity-70" }) })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mt-6 flex flex-wrap gap-x-6 gap-y-3", children: [
            { icon: Lock, text: "UPI, card or net banking" },
            { icon: Shield, text: `${GUARANTEE.headline} · ${GUARANTEE.window}` },
            { icon: Clock, text: "Cancel free before approval" }
          ].map(({ icon: Icon2, text: text2 }) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-small text-white/65", children: [
            /* @__PURE__ */ jsx(Icon2, { size: 16, className: "shrink-0 text-verdant-500" }),
            text2
          ] }, text2)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Reveal,
        {
          y: 30,
          delay: 160,
          scale: 0.96,
          className: "flex justify-center lg:justify-end",
          children: /* @__PURE__ */ jsx(Book3D, { draft, width: 330 })
        }
      )
    ] }) })
  ] });
}
function App() {
  return /* @__PURE__ */ jsxs(DraftProvider, { children: [
    /* @__PURE__ */ jsx(Grain, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { id: "main", className: "pb-20 sm:pb-0", children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx(ProofBar, {}),
      /* @__PURE__ */ jsx(Personaliser, {}),
      /* @__PURE__ */ jsx(HowItWorks, {}),
      /* @__PURE__ */ jsx(Journey, {}),
      /* @__PURE__ */ jsx(Themes, {}),
      /* @__PURE__ */ jsx(Spreads, {}),
      /* @__PURE__ */ jsx(WhyParents, {}),
      /* @__PURE__ */ jsx(Craft, {}),
      /* @__PURE__ */ jsx(Delivery, {}),
      /* @__PURE__ */ jsx(Testimonials, {}),
      /* @__PURE__ */ jsx(Faq, {}),
      /* @__PURE__ */ jsx(FinalCta, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(StickyCta, {})
  ] });
}
const html = renderToString(/* @__PURE__ */ jsx(App, {}));
const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const words = text.split(" ").filter((w) => /[a-zA-Z\u0900-\u097F]/.test(w));
console.log(`visible words on first render: ${words.length}`);
console.log(`characters: ${text.length}`);
