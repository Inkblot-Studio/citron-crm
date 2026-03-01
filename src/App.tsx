import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useOutletContext, useLocation } from 'react-router-dom'
import {
  MainShell,
  AppNavigationRail,
  EventStreamSidebar,
  CommandInterface,
  RouteWithErrorBoundary,
  ModuleSkeleton,
  OnboardingWizard,
  GuidedTour,
} from '@citron-systems/citron-ui'
import type { GuidedTourStep } from '@citron-systems/citron-ui'
import {
  MessageSquare,
  BarChart3,
  Users,
  Network,
  Activity,
  Mail,
  FileText,
  ListTodo,
  Workflow,
  PieChart,
  Brain,
  Settings,
  Building2,
  Briefcase,
  Target,
  Globe,
  Megaphone,
} from 'lucide-react'
import { useCitronOS } from '@/lib/mock-engine'
import { CommandProvider, useCommand } from '@/lib/CommandContext'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const IntelligenceLabPage = lazy(() =>
  import('@/pages/IntelligenceLabPage').then((m) => ({ default: m.IntelligenceLabPage }))
)
const DealsPage = lazy(() => import('@/pages/DealsPage').then((m) => ({ default: m.DealsPage })))
const ContactsPage = lazy(() => import('@/pages/ContactsPage').then((m) => ({ default: m.ContactsPage })))
const GraphPage = lazy(() => import('@/pages/GraphPage').then((m) => ({ default: m.GraphPage })))
const EventsPage = lazy(() => import('@/pages/EventsPage').then((m) => ({ default: m.EventsPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const TasksPage = lazy(() => import('@/pages/Tasks').then((m) => ({ default: m.TasksPage })))
const EmailCampaignsPage = lazy(() =>
  import('@/pages/EmailCampaigns').then((m) => ({ default: m.EmailCampaignsPage }))
)
const InvoicesPage = lazy(() => import('@/pages/InvoicesPage').then((m) => ({ default: m.InvoicesPage })))
const ReportsPage = lazy(() => import('@/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })))
const AutomationsPage = lazy(() =>
  import('@/pages/AutomationsPage').then((m) => ({ default: m.AutomationsPage }))
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
  { id: 'home', path: '/', icon: MessageSquare, label: 'Canvas' },
  { id: 'deals', path: '/deals', icon: BarChart3, label: 'Deals' },
  { id: 'contacts', path: '/contacts', icon: Users, label: 'Contacts' },
  { id: 'graph', path: '/graph', icon: Network, label: 'Graph' },
  { id: 'events', path: '/events', icon: Activity, label: 'Events' },
  { id: 'campaigns', path: '/campaigns', icon: Mail, label: 'Campaigns' },
  { id: 'invoices', path: '/invoices', icon: FileText, label: 'Invoices' },
  { id: 'tasks', path: '/tasks', icon: ListTodo, label: 'Tasks' },
  { id: 'automations', path: '/automations', icon: Workflow, label: 'Automations' },
  { id: 'reports', path: '/reports', icon: PieChart, label: 'Reports' },
  { id: 'intelligence', path: '/intelligence', icon: Brain, label: 'Intel Lab' },
  { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
]

const ONBOARDING_STEPS = [
  {
    id: 'company',
    question: "What's your company name?",
    subtitle: "We'll personalize your workspace around your brand.",
    icon: Building2,
    type: 'input' as const,
    field: 'companyName',
    placeholder: 'e.g. Acme Corporation',
  },
  {
    id: 'size',
    question: 'How many employees does your company have?',
    subtitle: 'This helps us tailor the right features for your team size.',
    icon: Users,
    type: 'select' as const,
    field: 'companySize',
    options: [
      { value: '1-10', label: '1\u201310' },
      { value: '11-50', label: '11\u201350' },
      { value: '51-200', label: '51\u2013200' },
      { value: '201-1000', label: '201\u20131,000' },
      { value: '1000+', label: '1,000+' },
    ],
  },
  {
    id: 'industry',
    question: 'What industry are you in?',
    subtitle: "We'll pre-configure pipelines and templates for your sector.",
    icon: Briefcase,
    type: 'select' as const,
    field: 'industry',
    options: [
      { value: 'saas', label: 'SaaS / Software' },
      { value: 'agency', label: 'Agency / Consulting' },
      { value: 'ecommerce', label: 'E-Commerce' },
      { value: 'fintech', label: 'Fintech' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'real-estate', label: 'Real Estate' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'role',
    question: "What's your role?",
    subtitle: 'So we can surface the most relevant modules first.',
    icon: Target,
    type: 'select' as const,
    field: 'role',
    options: [
      { value: 'founder', label: 'Founder / CEO' },
      { value: 'sales-leader', label: 'Sales Leader' },
      { value: 'account-exec', label: 'Account Executive' },
      { value: 'rev-ops', label: 'RevOps' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'cs', label: 'Customer Success' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'goals',
    question: 'What are your main goals?',
    subtitle: 'Select all that apply. We\u2019ll customize your dashboard.',
    icon: Megaphone,
    type: 'multi-select' as const,
    field: 'goals',
    options: [
      { value: 'pipeline', label: 'Manage sales pipeline' },
      { value: 'automate', label: 'Automate outreach' },
      { value: 'intelligence', label: 'AI-powered insights' },
      { value: 'invoicing', label: 'Invoicing & billing' },
      { value: 'reporting', label: 'Reporting & analytics' },
      { value: 'contacts', label: 'Contact management' },
    ],
  },
  {
    id: 'source',
    question: 'How did you hear about us?',
    subtitle: 'This helps us improve our reach.',
    icon: Globe,
    type: 'select' as const,
    field: 'source',
    options: [
      { value: 'search', label: 'Google / Search' },
      { value: 'social', label: 'Social Media' },
      { value: 'referral', label: 'Referral' },
      { value: 'blog', label: 'Blog / Content' },
      { value: 'event', label: 'Event / Webinar' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'website',
    question: "What's your company website?",
    subtitle: "We'll use this to enrich your account with public data.",
    icon: Globe,
    type: 'input' as const,
    field: 'website',
    placeholder: 'e.g. https://acme.com',
  },
]

const TOUR_STEPS: GuidedTourStep[] = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation Sidebar',
    description: 'Access all CRM modules from this sidebar. Each icon represents a different module.',
    position: 'right',
  },
  {
    target: '[data-tour="canvas"]',
    title: 'AI Command Canvas',
    description: 'Your AI-powered command center. Chat with the system to manage deals, create emails, and generate reports.',
    position: 'bottom',
  },
  {
    target: '[data-tour="event-feed"]',
    title: 'Real-Time Event Feed',
    description: 'Stay on top of everything. This feed shows live system events in real time.',
    position: 'left',
  },
  {
    target: '[data-tour="nav-deals"]',
    title: 'Deals Pipeline',
    description: 'Track and manage your sales pipeline. View deal stages, confidence scores, and revenue forecasts.',
    position: 'right',
  },
  {
    target: '[data-tour="nav-contacts"]',
    title: 'Contacts Directory',
    description: 'Your complete contact database with relationship scoring and engagement tracking.',
    position: 'right',
  },
  {
    target: '[data-tour="nav-campaigns"]',
    title: 'Email Campaigns',
    description: 'Create and send email campaigns with AI-powered templates and a drag-and-drop editor.',
    position: 'right',
  },
  {
    target: '[data-tour="nav-invoices"]',
    title: 'Invoices',
    description: 'Generate professional invoices using AI. Just describe the work and the system handles the rest.',
    position: 'right',
  },
  {
    target: '[data-tour="system-status"]',
    title: 'System Status',
    description: 'This indicator shows your platform status. Green means all systems are operational.',
    position: 'right',
  },
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

function AppLayoutShell() {
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
        navigation={
          <div data-tour="sidebar" className="flex h-full flex-col">
            <AppNavigationRail items={NAV_ITEMS} brandTitle="Command Canvas" className="p-2 sm:p-3" />
            <div
              data-tour="system-status"
              className="mx-auto mt-2 h-2 w-2 rounded-full bg-[var(--inkblot-semantic-color-status-success)] animate-pulse"
              title="System Online"
            />
          </div>
        }
        eventStream={
          showEventStream ? (
            <div data-tour="event-feed" className="h-full">
              <EventStreamSidebar events={citron.events} />
            </div>
          ) : null
        }
        commandBar={location.pathname === '/' ? <CommandBarConnected /> : null}
        eventStreamWidth="hidden lg:flex lg:w-80 lg:shrink-0 lg:flex-col lg:border-l lg:border-[var(--inkblot-semantic-color-border-default)]"
      >
        <Outlet context={citron} />
      </MainShell>
    </CommandProvider>
  )
}

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(
    () => localStorage.getItem('citron-onboarding-done') === 'true'
  )
  const [tourActive, setTourActive] = useState(false)

  const handleOnboardingComplete = () => {
    localStorage.setItem('citron-onboarding-done', 'true')
    setOnboardingDone(true)
    if (localStorage.getItem('citron-tour-done') !== 'true') {
      setTourActive(true)
    }
  }

  const handleTourComplete = () => {
    localStorage.setItem('citron-tour-done', 'true')
    setTourActive(false)
  }

  return (
    <>
      {!onboardingDone && (
        <OnboardingWizard steps={ONBOARDING_STEPS} onComplete={handleOnboardingComplete} />
      )}
      <BrowserRouter>
        {tourActive && (
          <>
            <div className="fixed inset-0 z-[9998] bg-black/70" aria-hidden />
            <div className="fixed inset-0 z-[9999]">
              <GuidedTour steps={TOUR_STEPS} onComplete={handleTourComplete} />
            </div>
          </>
        )}
        <Routes>
          <Route element={<AppLayoutShell />}>
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
              path="/deals"
              element={
                <RouteWithErrorBoundary>
                  <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                    <DealsPageWithContext />
                  </Suspense>
                </RouteWithErrorBoundary>
              }
            />
            <Route
              path="/contacts"
              element={
                <RouteWithErrorBoundary>
                  <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                    <ContactsPage />
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
              path="/campaigns"
              element={
                <RouteWithErrorBoundary>
                  <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                    <EmailCampaignsPage />
                  </Suspense>
                </RouteWithErrorBoundary>
              }
            />
            <Route
              path="/invoices"
              element={
                <RouteWithErrorBoundary>
                  <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                    <InvoicesPage />
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
              path="/automations"
              element={
                <RouteWithErrorBoundary>
                  <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                    <AutomationsPage />
                  </Suspense>
                </RouteWithErrorBoundary>
              }
            />
            <Route
              path="/reports"
              element={
                <RouteWithErrorBoundary>
                  <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                    <ReportsPage />
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
    </>
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

function DealsPageWithContext() {
  const context = useOutletContext<CitronOSContext>()
  return <DealsPage {...context} />
}

function GraphPageWithContext() {
  const context = useOutletContext<CitronOSContext>()
  return <GraphPage {...context} />
}

function EventsPageWithContext() {
  const context = useOutletContext<CitronOSContext>()
  return <EventsPage {...context} />
}
