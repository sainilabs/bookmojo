import { forwardRef, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { BookCover } from '@/components/art/BookCover';
import { HeroChild } from '@/components/art/HeroChild';
import { Chevron } from '@/components/art/Icons';
import { THEME_BY_ID, THEMES } from '@/data/catalogue';
import { cx, formatName } from '@/lib/utils';
import type { Draft } from '@/types';

interface FlipBookApi {
  pageFlip(): {
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
  };
}

interface FlipEvent {
  data: number;
}

const THEME_ARTWORK: Record<string, string> = {
  'lane-four': 'theme-lane-four.jpg',
  gulmohar: 'theme-gulmohar.jpg',
  'nala-bridge': 'theme-nala-bridge.jpg',
  chandni: 'aman-scientist-cover.png',
  backwater: 'theme-backwater.jpg',
  banyan: 'theme-banyan.jpg',
  sriharikota: 'theme-sriharikota.jpg',
  karkhana: 'theme-karkhana.jpg',
};

const StoryPage = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string; hard?: boolean }
>(({ children, className, hard = false }, ref) => (
  <div
    ref={ref}
    data-density={hard ? 'hard' : 'soft'}
    className={cx(
      'relative h-full overflow-hidden border border-[#d9cfbd] bg-[#fffaf0] text-[#27231d] [container-type:inline-size]',
      className,
    )}
    style={{ boxShadow: 'inset 0 0 28px rgb(93 75 45 / 0.08)' }}
  >
    {children}
  </div>
));

StoryPage.displayName = 'StoryPage';

function ChildPortrait({ draft, className }: { draft: Draft; className?: string }) {
  const theme = THEME_BY_ID.get(draft.themeId) ?? THEMES[0]!;

  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <HeroChild
        look={draft.look}
        outfit={theme.palette.accent}
        outfitDeep={theme.palette.deep}
        animate={false}
      />
    </svg>
  );
}

function IllustratedTextPage({
  image,
  eyebrow,
  body,
  pageNumber,
  accent,
  deep,
}: {
  image: string;
  eyebrow: string;
  body: string;
  pageNumber: number;
  accent: string;
  deep: string;
}) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#fffaf0]">
      <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#fffaf0]/82 backdrop-blur-[1px]" />
      <div className="relative mx-[5cqw] flex max-h-[90%] w-full flex-col items-center border border-white/70 bg-[#fffaf0]/88 px-[5cqw] py-[5cqw] text-center shadow-sm">
        <p
          className="font-bold tracking-[0.14em] uppercase"
          style={{ color: deep, fontSize: 'clamp(0.4rem, 3.4cqw, 0.58rem)' }}
        >
          {eyebrow}
        </p>
        <div className="my-[3cqw] h-px w-[28cqw]" style={{ backgroundColor: accent }} />
        <p
          className="font-book font-semibold text-[#343024]"
          style={{ fontSize: 'clamp(0.52rem, 5cqw, 0.92rem)', lineHeight: 1.36 }}
        >
          {body}
        </p>
      </div>
      <span className="absolute right-[5cqw] bottom-[4cqw] text-[clamp(0.45rem,3cqw,0.58rem)] text-[#75684f]">
        {pageNumber}
      </span>
    </div>
  );
}

export function PersonalisedFlipBook({ draft }: { draft: Draft }) {
  const book = useRef<FlipBookApi | null>(null);
  const [page, setPage] = useState(0);

  /**
   * THE PREVIEW IS PINNED TO THE LITTLE SCIENTIST BOOK, WHATEVER IS SELECTED.
   *
   * Little Scientist is the only story with finished artwork — a photographed
   * cover and ten illustrated spreads. The other seven have a single reused
   * illustration each, so they fell back to a generated cover and a six-page
   * book, and picking one replaced the real product with something that looked
   * like a placeholder.
   *
   * Rather than let the selection decide, the preview always shows the finished
   * book. The visitor's name, age, language and appearance still flow through it,
   * and the WhatsApp hand-off still carries whatever story they chose.
   *
   * Two consequences worth knowing:
   *  - The story picker no longer changes the preview, so the pages a visitor
   *    sees will not match a non-scientist story they selected.
   *  - Because the book no longer depends on the selection, the key below is
   *    constant: switching story does not rebuild it, and the page counter
   *    therefore never needs resetting.
   *
   * When the other stories get real artwork, this goes back to
   * `draft.themeId === 'chandni'` and the key back to `draft.themeId`.
   */
  const PREVIEW_STORY_ID = 'chandni';
  const usesScientistArtwork = true;

  const theme = THEME_BY_ID.get(PREVIEW_STORY_ID) ?? THEMES[0]!;
  const enteredName = formatName(draft.childName);
  const name = enteredName || 'Aman';
  const opening = theme.opening.replaceAll('{name}', name);
  /**
   * The printed cover stays on screen at all times.
   *
   * It used to swap to the generated cover the moment a name was typed, so the
   * cover could carry the child's actual name. That trade was the wrong way
   * round: the finished artwork is what sells the book, and losing it the instant
   * someone starts filling in the form made the preview look cheaper at exactly
   * the point the visitor was closest to ordering. The name still runs through
   * every page inside, so nothing about the personalisation promise is hidden.
   */
  const usesSampleCover = usesScientistArtwork;
  const asset = (file: string) => `${import.meta.env.BASE_URL}images/storybook/${file}`;
  const themeArtwork = asset(THEME_ARTWORK[draft.themeId] ?? THEME_ARTWORK.chandni!);

  /**
   * PAGES ARE AN ARRAY, NOT INLINE JSX CHILDREN — and that is load-bearing.
   *
   * react-pageflip walks its children with React.Children.map and calls
   * cloneElement on each one to attach the ref it needs. Children.map visits
   * every slot it is given, including the bare `false` that `{cond && <Page/>}`
   * leaves behind when the condition fails. cloneElement(false) throws
   * "The argument must be a React element, but you passed null", and because the
   * whole page is a single hydrated island, that one throw unmounted everything
   * and left a blank white page.
   *
   * It only ever surfaced for visitors whose saved draft was on a story other
   * than the scientist one, since that is both the default draft and the only
   * theme where all ten pages exist — which is why it never reproduced on a
   * fresh profile.
   *
   * A conditional spread emits no slot at all, so Children.map never sees a
   * non-element. Deriving pageCount from the array also removes the hand-kept
   * page total that had to be updated in lockstep with the JSX.
   */
  const pages = [
    <StoryPage key="cover" hard className="bg-[#161e44]">
      {usesSampleCover ? (
        <img
          src={asset('aman-scientist-cover.png')}
          alt="Aman Scientist Dreams personalised storybook cover"
          className="h-full w-full object-cover"
        />
      ) : (
        <BookCover draft={draft} placeholderName="Aman" className="h-full w-full" />
      )}
    </StoryPage>,

    <StoryPage key="opening">
      {usesScientistArtwork ? (
        <div className="relative h-full overflow-hidden bg-[#b9d5e8]">
          <img
            src={asset('aman-scientist-spread-rain-gauge.jpg')}
            alt={`${name}, wearing a white scientist coat, tests a homemade rain gauge on a terrace`}
            className="h-full w-full object-cover"
          />
          <span className="absolute right-3 bottom-3 grid size-5 place-items-center rounded-full bg-white/90 text-[0.55rem] font-bold text-[#28354a] shadow-sm">1</span>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-between px-[8cqw] py-[9cqw] text-center">
          <p className="text-[clamp(0.44rem,3.6cqw,0.55rem)] font-bold tracking-[0.14em] text-[#75684f] uppercase">
            This story belongs to
          </p>
          <div>
            <p className="font-book text-[clamp(1.2rem,12cqw,2.15rem)] leading-none font-semibold" style={{ color: theme.palette.deep }}>
              {name}
            </p>
            <div className="mx-auto mt-[4cqw] h-px w-[28cqw]" style={{ backgroundColor: theme.palette.accent }} />
          </div>
          <ChildPortrait draft={draft} className="max-h-[42%] w-[45%]" />
          <p className="font-book text-[clamp(0.54rem,4.5cqw,0.8rem)] italic text-[#75684f]">Made especially by BookMojo</p>
          <span className="absolute right-[5cqw] bottom-[4cqw] text-[clamp(0.45rem,3cqw,0.55rem)] text-[#9b907d]">1</span>
        </div>
      )}
    </StoryPage>,

    ...(usesScientistArtwork
      ? [
          <StoryPage key="curious-morning">
            <IllustratedTextPage
              image={asset('aman-scientist-curious-morning.jpg')}
              eyebrow="A curious morning"
              body={`By eight, Scientist ${name} had built a rain gauge and filled a notebook with questions. Every drop was a clue.`}
              pageNumber={2}
              accent={theme.palette.accent}
              deep={theme.palette.deep}
            />
          </StoryPage>,
        ]
      : []),

    <StoryPage key="adventure-begins">
      {usesScientistArtwork ? (
        <div className="relative h-full overflow-hidden bg-[#aac8dc]">
          <img
            src={asset('aman-scientist-spread-cloud-clues.jpg')}
            alt={`${name} studies the changing monsoon clouds at a rooftop weather station`}
            className="h-full w-full object-cover"
          />
          <span className="absolute right-3 bottom-3 grid size-5 place-items-center rounded-full bg-white/90 text-[0.55rem] font-bold text-[#28354a] shadow-sm">3</span>
        </div>
      ) : (
        <IllustratedTextPage
          image={themeArtwork}
          eyebrow="The adventure begins"
          body={opening}
          pageNumber={2}
          accent={theme.palette.accent}
          deep={theme.palette.deep}
        />
      )}
    </StoryPage>,

    ...(usesScientistArtwork
      ? [
          <StoryPage key="weather-station">
            <IllustratedTextPage
              image={asset('aman-scientist-weather-station.png')}
              eyebrow="Cloud clues"
              body={`Dark clouds gathered. ${name} checked the wind, sketched their shapes and spotted a bright patch racing in from the west.`}
              pageNumber={4}
              accent={theme.palette.accent}
              deep={theme.palette.deep}
            />
          </StoryPage>,
        ]
      : []),

    <StoryPage key="inside-adventure">
      {usesScientistArtwork ? (
        <div className="relative h-full overflow-hidden bg-[#d8934f]">
          <img
            src={asset('aman-scientist-spread-experiment.jpg')}
            alt={`${name} discovers the first monsoon rain with a homemade weather station`}
            className="h-full w-full object-cover"
          />
          <span className="absolute right-3 bottom-3 grid size-5 place-items-center rounded-full bg-white/90 text-[0.55rem] font-bold text-[#28354a] shadow-sm">5</span>
        </div>
      ) : (
        <div className="relative flex h-full flex-col justify-end overflow-hidden p-[7cqw] text-white" style={{ backgroundColor: theme.palette.base }}>
          <div className="absolute inset-x-0 top-0 h-[58%] opacity-90" style={{ background: `radial-gradient(circle at 50% 68%, ${theme.palette.accent}, transparent 52%)` }} />
          <ChildPortrait draft={draft} className="absolute top-[7cqw] left-1/2 max-h-[45%] w-[48%] -translate-x-1/2" />
          <div className="relative rounded-sm bg-black/30 p-[5cqw] backdrop-blur-[2px]">
            <p className="text-[clamp(0.44rem,3.5cqw,0.55rem)] font-bold tracking-[0.14em] text-white/75 uppercase">Inside the adventure</p>
            <p className="font-book mt-[2cqw] text-[clamp(0.58rem,4.8cqw,0.92rem)] leading-[1.45]">{theme.blurb}</p>
          </div>
          <span className="absolute right-[4cqw] bottom-[3cqw] text-[clamp(0.45rem,3cqw,0.55rem)] text-white/55">3</span>
        </div>
      )}
    </StoryPage>,

    ...(usesScientistArtwork
      ? [
          <StoryPage key="experiment">
            <IllustratedTextPage
              image={asset('aman-scientist-rain-gauge.png')}
              eyebrow="The experiment"
              body={`${name}'s pinwheel spun once for a breeze, then three quick turns. The monsoon was almost here.`}
              pageNumber={6}
              accent={theme.palette.accent}
              deep={theme.palette.deep}
            />
          </StoryPage>,
        ]
      : []),

    <StoryPage key="discovery">
      {usesScientistArtwork ? (
        <div className="relative h-full overflow-hidden bg-[#64859d]">
          <img
            src={asset('aman-scientist-spread-discovery.jpg')}
            alt={`${name} celebrates as rain begins to fill the rooftop gauge`}
            className="h-full w-full object-cover"
          />
          <span className="absolute right-3 bottom-3 grid size-5 place-items-center rounded-full bg-white/90 text-[0.55rem] font-bold text-[#28354a] shadow-sm">7</span>
        </div>
      ) : (
        <IllustratedTextPage
          image={themeArtwork}
          eyebrow="The discovery"
          body={`${name} solved the mystery with courage, careful questions and one wonderfully curious mind.`}
          pageNumber={4}
          accent={theme.palette.accent}
          deep={theme.palette.deep}
        />
      )}
    </StoryPage>,

    ...(usesScientistArtwork
      ? [
          <StoryPage key="discovery-text">
            <IllustratedTextPage
              image={asset('aman-scientist-discovery.jpg')}
              eyebrow="The discovery"
              body={`“Rain before sunset!” ${name} cheered as silver drops filled the gauge. Careful questions had solved the mystery.`}
              pageNumber={8}
              accent={theme.palette.accent}
              deep={theme.palette.deep}
            />
          </StoryPage>,
        ]
      : []),

    <StoryPage key="back-cover" hard>
      <div className="flex h-full flex-col items-center justify-center px-[8cqw] py-[9cqw] text-center text-white" style={{ backgroundColor: theme.palette.deep }}>
        <div className="grid size-[clamp(2rem,18cqw,3.5rem)] shrink-0 place-items-center rounded-md border border-white/25 bg-white/10 font-book text-[clamp(1rem,8cqw,1.5rem)]">B</div>
        <p className="font-book mt-[6cqw] text-[clamp(0.82rem,7.4cqw,1.35rem)] leading-[1.25] font-semibold">{name}&apos;s story is only beginning.</p>
        <p className="mt-[4cqw] text-[clamp(0.48rem,3.8cqw,0.65rem)] leading-[1.45] text-white/70">Written, illustrated and printed especially for one child.</p>
        <p className="mt-[7cqw] text-[clamp(0.42rem,3.2cqw,0.55rem)] font-bold tracking-[0.14em] text-white/55 uppercase">BookMojo original</p>
      </div>
    </StoryPage>,
  ];

  const pageCount = pages.length;

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className="relative flex min-h-[24rem] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-sunken px-3 py-4 sm:min-h-[31rem] sm:gap-4 sm:px-6 sm:py-8"
        aria-label={`Interactive preview of ${theme.name}, personalised for ${name}`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--jade-100) 75%, transparent), transparent 58%)',
          }}
        />

        <p className="relative z-20 rounded-sm bg-white/90 px-3 py-1 text-[0.7rem] font-semibold whitespace-nowrap text-ink shadow-e1 backdrop-blur-sm">
          Swipe pages or use the buttons
        </p>

        {/**
         * The key is the STORY ONLY, deliberately.
         *
         * It used to include the name and the character colours, so every single
         * keystroke in the name field produced a new key and React tore the whole
         * book out of the DOM and rebuilt it — a visible flash on every letter,
         * and the page counter was left pointing at a page the rebuilt book was no
         * longer showing.
         *
         * Nothing about a name or a colour change is structural, and
         * react-pageflip already handles content edits: new children run through
         * its `updateFromHtml` path and the pages update in place. What genuinely
         * does need a rebuild is the story, because the page count changes (ten
         * for the scientist, six for the rest) and `usePortrait` is only read when
         * PageFlip is constructed.
         */}
        <HTMLFlipBook
          key={PREVIEW_STORY_ID}
          ref={book}
          className="relative z-10 drop-shadow-[0_24px_28px_rgb(37_33_63_/_0.22)]"
          style={{}}
          width={260}
          height={330}
          size="stretch"
          minWidth={118}
          maxWidth={290}
          minHeight={150}
          maxHeight={368}
          startPage={0}
          drawShadow
          flippingTime={760}
          usePortrait={!usesScientistArtwork}
          startZIndex={10}
          autoSize
          maxShadowOpacity={0.38}
          showCover
          mobileScrollSupport
          clickEventForward
          useMouseEvents
          swipeDistance={24}
          showPageCorners
          disableFlipByClick={false}
          onFlip={(event: FlipEvent) => setPage(event.data)}
        >
          {pages}
        </HTMLFlipBook>

        <div className="relative z-20 grid w-full max-w-[38rem] grid-cols-2 gap-2" aria-label="Book preview controls">
          <button
            type="button"
            onClick={() => book.current?.pageFlip().flipPrev('bottom')}
            disabled={page === 0}
            className="btn btn-tonal min-h-11 w-full px-3 disabled:opacity-35"
            aria-label="Go back one book page"
          >
            <Chevron size={18} className="rotate-180" aria-hidden />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => book.current?.pageFlip().flipNext('bottom')}
            disabled={page >= pageCount - 1}
            className="btn btn-ink min-h-11 w-full px-3"
            aria-label="Turn to next book page"
          >
            <span>Next page</span>
            <Chevron size={18} aria-hidden />
          </button>
        </div>

        <div className="relative z-20 text-center" aria-label="Book preview status">
          <p className="text-small font-bold text-ink" aria-live="polite">
            Page {Math.min(page + 1, pageCount)} / {pageCount}
          </p>
          <p className="text-[0.68rem] text-ink-muted">Interactive preview</p>
        </div>
      </div>
    </div>
  );
}
