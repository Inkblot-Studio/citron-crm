import type { ComponentPropsWithoutRef } from 'react'
import { DialogContent } from '@citron-systems/citron-ui'
import { cn } from './cn'
import { MODULE_DIALOG_SURFACE_CLASS } from './module-surfaces'

export type ModuleDialogContentProps = ComponentPropsWithoutRef<typeof DialogContent>

/** Dialog panel using the same restrained shell as Marketing module compose / templates. */
export function ModuleDialogContent({ className, ...props }: ModuleDialogContentProps) {
  return <DialogContent className={cn(MODULE_DIALOG_SURFACE_CLASS, className)} {...props} />
}
