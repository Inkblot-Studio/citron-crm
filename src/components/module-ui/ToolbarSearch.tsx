import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { SearchBar } from '@citron-systems/citron-ui'
import { cn } from './cn'

export type ToolbarSearchProps = ComponentPropsWithoutRef<typeof SearchBar>

/**
 * SearchBar aligned to the 32px toolbar — overrides touch-target min-height from EmailCampaigns-style pill search.
 */
export const ToolbarSearch = forwardRef<HTMLInputElement, ToolbarSearchProps>(
  ({ className, ...props }, ref) => (
    <SearchBar
      ref={ref}
      className={cn(
        'min-h-8 py-[var(--inkblot-spacing-1)] text-[length:inherit] leading-snug sm:min-h-8',
        className,
      )}
      {...props}
    />
  ),
)

ToolbarSearch.displayName = 'ToolbarSearch'
