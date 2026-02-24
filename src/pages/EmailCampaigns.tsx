import { useState } from 'react'
import {
  PageHeader,
  PageHeaderActionButton,
  TabSystem,
  StatCardGrid,
  StatCards,
  CampaignTable,
  EmailTemplatesSection,
  Input,
  AIComposeInput,
  SearchBar,
  EmailComposeActionButtons,
} from '@citron-systems/citron-ui'
import type { CampaignTableRow, EmailTemplateItem } from '@citron-systems/citron-ui'
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
  { label: 'Sent', value: '12,450', change: '+8%', changeVariant: 'success' as const },
  { label: 'Opened', value: '68%', change: '+2%', changeVariant: 'success' as const },
  { label: 'Clicked', value: '24%', change: '-1%', changeVariant: 'error' as const },
  { label: 'Bounced', value: '1.2%', change: '0%', changeVariant: 'neutral' as const },
]

const MOCK_CAMPAIGNS: CampaignTableRow[] = [
  {
    id: '1',
    campaignName: 'Q1 Product Launch',
    recipients: '2,840 recipients',
    status: 'sent',
    opens: '68%',
    clicks: '24%',
    date: 'Feb 12, 2026',
  },
  {
    id: '2',
    campaignName: 'Welcome Series',
    recipients: '1,200 recipients',
    status: 'active',
    statusSubtext: 'Running',
    opens: '-',
    clicks: '-',
    date: 'Feb 28, 2026',
  },
  {
    id: '3',
    campaignName: 'Re-engagement',
    recipients: '890 recipients',
    status: 'draft',
    opens: '-',
    clicks: '-',
    date: 'Feb 5, 2026',
  },
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

export function EmailCampaignsPage() {
  const [activeTabId, setActiveTabId] = useState('compose')
  const [subject, setSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [recipientSearch, setRecipientSearch] = useState('')

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
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Email Campaigns"
          subtitle="Automate outreach · AI-powered templates"
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
          className="mb-6"
        />
        {activeTabId === 'campaigns' && (
          <div className="flex flex-col gap-6">
            <StatCardGrid columns={4}>
              <StatCards items={MOCK_STATS} />
            </StatCardGrid>
            <CampaignTable columns={CAMPAIGN_COLUMNS} rows={MOCK_CAMPAIGNS} />
          </div>
        )}
        {activeTabId === 'templates' && (
          <EmailTemplatesSection
            title="Templates"
            templates={MOCK_TEMPLATES}
            onGenerateWithAI={() => setActiveTabId('compose')}
            onTemplateClick={() => setActiveTabId('compose')}
          />
        )}
        {activeTabId === 'compose' && (
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                SUBJECT
              </label>
              <Input
                placeholder="Enter subject line..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="rounded-[var(--inkblot-radius-md)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <AIComposeInput
                label="Body"
                placeholder="Compose your email or let AI generate content..."
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                onWriteWithAI={handleWriteWithAI}
                loading={aiLoading}
                className="min-h-[200px] resize-y rounded-[var(--inkblot-radius-md)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                RECIPIENTS
              </label>
              <SearchBar
                placeholder="Search contacts, segments, or tags..."
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                className="rounded-[var(--inkblot-radius-md)]"
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
