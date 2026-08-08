import { useId, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import { Check } from '@/components/art/Icons';

/**
 * FORM CONTROLS
 * -----------------------------------------------------------------------------
 * Built on native <input type="radio"> inside a <fieldset><legend>, with the
 * input visually hidden and the <label> styled.
 *
 * The tempting alternative — divs with role="radio" and a roving tabindex — is
 * more code and worse: native radios give us arrow-key navigation, group
 * semantics, form association, autofill, Windows High Contrast Mode and voice
 * control ("click Curls") for free. Reaching for ARIA when a native element
 * exists is how accessible-looking interfaces end up unusable.
 *
 * Hit targets are 44px minimum. Selection is never signalled by colour alone:
 * every selected state also changes border weight and adds a check or ring,
 * so it survives colour-blindness and greyscale.
 */

export interface Choice<T extends string> {
  value: T;
  label: string;
  hint?: string;
  /** Swatch colour, when the choice is a visual attribute. */
  swatch?: string;
}

interface ChoiceGroupProps<T extends string> {
  legend: ReactNode;
  /** Visually hides the legend when the surrounding UI already labels the group. */
  hideLegend?: boolean;
  options: ReadonlyArray<Choice<T>>;
  value: T;
  onChange: (value: T) => void;
  variant?: 'segment' | 'chip' | 'swatch';
  columns?: 2 | 3 | 4 | 6;
  className?: string;
  note?: ReactNode;
}

export function ChoiceGroup<T extends string>({
  legend,
  hideLegend,
  options,
  value,
  onChange,
  variant = 'chip',
  columns = 4,
  className,
  note,
}: ChoiceGroupProps<T>) {
  const name = useId();

  return (
    <fieldset className={cx('min-w-0 border-0 p-0', className)}>
      <legend
        className={cx(
          'eyebrow mb-2.5',
          hideLegend && 'sr-only',
        )}
      >
        {legend}
      </legend>

      <div
        className={cx(
          variant === 'swatch' ? 'flex flex-wrap gap-2' : 'grid gap-2',
          variant !== 'swatch' && columns === 2 && 'grid-cols-2',
          variant !== 'swatch' && columns === 3 && 'grid-cols-3',
          variant !== 'swatch' && columns === 4 && 'grid-cols-2 xs:grid-cols-4',
          variant !== 'swatch' && columns === 6 && 'grid-cols-3 xs:grid-cols-6',
        )}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={option.value}
              className={cx(
                'group relative cursor-pointer select-none',
                variant === 'swatch' ? 'block' : 'block',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />

              {variant === 'swatch' ? (
                <span
                  className={cx(
                    'grid size-11 place-items-center rounded-full transition-all duration-200',
                    'ring-offset-2 ring-offset-raised peer-focus-visible:ring-2 peer-focus-visible:ring-clay-500',
                    selected ? 'ring-2 ring-ink' : 'ring-1 ring-hairline hover:ring-strong',
                  )}
                >
                  <span
                    className="size-8 rounded-full shadow-e1"
                    style={{ background: option.swatch }}
                    aria-hidden="true"
                  />
                  {selected && (
                    <Check
                      size={16}
                      className="absolute text-white mix-blend-difference"
                      aria-hidden="true"
                    />
                  )}
                  <span className="sr-only">{option.label}</span>
                </span>
              ) : (
                <span
                  className={cx(
                    'flex min-h-11 flex-col items-center justify-center rounded-[0.8rem] px-3 py-2 text-center transition-all duration-200',
                    'ring-offset-2 ring-offset-raised peer-focus-visible:ring-2 peer-focus-visible:ring-clay-500',
                    selected
                      ? 'bg-inverse text-ink-inverse shadow-e2 font-semibold'
                      : 'bg-inset text-ink-soft hover:bg-strong/25 hover:text-ink',
                  )}
                >
                  <span className="text-small leading-tight font-semibold">{option.label}</span>
                  {option.hint && (
                    <span
                      className={cx(
                        'text-[0.68rem] leading-tight',
                        selected ? 'opacity-70' : 'text-ink-muted',
                      )}
                    >
                      {option.hint}
                    </span>
                  )}
                </span>
              )}
            </label>
          );
        })}
      </div>

      {note && <p className="mt-2.5 text-small text-ink-muted">{note}</p>}
    </fieldset>
  );
}

/**
 * Single text field.
 *
 * `autoComplete="off"` is correct here and unusual: the browser must not offer
 * the buyer's *own* name for a field that means "my child's name". A wrong
 * autofill on this field would put the wrong name on a printed book.
 */
export function NameField({
  value,
  onChange,
  label,
  hint,
  placeholder,
  maxLength = 20,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  hint?: ReactNode;
  placeholder?: string;
  maxLength?: number;
}) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          aria-describedby={hint ? hintId : undefined}
          className={cx(
            'font-display w-full rounded-[0.9rem] border-2 border-hairline bg-raised px-4 py-3',
            'text-[1.35rem] leading-tight font-semibold tracking-[-0.01em]',
            'transition-colors duration-200 outline-none',
            'placeholder:text-ink-muted/55 placeholder:font-normal placeholder:italic',
            'hover:border-strong focus:border-clay-500',
          )}
        />
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-micro font-semibold tabular-nums text-ink-muted"
          aria-hidden="true"
        >
          {value.length}/{maxLength}
        </span>
      </div>
      {hint && (
        <p id={hintId} className="text-small text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
