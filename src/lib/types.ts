export type EntityType = 'Person' | 'Organization' | 'Deal'

export interface GraphNode {
  id: string
  type: EntityType
  name: string
  metadata: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface GraphEdge {
  id: string
  type: string
  sourceId: string
  targetId: string
  metadata?: Record<string, string>
  createdAt: string
}

export interface CitronEvent {
  id: string
  actor: string
  subject: string
  event_type: string
  timestamp: string
  confidence_score: number
  metadata?: Record<string, unknown>
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  intent?: 'entity' | 'event' | 'general'
  timestamp: string
}
