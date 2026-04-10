import { useState, useCallback } from 'react'
import { CenteredAIChat } from '@citron-systems/citron-ui'
import type { CenteredAIChatMessage, CenteredAIChatComposePayload } from '@citron-systems/citron-ui'

export default function HomePage() {
  const [messages, setMessages] = useState<CenteredAIChatMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleComposeSubmit = useCallback(({ text, files }: CenteredAIChatComposePayload) => {
    const trimmed = text.trim()
    const lines: string[] = []
    if (trimmed) lines.push(trimmed)
    if (files.length > 0) {
      lines.push(`[Attached: ${files.map((f) => f.name).join(', ')}]`)
    }
    const content = lines.join('\n')
    if (!content) return

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
        content: `Processing your request: "${trimmed || files.map((f) => f.name).join(', ')}"`,
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsProcessing(false)
    }, 1200)
  }, [])

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <CenteredAIChat
        messages={messages}
        onComposeSubmit={handleComposeSubmit}
        isProcessing={isProcessing}
        className="h-full min-h-0 w-full"
      />
    </div>
  )
}
