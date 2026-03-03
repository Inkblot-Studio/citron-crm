import { Settings, User, Bell, Shield, Palette, Globe, Key, Database } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/lib/ToastContext'

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

          {activeSection !== 'profile' && activeSection !== 'appearance' && (
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
