import type { HTMLAttributes } from 'react'
import { cn } from './cn'

export interface ModuleToolbarProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
}

/**
 * Single-row compact toolbar — same horizontal rhythm as Email Campaigns search + actions.
 */
export function ModuleToolbar({ label, className, children, ...props }: ModuleToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      className={cn(
        'flex flex-wrap items-center gap-[var(--inkblot-spacing-2)] sm:flex-nowrap',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
