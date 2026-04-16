import { useLayoutEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@citron-systems/citron-ui'

export type SettingsMenuOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SettingsMenuSelectProps = {
  id?: string
  options: SettingsMenuOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  /** Announces the list for screen readers (native `<select>` had a `<label>`). */
  listAriaLabel: string
  className?: string
}

const triggerClass =
  'flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-[var(--inkblot-semantic-color-border-default)] bg-[var(--inkblot-semantic-color-background-secondary)] px-4 text-left text-sm text-[var(--inkblot-semantic-color-text-primary)] shadow-sm outline-none transition-colors hover:bg-[var(--inkblot-semantic-color-background-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--inkblot-semantic-color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--inkblot-semantic-color-background-primary)] disabled:pointer-events-none disabled:opacity-50'

const optionRow =
  'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-[var(--inkblot-semantic-color-text-primary)] transition-colors hover:bg-[var(--inkblot-semantic-color-background-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inkblot-semantic-color-border-focus)] disabled:pointer-events-none disabled:opacity-50'

export function SettingsMenuSelect({
  id,
  options,
  value,
  onChange,
  disabled,
  placeholder = 'Choose…',
  listAriaLabel,
  className,
}: SettingsMenuSelectProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined)

  useLayoutEffect(() => {
    if (!open) return
    const w = triggerRef.current?.getBoundingClientRect().width
    if (w) setPanelWidth(Math.round(w))
  }, [open])

  const selected = options.find((o) => o.value === value)
  const label = selected?.label ?? placeholder

  return (
    <div className="block w-full min-w-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={triggerRef}
          type="button"
          id={id}
          disabled={disabled}
          className={[triggerClass, className].filter(Boolean).join(' ')}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="min-w-0 flex-1 truncate">{label}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" strokeWidth={2} aria-hidden />
        </PopoverTrigger>
        <PopoverContent
          className="z-[220] !p-1 border border-[var(--inkblot-semantic-color-border-default)] bg-[var(--inkblot-semantic-color-background-primary)] shadow-[var(--inkblot-shadow-lg)]"
          style={{
            width: panelWidth,
            maxWidth: 'min(calc(100vw - 2rem), 24rem)',
          }}
        >
          <ul
            role="listbox"
            aria-label={listAriaLabel}
            className="max-h-64 overflow-y-auto py-0.5 [scrollbar-gutter:stable]"
          >
            {options.map((opt) => {
              const isOn = opt.value === value
              return (
                <li key={opt.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isOn}
                    disabled={opt.disabled}
                    className={optionRow}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                    }}
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                      {isOn ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
                    </span>
                    <span className="min-w-0 flex-1">{opt.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/** Same as SettingsMenuSelect — use if markup still references `<Select>`. */
export const Select = SettingsMenuSelect
