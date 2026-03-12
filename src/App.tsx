import { Suspense, lazy, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import {
  AppLayout,
  RouteWithErrorBoundary,
  ModuleSkeleton,
  OnboardingWizard,
  GuidedTour,
  Toaster,
} from '@citron-systems/citron-ui'
import { ToastProvider, useToast } from '@/lib/ToastContext'
import { JiraProvider } from '@/lib/JiraContext'
import type { AppSidebarItem, GuidedTourStep } from '@citron-systems/citron-ui'
import {
  MessageSquare,
  FileText,
  Users,
  Mail,
  CheckSquare,
  Settings,
  Building2,
  Briefcase,
  Target,
  Globe,
  Megaphone,
} from 'lucide-react'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ContactsPage = lazy(() => import('@/pages/ContactsPage'))
const MarketingPage = lazy(() => import('marketing/Marketing'))
const InvoicesPage = lazy(() => import('@/pages/InvoicesPage'))
const TasksPage = lazy(() => import('@/pages/TasksPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const SIDEBAR_ITEMS: AppSidebarItem[] = [
  { id: 'canvas', icon: MessageSquare, label: 'Canvas', path: '/', dataTour: 'nav-canvas' },
  { id: 'invoices', icon: FileText, label: 'Invoices & Deals', path: '/invoices', dataTour: 'nav-invoices' },
  { id: 'contacts', icon: Users, label: 'Contacts', path: '/contacts', dataTour: 'nav-contacts' },
  { id: 'campaigns', icon: Mail, label: 'Campaigns', path: '/campaigns', dataTour: 'nav-campaigns' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks', path: '/tasks', dataTour: 'nav-tasks' },
]

const SIDEBAR_BOTTOM_ITEMS: AppSidebarItem[] = [
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings', dataTour: 'nav-settings' },
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
    position: 'right',
  },
  {
    target: '[data-tour="right-panel"]',
    title: 'AI Chat & Events',
    description: 'Chat with specialized AI agents and track real-time events from this panel.',
    position: 'left',
  },
  {
    target: '[data-tour="nav-invoices"]',
    title: 'Invoices & Deals',
    description: 'Manage your sales pipeline and generate AI-powered invoices.',
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
    target: '[data-tour="nav-tasks"]',
    title: 'Tasks',
    description: 'Track and manage tasks across your deals and team.',
    position: 'right',
  },
]

const AGENTS = [
  { id: 'general', label: 'General', icon: MessageSquare, description: 'Full CRM assistant' },
  { id: 'invoices', label: 'Invoices', icon: FileText, description: 'Create & manage invoices' },
  { id: 'campaigns', label: 'Campaigns', icon: Mail, description: 'Email campaigns & templates' },
  { id: 'contacts', label: 'Contacts', icon: Users, description: 'Contact management' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, description: 'Task automation' },
]

const AGENT_RESPONSES: Record<string, { text: string; cards: ('entity' | 'intelligence')[] }> = {
  general: { text: "Here's an overview of your CRM data with entity profile and intelligence scores.", cards: ['entity', 'intelligence'] },
  invoices: { text: "I've pulled up your latest invoice data and deal health metrics.", cards: ['entity', 'intelligence'] },
  campaigns: { text: 'Analyzing your campaign performance. Here are the key insights.', cards: ['intelligence'] },
  contacts: { text: "Here's the contact profile and relationship intelligence.", cards: ['entity'] },
  tasks: { text: "I've reviewed your task queue. Here's what needs attention.", cards: ['intelligence'] },
}

function PageWrapper({ showRightPanel = true, children }: { showRightPanel?: boolean; children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <AppLayout
      showRightPanel={showRightPanel}
      sidebarProps={{
        items: SIDEBAR_ITEMS,
        bottomItems: SIDEBAR_BOTTOM_ITEMS,
        activePath: location.pathname,
        onNavigate: navigate,
        showStatusDot: true,
      }}
      rightPanelProps={{
        agents: AGENTS,
        agentResponses: AGENT_RESPONSES,
        autoRespond: true,
        autoRespondDelayMs: 800,
      }}
    >
      {children}
    </AppLayout>
  )
}

function AppRoutes({ tourActive, onTourComplete }: { tourActive: boolean; onTourComplete: () => void }) {
  return (
    <>
      {tourActive && <GuidedTour steps={TOUR_STEPS} onComplete={onTourComplete} />}
      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper showRightPanel={true}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <HomePage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/contacts"
          element={
            <PageWrapper showRightPanel={false}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <ContactsPage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/campaigns"
          element={
            <PageWrapper showRightPanel={false}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <MarketingPage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/invoices"
          element={
            <PageWrapper showRightPanel={false}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <InvoicesPage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/tasks"
          element={
            <PageWrapper showRightPanel={false}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <TasksPage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <PageWrapper showRightPanel={false}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                  <SettingsPage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <RouteWithErrorBoundary>
              <Suspense fallback={<ModuleSkeleton className="h-64" />}>
                <NotFound />
              </Suspense>
            </RouteWithErrorBoundary>
          }
        />
      </Routes>
    </>
  )
}

export default function App() {
  const isDev = import.meta.env.DEV
  const [onboardingDone, setOnboardingDone] = useState(
    () => (isDev ? false : localStorage.getItem('citron-onboarding-done') === 'true')
  )
  const [tourActive, setTourActive] = useState(() => {
    if (isDev) return false
    const onboardingIsDone = localStorage.getItem('citron-onboarding-done') === 'true'
    const tourIsDone = localStorage.getItem('citron-tour-done') === 'true'
    return onboardingIsDone && !tourIsDone
  })

  useEffect(() => {
    if (!isDev) return
    localStorage.removeItem('citron-onboarding-done')
    localStorage.removeItem('citron-tour-done')
    setOnboardingDone(false)
    setTourActive(false)
  }, [isDev])

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
    <ToastProvider>
      <JiraProvider>
        {!onboardingDone && (
          <OnboardingWizard steps={ONBOARDING_STEPS} onComplete={handleOnboardingComplete} />
        )}
        <BrowserRouter>
          <AppWithToaster />
          <AppRoutes tourActive={tourActive} onTourComplete={handleTourComplete} />
        </BrowserRouter>
      </JiraProvider>
    </ToastProvider>
  )
}

function AppWithToaster() {
  const { toasts, dismissToast } = useToast()
  return (
    <Toaster
      toasts={toasts}
      position="bottom-right"
      onDismiss={dismissToast}
      className="fixed bottom-4 right-4 z-[100]"
    />
  )
}
