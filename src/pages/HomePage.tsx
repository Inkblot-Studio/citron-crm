import { useState, useCallback } from 'react'
import { CenteredAIChat } from '@citron-systems/citron-ui'
import type { CenteredAIChatMessage, CenteredAIChatAgent } from '@citron-systems/citron-ui'

const AGENTS: CenteredAIChatAgent[] = [
  { id: 'general', label: 'General', description: 'Full CRM assistant' },
  { id: 'accounting', label: 'Accounting', description: 'Invoices & deals' },
  { id: 'campaigns', label: 'Campaigns', description: 'Email campaigns' },
  { id: 'tasks', label: 'Tasks', description: 'Tasks & workflows' },
]

export default function HomePage() {
  const [messages, setMessages] = useState<CenteredAIChatMessage[]>([])
  const [activeAgent, setActiveAgent] = useState('general')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSend = useCallback(
    (content: string) => {
      const userMsg: CenteredAIChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      }
      setMessages((prev) => [...prev, userMsg])
      setIsProcessing(true)

      setTimeout(() => {
        const assistantMsg: CenteredAIChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `[${activeAgent}] Processing your request: "${content}"`,
        }
        setMessages((prev) => [...prev, assistantMsg])
        setIsProcessing(false)
      }, 1200)
    },
    [activeAgent]
  )

  return (
    <CenteredAIChat
      messages={messages}
      onSend={handleSend}
      isProcessing={isProcessing}
      placeholder="Ask anything about your CRM..."
      agents={AGENTS}
      activeAgent={activeAgent}
      onAgentChange={setActiveAgent}
      onFilesAttach={(files) => {
        const names = files.map((f) => f.name).join(', ')
        handleSend(`[Attached: ${names}]`)
      }}
      emptyStateMessage="How can I help you today?"
    />
  )
}
