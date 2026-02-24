import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import {
  EntityCard,
  EventRow,
  EntityCommandCard,
  IntelligenceScoreCard,
  ModuleContainer,
  ModuleErrorBoundary,
  StatusBadge,
} from '@citron-systems/citron-ui'
import type { ChatMessage } from './types'
import { findEntityByName } from './mock-engine'
import type { GraphNode, CitronEvent } from './types'

function detectIntent(query: string): 'entity' | 'event' | 'general' {
  const lower = query.toLowerCase()
  if (
    lower.includes('entity') ||
    lower.includes('company') ||
    lower.includes('person') ||
    lower.includes('deal') ||
    lower.includes('profile') ||
    lower.includes('org') ||
    lower.includes('acme')
  ) {
    return 'entity'
  }
  if (
    lower.includes('event') ||
    lower.includes('activity') ||
    lower.includes('recent') ||
    lower.includes('stream') ||
    lower.includes('log')
  ) {
    return 'event'
  }
  return 'general'
}

interface CommandContextValue {
  prompt: string
  setPrompt: (v: string) => void
  messages: ChatMessage[]
  generatedUI: Map<string, ReactNode>
  isProcessing: boolean
  submitPrompt: (value?: string) => void
  entities: GraphNode[]
  events: CitronEvent[]
}

const CommandContext = createContext<CommandContextValue | null>(null)

export function useCommand() {
  const ctx = useContext(CommandContext)
  if (!ctx) throw new Error('useCommand must be used within CommandProvider')
  return ctx
}

interface CommandProviderProps {
  children: ReactNode
  entities: GraphNode[]
  events: CitronEvent[]
  onFocusEntity?: (entity: GraphNode) => void
}

export function CommandProvider({
  children,
  entities,
  events,
  onFocusEntity,
}: CommandProviderProps) {
  const INITIAL_USER_ID = 'msg-initial-user'
  const INITIAL_ASSISTANT_ID = 'msg-initial-assistant'

  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: INITIAL_USER_ID,
      role: 'user',
      content: "Show me Acme Corp's profile and deal health.",
      timestamp: new Date().toISOString(),
    },
    {
      id: INITIAL_ASSISTANT_ID,
      role: 'assistant',
      content: "Here's the entity profile and current intelligence scores for Acme Corp.",
      intent: 'entity',
      timestamp: new Date().toISOString(),
    },
  ])
  const [generatedUI, setGeneratedUI] = useState<Map<string, ReactNode>>(new Map())
  const [isProcessing, setIsProcessing] = useState(false)
  const hasInitializedUI = useRef(false)

  useEffect(() => {
    const entity = entities[0]
    if (hasInitializedUI.current || !entity) return
    hasInitializedUI.current = true
    const stats = [
      { label: 'CONTACTS', value: '12' },
      { label: 'OPEN DEALS', value: '3' },
      { label: 'TOUCHPOINTS', value: '47' },
    ]
    const ui = (
      <>
        <ModuleContainer title="">
          <ModuleErrorBoundary>
            <EntityCommandCard
              title={entity.name}
              insights={
                <div className="flex flex-col gap-3">
                  <span className="text-sm text-[var(--inkblot-semantic-color-text-secondary)]">
                    {entity.metadata?.industry ?? 'Enterprise'} - {entity.metadata?.stage ?? 'Series C'} - {entity.metadata?.segment ?? 'SaaS'}
                  </span>
                  <StatusBadge label="Active" variant="success" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">{s.label}</p>
                        <p className="text-sm font-bold text-[var(--inkblot-semantic-color-text-primary)]">
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="flex items-center gap-2 text-sm text-[var(--inkblot-semantic-color-text-secondary)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--inkblot-semantic-color-status-success)]" />
                    Connected to Jane Smith, TechVentures +3 more
                  </p>
                </div>
              }
            />
          </ModuleErrorBoundary>
        </ModuleContainer>
        <div className="space-y-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
            Intelligence Scores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <IntelligenceScoreCard label="Revenue Confidence" value={82} trend="up" />
            <IntelligenceScoreCard label="Churn Risk" value={23} trend="down" />
            <IntelligenceScoreCard label="Momentum" value={67} />
          </div>
        </div>
      </>
    )
    setGeneratedUI((prev) => {
      const next = new Map(prev)
      next.set(INITIAL_ASSISTANT_ID, ui)
      return next
    })
  }, [entities])

  const submitPrompt = useCallback(
    (value?: string) => {
      const trimmed = (value ?? prompt).trim()
      if (!trimmed || isProcessing) return

      const matchedEntity = findEntityByName(trimmed)
      if (matchedEntity && onFocusEntity) {
        onFocusEntity(matchedEntity)
      }

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setPrompt('')
      setIsProcessing(true)

      const intent = detectIntent(trimmed)

      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-res`,
          role: 'assistant',
          content:
            intent === 'entity'
              ? "Here's the entity profile and current intelligence scores for Acme Corp."
              : intent === 'event'
                ? 'Latest activity from the event bus:'
                : '',
          intent,
          timestamp: new Date().toISOString(),
        }

        let ui: ReactNode
        if (intent === 'entity' && entities[0]) {
          const entity = entities[0]
          ui = (
            <EntityCard
              name={entity.name}
              entityType={entity.type}
              metadata={entity.metadata}
              edges={[
                { type: 'WORKS_WITH', target: entities[1]?.name },
                { type: 'MANAGES', target: entities[4]?.name },
              ]}
            />
          )
        } else if (intent === 'event') {
          ui = (
            <div className="space-y-2">
              {events.slice(0, 5).map((evt) => (
                <EventRow key={evt.id} event={evt} />
              ))}
            </div>
          )
        } else {
          ui = (
            <p className="text-sm text-[var(--inkblot-semantic-color-text-primary)]">
              Revenue confidence is trending upward at 78%. Momentum score increased 12% this week driven by 3 new meetings with Acme Corp. Churn risk remains low at 15% across the active pipeline.
            </p>
          )
        }

        setGeneratedUI((prev) => {
          const next = new Map(prev)
          next.set(assistantMsg.id, ui)
          return next
        })
        setMessages((prev) => [...prev, assistantMsg])
        setIsProcessing(false)
      }, 800)
    },
    [prompt, isProcessing, entities, events, onFocusEntity],
  )

  return (
    <CommandContext.Provider
      value={{
        prompt,
        setPrompt,
        messages,
        generatedUI,
        isProcessing,
        submitPrompt,
        entities,
        events,
      }}
    >
      {children}
    </CommandContext.Provider>
  )
}
