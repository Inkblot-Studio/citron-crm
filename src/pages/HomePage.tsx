import { useRef, useEffect } from 'react'
import { ModuleSkeleton } from '@citron-systems/citron-ui'
import { useCommand } from '@/lib/CommandContext'
import type { GraphNode, CitronEvent } from '@/lib/types'

interface HomePageProps {
  entities?: GraphNode[]
  events?: CitronEvent[]
}

export function HomePage(_props: HomePageProps) {
  const { messages, generatedUI, isProcessing } = useCommand()
  const feedRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const skeletonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollToNewContent = () => {
      const target = lastMessageRef.current
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight
      }
    }
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToNewContent)
    })
    return () => cancelAnimationFrame(raf)
  }, [messages, isProcessing])

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0" data-tour="canvas">
      <div className="flex min-w-0 flex-1 w-full max-w-2xl flex-col gap-4 mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--inkblot-semantic-color-status-success)]" />
          <span className="text-sm text-[var(--inkblot-semantic-color-text-secondary)]">System ready</span>
        </div>

        <div ref={feedRef} className="flex flex-1 flex-col gap-4 overflow-y-auto min-h-0">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              ref={index === messages.length - 1 ? lastMessageRef : undefined}
              className="flex flex-col gap-2"
            >
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[80%] rounded-[var(--inkblot-radius-lg)] bg-[var(--inkblot-semantic-color-interactive-primary)] px-4 py-3 text-sm text-[var(--inkblot-semantic-color-text-inverse)]">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="max-w-[90%] sm:max-w-[85%]">
                  {msg.content && (
                    <p className="text-sm text-[var(--inkblot-semantic-color-text-secondary)]">{msg.content}</p>
                  )}
                  {generatedUI.get(msg.id)}
                </div>
              )}
            </div>
          ))}
          {isProcessing && (
            <div ref={skeletonRef} className="max-w-[90%] sm:max-w-[85%]">
              <ModuleSkeleton className="h-20 w-full animate-shimmer" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
