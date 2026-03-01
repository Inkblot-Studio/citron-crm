import { useState } from 'react'
import {
  PageHeader,
  PageHeaderActionButton,
  TabSystem,
  Card,
  CardContent,
  CampaignTable,
  EmailTemplatesSection,
  Input,
  AIComposeInput,
  SearchBar,
  EmailComposeActionButtons,
  EmailBlockEditor,
  AIEmailGenerator,
} from '@citron-systems/citron-ui'
import type { CampaignTableRow, EmailTemplateItem, EmailBlock } from '@citron-systems/citron-ui'
import { Mail } from 'lucide-react'

const CAMPAIGN_COLUMNS = [
  { key: 'campaignName', label: 'Campaign' },
  { key: 'recipients', label: 'Recipients' },
  { key: 'status', label: 'Status' },
  { key: 'opens', label: 'Opens' },
  { key: 'clicks', label: 'Clicks' },
  { key: 'date', label: 'Date' },
]

const MOCK_STATS = [
  { label: 'Total Sent', value: '12.4K', change: 'This month', changeVariant: 'success' as const },
  { label: 'Avg. Open Rate', value: '64%', change: '+8% vs prior', changeVariant: 'success' as const },
  { label: 'Avg. Click Rate', value: '22%', change: '+3% vs prior', changeVariant: 'success' as const },
  { label: 'Active Automations', value: '7', change: '3 paused', changeVariant: 'neutral' as const },
]

const MOCK_CAMPAIGNS: CampaignTableRow[] = [
  { id: '1', campaignName: 'Q1 Product Launch', recipients: '2,840 recipients', status: 'sent', opens: '68%', clicks: '24%', date: 'Feb 12, 2026' },
  { id: '2', campaignName: 'Onboarding Drip \u2013 Week 1', recipients: '1,200 recipients', status: 'active', statusSubtext: 'Running', opens: '-', clicks: '-', date: 'Feb 28, 2026' },
  { id: '3', campaignName: 'Churn Prevention \u2013 Tier 2', recipients: '0 recipients', status: 'draft', opens: '-', clicks: '-', date: 'Feb 5, 2026' },
  { id: '4', campaignName: 'Feature Update \u2013 Feb 2026', recipients: '4,100 recipients', status: 'scheduled', opens: '-', clicks: '-', date: 'Feb 28, 2026' },
  { id: '5', campaignName: 'Re-engagement Flow', recipients: '890 recipients', status: 'sent', opens: '45%', clicks: '12%', date: 'Feb 5, 2026' },
]

const MOCK_TEMPLATES: EmailTemplateItem[] = [
  { id: '1', category: 'Onboarding', title: 'Welcome Series', uses: '34 uses' },
  { id: '2', category: 'Marketing', title: 'Product Announcement', uses: '12 uses' },
  { id: '3', category: 'Retention', title: 'Renewal Reminder', uses: '28 uses' },
  { id: '4', category: 'Sales', title: 'Meeting Follow-up', uses: '56 uses' },
]

const MOCK_RECIPIENTS = [
  'Acme Corp - Sarah Chen',
  'TechStart Inc - Mike Rodriguez',
  'GlobalTech - Lisa Kim',
  'Enterprise Co - John Smith',
  'StartupXYZ - Emma Wilson',
]

const TABS = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'templates', label: 'Templates' },
  { id: 'compose', label: 'Compose' },
]

type ComposeMode = 'blocks' | 'ai' | 'simple'

export function EmailCampaignsPage() {
  const [activeTabId, setActiveTabId] = useState('campaigns')
  const [subject, setSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [recipientSearch, setRecipientSearch] = useState('')
  const [composeMode, setComposeMode] = useState<ComposeMode>('blocks')
  const [blocks, setBlocks] = useState<EmailBlock[]>([])

  const handleWriteWithAI = () => {
    setAiLoading(true)
    setTimeout(() => {
      setComposeBody((prev) =>
        prev +
          '\n\n[AI draft: Thank you for your interest. We would be glad to schedule a call next week.]'
      )
      setAiLoading(false)
    }, 1200)
  }

  const handleSendNow = () => {
    setSubject('')
    setComposeBody('')
    setBlocks([])
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Email Campaigns"
          subtitle="Automate outreach \u00B7 AI-powered templates"
          icon={
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-interactive-primary)]">
              <Mail className="h-5 w-5 text-[var(--inkblot-semantic-color-text-inverse)]" />
            </div>
          }
          action={
            <PageHeaderActionButton
              label="New Campaign"
              onClick={() => setActiveTabId('compose')}
            />
          }
        />
        <TabSystem
          tabs={TABS}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
          className="mb-2"
        />

        {activeTabId === 'campaigns' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
              {MOCK_STATS.map((item) => (
                <Card key={item.label} className="min-w-0 overflow-visible">
                  <CardContent className="p-4">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                      {item.label}
                    </span>
                    <p className="mt-1 text-2xl font-semibold text-[var(--inkblot-semantic-color-text-primary)]">
                      {item.value}
                    </p>
                    <span className="text-[10px] mt-1 block text-[var(--inkblot-semantic-color-text-secondary)]">
                      {item.change}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="overflow-x-auto min-w-0">
              <CampaignTable columns={CAMPAIGN_COLUMNS} rows={MOCK_CAMPAIGNS} />
            </div>
          </div>
        )}

        {activeTabId === 'templates' && (
          <EmailTemplatesSection
            title="Templates"
            templates={MOCK_TEMPLATES}
            onGenerateWithAI={() => {
              setActiveTabId('compose')
              setComposeMode('ai')
            }}
            onTemplateClick={() => setActiveTabId('compose')}
          />
        )}

        {activeTabId === 'compose' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                SUBJECT
              </label>
              <Input
                placeholder="Enter subject line..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-2 text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                Editor Mode
              </span>
              {(['blocks', 'ai', 'simple'] as ComposeMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setComposeMode(mode)}
                  className={`rounded-[var(--inkblot-radius-md)] px-3 py-1.5 text-xs font-medium transition-colors ${
                    composeMode === mode
                      ? 'bg-[var(--inkblot-semantic-color-background-tertiary)] text-[var(--inkblot-semantic-color-text-primary)]'
                      : 'text-[var(--inkblot-semantic-color-text-secondary)] hover:text-[var(--inkblot-semantic-color-text-primary)]'
                  }`}
                >
                  {mode === 'blocks' ? 'Drag & Drop' : mode === 'ai' ? 'AI Generate' : 'Simple'}
                </button>
              ))}
            </div>

            {composeMode === 'blocks' && (
              <EmailBlockEditor blocks={blocks} onBlocksChange={setBlocks} />
            )}

            {composeMode === 'ai' && (
              <AIEmailGenerator
                onGenerate={(newBlocks) => {
                  setBlocks(newBlocks)
                  setComposeMode('blocks')
                }}
              />
            )}

            {composeMode === 'simple' && (
              <AIComposeInput
                label="Body"
                placeholder="Compose your email or let AI generate content..."
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                onWriteWithAI={handleWriteWithAI}
                loading={aiLoading}
                className="min-h-[200px] resize-y"
              />
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                RECIPIENTS
              </label>
              <SearchBar
                placeholder="Search contacts, segments, or tags..."
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 pt-2">
                {MOCK_RECIPIENTS.map((name) => (
                  <span
                    key={name}
                    className="rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-background-tertiary)] px-3 py-1.5 text-sm text-[var(--inkblot-semantic-color-text-secondary)]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <EmailComposeActionButtons
              onSendNow={handleSendNow}
              onSchedule={() => {}}
              onSaveDraft={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  )
}
