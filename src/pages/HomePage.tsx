import { useState, useCallback } from 'react'
import { CenteredAssistantChat } from '@citron-systems/citron-ui'
import type { AssistantMessage } from '@citron-systems/citron-ui'

export default function HomePage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSend = useCallback(
    ({ text, files }: { text: string; files: File[] }) => {
      const content =
        files.length > 0
          ? `${text}\n[Attached: ${files.map((f) => f.name).join(', ')}]`
          : text

      const userMsg: AssistantMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      }
      setMessages((prev) => [...prev, userMsg])
      setIsProcessing(true)

      setTimeout(() => {
        const assistantMsg: AssistantMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Processing your request: "${text}"`,
        }
        setMessages((prev) => [...prev, assistantMsg])
        setIsProcessing(false)
      }, 1200)
    },
    [],
  )

  return (
    <CenteredAssistantChat
      messages={messages}
      onSend={handleSend}
      isProcessing={isProcessing}
      placeholder="Ask anything about your CRM..."
      emptyStateMessage="How can I help you today?"
      className="max-w-3xl"
    />
  )
}
