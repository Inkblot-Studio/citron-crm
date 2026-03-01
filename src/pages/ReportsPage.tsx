import {
  PageHeader,
  Card,
  CardContent,
  Progress,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  CircularScore,
} from '@citron-systems/citron-ui'
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react'
import { REPORT_METRICS, REVENUE_DATA, FUNNEL_STAGES, TOP_PERFORMERS } from '@/lib/mock-engine'

export function ReportsPage() {
  const maxVal = Math.max(...REVENUE_DATA.map((d) => d.value))

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Reports"
          subtitle="Revenue analytics \u00B7 Performance tracking"
          icon={
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-status-warning)]">
              <PieChart className="h-5 w-5 text-[var(--inkblot-semantic-color-text-inverse)]" />
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
          {REPORT_METRICS.map((m) => (
            <Card key={m.label} className="min-w-0 overflow-visible">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                    {m.label}
                  </span>
                  {m.up ? (
                    <TrendingUp className="h-3.5 w-3.5 shrink-0 text-[var(--inkblot-semantic-color-status-success)]" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 shrink-0 text-[var(--inkblot-semantic-color-status-error)]" />
                  )}
                </div>
                <p className="text-2xl font-semibold text-[var(--inkblot-semantic-color-text-primary)] break-words">
                  {m.value}
                </p>
                <span className={`text-[10px] flex items-center gap-0.5 mt-1 ${m.up ? 'text-[var(--inkblot-semantic-color-status-success)]' : 'text-[var(--inkblot-semantic-color-status-error)]'}`}>
                  {m.change}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                Revenue Trend
              </h2>
              <div className="flex h-40 items-end gap-3">
                {REVENUE_DATA.map((d) => (
                  <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-[var(--inkblot-radius-sm)] bg-[var(--inkblot-semantic-color-interactive-primary)] transition-all"
                      style={{ height: `${(d.value / maxVal) * 100}%` }}
                    />
                    <span className="text-[10px] text-[var(--inkblot-semantic-color-text-secondary)]">{d.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                Sales Funnel
              </h2>
              <div className="space-y-3">
                {FUNNEL_STAGES.map((f) => (
                  <div key={f.stage} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs text-[var(--inkblot-semantic-color-text-secondary)]">{f.stage}</span>
                    <div className="flex-1">
                      <Progress value={f.pct} />
                    </div>
                    <span className="w-12 text-right text-xs font-mono text-[var(--inkblot-semantic-color-text-primary)]">
                      {f.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
              Top Performers
            </h2>
            <div className="overflow-x-auto min-w-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Deals Closed</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Win Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_PERFORMERS.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="font-mono">{p.closed}</TableCell>
                    <TableCell className="font-mono">{p.revenue}</TableCell>
                    <TableCell>
                      <CircularScore label="" value={p.rate} tone={p.rate >= 70 ? 'success' : 'warning'} size={32} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
