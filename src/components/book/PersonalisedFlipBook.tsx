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

const StoryPage = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string; hard?: boolean }
>(({ children, className, hard = false }, ref) => (
  <div
    ref={ref}
    data-density={hard ? 'hard' : 'soft'}
    className={cx(
      'relative h-full overflow-hidden border border-[#d9cfbd] bg-[#fffaf0] text-[#27231d]',
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

export function PersonalisedFlipBook({ draft }: { draft: Draft }) {
  const book = useRef<FlipBookApi | null>(null);
  const [page, setPage] = useState(0);
  const theme = THEME_BY_ID.get(draft.themeId) ?? THEMES[0]!;
  const name = formatName(draft.childName) || 'Aarav';
  const opening = theme.opening.replaceAll('{name}', name);
  const pageCount = 6;

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

        <HTMLFlipBook
          key={`${draft.themeId}-${name}-${draft.look.skin}-${draft.look.hair}-${draft.look.hairStyle}`}
          ref={book}
          className="relative z-10 drop-shadow-[0_24px_28px_rgb(37_33_63_/_0.22)]"
          style={{}}
          width={290}
          height={348}
          size="stretch"
          minWidth={240}
          maxWidth={320}
          minHeight={288}
          maxHeight={384}
          startPage={0}
          drawShadow
          flippingTime={760}
          usePortrait
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
          <StoryPage hard className="bg-[#161e44]">
            <BookCover draft={draft} className="h-full w-full" />
          </StoryPage>

          <StoryPage>
            <div className="flex h-full flex-col items-center justify-between px-7 py-8 text-center">
              <p className="text-[0.55rem] font-bold tracking-[0.2em] text-[#75684f] uppercase">
                This story belongs to
              </p>
              <div>
                <p className="font-book text-[2.15rem] leading-none font-semibold" style={{ color: theme.palette.deep }}>
                  {name}
                </p>
                <div className="mx-auto mt-3 h-px w-20" style={{ backgroundColor: theme.palette.accent }} />
              </div>
              <ChildPortrait draft={draft} className="w-[45%]" />
              <p className="font-book text-[0.8rem] italic text-[#75684f]">Made especially by BookMojo</p>
              <span className="absolute right-4 bottom-3 text-[0.55rem] text-[#9b907d]">1</span>
            </div>
          </StoryPage>

          <StoryPage>
            <div className="flex h-full flex-col px-7 py-8">
              <p className="text-[0.55rem] font-bold tracking-[0.18em] uppercase" style={{ color: theme.palette.deep }}>
                Chapter one
              </p>
              <h3 className="font-book mt-5 text-[1.6rem] leading-tight font-semibold">A very important morning</h3>
              <p className="font-book mt-5 text-[0.95rem] leading-[1.7] text-[#4d4538] first-letter:float-left first-letter:mr-1.5 first-letter:text-[2.7rem] first-letter:leading-[0.8] first-letter:font-semibold" style={{ '--first-letter-color': theme.palette.accent } as React.CSSProperties}>
                {opening}
              </p>
              <div className="mt-auto flex items-end justify-between">
                <div className="mb-2 h-px w-16" style={{ backgroundColor: theme.palette.accent }} />
                <ChildPortrait draft={draft} className="w-[38%]" />
              </div>
              <span className="absolute right-4 bottom-3 text-[0.55rem] text-[#9b907d]">2</span>
            </div>
          </StoryPage>

          <StoryPage>
            <div className="relative flex h-full flex-col justify-end overflow-hidden p-7 text-white" style={{ backgroundColor: theme.palette.base }}>
              <div className="absolute inset-x-0 top-0 h-[58%] opacity-90" style={{ background: `radial-gradient(circle at 50% 68%, ${theme.palette.accent}, transparent 52%)` }} />
              <ChildPortrait draft={draft} className="absolute top-7 left-1/2 w-[48%] -translate-x-1/2" />
              <div className="relative rounded-sm bg-black/25 p-5 backdrop-blur-[2px]">
                <p className="text-[0.55rem] font-bold tracking-[0.18em] text-white/70 uppercase">Inside the adventure</p>
                <p className="font-book mt-2 text-[0.92rem] leading-[1.55]">{theme.blurb}</p>
              </div>
              <span className="absolute right-4 bottom-3 text-[0.55rem] text-white/55">3</span>
            </div>
          </StoryPage>

          <StoryPage>
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <span className="font-book text-[3rem] leading-none" style={{ color: theme.palette.accent }}>“</span>
              <p className="font-book text-[1.35rem] leading-snug font-semibold" style={{ color: theme.palette.deep }}>
                {theme.promise}
              </p>
              <div className="my-6 h-px w-20" style={{ backgroundColor: theme.palette.accent }} />
              <p className="text-[0.7rem] leading-relaxed text-[#75684f]">
                Every page changes with {name}&apos;s name, age and chosen character.
              </p>
              <span className="absolute right-4 bottom-3 text-[0.55rem] text-[#9b907d]">4</span>
            </div>
          </StoryPage>

          <StoryPage hard>
            <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white" style={{ backgroundColor: theme.palette.deep }}>
              <div className="grid size-14 place-items-center rounded-md border border-white/25 bg-white/10 font-book text-2xl">B</div>
              <p className="font-book mt-5 text-[1.35rem] font-semibold">{name}&apos;s story is only beginning.</p>
              <p className="mt-3 text-[0.65rem] leading-relaxed text-white/65">Written, illustrated and printed especially for one child.</p>
              <p className="absolute bottom-7 text-[0.55rem] font-bold tracking-[0.22em] text-white/50 uppercase">BookMojo original</p>
            </div>
          </StoryPage>
        </HTMLFlipBook>

        <div className="relative z-20 grid w-full max-w-[22rem] grid-cols-2 gap-2" aria-label="Book preview controls">
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