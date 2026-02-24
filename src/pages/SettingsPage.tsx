import { ModuleContainer } from '@citron-systems/citron-ui'

export function SettingsPage() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 sm:p-6 min-w-0">
      <ModuleContainer title="Settings">
        <p className="text-sm text-[var(--inkblot-semantic-color-text-secondary)]">
          Application configuration
        </p>
      </ModuleContainer>
    </div>
  )
}
