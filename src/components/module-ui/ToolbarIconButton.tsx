import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from './cn'

export type ToolbarIconButtonVariant = 'primary' | 'secondary' | 'filter'

export interface ToolbarIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ToolbarIconButtonVariant
  /** Only used when variant="filter". */
  active?: boolean
}

/** Standard 32×32 header icon actions — matches citron-ui compact toolbar buttons (Marketing / Contacts patterns). */
export const ToolbarIconButton = forwardRef<HTMLButtonElement, ToolbarIconButtonProps>(
  ({ variant = 'secondary', active = false, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
        'transition-colors duration-[var(--inkblot-duration-fast)] motion-safe:active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inkblot-semantic-color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--inkblot-semantic-color-background-primary)]',
        'disabled:pointer-events-none disabled:opacity-[var(--inkblot-opacity-disabled)] [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:shrink-0',
        variant === 'primary' &&
          'bg-[var(--inkblot-semantic-color-interactive-primary)] text-[var(--inkblot-semantic-color-text-inverse)] hover:bg-[var(--inkblot-semantic-color-interactive-primary-hover)] active:bg-[var(--inkblot-semantic-color-interactive-primary-active)]',
        variant === 'secondary' &&
          'border border-transparent bg-[var(--inkblot-semantic-color-background-primary)] text-[var(--inkblot-semantic-color-text-secondary)] shadow-none hover:bg-[var(--inkblot-semantic-color-interactive-secondary-hover)] hover:text-[var(--inkblot-semantic-color-text-primary)] dark:bg-[var(--inkblot-semantic-color-background-secondary)]',
        variant === 'filter' &&
          (active
            ? 'text-[var(--inkblot-semantic-color-interactive-primary)] hover:bg-[var(--inkblot-semantic-color-interactive-secondary-hover)]'
            : 'border-transparent bg-transparent text-[var(--inkblot-semantic-color-text-tertiary)] hover:bg-[var(--inkblot-semantic-color-interactive-secondary-hover)] hover:text-[var(--inkblot-semantic-color-text-primary)]'),
        className,
      )}
      aria-pressed={variant === 'filter' ? active : undefined}
      {...props}
    />
  ),
)

ToolbarIconButton.displayName = 'ToolbarIconButton'
