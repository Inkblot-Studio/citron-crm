import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useOutletContext, useLocation } from 'react-router-dom'
import {
  MainShell,
  AppNavigationRail,
  EventStreamSidebar,
  CommandInterface,
  RouteWithErrorBoundary,
  ModuleSkeleton,
} from '@citron-systems/citron-ui'
import { ClipboardList, Brain, BarChart3, Network, Activity, Settings, ListTodo, Mail } from 'lucide-react'
import { useCitronOS } from '@/lib/mock-engine'
import { CommandProvider, useCommand } from '@/lib/CommandContext'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const IntelligenceLabPage = lazy(() =>
  import('@/pages/IntelligenceLabPage').then((m) => ({ default: m.IntelligenceLabPage }))
)
const PipelinePage = lazy(() => import('@/pages/PipelinePage').then((m) => ({ default: m.PipelinePage })))
const GraphPage = lazy(() => import('@/pages/GraphPage').then((m) => ({ default: m.GraphPage })))
const EventsPage = lazy(() => import('@/pages/EventsPage').then((m) => ({ default: m.EventsPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const TasksPage = lazy(() => import('@/pages/Tasks').then((m) => ({ default: m.TasksPage })))
const EmailCampaignsPage = lazy(() =>
  import('@/pages/EmailCampaigns').then((m) => ({ default: m.EmailCampaignsPage }))
)

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
  { id: 'tasks', path: '/tasks', icon: ListTodo, label: 'To-do' },
  { id: 'email-campaigns', path: '/email-campaigns', icon: Mail, label: 'Email Campaigns' },
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
          <Route
            path="/"
            element={
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <HomePageWithContext />
                </Suspense>
              </RouteWithErrorBoundary>
            }
          />
          <Route
            path="/intelligence"
            element={
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <IntelligenceLabPageWithContext />
                </Suspense>
              </RouteWithErrorBoundary>
            }
          />
          <Route
            path="/pipeline"
            element={
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <PipelinePageWithContext />
                </Suspense>
              </RouteWithErrorBoundary>
            }
          />
          <Route
            path="/graph"
            element={
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <GraphPageWithContext />
                </Suspense>
              </RouteWithErrorBoundary>
            }
          />
          <Route
            path="/tasks"
            element={
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <TasksPage />
                </Suspense>
              </RouteWithErrorBoundary>
            }
          />
          <Route
            path="/email-campaigns"
            element={
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <EmailCampaignsPage />
                </Suspense>
              </RouteWithErrorBoundary>
            }
          />
          <Route
            path="/events"
            element={
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <EventsPageWithContext />
                </Suspense>
              </RouteWithErrorBoundary>
            }
          />
          <Route
            path="/settings"
            element={
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <SettingsPage />
                </Suspense>
              </RouteWithErrorBoundary>
            }
          />
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
