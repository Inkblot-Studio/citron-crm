import { useState } from 'react'
import {
  PageHeader,
  TabSystem,
  Card,
  CardContent,
  Input,
  Switch,
  Select,
  Button,
  Separator,
} from '@citron-systems/citron-ui'
import { Settings } from 'lucide-react'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'api', label: 'API' },
  { id: 'data', label: 'Data' },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profileName, setProfileName] = useState('Alex Johnson')
  const [profileEmail, setProfileEmail] = useState('alex@citron.io')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [slackNotifications, setSlackNotifications] = useState(false)
  const [dealAlerts, setDealAlerts] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Settings"
          subtitle="Application configuration"
          icon={
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-background-tertiary)]">
              <Settings className="h-5 w-5 text-[var(--inkblot-semantic-color-text-secondary)]" />
            </div>
          }
        />

        <TabSystem tabs={TABS} activeTabId={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'profile' && (
          <Card>
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Full Name</label>
                <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Email</label>
                <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Role</label>
                <Select
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'member', label: 'Member' },
                  ]}
                  defaultValue="admin"
                />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--inkblot-semantic-color-text-primary)]">Email Notifications</p>
                  <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--inkblot-semantic-color-text-primary)]">Slack Notifications</p>
                  <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">Post updates to Slack channel</p>
                </div>
                <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--inkblot-semantic-color-text-primary)]">Deal Stage Alerts</p>
                  <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">Alert when deals change stage</p>
                </div>
                <Switch checked={dealAlerts} onCheckedChange={setDealAlerts} />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--inkblot-semantic-color-text-primary)]">Two-Factor Authentication</p>
                  <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">Add an extra layer of security</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Current Password</label>
                <Input type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">New Password</label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'appearance' && (
          <Card>
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Theme</label>
                <Select
                  options={[
                    { value: 'dark', label: 'Dark' },
                    { value: 'light', label: 'Light' },
                    { value: 'system', label: 'System' },
                  ]}
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Accent Color</label>
                <Select
                  options={[
                    { value: 'lime', label: 'Citrus Lime' },
                    { value: 'lemon', label: 'Citrus Lemon' },
                    { value: 'orange', label: 'Citrus Orange' },
                    { value: 'green', label: 'Citrus Green' },
                  ]}
                  defaultValue="lime"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'integrations' && (
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              {[
                { name: 'Salesforce', desc: 'Sync contacts and deals', connected: true },
                { name: 'HubSpot', desc: 'Marketing automation', connected: false },
                { name: 'Slack', desc: 'Team notifications', connected: true },
                { name: 'Google Calendar', desc: 'Meeting scheduling', connected: false },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--inkblot-semantic-color-text-primary)]">{integration.name}</p>
                    <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">{integration.desc}</p>
                  </div>
                  <Button variant={integration.connected ? 'secondary' : 'primary'}>
                    {integration.connected ? 'Connected' : 'Connect'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === 'api' && (
          <Card>
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">API Key</label>
                <div className="flex gap-2">
                  <Input
                    type={apiKeyVisible ? 'text' : 'password'}
                    value="ctk_live_a1b2c3d4e5f6g7h8i9j0"
                    readOnly
                    className="flex-1 font-mono"
                  />
                  <Button variant="secondary" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                    {apiKeyVisible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Webhook URL</label>
                <Input placeholder="https://your-server.com/webhook" />
              </div>
              <div className="flex justify-end">
                <Button>Regenerate Key</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'data' && (
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--inkblot-semantic-color-text-primary)]">Export All Data</p>
                  <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">Download a CSV of all CRM records</p>
                </div>
                <Button variant="secondary">Export</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--inkblot-semantic-color-status-error)]">Delete Account</p>
                  <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">Permanently delete your account and all data</p>
                </div>
                <Button variant="secondary">Delete</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
