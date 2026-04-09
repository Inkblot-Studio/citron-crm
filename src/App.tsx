import { Suspense, lazy, useState, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import {
  AppLayout,
  RouteWithErrorBoundary,
  OnboardingWizard,
  GuidedTour,
  Toaster,
  ThemeProvider,
} from '@citron-systems/citron-ui'
import { ToastProvider, useToast } from '@/lib/ToastContext'
import { JiraProvider } from '@/lib/JiraContext'
import type { AppSidebarItem, GuidedTourStep } from '@citron-systems/citron-ui'
import { RouteFallback } from '@/components/RouteFallback'
import {
  MessageSquare,
  FileText,
  Mail,
  CheckSquare,
  Settings,
  Building2,
  Briefcase,
  Target,
  Globe,
  Megaphone,
  Users,
} from 'lucide-react'
import SettingsPage from '@/pages/SettingsPage'

const HomePage = lazy(() => import('@/pages/HomePage'))
const MarketingPage = lazy(() => import('marketing/Marketing'))
const AccountingModule = lazy(() => import('accounting/Accounting'))
const TasksManagerPage = lazy(() => import('tasksManager/TasksManager'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const SIDEBAR_ITEMS: AppSidebarItem[] = [
  { id: 'home', icon: MessageSquare, label: 'Home', path: '/', dataTour: 'nav-home' },
  { id: 'accounting', icon: FileText, label: 'Accounting', path: '/invoices', dataTour: 'nav-invoices' },
  { id: 'campaigns', icon: Mail, label: 'Campaigns', path: '/campaigns', dataTour: 'nav-campaigns' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks Manager', path: '/tasks', dataTour: 'nav-tasks' },
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
      { value: 'audience', label: 'Audience & lead management' },
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
    title: 'Navigation',
    description: 'Access all CRM modules from this sidebar.',
    position: 'right',
  },
  {
    target: '[data-tour="nav-home"]',
    title: 'AI Assistant',
    description: 'Your AI-powered assistant. Ask questions, manage data, and generate content.',
    position: 'right',
  },
  {
    target: '[data-tour="nav-invoices"]',
    title: 'Accounting',
    description: 'Invoices, deals pipeline, and billing workflows.',
    position: 'right',
  },
  {
    target: '[data-tour="nav-campaigns"]',
    title: 'Email Campaigns',
    description: 'Create and send email campaigns with AI-powered templates.',
    position: 'right',
  },
  {
    target: '[data-tour="nav-tasks"]',
    title: 'Tasks Manager',
    description: 'Track and manage work in the Tasks Manager module.',
    position: 'right',
  },
]

const MODULE_AGENTS: Record<string, { id: string; label: string; icon: typeof MessageSquare; description: string }[]> = {
  '/invoices': [
    { id: 'accounting', label: 'Accounting', icon: FileText, description: 'Invoices & deals' },
  ],
  '/campaigns': [
    { id: 'campaigns', label: 'Campaigns', icon: Mail, description: 'Email campaigns & templates' },
  ],
  '/tasks': [
    { id: 'tasks', label: 'Tasks Manager', icon: CheckSquare, description: 'Tasks & workflows' },
  ],
}

const MODULE_AGENT_RESPONSES: Record<string, { text: string; cards: ('entity' | 'intelligence')[] }> = {
  accounting: { text: "Here's your Accounting data: invoices and deal metrics.", cards: ['entity', 'intelligence'] },
  campaigns: { text: 'Analyzing your campaign performance and key insights.', cards: ['intelligence'] },
  tasks: { text: "Here's your Tasks Manager queue and what needs attention.", cards: ['intelligence'] },
}

function PageWrapper({ showRightPanel = false, children }: { showRightPanel?: boolean; children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  const agents = useMemo(() => MODULE_AGENTS[location.pathname] ?? [], [location.pathname])
  const hasAgents = agents.length > 0

  return (
    <AppLayout
      showRightPanel={showRightPanel && hasAgents}
      sidebarProps={{
        items: SIDEBAR_ITEMS,
        bottomItems: SIDEBAR_BOTTOM_ITEMS,
        activePath: location.pathname,
        onNavigate: navigate,
        showStatusDot: false,
        showThemeToggle: true,
      }}
      {...(showRightPanel && hasAgents
        ? {
            rightPanelProps: {
              agents,
              agentResponses: MODULE_AGENT_RESPONSES,
              autoRespond: true,
              autoRespondDelayMs: 800,
            },
          }
        : {})}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden w-full h-full">
        {children}
      </div>
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
            <PageWrapper showRightPanel={false}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<RouteFallback variant="home" />}>
                  <HomePage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/campaigns"
          element={
            <PageWrapper showRightPanel={true}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<RouteFallback variant="module" />}>
                  <MarketingPage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/invoices"
          element={
            <PageWrapper showRightPanel={true}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<RouteFallback variant="module" />}>
                  <AccountingModule />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/tasks"
          element={
            <PageWrapper showRightPanel={true}>
              <RouteWithErrorBoundary>
                <Suspense fallback={<RouteFallback variant="module" />}>
                  <TasksManagerPage />
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
                <SettingsPage />
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <RouteWithErrorBoundary>
              <Suspense fallback={<RouteFallback variant="module" />}>
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
    <ThemeProvider>
      <div className="flex h-full min-h-0 flex-col">
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
      </div>
    </ThemeProvider>
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
