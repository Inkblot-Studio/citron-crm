import { useMemo, useState, useRef, useCallback } from 'react'
import { PageHeader } from '@citron-systems/citron-ui'
import type { CitronOSContext } from '@/App'
import type { GraphNode, EntityType } from '@/lib/types'

function getNodeColor(type: EntityType): string {
  switch (type) {
    case 'Organization':
      return 'var(--inkblot-semantic-color-status-success)'
    case 'Person':
      return 'var(--inkblot-semantic-color-status-warning)'
    case 'Deal':
      return 'var(--inkblot-semantic-color-status-info)'
    default:
      return 'var(--inkblot-semantic-color-text-secondary)'
  }
}

function computeLayout(entities: GraphNode[]) {
  const centerX = 400
  const centerY = 250
  const radius = 180
  return entities.map((e, i) => {
    const angle = (i / entities.length) * 2 * Math.PI - Math.PI / 2
    return {
      ...e,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })
}

export function GraphPage({ entities, edges }: CitronOSContext) {
  const layout = useMemo(() => computeLayout(entities), [entities])
  const idToPos = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>()
    layout.forEach((n) => m.set(n.id, { x: n.x, y: n.y }))
    return m
  }, [layout])

  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ mouseX: 0, mouseY: 0, translateX: 0, translateY: 0 })

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setScale((s) => Math.min(3, Math.max(0.2, s + delta)))
    },
    []
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        setIsDragging(true)
        dragStart.current = {
          mouseX: e.clientX,
          mouseY: e.clientY,
          translateX: translate.x,
          translateY: translate.y,
        }
      }
    },
    [translate]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setTranslate({
          x: dragStart.current.translateX + (e.clientX - dragStart.current.mouseX),
          y: dragStart.current.translateY + (e.clientY - dragStart.current.mouseY),
        })
      }
    },
    [isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden p-4 sm:p-6 min-w-0">
      <div className="flex flex-col gap-4 min-h-0 flex-1">
        <PageHeader
          title="Entity Graph"
          subtitle={`Relationship intelligence \u00B7 ${entities.length} nodes \u00B7 ${edges.length} edges`}
          icon={
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-background-tertiary)]">
              <div className="h-2 w-2 rounded-full bg-[var(--inkblot-semantic-color-status-success)]" />
            </div>
          }
        />

        <div className="flex flex-wrap gap-4 text-xs text-[var(--inkblot-semantic-color-text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--inkblot-semantic-color-status-success)]" />
            Orgs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--inkblot-semantic-color-status-warning)]" />
            People
          </span>
        </div>

        <div
          className="relative flex-1 min-h-[300px] sm:min-h-[400px] overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ touchAction: 'none' }}
        >
          <svg viewBox="0 0 800 500" className="h-full w-full" style={{ overflow: 'visible' }}>
            <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>
              {edges.map((edge) => {
                const src = idToPos.get(edge.sourceId)
                const tgt = idToPos.get(edge.targetId)
                if (!src || !tgt) return null
                return (
                  <line
                    key={edge.id}
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="var(--inkblot-semantic-color-border-default)"
                    strokeWidth={1}
                  />
                )
              })}
              {layout.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={24}
                    fill="var(--inkblot-semantic-color-background-primary)"
                    stroke={getNodeColor(node.type)}
                    strokeWidth={3}
                  />
                  <text
                    x={node.x}
                    y={node.y + 38}
                    textAnchor="middle"
                    fill="var(--inkblot-semantic-color-text-primary)"
                    fontSize={12}
                    fontFamily="var(--inkblot-typography-font-family-sans)"
                  >
                    {node.name}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
