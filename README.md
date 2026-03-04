# Citron OS CRM

An AI-native, high-density Revenue & Operations Platform built as an **Operating System for CRM workflows**. Citron OS delivers a premium, high-performance dashboard experience—strict dark mode, citrus-accented design tokens, and a modular runtime that isolates every functional unit.

## Overview

Citron OS CRM follows an **OS-First, SaaS-Second** architecture:

- **OS-First**: Persistent navigation, modular workspaces, isolated modules, and a system-wide intelligence layer. The shell behaves like a premium operating system.
- **SaaS-Second**: Multi-tenant hosting, subscriptions, and cloud sync are layers built on top; they do not dictate core UX or data structures.

The current implementation focuses on the **Intelligence Lab** dashboard—a three-column layout with real-time activity streams, entity focus cards, AI-driven command interface, and intelligence score metrics.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build | Vite 7 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 + Design Tokens |
| Design System | `@citron-systems/citron-ds` (tokens) |
| Components | `@citron-systems/citron-ui` |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Inkblot-Studio/citron-crm.git
cd citron-crm
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173`.

For full-stack development (including Jira API), use Vercel's dev server:

```bash
npm run dev:full
```

This runs both the frontend and the `/api/*` serverless functions locally.

### Build

```bash
npm run build
```

Outputs production assets to `dist/`.

### Preview

```bash
npm run preview
```

Serves the production build for local testing.

## Project Structure

```
citron-crm/
├── CITRON_OS_BLUEPRINT.md    # Technical architecture and constraints
├── src/
│   ├── main.tsx              # Entry point, theme setup
│   ├── App.tsx               # Shell assembly, navigation
│   ├── index.css             # Tailwind + global styles
│   ├── lib/
│   │   ├── types.ts          # GraphNode, GraphEdge, CitronEvent
│   │   └── mock-engine.ts    # GraphStore, EventBus, useCitronOS hook
│   └── components/
│       ├── MainShell.tsx     # Root layout (nav + content)
│       ├── IntelligenceLab.tsx  # 3-column dashboard
│       └── ChatFeed.tsx      # Generative UI chat area
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

## Intelligence Lab Layout

The dashboard is organized into three columns:

| Column | Width | Content |
|--------|-------|---------|
| Left | 25% | **Activity Stream** — `EventStreamFeed` with real-time events |
| Center | 50% | **Current Focus** — `EntityCommandCard` (hero) + `CommandInterface` (chat) |
| Right | 25% | **Intelligence Scores** — Revenue Confidence, Momentum, Churn Risk + `MetricComparisonList` |

The **CommandInterface** at the bottom of the center column is the primary OS input. When a message is sent:

1. A `ModuleSkeleton` shimmer effect appears for ~1s
2. An `EntityCard` or list of `EventRow` is injected based on query intent (entity/profile vs event/activity)

## Mock Data Engine

The mock engine (`src/lib/mock-engine.ts`) provides:

- **GraphStore**: 5 entities (Acme Corp, Global Logistics, Jane Smith, Mark Johnson, Titan Deal) with relationships
- **EventBus**: 10 recent activities (emails, stage changes, calls, etc.)
- **`useCitronOS()`**: Hook returning `{ entities, events, focusEntity, loading }` with an 800ms simulated load delay

All data structures follow the Blueprint (Block 3 & 4). Replace with a real GraphService and EventBus when connecting to a backend.

## Design System Constraints

**Strict token enforcement** — All visuals use `var(--inkblot-*)` tokens only:

- Backgrounds: `--inkblot-semantic-color-background-primary|secondary|tertiary`
- Text: `--inkblot-semantic-color-text-primary|secondary|tertiary`
- Borders: `--inkblot-semantic-color-border-default|strong|focus`
- Status: `--inkblot-semantic-color-status-success|warning|error|info`
- Radius: `var(--inkblot-radius-sm|md|lg|xl)`
- Spacing: Tailwind classes mapped to tokens (`gap-4`, `p-4`, etc.)

No hex codes, no hardcoded pixels. Reference: `@citron-systems/citron-ds` exports.

## Modular Runtime

Every dashboard section is wrapped for resilience:

1. **ModuleContainer** — Handles loading state (ModuleSkeleton), title, optional onRetry
2. **ModuleErrorBoundary** — Catches errors so a crashed module does not take down the app

```
ModuleContainer (loading, title, onRetry)
  └── ModuleErrorBoundary
        └── [Module content]
```

## Data Layer (Blueprint)

### GraphNode

```typescript
type EntityType = 'Person' | 'Organization' | 'Deal'

interface GraphNode {
  id: string
  type: EntityType
  name: string
  metadata: Record<string, string>
  createdAt: string
  updatedAt: string
}
```

### GraphEdge

```typescript
interface GraphEdge {
  id: string
  type: string  // WORKS_WITH, MANAGES, OWNED_BY, PARTNER_OF, etc.
  sourceId: string
  targetId: string
  metadata?: Record<string, string>
  createdAt: string
}
```

### CitronEvent

```typescript
interface CitronEvent {
  id: string
  actor: string
  subject: string
  event_type: string  // EMAIL_SENT, STAGE_CHANGED, PHONE_CALL, etc.
  timestamp: string
  confidence_score: number  // 0–1
  metadata?: Record<string, unknown>
}
```

## Jira Integration

Connect Jira Cloud to sync and manage tasks:

1. Go to **Settings** > **Integrations**
2. Enter your Jira URL, email, and [API token](https://id.atlassian.com/manage-profile/security/api-tokens)
3. Click **Connect**
4. Navigate to **Tasks** to view and manage your Jira issues

The Tasks page supports creating issues, editing (title, description, priority, due date), and changing status via workflow transitions.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:full` | Start with Jira API (Vercel dev) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Serve production build |

## Key Files

- **CITRON_OS_BLUEPRINT.md** — Definitive reference for architecture, constraints, roadmap, and coding practices
- **src/lib/types.ts** — Shared TypeScript interfaces
- **src/lib/mock-engine.ts** — Mock GraphStore, EventBus, useCitronOS hook

## License

MIT
