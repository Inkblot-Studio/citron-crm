import { useState, useEffect } from 'react'
import type {
  GraphNode,
  GraphEdge,
  CitronEvent,
  Invoice,
  Contact,
  Automation,
  ReportMetric,
  FunnelStage,
  TopPerformer,
} from './types'

const ENTITIES: GraphNode[] = [
  { id: 'org-001', type: 'Organization', name: 'Acme Corp', metadata: {}, createdAt: '2025-11-01T08:00:00Z', updatedAt: '2026-02-20T14:30:00Z' },
  { id: 'org-002', type: 'Organization', name: 'TechVentures', metadata: {}, createdAt: '2025-09-15T10:00:00Z', updatedAt: '2026-02-19T09:15:00Z' },
  { id: 'org-003', type: 'Organization', name: 'GlobalTech', metadata: {}, createdAt: '2025-08-01T10:00:00Z', updatedAt: '2026-02-18T09:00:00Z' },
  { id: 'org-004', type: 'Organization', name: 'DataFlow Labs', metadata: {}, createdAt: '2025-10-01T10:00:00Z', updatedAt: '2026-02-17T09:00:00Z' },
  { id: 'per-001', type: 'Person', name: 'Jane Smith', metadata: {}, createdAt: '2025-12-01T12:00:00Z', updatedAt: '2026-02-21T16:45:00Z' },
  { id: 'per-002', type: 'Person', name: 'Mark Johnson', metadata: {}, createdAt: '2025-10-20T09:30:00Z', updatedAt: '2026-02-18T11:00:00Z' },
  { id: 'per-003', type: 'Person', name: 'Sarah Lee', metadata: {}, createdAt: '2025-11-15T10:00:00Z', updatedAt: '2026-02-19T11:00:00Z' },
]

const EDGES: GraphEdge[] = [
  { id: 'edge-001', type: 'WORKS_AT', sourceId: 'per-001', targetId: 'org-001', createdAt: '2025-12-01T12:00:00Z' },
  { id: 'edge-002', type: 'WORKS_AT', sourceId: 'per-002', targetId: 'org-002', createdAt: '2025-10-20T09:30:00Z' },
  { id: 'edge-003', type: 'WORKS_AT', sourceId: 'per-003', targetId: 'org-003', createdAt: '2025-11-15T10:00:00Z' },
  { id: 'edge-004', type: 'PARTNER_OF', sourceId: 'org-001', targetId: 'org-002', createdAt: '2025-11-15T10:00:00Z' },
  { id: 'edge-005', type: 'PARTNER_OF', sourceId: 'org-001', targetId: 'org-004', createdAt: '2025-12-01T10:00:00Z' },
  { id: 'edge-006', type: 'REPORTS_TO', sourceId: 'per-001', targetId: 'per-002', createdAt: '2025-11-01T10:00:00Z' },
  { id: 'edge-007', type: 'CONSULTS', sourceId: 'per-003', targetId: 'org-001', createdAt: '2025-12-15T10:00:00Z' },
  { id: 'edge-008', type: 'PARTNER_OF', sourceId: 'org-002', targetId: 'org-004', createdAt: '2026-01-01T10:00:00Z' },
]

const EVENTS: CitronEvent[] = [
  { id: 'evt-001', actor: 'Jane Smith', subject: 'Acme Corp', event_type: 'EMAIL_OPENED', timestamp: 'Live', confidence_score: 0.95, metadata: { description: 'Email opened', details: 'Jane Smith - Acme Corp' } },
  { id: 'evt-002', actor: 'TechVentures', subject: '$2,100', event_type: 'INVOICE_PAID', timestamp: '2m ago', confidence_score: 1.0, metadata: { description: 'Invoice #1042 paid', details: '$2,100 - TechVentures' } },
  { id: 'evt-003', actor: 'Pipeline', subject: 'Negotiation → Closing', event_type: 'STAGE_CHANGED', timestamp: '14m ago', confidence_score: 1.0, metadata: { description: 'Pipeline stage changed', details: 'Negotiation → Closing' } },
  { id: 'evt-004', actor: 'Mark Johnson', subject: '12 min', event_type: 'CALL_COMPLETED', timestamp: '22m ago', confidence_score: 0.88, metadata: { description: 'Call completed', details: '12 min - Mark Johnson' } },
  { id: 'evt-005', actor: 'GlobalTech Inc', subject: 'NDA', event_type: 'CONTRACT_SIGNED', timestamp: '1h ago', confidence_score: 1.0, metadata: { description: 'Contract signed', details: 'NDA - GlobalTech Inc' } },
  { id: 'evt-006', actor: 'Acme', subject: 'DataFlow Labs', event_type: 'RELATIONSHIP_DETECTED', timestamp: '2h ago', confidence_score: 0.9, metadata: { description: 'New relationship detected', details: 'Acme ↔ DataFlow Labs' } },
  { id: 'evt-007', actor: 'StartupXYZ', subject: '$8,200', event_type: 'INVOICE_OVERDUE', timestamp: '3h ago', confidence_score: 1.0, metadata: { description: 'Invoice overdue', details: '$8,200 - StartupXYZ' } },
]

interface CitronOSState {
  entities: GraphNode[]
  edges: GraphEdge[]
  events: CitronEvent[]
  focusEntity: GraphNode
  setFocusEntity: (entity: GraphNode) => void
  loading: boolean
}

export function useCitronOS(): CitronOSState {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    entities: [] as GraphNode[],
    edges: [] as GraphEdge[],
    events: [] as CitronEvent[],
  })
  const [focusEntity, setFocusEntity] = useState<GraphNode>(ENTITIES[0]!)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        entities: ENTITIES,
        edges: EDGES,
        events: EVENTS,
      })
      setFocusEntity(ENTITIES[0]!)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return { ...data, focusEntity, setFocusEntity, loading }
}

export function getEntityById(id: string): GraphNode | undefined {
  return ENTITIES.find((e) => e.id === id)
}

export function findEntityByName(query: string): GraphNode | undefined {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return undefined
  return ENTITIES.find(
    (e) =>
      e.name.toLowerCase().includes(normalized) ||
      normalized.includes(e.name.toLowerCase())
  )
}

export { ENTITIES }

export function buildPipelineMetrics(): { label: string; value: string | number; variant?: 'default' | 'success' | 'warning' | 'error' }[] {
  return [
    { label: 'Prospecting', value: '$45,000', variant: 'default' },
    { label: 'Discovery', value: '$78,000', variant: 'default' },
    { label: 'Negotiation', value: '$125,000', variant: 'success' },
    { label: 'Proposal Sent', value: '$91,600', variant: 'warning' },
    { label: 'Closed Won', value: '$210,000', variant: 'success' },
    { label: 'Closed Lost', value: '$32,000', variant: 'error' },
  ]
}

export interface PipelineDeal {
  id: string
  deal: string
  value: string
  stage: string
  score: number
  trend: 'up' | 'down' | 'flat'
}

export const PIPELINE_DEALS: PipelineDeal[] = [
  { id: '1', deal: 'Acme Corp - Enterprise', value: '$120,000', stage: 'Closing', score: 82, trend: 'up' },
  { id: '2', deal: 'TechVentures - Pro', value: '$45,000', stage: 'Negotiation', score: 65, trend: 'up' },
  { id: '3', deal: 'DataFlow Labs', value: '$70,000', stage: 'Discovery', score: 45, trend: 'down' },
  { id: '4', deal: 'GlobalTech Inc', value: '$200,000', stage: 'Proposal', score: 38, trend: 'down' },
  { id: '5', deal: 'StartupXYZ', value: '$15,000', stage: 'Closing', score: 81, trend: 'up' },
]

export const PIPELINE_METRIC_CARDS = [
  { label: 'PIPELINE VALUE', value: '$458K', subtext: '+12% MoM' },
  { label: 'AVG. DEAL SIZE', value: '$91.6K', subtext: '5 active' },
  { label: 'WIN RATE', value: '68%', subtext: 'Last 90 days' },
  { label: 'AVG. CYCLE', value: '34d', subtext: '3d vs prior' },
]

export function getEdgesForEntity(entityId: string): GraphEdge[] {
  return EDGES.filter((e) => e.sourceId === entityId || e.targetId === entityId)
}

export function resolveEdgeTarget(edge: GraphEdge, fromId: string): string {
  const targetId = edge.sourceId === fromId ? edge.targetId : edge.sourceId
  const target = ENTITIES.find((e) => e.id === targetId)
  return target?.name ?? targetId
}

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2026-001', client: 'Acme Corp', amount: '$12,400', status: 'paid', date: 'Feb 10, 2026' },
  { id: 'INV-2026-002', client: 'TechVentures', amount: '$4,500', status: 'pending', date: 'Feb 18, 2026' },
  { id: 'INV-2026-003', client: 'DataFlow Labs', amount: '$7,800', status: 'overdue', date: 'Jan 28, 2026' },
  { id: 'INV-2026-004', client: 'GlobalTech', amount: '$22,000', status: 'draft', date: 'Feb 25, 2026' },
]

export const INVOICE_KPI = [
  { label: 'Total Revenue', value: '$46.7K', change: '+12%', changeVariant: 'success' as const },
  { label: 'Outstanding', value: '$12.3K', change: '3 invoices', changeVariant: 'neutral' as const },
  { label: 'Overdue', value: '$7.8K', change: '1 invoice', changeVariant: 'error' as const },
  { label: 'Avg. Payment', value: '12d', change: '-2d vs prior', changeVariant: 'success' as const },
]

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Sarah Chen', company: 'Acme Corp', role: 'VP of Engineering', score: 92, tags: ['Champion', 'Decision Maker'], lastActivity: '2h ago', starred: true },
  { id: 'c2', name: 'Marcus Johnson', company: 'TechVentures', role: 'CTO', score: 78, tags: ['Technical Buyer'], lastActivity: '1d ago', starred: false },
  { id: 'c3', name: 'Elena Rodriguez', company: 'GlobalTech Inc', role: 'Head of Product', score: 45, tags: ['At Risk'], lastActivity: '12d ago', starred: false },
  { id: 'c4', name: 'David Park', company: 'DataFlow Labs', role: 'CEO', score: 67, tags: ['Executive Sponsor'], lastActivity: '3h ago', starred: true },
  { id: 'c5', name: 'Lisa Wang', company: 'StartupXYZ', role: 'COO', score: 88, tags: ['Champion', 'Budget Holder'], lastActivity: '5h ago', starred: false },
  { id: 'c6', name: 'James Miller', company: 'Acme Corp', role: 'Engineering Manager', score: 71, tags: ['End User'], lastActivity: '6h ago', starred: false },
  { id: 'c7', name: 'Anna Fischer', company: 'GlobalTech Inc', role: 'CFO', score: 34, tags: ['At Risk', 'Budget Holder'], lastActivity: '21d ago', starred: false },
  { id: 'c8', name: 'Tom Nakamura', company: 'TechVentures', role: 'VP Sales', score: 83, tags: ['Decision Maker'], lastActivity: '8h ago', starred: true },
]

export const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: 'auto-1',
    name: 'New Lead \u2192 Welcome Sequence',
    trigger: 'Contact created',
    actions: ['Send welcome email', 'Create task for SDR', 'Add to nurture segment'],
    status: 'active',
    runs: 342,
    lastRun: '12 min ago',
  },
  {
    id: 'auto-2',
    name: 'Deal Stage \u2192 Notification',
    trigger: 'Deal moves to Negotiation',
    actions: ['Notify account exec', 'Schedule follow-up', 'Update CRM score'],
    status: 'active',
    runs: 89,
    lastRun: '2h ago',
  },
  {
    id: 'auto-3',
    name: 'Churn Risk Alert',
    trigger: 'Score drops below 40',
    actions: ['Alert CS manager', 'Create retention task', 'Send re-engagement email'],
    status: 'active',
    runs: 23,
    lastRun: '1d ago',
  },
  {
    id: 'auto-4',
    name: 'Meeting Follow-up',
    trigger: 'Meeting completed',
    actions: ['Send summary email', 'Create next steps task'],
    status: 'paused',
    runs: 156,
    lastRun: '3d ago',
  },
  {
    id: 'auto-5',
    name: 'Invoice Overdue Escalation',
    trigger: 'Invoice overdue > 7 days',
    actions: ['Send reminder', 'Notify finance', 'Flag in pipeline'],
    status: 'paused',
    runs: 12,
    lastRun: '5d ago',
  },
]

export const REPORT_METRICS: ReportMetric[] = [
  { label: 'MRR', value: '$284K', change: '+18%', up: true },
  { label: 'New Customers', value: '34', change: '+12%', up: true },
  { label: 'Conversion Rate', value: '24%', change: '+2.1pp', up: true },
  { label: 'Avg. Response Time', value: '2.4h', change: '-18%', up: true },
]

export const REVENUE_DATA = [
  { month: 'Sep', value: 42 },
  { month: 'Oct', value: 48 },
  { month: 'Nov', value: 45 },
  { month: 'Dec', value: 62 },
  { month: 'Jan', value: 58 },
  { month: 'Feb', value: 71 },
]

export const FUNNEL_STAGES: FunnelStage[] = [
  { stage: 'Leads', count: 1240, pct: 100 },
  { stage: 'Qualified', count: 680, pct: 55 },
  { stage: 'Proposal', count: 320, pct: 26 },
  { stage: 'Negotiation', count: 180, pct: 15 },
  { stage: 'Closed Won', count: 89, pct: 7 },
]

export const TOP_PERFORMERS: TopPerformer[] = [
  { name: 'Sarah Kim', closed: 12, revenue: '$340K', rate: 78 },
  { name: 'Mike Roberts', closed: 9, revenue: '$280K', rate: 65 },
  { name: 'Lisa Chen', closed: 8, revenue: '$195K', rate: 72 },
]
