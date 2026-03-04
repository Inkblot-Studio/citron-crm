import { Settings, User, Bell, Shield, Palette, Globe, Key, Database, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/lib/ToastContext'
import { useJiraConfig } from '@/lib/JiraContext'
import { verifyJiraConnection } from '@/lib/jira-api'

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
    <div className="max-w-lg space-y-5">
      <h2 className="text-sm font-semibold text-foreground">Integrations</h2>
      <p className="text-xs text-muted-foreground">Connect external tools to sync data with Citron CRM.</p>
      <div className="glass rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2684FF]/10 flex items-center justify-center">
            <span className="text-lg font-bold text-[#2684FF]">J</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Jira</p>
            <p className="text-[10px] text-muted-foreground">Sync tasks and issues from Jira Cloud</p>
          </div>
        </div>
        {isConnected ? (
          <div className="space-y-3 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">Connected to {config?.domain}</p>
            <button
              onClick={handleDisconnect}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground">Jira URL</label>
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="https://your-domain.atlassian.net"
                className="w-full bg-surface-1 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-surface-1 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground">API Token</label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Your Jira API token"
                className="w-full bg-surface-1 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <a
                href="https://id.atlassian.com/manage-profile/security/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline flex items-center gap-1"
              >
                Create API token <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <button
              onClick={handleConnect}
              disabled={testing}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {testing ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const sections = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'integrations', label: 'Integrations', icon: Globe },
  { key: 'api', label: 'API Keys', icon: Key },
  { key: 'data', label: 'Data & Export', icon: Database },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [profile, setProfile] = useState({
    displayName: 'Alex Operator',
    email: 'alex@citronos.io',
    role: 'Revenue Operations Lead',
  })
  const { addToast } = useToast()

  const handleSaveProfile = () => {
    addToast({ title: 'Settings saved', variant: 'success' })
  }

  return (
    <div className="h-full flex flex-col">
      <header className="px-8 py-5 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Workspace configuration</p>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-52 border-r border-border py-4 px-3 space-y-0.5">
          {sections.map((s) => (
            <button
              key={s.key}
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
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-6">
          {activeSection === 'profile' && (
            <div className="max-w-lg space-y-5">
              <h2 className="text-sm font-semibold text-foreground">Profile Settings</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Display Name</label>
                  <input
                    value={profile.displayName}
                    onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
                    className="w-full bg-surface-1 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Email</label>
                  <input
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className="w-full bg-surface-1 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Role</label>
                  <input
                    value={profile.role}
                    onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                    className="w-full bg-surface-1 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="max-w-lg space-y-5">
              <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
              <p className="text-xs text-muted-foreground">Citron OS supports full white-label theming via design tokens.</p>
              <div className="space-y-4">
                <div className="glass rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Theme</p>
                    <p className="text-[10px] text-muted-foreground">Light mode is currently active</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-0 border-2 border-primary ring-2 ring-primary/20" title="Light" />
                    <div className="w-8 h-8 rounded-lg bg-gray-800 border border-border/50 opacity-40" title="Dark" />
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm font-medium text-foreground mb-3">Accent Colors</p>
                  <div className="flex gap-2">
                    {[
                      { color: 'bg-citrus-lime', active: true },
                      { color: 'bg-citrus-lemon', active: false },
                      { color: 'bg-citrus-orange', active: false },
                      { color: 'bg-citrus-green', active: false },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full ${c.color} ${c.active ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && <IntegrationsSection />}
          {activeSection !== 'profile' && activeSection !== 'appearance' && activeSection !== 'integrations' && (
            <div className="flex items-center justify-center h-60">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-5 h-5 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {sections.find((s) => s.key === activeSection)?.label} settings
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">Configuration panel coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
