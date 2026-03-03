import { CommandCanvas } from '@citron-systems/citron-ui'

export default function HomePage() {
  return (
    <CommandCanvas
      title="Command Canvas"
      subtitle="AI-native interface — results appear here"
      readyLabel="System ready"
      footerText="Citron OS v1.0 · AI-native Revenue & Operations Platform"
      hideInput
    />
  )
}
