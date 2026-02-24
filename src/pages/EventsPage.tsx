import { ModuleContainer, ModuleErrorBoundary, ActivityStream } from '@citron-systems/citron-ui'
import type { CitronOSContext } from '@/App'
import { findEntityByName, getEntityById } from '@/lib/mock-engine'

export function EventsPage({ events, loading, setFocusEntity }: CitronOSContext) {
  const handleEntitySelect = (entity: { id: string }) => {
    const full = getEntityById(entity.id)
    if (full) setFocusEntity(full)
  }
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <ModuleContainer loading={loading} title="Event Stream">
        <ModuleErrorBoundary>
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--inkblot-semantic-color-text-primary)]">
                Event Stream
              </h1>
              <p className="text-sm text-[var(--inkblot-semantic-color-text-secondary)]">
                Real-time activity across all modules
              </p>
            </div>
            <div className="border-t border-[var(--inkblot-semantic-color-border-default)] pt-4 space-y-2 sm:space-y-4">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                Event Stream
              </h2>
              <ActivityStream
                events={events}
                findEntity={(name) => findEntityByName(name) ?? null}
                onEntitySelect={handleEntitySelect}
              />
            </div>
          </div>
        </ModuleErrorBoundary>
      </ModuleContainer>
    </div>
  )
}
