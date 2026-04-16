import { Skeleton } from '@citron-systems/citron-ui'

interface RouteFallbackProps {
  variant?: 'home' | 'module' | 'settings'
}

function HomeFallback() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col px-4 pb-8 pt-12">
      <div className="flex flex-1 flex-col items-center justify-center px-2">
        <Skeleton className="h-5 w-full max-w-md rounded-lg" />
      </div>
      <div className="mx-auto mt-auto w-full max-w-2xl">
        <Skeleton className="h-16 w-full rounded-3xl" />
      </div>
    </div>
  )
}

function ModuleFallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-5 w-40 rounded-lg" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

function SettingsFallback() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 md:px-6 md:py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-5 w-40 max-w-full rounded-md" />
            <Skeleton className="h-2.5 w-64 max-w-full rounded-md" />
          </div>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <div className="shrink-0 border-b border-border px-4 py-3 md:hidden">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="hidden w-56 shrink-0 flex-col gap-0.5 border-border bg-[var(--inkblot-semantic-color-background-primary)] py-4 md:flex md:border-r md:px-3 lg:w-60 lg:px-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
        <div data-citron-settings-scroll className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl space-y-4">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="h-10 w-40 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RouteFallback({ variant = 'module' }: RouteFallbackProps) {
  switch (variant) {
    case 'home':
      return <HomeFallback />
    case 'settings':
      return <SettingsFallback />
    default:
      return <ModuleFallback />
  }
}
