import { useState } from 'react'
import {
  PageHeader,
  PageHeaderActionButton,
  TabSystem,
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Input,
  Textarea,
  Button,
  Progress,
  StatusBadge,
} from '@citron-systems/citron-ui'
import { FileText, Sparkles, Send, Download, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import { MOCK_INVOICES, INVOICE_KPI } from '@/lib/mock-engine'
import type { GeneratedInvoice } from '@/lib/types'

const TABS = [
  { id: 'invoices', label: 'Invoices' },
  { id: 'create', label: 'AI Create' },
]

const WIZARD_STEPS = [
  { id: 'client', question: 'Who is this invoice for?', placeholder: 'e.g. Acme Corporation', field: 'clientName', multiline: false },
  { id: 'client_email', question: "Client's email address?", placeholder: 'e.g. billing@acme.com', field: 'clientEmail', multiline: false },
  { id: 'items', question: 'Describe the services or products to invoice', placeholder: 'e.g. Web development \u2014 40 hours at $150/hr, Hosting setup \u2014 flat fee $500', field: 'itemsDescription', multiline: true },
  { id: 'due', question: 'When is payment due?', placeholder: 'e.g. Net 30, March 15 2026', field: 'dueDate', multiline: false },
  { id: 'notes', question: 'Any additional notes or terms?', placeholder: 'e.g. Late payment fee 1.5%/month', field: 'notes', multiline: true },
]

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
  paid: { label: 'Paid', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  overdue: { label: 'Overdue', variant: 'error' },
  draft: { label: 'Draft', variant: 'info' },
}

const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  paid: CheckCircle2,
  pending: Clock,
  overdue: AlertCircle,
  draft: FileText,
}

export function InvoicesPage() {
  const [activeTab, setActiveTab] = useState('invoices')
  const [wizardStep, setWizardStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [generatedInvoice, setGeneratedInvoice] = useState<GeneratedInvoice | null>(null)

  const currentStep = WIZARD_STEPS[wizardStep]
  const currentValue = formData[currentStep?.field ?? ''] ?? ''

  const handleNext = () => {
    if (wizardStep < WIZARD_STEPS.length - 1) {
      setWizardStep((s) => s + 1)
    } else {
      setGenerating(true)
      setTimeout(() => {
        setGeneratedInvoice({
          clientName: formData.clientName || 'Client',
          clientEmail: formData.clientEmail || '',
          itemsDescription: formData.itemsDescription || '',
          dueDate: formData.dueDate || 'Net 30',
          notes: formData.notes || '',
          invoiceNumber: `INV-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
          items: [
            { description: 'Web Development Services', qty: 40, rate: 150, amount: 6000 },
            { description: 'Hosting & Infrastructure Setup', qty: 1, rate: 500, amount: 500 },
            { description: 'UI/UX Design Consultation', qty: 8, rate: 175, amount: 1400 },
          ],
          subtotal: 7900,
          tax: 790,
          total: 8690,
        })
        setGenerating(false)
      }, 2000)
    }
  }

  const resetWizard = () => {
    setWizardStep(0)
    setFormData({})
    setGeneratedInvoice(null)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Invoices"
          subtitle="AI-powered invoice creation \u00B7 Template engine"
          icon={
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-interactive-primary)]">
              <FileText className="h-5 w-5 text-[var(--inkblot-semantic-color-text-inverse)]" />
            </div>
          }
          action={
            <PageHeaderActionButton
              label="New Invoice"
              onClick={() => {
                setActiveTab('create')
                resetWizard()
              }}
            />
          }
        />

        <TabSystem tabs={TABS} activeTabId={activeTab} onTabChange={setActiveTab} className="mb-2" />

        {activeTab === 'invoices' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
              {INVOICE_KPI.map((item) => (
                <Card key={item.label} className="min-w-0 overflow-visible">
                  <CardContent className="p-4">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">
                      {item.label}
                    </span>
                    <p className="mt-1 text-2xl font-semibold text-[var(--inkblot-semantic-color-text-primary)]">
                      {item.value}
                    </p>
                    <span className={`text-[10px] mt-1 block ${item.changeVariant === 'success' ? 'text-[var(--inkblot-semantic-color-status-success)]' : item.changeVariant === 'error' ? 'text-[var(--inkblot-semantic-color-status-error)]' : 'text-[var(--inkblot-semantic-color-text-secondary)]'}`}>
                      {item.change}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="overflow-x-auto min-w-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_INVOICES.map((inv) => {
                  const st = STATUS_MAP[inv.status]
                  const Icon = STATUS_ICON[inv.status]
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-[var(--inkblot-semantic-color-status-warning)]">{inv.id}</TableCell>
                      <TableCell className="font-medium">{inv.client}</TableCell>
                      <TableCell className="font-mono">{inv.amount}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          {Icon ? <Icon className="h-3 w-3" /> : null}
                          {st ? <StatusBadge label={st.label} variant={st.variant} /> : null}
                        </span>
                      </TableCell>
                      <TableCell className="text-[var(--inkblot-semantic-color-text-secondary)]">{inv.date}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            </div>
          </div>
        )}

        {activeTab === 'create' && !generatedInvoice && (
          <div className="mx-auto w-full max-w-lg py-4">
            <div className="mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--inkblot-semantic-color-status-warning)]" />
              <span className="text-sm font-semibold text-[var(--inkblot-semantic-color-text-primary)]">AI Invoice Wizard</span>
              <span className="ml-auto text-xs text-[var(--inkblot-semantic-color-text-secondary)]">
                Step {wizardStep + 1} of {WIZARD_STEPS.length}
              </span>
            </div>

            <Progress value={((wizardStep + 1) / WIZARD_STEPS.length) * 100} className="mb-6" />

            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-[var(--inkblot-semantic-color-text-primary)]">
                {currentStep?.question}
              </label>
              {currentStep?.multiline ? (
                <Textarea
                  value={currentValue}
                  onChange={(e) => setFormData((d) => ({ ...d, [currentStep.field]: e.target.value }))}
                  placeholder={currentStep.placeholder}
                  rows={4}
                />
              ) : (
                <Input
                  value={currentValue}
                  onChange={(e) => setFormData((d) => ({ ...d, [currentStep!.field]: e.target.value }))}
                  placeholder={currentStep?.placeholder}
                  onKeyDown={(e) => e.key === 'Enter' && currentValue.trim() && handleNext()}
                />
              )}
              <div className="flex gap-3 pt-2">
                {wizardStep > 0 && (
                  <Button variant="secondary" onClick={() => setWizardStep((s) => s - 1)}>
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={(!currentValue.trim() && wizardStep < WIZARD_STEPS.length - 1) || generating}
                >
                  {wizardStep === WIZARD_STEPS.length - 1 ? (
                    generating ? (
                      <span className="flex items-center gap-2">Generating\u2026</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        Generate Invoice
                      </span>
                    )
                  ) : (
                    <span className="flex items-center gap-2">
                      Next
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && generatedInvoice && (
          <div className="mx-auto w-full max-w-2xl py-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-[var(--inkblot-semantic-color-text-primary)]">
                <CheckCircle2 className="h-4 w-4 text-[var(--inkblot-semantic-color-status-success)]" />
                Invoice Generated
              </span>
              <div className="flex gap-2">
                <Button variant="secondary">
                  <Download className="mr-1.5 h-3 w-3" />
                  Export PDF
                </Button>
                <Button>
                  <Send className="mr-1.5 h-3 w-3" />
                  Send to Client
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="space-y-6 p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--inkblot-semantic-color-text-primary)]">INVOICE</h3>
                    <p className="mt-1 font-mono text-xs text-[var(--inkblot-semantic-color-status-warning)]">{generatedInvoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--inkblot-semantic-color-text-primary)]">Your Company</p>
                    <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">hello@company.com</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 border-t border-[var(--inkblot-semantic-color-border-default)] pt-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Bill To</span>
                    <p className="mt-1 text-sm font-medium text-[var(--inkblot-semantic-color-text-primary)]">{generatedInvoice.clientName}</p>
                    <p className="text-xs text-[var(--inkblot-semantic-color-text-secondary)]">{generatedInvoice.clientEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Due Date</span>
                    <p className="mt-1 text-sm text-[var(--inkblot-semantic-color-text-primary)]">{generatedInvoice.dueDate}</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedInvoice.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="font-mono">{item.qty}</TableCell>
                        <TableCell className="font-mono">${item.rate}</TableCell>
                        <TableCell className="text-right font-mono">${item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end border-t border-[var(--inkblot-semantic-color-border-default)] pt-4">
                  <div className="w-48 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--inkblot-semantic-color-text-secondary)]">Subtotal</span>
                      <span className="font-mono">${generatedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--inkblot-semantic-color-text-secondary)]">Tax (10%)</span>
                      <span className="font-mono">${generatedInvoice.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-[var(--inkblot-semantic-color-border-default)] pt-2 text-sm font-bold">
                      <span>Total</span>
                      <span className="font-mono text-[var(--inkblot-semantic-color-status-success)]">${generatedInvoice.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {generatedInvoice.notes && (
                  <div className="border-t border-[var(--inkblot-semantic-color-border-default)] pt-4">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--inkblot-semantic-color-text-secondary)]">Notes</span>
                    <p className="mt-1 text-xs text-[var(--inkblot-semantic-color-text-secondary)]">{generatedInvoice.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <button
              onClick={resetWizard}
              className="mt-4 text-xs text-[var(--inkblot-semantic-color-text-secondary)] hover:text-[var(--inkblot-semantic-color-text-primary)]"
            >
              \u2190 Create another invoice
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
