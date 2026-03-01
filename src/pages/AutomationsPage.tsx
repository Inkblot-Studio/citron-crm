import { useState } from 'react'
import {
  PageHeader,
  PageHeaderActionButton,
  Card,
  CardContent,
  Badge,
  StatusBadge,
  Switch,
} from '@citron-systems/citron-ui'
import { Workflow, Zap, UserPlus, AlertTriangle, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { MOCK_AUTOMATIONS } from '@/lib/mock-engine'
import type { Automation } from '@/lib/types'

const TRIGGER_ICON: Record<string, typeof Zap> = {
  'Contact created': UserPlus,
  'Deal moves to Negotiation': Zap,
  'Score drops below 40': AlertTriangle,
  'Meeting completed': CheckCircle2,
  'Invoice overdue > 7 days': Clock,
}

export function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS)

  const toggleStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
      )
    )
  }

  const activeCount = automations.filter((a) => a.status === 'active').length
  const totalRuns = automations.reduce((s, a) => s + a.runs, 0)

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Automations"
          subtitle={`${activeCount} active \u00B7 ${totalRuns} total runs`}
          icon={
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-interactive-primary)]">
              <Workflow className="h-5 w-5 text-[var(--inkblot-semantic-color-text-inverse)]" />
            </div>
          }
          action={<PageHeaderActionButton label="New Automation" onClick={() => {}} />}
        />

        <div className="flex flex-col gap-4">
          {automations.map((auto) => {
            const TriggerIcon = TRIGGER_ICON[auto.trigger] ?? Zap
            return (
              <Card key={auto.id}>
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-background-tertiary)]">
                    <TriggerIcon className="h-4 w-4 text-[var(--inkblot-semantic-color-text-secondary)]" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[var(--inkblot-semantic-color-text-primary)]">
                        {auto.name}
                      </span>
                      <StatusBadge
                        label={auto.status === 'active' ? 'Active' : 'Paused'}
                        variant={auto.status === 'active' ? 'success' : 'warning'}
                      />
                    </div>

                    <span className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">
                      Trigger: {auto.trigger}
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {auto.actions.map((action, i) => (
                        <span key={action} className="flex items-center gap-1">
                          <Badge variant="secondary">{action}</Badge>
                          {i < auto.actions.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-[var(--inkblot-semantic-color-text-secondary)]" />
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-1 text-xs text-[var(--inkblot-semantic-color-text-secondary)]">
                      <span>{auto.runs} runs</span>
                      <span>Last: {auto.lastRun}</span>
                    </div>
                  </div>

                  <Switch
                    checked={auto.status === 'active'}
                    onCheckedChange={() => toggleStatus(auto.id)}
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
