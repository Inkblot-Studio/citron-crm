import { Skeleton } from '@citron-systems/citron-ui'

interface RouteFallbackProps {
  variant?: 'home' | 'module' | 'settings'
}

function HomeFallback() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <Skeleton className="h-6 w-48 rounded-lg" />
      <Skeleton className="h-4 w-64 rounded-lg" />
      <div className="mt-auto w-full max-w-2xl space-y-3">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-xl" />
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
    <div className="flex flex-1 gap-4 p-6">
      <div className="w-52 shrink-0 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
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
