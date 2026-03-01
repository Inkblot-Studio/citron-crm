import {
  PageHeader,
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  CircularScore,
} from '@citron-systems/citron-ui'
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { PIPELINE_DEALS, PIPELINE_METRIC_CARDS } from '@/lib/mock-engine'
import type { CitronOSContext } from '@/App'

const KPI_ITEMS = PIPELINE_METRIC_CARDS.map((c) => ({
  label: c.label,
  value: c.value,
  change: c.subtext,
  changeVariant: (c.subtext.startsWith('+') ? 'success' : 'neutral') as 'success' | 'neutral',
}))

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') return <TrendingUp className="h-3 w-3 text-[var(--inkblot-semantic-color-status-success)]" />
  if (trend === 'down') return <TrendingDown className="h-3 w-3 text-[var(--inkblot-semantic-color-status-error)]" />
  return <Minus className="h-3 w-3 text-[var(--inkblot-semantic-color-text-secondary)]" />
}

function scoreTone(score: number): 'success' | 'warning' | 'error' {
  if (score >= 70) return 'success'
  if (score >= 50) return 'warning'
  return 'error'
}

export function DealsPage(_props: Partial<CitronOSContext>) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Deals Pipeline"
          subtitle="5 active deals \u00B7 $458,000 weighted pipeline"
          icon={
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-interactive-primary)]">
              <BarChart3 className="h-5 w-5 text-[var(--inkblot-semantic-color-text-inverse)]" />
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
          {KPI_ITEMS.map((item) => (
            <Card key={item.label} className="min-w-0 overflow-visible">
              <CardContent className="p-4">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                  {item.label}
                </span>
                <p className="mt-1 text-2xl font-semibold text-[var(--inkblot-semantic-color-text-primary)]">
                  {item.value}
                </p>
                <span className={`text-[10px] mt-1 block ${item.changeVariant === 'success' ? 'text-[var(--inkblot-semantic-color-status-success)]' : 'text-[var(--inkblot-semantic-color-text-secondary)]'}`}>
                  {item.change}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="overflow-x-auto min-w-0 -mx-4 sm:mx-0 px-4 sm:px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {PIPELINE_DEALS.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium">{deal.deal}</TableCell>
                <TableCell className="font-mono">{deal.value}</TableCell>
                <TableCell className="text-[var(--inkblot-semantic-color-text-secondary)]">{deal.stage}</TableCell>
                <TableCell>
                  <CircularScore label="" value={deal.score} tone={scoreTone(deal.score)} size={32} />
                </TableCell>
                <TableCell>
                  <TrendIcon trend={deal.trend} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}
