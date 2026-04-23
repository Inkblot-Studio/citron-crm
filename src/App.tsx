import {
  Suspense,
  lazy,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  createContext,
  useContext,
  type ComponentProps,
} from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import {
  AppLayout,
  RouteWithErrorBoundary,
  OnboardingWizard,
  GuidedTour,
  Toaster,
  ThemeProvider,
  AssistantPanel,
} from '@citron-systems/citron-ui'
import { ToastProvider, useToast } from '@/lib/ToastContext'
import { JiraProvider } from '@/lib/JiraContext'
import type { AppSidebarItem, GuidedTourStep, AssistantMessage } from '@citron-systems/citron-ui'
import { RouteFallback } from '@/components/RouteFallback'
import { resetCitronCanvasScroll } from '@/lib/citron-layout-scroll'
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
  BotMessageSquare,
  DollarSign,
} from 'lucide-react'

const HomePage = lazy(() => import('@/pages/HomePage'))
const MarketingPage = lazy(() => import('marketing/Marketing'))
const AccountingModule = lazy(() => import('accounting/Accounting'))
const TasksManagerPage = lazy(() => import('tasksManager/TasksManager'))
const SalesModule = lazy(() => import('sales/Sales'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

const SIDEBAR_ITEMS = [
  { id: 'home', icon: MessageSquare, label: 'Home', path: '/', dataTour: 'nav-home' },
  { id: 'accounting', icon: FileText, label: 'Accounting', path: '/invoices', dataTour: 'nav-invoices' },
  { id: 'marketing', icon: Mail, label: 'Marketing', path: '/campaigns', dataTour: 'nav-campaigns' },
  {
    id: 'sales',
    icon: DollarSign,
    label: 'Sales',
    path: '/sales',
    dataTour: 'nav-sales',
  },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks Manager', path: '/tasks', dataTour: 'nav-tasks' },
] as unknown as AppSidebarItem[]

const SIDEBAR_BOTTOM_ITEMS = [
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings', dataTour: 'nav-settings' },
] as unknown as AppSidebarItem[]

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
      { value: 'insights', label: 'AI-powered insights' },
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
] as unknown as NonNullable<ComponentProps<typeof OnboardingWizard>['steps']>

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
    target: '[data-tour="nav-sales"]',
    title: 'Sales',
    description: 'Pipeline, opportunities, and revenue workflows.',
    position: 'right',
  },
  {
    target: '[data-tour="nav-tasks"]',
    title: 'Tasks Manager',
    description: 'Track and manage work in the Tasks Manager module.',
    position: 'right',
  },
]

function getModuleLabelForPath(pathname: string): string {
  if (pathname.startsWith('/invoices')) return 'Accounting'
  if (pathname === '/campaigns' || pathname.startsWith('/campaigns/')) return 'Marketing'
  if (pathname.startsWith('/sales')) return 'Sales'
  if (pathname === '/tasks' || pathname.startsWith('/tasks/')) return 'Tasks Manager'
  if (pathname.startsWith('/settings')) return 'Settings'
  return 'Citron'
}

// ── Assistant context (global toggle + messages) ────────────────────────────

interface AssistantCtx {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  messages: AssistantMessage[]
  send: (payload: { text: string; files: File[] }) => void
  isProcessing: boolean
}

const AssistantContext = createContext<AssistantCtx | null>(null)

function useAssistant() {
  const ctx = useContext(AssistantContext)
  if (!ctx) throw new Error('useAssistant must be used within AssistantProvider')
  return ctx
}

function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const toggle = useCallback(() => setOpen((v) => !v), [])

  const send = useCallback(({ text, files }: { text: string; files: File[] }) => {
    const content =
      files.length > 0 ? `${text}\n[Attached: ${files.map((f) => f.name).join(', ')}]` : text
    const userMsg: AssistantMessage = { id: crypto.randomUUID(), role: 'user', content }
    setMessages((prev) => [...prev, userMsg])
    setIsProcessing(true)

    setTimeout(() => {
      const reply: AssistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Processing: "${text}"`,
      }
      setMessages((prev) => [...prev, reply])
      setIsProcessing(false)
    }, 1200)
  }, [])

  return (
    <AssistantContext.Provider value={{ open, setOpen, toggle, messages, send, isProcessing }}>
      {children}
    </AssistantContext.Provider>
  )
}

// ── Layout wrapper ──────────────────────────────────────────────────────────

function PageWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { open, setOpen, toggle, messages, send, isProcessing } = useAssistant()

  const moduleLabel = getModuleLabelForPath(location.pathname)
  const isHome = location.pathname === '/'

  const assistantTitle = `${moduleLabel} Assistant`
  const assistantSubtitle = `Ask anything about ${moduleLabel}`

  useEffect(() => {
    if (isHome) setOpen(false)
  }, [isHome, setOpen])

  useLayoutEffect(() => {
    const reset = () => resetCitronCanvasScroll()
    reset()
    const outer = requestAnimationFrame(() => {
      reset()
      requestAnimationFrame(reset)
    })
    return () => cancelAnimationFrame(outer)
  }, [location.pathname, location.key])

  return (
    <AppLayout
      sidebarProps={{
        items: SIDEBAR_ITEMS,
        bottomItems: SIDEBAR_BOTTOM_ITEMS,
        activePath: location.pathname,
        onNavigate: navigate,
        showStatusDot: false,
        showThemeToggle: true,
      }}
    >
      <div className="citron-assistant-scope flex h-full min-h-0 w-full min-w-0 flex-1 flex-row overflow-hidden">
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {children}

          {!isHome && !open && (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={false}
              aria-label="Open assistant"
              className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--inkblot-semantic-color-interactive-primary)] text-[var(--inkblot-semantic-color-text-inverse)] shadow-lg transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
            >
              <BotMessageSquare className="h-5 w-5" />
            </button>
          )}
        </div>

        {!isHome && (
          <AssistantPanel
            open={open}
            onOpenChange={setOpen}
            title={assistantTitle}
            subtitle={assistantSubtitle}
            messages={messages}
            onSend={send}
            isProcessing={isProcessing}
            placeholder={`Ask the ${moduleLabel} assistant...`}
            emptyStateMessage="How can I help you in this module?"
            className="min-h-0"
          />
        )}
      </div>
    </AppLayout>
  )
}

// ── Routes ──────────────────────────────────────────────────────────────────

function AppRoutes({ tourActive, onTourComplete }: { tourActive: boolean; onTourComplete: () => void }) {
  return (
    <>
      {tourActive && <GuidedTour steps={TOUR_STEPS} onComplete={onTourComplete} />}
      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper>
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
            <PageWrapper>
              <RouteWithErrorBoundary>
                <Suspense fallback={<RouteFallback variant="module" />}>
                  <MarketingPage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/invoices/*"
          element={
            <PageWrapper>
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
            <PageWrapper>
              <RouteWithErrorBoundary>
                <Suspense fallback={<RouteFallback variant="module" />}>
                  <TasksManagerPage />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/sales/*"
          element={
            <PageWrapper>
              <RouteWithErrorBoundary>
                <Suspense fallback={<RouteFallback variant="module" />}>
                  <SalesModule />
                </Suspense>
              </RouteWithErrorBoundary>
            </PageWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <PageWrapper>
              <RouteWithErrorBoundary>
                <Suspense fallback={<RouteFallback variant="settings" />}>
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

// ── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const isDev = import.meta.env.DEV
  const [onboardingDone, setOnboardingDone] = useState(
    () => (isDev ? false : localStorage.getItem('citron-onboarding-done') === 'true'),
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
            <AssistantProvider>
              {!onboardingDone && (
                <OnboardingWizard steps={ONBOARDING_STEPS} onComplete={handleOnboardingComplete} />
              )}
              <BrowserRouter>
                <AppWithToaster />
                <AppRoutes tourActive={tourActive} onTourComplete={handleTourComplete} />
              </BrowserRouter>
            </AssistantProvider>
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
