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

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft'

export interface Invoice {
  id: string
  client: string
  amount: string
  status: InvoiceStatus
  date: string
}

export interface InvoiceItem {
  description: string
  qty: number
  rate: number
  amount: number
}

export interface GeneratedInvoice {
  clientName: string
  clientEmail: string
  itemsDescription: string
  dueDate: string
  notes: string
  invoiceNumber: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
}

export interface Contact {
  id: string
  name: string
  company: string
  role: string
  score: number
  tags: string[]
  lastActivity: string
  starred: boolean
}

export interface Automation {
  id: string
  name: string
  trigger: string
  actions: string[]
  status: 'active' | 'paused'
  runs: number
  lastRun: string
}

export interface ReportMetric {
  label: string
  value: string
  change: string
  up: boolean
}

export interface FunnelStage {
  stage: string
  count: number
  pct: number
}

export interface TopPerformer {
  name: string
  closed: number
  revenue: string
  rate: number
}
