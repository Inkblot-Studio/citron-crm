import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Database,
  Globe,
  ExternalLink,
  Copy,
  Trash2,
  Download,
  RefreshCw,
  Sparkles,
  Settings as SettingsModuleIcon,
} from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { resetCitronCanvasScroll } from '@/lib/citron-layout-scroll'
import { useToast } from '@/lib/ToastContext'
import { useJiraConfig } from '@/lib/JiraContext'
import { verifyJiraConnection } from '@/lib/jira-api'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  IntegrationPlaceholder,
  Switch,
  Skeleton,
  RadioGroup,
  Textarea,
} from '@citron-systems/citron-ui'
import type { LucideIcon } from 'lucide-react'
import {
  type ApiKeyRecord,
  type AppearanceSettings,
  type NotificationSettings,
  type SecuritySettings,
  type UserProfileSettings,
  exportAllSettingsBlob,
  loadApiKeys,
  loadAppearance,
  loadNotifications,
  loadProfile,
  loadSecurity,
  saveApiKeys,
  saveAppearance,
  saveNotifications,
  saveProfile,
  saveSecurity,
} from '@/lib/user-settings-storage'
import { SettingsMenuSelect } from '@/components/SettingsMenuSelect'

type SectionKey =
  | 'profile'
  | 'notifications'
  | 'security'
  | 'appearance'
  | 'integrations'
  | 'api'
  | 'data'

const SECTIONS: { key: SectionKey; label: string; icon: LucideIcon }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'integrations', label: 'Integrations', icon: Globe },
  { key: 'api', label: 'API keys', icon: Key },
  { key: 'data', label: 'Data & export', icon: Database },
]

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'America/Chicago', label: 'Central Time (US)' },
  { value: 'America/Denver', label: 'Mountain Time (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Madrid', label: 'Madrid' },
  { value: 'UTC', label: 'UTC' },
]

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
]

const SESSION_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '60', label: '1 hour' },
  { value: '480', label: '8 hours' },
  { value: '0', label: 'Never (this device only)' },
]

function SettingsPageSkeleton() {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 md:px-6 md:py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-5 w-40 max-w-full rounded-md" />
            <Skeleton className="h-2.5 w-64 max-w-full rounded-md" />
          </div>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <div className="shrink-0 border-b border-border px-4 py-3 md:hidden">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="hidden w-56 shrink-0 flex-col gap-0.5 border-border bg-[var(--inkblot-semantic-color-background-primary)] py-4 md:flex md:border-r md:px-3 lg:w-60 lg:px-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
        <div data-citron-settings-scroll className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl space-y-4">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-10 w-36 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsRow({
  label,
  description,
  control,
}: {
  label: string
  description?: string
  control: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0 sm:pl-6">{control}</div>
    </div>
  )
}

function IntegrationsSection() {
  const { config, isConnected, saveConfig, clearConfig } = useJiraConfig()
  const { addToast } = useToast()
  const [domain, setDomain] = useState(config?.domain ?? '')
  const [email, setEmail] = useState(config?.email ?? '')
  const [apiToken, setApiToken] = useState(config?.apiToken ?? '')
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    setDomain(config?.domain ?? '')
    setEmail(config?.email ?? '')
    setApiToken(config?.apiToken ?? '')
  }, [config])

  const handleConnect = async () => {
    const d = domain.trim().replace(/\/$/, '')
    if (!d || !email.trim() || !apiToken.trim()) {
      addToast({ title: 'Fill in all fields', variant: 'error' })
      return
    }
    setTesting(true)
    const result = await verifyJiraConnection({ domain: d, email: email.trim(), apiToken: apiToken.trim() })
    setTesting(false)
    if (result.ok) {
      saveConfig({ domain: d, email: email.trim(), apiToken: apiToken.trim() })
      addToast({ title: 'Jira connected', variant: 'success' })
    } else {
      addToast({ title: result.error ?? 'Connection failed', variant: 'error' })
    }
  }

  const handleDisconnect = () => {
    clearConfig()
    setDomain('')
    setEmail('')
    setApiToken('')
    addToast({ title: 'Jira disconnected', variant: 'info' })
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight text-foreground">Integrations</h2>
        <p className="text-sm text-muted-foreground">
          Connect external products used by Citron CRM modules. Credentials are stored in this browser only.
        </p>
      </div>

      <IntegrationPlaceholder
        name="Jira Cloud"
        description="Issue tracking for Tasks Manager — search, transition, and assign work without leaving Citron."
        icon={<span className="text-lg font-bold text-status-info">J</span>}
        connected={isConnected}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {testing ? (
        <Card className="overflow-hidden">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-full max-w-md rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg sm:w-40" />
          </CardContent>
        </Card>
      ) : !isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jira credentials</CardTitle>
            <CardDescription>
              Use an API token from your Atlassian account. Values are saved locally for the Tasks module.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jira-domain">Jira site URL</Label>
              <Input
                id="jira-domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="https://your-domain.atlassian.net"
                autoComplete="url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jira-email">Atlassian account email</Label>
              <Input
                id="jira-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jira-token">API token</Label>
              <Input
                id="jira-token"
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Paste your API token"
                autoComplete="off"
              />
              <a
                href="https://id.atlassian.com/manage-profile/security/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Create an API token <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Button type="button" onClick={handleConnect} disabled={testing} className="w-full sm:w-auto">
              Test connection & save
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Connected</p>
              <p className="text-sm text-muted-foreground">
                Active site <span className="font-mono text-foreground">{config?.domain}</span>
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const { addToast } = useToast()
  const { config } = useJiraConfig()
  const location = useLocation()
  const mainScrollRef = useRef<HTMLDivElement | null>(null)

  const setMainScrollEl = useCallback((node: HTMLDivElement | null) => {
    mainScrollRef.current = node
    if (node) node.scrollTop = 0
  }, [])
  const [hydrated, setHydrated] = useState(false)
  const [active, setActive] = useState<SectionKey>('profile')

  const [profile, setProfile] = useState<UserProfileSettings>(loadProfile)
  const [notifications, setNotifications] = useState<NotificationSettings>(loadNotifications)
  const [security, setSecurity] = useState<SecuritySettings>(loadSecurity)
  const [appearance, setAppearance] = useState<AppearanceSettings>(loadAppearance)
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([])
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [exporting, setExporting] = useState(false)

  const apiKeysSafe = useMemo(() => (Array.isArray(apiKeys) ? apiKeys : []), [apiKeys])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setProfile(loadProfile())
      setNotifications(loadNotifications())
      setSecurity(loadSecurity())
      setAppearance(loadAppearance())
      setApiKeys(loadApiKeys())
      setHydrated(true)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!hydrated || Array.isArray(apiKeys)) return
    setApiKeys(loadApiKeys())
  }, [hydrated, apiKeys])

  useEffect(() => {
    if (!hydrated) return
    document.documentElement.dataset.citronDensity = appearance.density
    document.documentElement.toggleAttribute('data-reduce-motion', appearance.reduceMotion)
    return () => {
      delete document.documentElement.dataset.citronDensity
      document.documentElement.removeAttribute('data-reduce-motion')
    }
  }, [appearance.density, appearance.reduceMotion, hydrated])

  /** One scroll region below the Settings header — reset shell + panel so fast route changes never inherit scroll. */
  useLayoutEffect(() => {
    if (!hydrated) return
    const reset = () => {
      resetCitronCanvasScroll()
      const el = mainScrollRef.current
      if (el) el.scrollTop = 0
    }
    reset()
    const outer = requestAnimationFrame(() => {
      reset()
      requestAnimationFrame(reset)
    })
    return () => cancelAnimationFrame(outer)
  }, [hydrated, active, location.key])

  /** While Settings is open, prevent the shell canvas from retaining scroll from other modules. */
  useLayoutEffect(() => {
    const section = document.querySelector<HTMLElement>('section[data-tour="canvas"]')
    if (!section) return
    const prevOverflow = section.style.overflow
    const prevOverscroll = section.style.overscrollBehavior
    section.style.overflow = 'hidden'
    section.style.overscrollBehavior = 'none'
    section.scrollTop = 0
    resetCitronCanvasScroll()
    return () => {
      section.style.overflow = prevOverflow
      section.style.overscrollBehavior = prevOverscroll
    }
  }, [])

  const persistNotifications = useCallback((next: NotificationSettings) => {
    setNotifications(next)
    saveNotifications(next)
  }, [])

  const persistSecurityPartial = useCallback(
    (patch: Partial<SecuritySettings>) => {
      const next = { ...security, ...patch }
      setSecurity(next)
      saveSecurity(next)
    },
    [security],
  )

  const sectionSelectOptions = useMemo(
    () => SECTIONS.map((s) => ({ value: s.key, label: s.label })),
    [],
  )

  const handleSaveProfile = () => {
    saveProfile(profile)
    addToast({ title: 'Profile saved', variant: 'success' })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordForm.next || passwordForm.next !== passwordForm.confirm) {
      addToast({ title: 'Passwords do not match', variant: 'error' })
      return
    }
    addToast({ title: 'Password update requested (demo — not sent to a server)', variant: 'info' })
    setPasswordForm({ current: '', next: '', confirm: '' })
  }

  const handleGenerateApiKey = () => {
    const raw = typeof crypto.randomUUID === 'function' ? crypto.randomUUID().replace(/-/g, '') : String(Date.now())
    const prefix = `crm_live_${raw.slice(0, 8)}`
    setApiKeys((prev) => {
      const list = Array.isArray(prev) ? prev : []
      const rec: ApiKeyRecord = {
        id: crypto.randomUUID(),
        name: `Key ${list.length + 1}`,
        prefix,
        createdAt: new Date().toISOString(),
      }
      const next = [...list, rec]
      saveApiKeys(next)
      return next
    })
    addToast({
      title: 'API key created',
      description: `Store the full secret once: ${prefix}_••••••••`,
      variant: 'success',
    })
  }

  const handleCopyKeyPrefix = async (prefix: string) => {
    try {
      await navigator.clipboard.writeText(prefix)
      addToast({ title: 'Copied to clipboard', variant: 'success' })
    } catch {
      addToast({ title: 'Clipboard unavailable', variant: 'warning' })
    }
  }

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => {
      const list = Array.isArray(prev) ? prev : []
      const next = list.filter((k) => k.id !== id)
      saveApiKeys(next)
      return next
    })
    addToast({ title: 'Key revoked', variant: 'info' })
  }

  const handleExport = () => {
    setExporting(true)
    const blob = exportAllSettingsBlob(config?.domain)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `citron-settings-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setExporting(false), 400)
    addToast({ title: 'Export started', variant: 'success' })
  }

  const handleResetWorkspace = () => {
    const keys = Object.keys(localStorage).filter(
      (k) =>
        k.startsWith('citron-settings') ||
        k.startsWith('citron-api') ||
        k === 'citron-home-agent',
    )
    keys.forEach((k) => localStorage.removeItem(k))
    setProfile(loadProfile())
    setNotifications(loadNotifications())
    setSecurity(loadSecurity())
    setAppearance(loadAppearance())
    setApiKeys([])
    addToast({ title: 'Workspace preferences cleared (Jira untouched)', variant: 'warning' })
  }

  const handleReplayTour = () => {
    localStorage.removeItem('citron-tour-done')
    addToast({ title: 'Tour will show on next full reload (non-dev)', variant: 'info' })
  }

  if (!hydrated) {
    return <SettingsPageSkeleton />
  }

  const renderSection = () => {
    switch (active) {
      case 'profile':
        return (
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">How you appear across Citron CRM.</p>
            </div>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="display-name">Display name</Label>
                    <Input
                      id="display-name"
                      value={profile.displayName}
                      onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="work-email">Work email</Label>
                    <Input
                      id="work-email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-4 sm:pr-2">
                    <Label htmlFor="tz" className="block shrink-0 text-sm font-medium leading-none">
                      Time zone
                    </Label>
                    <SettingsMenuSelect
                      id="tz"
                      listAriaLabel="Time zone"
                      options={TIMEZONE_OPTIONS}
                      value={profile.timezone}
                      onChange={(v) => setProfile((p) => ({ ...p, timezone: v }))}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-4 sm:pl-2">
                    <Label htmlFor="lang" className="block shrink-0 text-sm font-medium leading-none">
                      Language
                    </Label>
                    <SettingsMenuSelect
                      id="lang"
                      listAriaLabel="Language"
                      options={LANGUAGE_OPTIONS}
                      value={profile.language}
                      onChange={(v) => setProfile((p) => ({ ...p, language: v }))}
                    />
                  </div>
                </div>
                <Separator />
                <Button type="button" onClick={handleSaveProfile}>
                  Save profile
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case 'notifications':
        return (
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Choose what we surface in email and in-app.</p>
            </div>
            <Card>
              <CardContent className="pt-2">
                <SettingsRow
                  label="Product updates"
                  description="Release notes, new modules, and roadmap highlights."
                  control={
                    <Switch
                      checked={notifications.emailProductUpdates}
                      onCheckedChange={(v) =>
                        persistNotifications({ ...notifications, emailProductUpdates: v })
                      }
                    />
                  }
                />
                <SettingsRow
                  label="Weekly digest"
                  description="A summary of pipeline movement and campaign performance."
                  control={
                    <Switch
                      checked={notifications.emailDigest}
                      onCheckedChange={(v) => persistNotifications({ ...notifications, emailDigest: v })}
                    />
                  }
                />
                <SettingsRow
                  label="Mentions & assignments"
                  description="When someone @mentions you or assigns a task."
                  control={
                    <Switch
                      checked={notifications.mentionAlerts}
                      onCheckedChange={(v) => persistNotifications({ ...notifications, mentionAlerts: v })}
                    />
                  }
                />
                <SettingsRow
                  label="Campaign performance"
                  description="Alerts when a campaign crosses open or click thresholds."
                  control={
                    <Switch
                      checked={notifications.campaignPerformance}
                      onCheckedChange={(v) =>
                        persistNotifications({ ...notifications, campaignPerformance: v })
                      }
                    />
                  }
                />
                <SettingsRow
                  label="Desktop push (beta)"
                  description="Browser notifications when Citron is open in a tab."
                  control={
                    <Switch
                      checked={notifications.desktopPush}
                      onCheckedChange={(v) => persistNotifications({ ...notifications, desktopPush: v })}
                    />
                  }
                />
              </CardContent>
            </Card>
          </div>
        )
      case 'security':
        return (
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Session rules and credential hygiene for this workspace.</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Session</CardTitle>
                <CardDescription>Re-authentication prompts are simulated locally for this demo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex max-w-md flex-col gap-4">
                  <Label htmlFor="session" className="block shrink-0 text-sm font-medium leading-none">
                    Idle sign-out
                  </Label>
                  <SettingsMenuSelect
                    id="session"
                    listAriaLabel="Idle sign-out"
                    options={SESSION_OPTIONS}
                    value={security.sessionTimeout}
                    onChange={(v) => {
                      persistSecurityPartial({ sessionTimeout: v })
                      addToast({ title: 'Session policy updated', variant: 'success' })
                    }}
                  />
                </div>
                <SettingsRow
                  label="Two-factor authentication"
                  description="Adds a second step at sign-in when your IdP supports it."
                  control={
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(v) => {
                        persistSecurityPartial({ twoFactorEnabled: v })
                        addToast({
                          title: v ? '2FA preference enabled' : '2FA preference disabled',
                          variant: 'info',
                        })
                      }}
                    />
                  }
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addToast({ title: 'Signed out other sessions (demo)', variant: 'info' })}
                >
                  Sign out other sessions
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Password</CardTitle>
                <CardDescription>Demo form — nothing is sent to a server from this page.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pw-current">Current password</Label>
                    <Input
                      id="pw-current"
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pw-next">New password</Label>
                      <Input
                        id="pw-next"
                        type="password"
                        value={passwordForm.next}
                        onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))}
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pw-confirm">Confirm new password</Label>
                      <Input
                        id="pw-confirm"
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <Button type="submit">Update password</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )
      case 'appearance':
        return (
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">Appearance</h2>
              <p className="text-sm text-muted-foreground">Layout density and motion apply immediately on this device.</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Theme</CardTitle>
                <CardDescription>Switch light or dark from the theme control in the app sidebar.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Layout density</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  name="density"
                  options={[
                    {
                      value: 'comfortable',
                      label: 'Comfortable',
                      description: 'More breathing room in lists and forms.',
                    },
                    {
                      value: 'compact',
                      label: 'Compact',
                      description: 'Higher information density for power users.',
                    },
                  ]}
                  value={appearance.density}
                  onValueChange={(value) => {
                    const d = value as AppearanceSettings['density']
                    const next = { ...appearance, density: d }
                    setAppearance(next)
                    saveAppearance(next)
                    addToast({ title: 'Density updated', variant: 'success' })
                  }}
                />
                <Separator className="my-6" />
                <SettingsRow
                  label="Reduce motion"
                  description="Respects prefers-reduced-motion-style behavior for supported surfaces."
                  control={
                    <Switch
                      checked={appearance.reduceMotion}
                      onCheckedChange={(v) => {
                        const next = { ...appearance, reduceMotion: v }
                        setAppearance(next)
                        saveAppearance(next)
                        addToast({ title: v ? 'Reduced motion on' : 'Reduced motion off', variant: 'info' })
                      }}
                    />
                  }
                />
              </CardContent>
            </Card>
          </div>
        )
      case 'integrations':
        return <IntegrationsSection />
      case 'api':
        return (
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-base font-semibold tracking-tight text-foreground">API keys</h2>
                <p className="text-sm text-muted-foreground">
                  Keys are stored in this browser for demo purposes. Rotate regularly in production.
                </p>
              </div>
              <Button type="button" className="shrink-0 gap-2" onClick={handleGenerateApiKey}>
                <Sparkles className="h-4 w-4" />
                New key
              </Button>
            </div>
            {apiKeysSafe.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No keys yet. Create one for automation prototypes.</p>
                </CardContent>
              </Card>
            ) : (
              <ul className="space-y-3">
                {apiKeysSafe.map((k) => (
                  <li key={k.id}>
                    <Card>
                      <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-medium text-foreground">{k.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">{k.prefix}_••••••••</p>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(k.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="gap-1.5"
                            onClick={() => handleCopyKeyPrefix(`${k.prefix}_secret_demo`)}
                          >
                            <Copy className="h-4 w-4" />
                            Copy sample secret
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            className="gap-1.5 text-destructive"
                            onClick={() => handleRevokeKey(k.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Revoke
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      case 'data':
        return (
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">Data & export</h2>
              <p className="text-sm text-muted-foreground">
                Download your saved preferences or reset local workspace data.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Export</CardTitle>
                <CardDescription>JSON bundle of profile, notifications, security, and appearance.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button type="button" className="gap-2" onClick={handleExport} disabled={exporting}>
                  {exporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download JSON
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product tour</CardTitle>
                <CardDescription>Replay the guided tour after your next reload (production only).</CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="secondary" onClick={handleReplayTour}>
                  Reset tour flag
                </Button>
              </CardContent>
            </Card>
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
                <CardDescription>Clears Citron preference keys from localStorage. Jira credentials are kept.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="secondary" className="border-destructive/50 text-destructive" onClick={handleResetWorkspace}>
                  Clear workspace preferences
                </Button>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="diag">Diagnostic notes (local only)</Label>
              <Textarea
                id="diag"
                placeholder="Paste repro steps or feedback — stored only in this field until you leave the page."
                rows={4}
                className="resize-y"
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[var(--inkblot-semantic-color-background-primary)]">
      <header className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 md:px-6 md:py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <SettingsModuleIcon className="h-4 w-4 text-accent" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">Settings</h1>
            <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
              Workspace, security, and integrations for this Citron CRM shell.
            </p>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <div className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 md:hidden">
          <Label
            htmlFor="settings-section"
            className="block shrink-0 text-xs font-medium text-muted-foreground"
          >
            Section
          </Label>
          <SettingsMenuSelect
            id="settings-section"
            listAriaLabel="Settings section"
            options={sectionSelectOptions}
            value={active}
            onChange={(v) => setActive(v as SectionKey)}
          />
        </div>

        <nav
          className="hidden w-56 shrink-0 flex-col gap-0.5 border-border bg-[var(--inkblot-semantic-color-background-primary)] py-4 lg:w-60 md:flex md:border-r md:px-3 lg:px-4"
          aria-label="Settings sections"
        >
          {SECTIONS.map((s) => {
            const Icon = s.icon
            const isOn = active === s.key
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(s.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isOn
                    ? 'bg-secondary text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                {s.label}
              </button>
            )
          })}
        </nav>

        <div
          ref={setMainScrollEl}
          data-citron-settings-scroll
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain"
        >
          <div className="px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl">{renderSection()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
