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
      <div className="shrink-0 border-b border-border px-4 py-4 sm:px-6">
        <Skeleton className="h-8 w-48 max-w-full rounded-lg" />
        <Skeleton className="mt-2 h-4 w-72 max-w-full rounded-lg" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6 md:flex-row md:gap-0 md:p-0">
        <div className="hidden w-full shrink-0 space-y-2 md:block md:w-56 md:border-r md:border-border md:p-4 lg:w-60 lg:p-5">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
        <div className="md:hidden">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-0 pb-6 md:px-6 md:py-6 lg:px-8">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-lg" />
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
