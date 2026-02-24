import { BrowserRouter, Routes, Route, Outlet, useOutletContext, useLocation } from 'react-router-dom'
import {
  MainShell,
  AppNavigationRail,
  EventStreamSidebar,
  CommandInterface,
} from '@citron-systems/citron-ui'
import { ClipboardList, Brain, BarChart3, Network, Activity, Settings } from 'lucide-react'
import { useCitronOS } from '@/lib/mock-engine'
import { CommandProvider, useCommand } from '@/lib/CommandContext'
import { HomePage } from '@/pages/HomePage'
import { IntelligenceLabPage } from '@/pages/IntelligenceLabPage'
import { PipelinePage } from '@/pages/PipelinePage'
import { GraphPage } from '@/pages/GraphPage'
import { EventsPage } from '@/pages/EventsPage'
import { SettingsPage } from '@/pages/SettingsPage'

export interface CitronOSContext {
  entities: import('@/lib/types').GraphNode[]
  edges: import('@/lib/types').GraphEdge[]
  events: import('@/lib/types').CitronEvent[]
  focusEntity: import('@/lib/types').GraphNode
  setFocusEntity: (entity: import('@/lib/types').GraphNode) => void
  loading: boolean
}

const NAV_ITEMS = [
  { id: 'home', path: '/', icon: ClipboardList, label: 'Home' },
  { id: 'intelligence', path: '/intelligence', icon: Brain, label: 'Intelligence' },
  { id: 'pipeline', path: '/pipeline', icon: BarChart3, label: 'Pipeline' },
  { id: 'graph', path: '/graph', icon: Network, label: 'Graph' },
  { id: 'events', path: '/events', icon: Activity, label: 'Events' },
  { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
]

function CommandBarConnected() {
  const { prompt, setPrompt, submitPrompt, isProcessing } = useCommand()
  return (
    <div className="flex w-full justify-center border-t border-[var(--inkblot-semantic-color-border-default)] bg-[var(--inkblot-semantic-color-background-secondary)] p-4">
      <div className="flex w-full max-w-2xl flex-col gap-3">
        <CommandInterface
          promptValue={prompt}
          onPromptChange={setPrompt}
          onPromptSubmit={() => submitPrompt()}
          isProcessing={isProcessing}
          placeholder="Ask Citron Intelligence..."
        />
        <p className="text-xs text-[var(--inkblot-semantic-color-text-tertiary)]">
          Citron OS v1.0 — AI-native Revenue & Operations Platform
        </p>
      </div>
    </div>
  )
}

function AppLayout() {
  const citron = useCitronOS()
  const location = useLocation()
  const showEventStream = location.pathname !== '/events'

  return (
    <CommandProvider
      entities={citron.entities}
      events={citron.events}
      onFocusEntity={citron.setFocusEntity}
    >
      <MainShell
        className="min-w-0"
        navigation={<AppNavigationRail items={NAV_ITEMS} brandTitle="Command Canvas" className="p-2 sm:p-3" />}
        eventStream={showEventStream ? <EventStreamSidebar events={citron.events} /> : null}
        commandBar={location.pathname === '/' ? <CommandBarConnected /> : null}
        eventStreamWidth="hidden lg:flex lg:w-80 lg:shrink-0 lg:flex-col lg:border-l lg:border-[var(--inkblot-semantic-color-border-default)]"
      >
        <Outlet context={citron} />
      </MainShell>
    </CommandProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePageWithContext />} />
          <Route path="/intelligence" element={<IntelligenceLabPageWithContext />} />
          <Route path="/pipeline" element={<PipelinePageWithContext />} />
          <Route path="/graph" element={<GraphPageWithContext />} />
          <Route path="/events" element={<EventsPageWithContext />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function HomePageWithContext() {
  const { entities, events } = useOutletContext<CitronOSContext>()
  return <HomePage entities={entities} events={events} />
}

function IntelligenceLabPageWithContext() {
  const { entities, events, focusEntity, setFocusEntity, loading } =
    useOutletContext<CitronOSContext>()
  return (
    <IntelligenceLabPage
      entities={entities}
      events={events}
      focusEntity={focusEntity}
      setFocusEntity={setFocusEntity}
      loading={loading}
    />
  )
}

function PipelinePageWithContext() {
  const context = useOutletContext<CitronOSContext>()
  return <PipelinePage {...context} />
}

function GraphPageWithContext() {
  const context = useOutletContext<CitronOSContext>()
  return <GraphPage {...context} />
}

function EventsPageWithContext() {
  const context = useOutletContext<CitronOSContext>()
  return <EventsPage {...context} />
}
