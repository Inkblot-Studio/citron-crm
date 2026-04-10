import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Database,
  Globe,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/lib/ToastContext'
import { useJiraConfig } from '@/lib/JiraContext'
import { verifyJiraConnection } from '@/lib/jira-api'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Separator,
  IntegrationPlaceholder,
} from '@citron-systems/citron-ui'

const sections = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'integrations', label: 'Integrations', icon: Globe },
  { key: 'api', label: 'API Keys', icon: Key },
  { key: 'data', label: 'Data & Export', icon: Database },
]

function IntegrationsSection() {
  const { config, isConnected, saveConfig, clearConfig } = useJiraConfig()
  const { addToast } = useToast()
  const [domain, setDomain] = useState(config?.domain ?? '')
  const [email, setEmail] = useState(config?.email ?? '')
  const [apiToken, setApiToken] = useState(config?.apiToken ?? '')
  const [testing, setTesting] = useState(false)

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
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Integrations</h2>
        <p className="text-xs text-muted-foreground mt-1">
          External services used by CRM modules.
        </p>
      </div>

      <IntegrationPlaceholder
        name="Jira"
        description="Issue tracking and project management for Tasks Manager"
        icon={<span className="text-lg font-bold text-status-info">J</span>}
        connected={isConnected}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {!isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xs">Jira Credentials</CardTitle>
            <CardDescription className="text-[10px]">
              Values are shared with the Tasks Manager module via localStorage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-[10px]">Jira URL</Label>
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="https://your-domain.atlassian.net"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px]">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px]">API Token</Label>
              <Input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Your Jira API token"
              />
              <a
                href="https://id.atlassian.com/manage-profile/security/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline inline-flex items-center gap-1"
              >
                Create API token <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <Button onClick={handleConnect} disabled={testing} className="w-full">
              {testing ? 'Connecting...' : 'Connect'}
            </Button>
          </CardContent>
        </Card>
      )}

      {isConnected && (
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">
              Connected to <strong>{config?.domain}</strong>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ProfileSection() {
  const [profile, setProfile] = useState({
    displayName: 'Alex Operator',
    email: 'alex@citronos.io',
    role: 'Revenue Operations Lead',
  })
  const { addToast } = useToast()

  return (
    <div className="max-w-lg space-y-5">
      <h2 className="text-sm font-semibold text-foreground">Profile Settings</h2>
      <Card>
        <CardContent className="space-y-4 py-5">
          <div className="space-y-1.5">
            <Label>Display Name</Label>
            <Input
              value={profile.displayName}
              onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Input
              value={profile.role}
              onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
            />
          </div>
          <Separator />
          <Button onClick={() => addToast({ title: 'Settings saved', variant: 'success' })}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function AppearanceSection() {
  return (
    <div className="max-w-lg space-y-5">
      <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
      <p className="text-xs text-muted-foreground">
        Citron OS supports full white-label theming via design tokens.
      </p>
      <Card>
        <CardContent className="py-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Theme</p>
            <p className="text-[10px] text-muted-foreground">Toggle between light and dark modes using the sidebar control.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PlaceholderSection({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-60">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto">
          <Settings className="w-5 h-5 text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground">{label} settings</p>
        <p className="text-xs text-muted-foreground/60">Configuration panel coming soon</p>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden w-full">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <nav className="w-52 shrink-0 border-r border-border py-4 px-3 space-y-0.5">
          {sections.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveSection(s.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeSection === s.key
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <s.icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto hide-scrollbar px-8 py-6">
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'appearance' && <AppearanceSection />}
          {activeSection === 'integrations' && <IntegrationsSection />}
          {activeSection !== 'profile' &&
            activeSection !== 'appearance' &&
            activeSection !== 'integrations' && (
              <PlaceholderSection label={sections.find((s) => s.key === activeSection)?.label ?? activeSection} />
            )}
        </div>
      </div>
    </div>
  )
}
