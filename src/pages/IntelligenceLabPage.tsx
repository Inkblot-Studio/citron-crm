import { IntelligenceLab } from '@citron-systems/citron-ui'
import { getEntityById } from '@/lib/mock-engine'

const KPI_CARDS = [
  { label: 'Pipeline Health', value: 76, subtext: undefined, trend: undefined as 'up' | 'down' | undefined },
  { label: 'Churn Risk', value: 28, subtext: undefined, trend: undefined as 'up' | 'down' | undefined },
  { label: 'Expansion Signal', value: 64, subtext: undefined, trend: undefined as 'up' | 'down' | undefined },
  { label: 'Team Velocity', value: 83, subtext: undefined, trend: undefined as 'up' | 'down' | undefined },
]

const AI_INSIGHTS = [
  {
    title: 'Acme Corp likely to close within 14 days',
    description: 'Based on email sentiment, meeting cadence, and champion engagement patterns.',
    confidence: 89,
  },
  {
    title: 'Churn risk detected: GlobalTech Inc',
    description: 'Declining touchpoints and support ticket volume suggest potential churn.',
    confidence: 74,
  },
  {
    title: 'Expansion opportunity: TechVentures',
    description: 'Usage patterns and NPS scores indicate readiness for upsell conversation.',
    confidence: 81,
  },
]

interface IntelligenceLabPageProps {
  entities: import('@/lib/types').GraphNode[]
  events: import('@/lib/types').CitronEvent[]
  focusEntity: import('@/lib/types').GraphNode
  setFocusEntity: (entity: import('@/lib/types').GraphNode) => void
  loading: boolean
}

export function IntelligenceLabPage({
  entities,
  events,
  focusEntity,
  setFocusEntity,
  loading,
}: IntelligenceLabPageProps) {
  const handleSetFocusEntity = (entity: { id: string }) => {
    const full = getEntityById(entity.id)
    if (full) setFocusEntity(full)
  }
  return (
    <IntelligenceLab
      entities={entities}
      events={events}
      focusEntity={focusEntity}
      setFocusEntity={handleSetFocusEntity}
      loading={loading}
      kpiCards={KPI_CARDS}
      aiInsights={AI_INSIGHTS}
      title="Intelligence Lab"
      subtitle="AI-generated insights - Updated 3 min ago"
      className="p-4 sm:p-6 min-w-0"
    />
  )
}
