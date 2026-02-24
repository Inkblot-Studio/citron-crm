import {
  ModuleContainer,
  ModuleErrorBoundary,
} from '@citron-systems/citron-ui'
import { PIPELINE_DEALS, PIPELINE_METRIC_CARDS } from '@/lib/mock-engine'
import type { CitronOSContext } from '@/App'
import { ChevronUp, ChevronDown, Minus } from 'lucide-react'

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--inkblot-semantic-color-status-success)'
  if (score >= 50) return 'var(--inkblot-semantic-color-status-warning)'
  return 'var(--inkblot-semantic-color-status-error)'
}

export function PipelinePage({ loading }: CitronOSContext) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 sm:p-6 min-w-0">
      <ModuleContainer loading={loading} title="Deals Pipeline">
        <ModuleErrorBoundary>
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--inkblot-semantic-color-text-primary)]">
                Deals Pipeline
              </h1>
              <p className="text-sm text-[var(--inkblot-semantic-color-text-secondary)]">
                5 active deals - $458,000 weighted pipeline
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PIPELINE_METRIC_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[var(--inkblot-radius-lg)] bg-[var(--inkblot-semantic-color-background-secondary)] p-6"
                >
                  <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">
                    {card.label}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[var(--inkblot-semantic-color-text-primary)]">
                    {card.value}
                  </p>
                  <p className="text-sm text-[var(--inkblot-semantic-color-text-secondary)]">
                    {card.subtext.startsWith('+') ? (
                      <span className="text-[var(--inkblot-semantic-color-status-success)]">
                        {card.subtext}
                      </span>
                    ) : (
                      card.subtext
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-[var(--inkblot-radius-lg)] border border-[var(--inkblot-semantic-color-border-default)] bg-[var(--inkblot-semantic-color-background-secondary)]">
              <div className="grid min-w-[500px] grid-cols-4 gap-4 border-b border-[var(--inkblot-semantic-color-border-default)] bg-[var(--inkblot-semantic-color-background-tertiary)] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                <span>Deal</span>
                <span className="text-right">Value</span>
                <span className="text-center">Stage</span>
                <span className="text-right">Score</span>
              </div>
              {PIPELINE_DEALS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className="grid min-w-[500px] grid-cols-4 gap-4 border-b border-[var(--inkblot-semantic-color-border-default)] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--inkblot-semantic-color-background-tertiary)]"
                >
                  <span className="font-medium text-[var(--inkblot-semantic-color-text-primary)]">
                    {d.deal}
                  </span>
                  <span className="text-right text-[var(--inkblot-semantic-color-text-secondary)]">
                    {d.value}
                  </span>
                  <span className="text-center text-[var(--inkblot-semantic-color-text-secondary)]">
                    {d.stage}
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `${getScoreColor(d.score)}20`,
                        color: getScoreColor(d.score),
                      }}
                    >
                      {d.score}
                    </span>
                    {d.trend === 'up' && (
                      <ChevronUp className="h-4 w-4 text-[var(--inkblot-semantic-color-status-success)]" aria-hidden />
                    )}
                    {d.trend === 'down' && (
                      <ChevronDown className="h-4 w-4 text-[var(--inkblot-semantic-color-status-error)]" aria-hidden />
                    )}
                    {d.trend === 'flat' && (
                      <Minus className="h-4 w-4 text-[var(--inkblot-semantic-color-text-tertiary)]" aria-hidden />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ModuleErrorBoundary>
      </ModuleContainer>
    </div>
  )
}
