import { CircularScore } from '@citron-systems/citron-ui'
import {
  FileText,
  Plus,
  Sparkles,
  Send,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/lib/ToastContext'

const wizardSteps = [
  { id: 'client', question: 'Who is this invoice for?', placeholder: 'e.g. Acme Corporation', field: 'clientName' },
  { id: 'client_email', question: "Client's email address?", placeholder: 'e.g. billing@acme.com', field: 'clientEmail' },
  { id: 'items', question: 'Describe the services or products to invoice', placeholder: 'e.g. Web development — 40 hours at $150/hr', field: 'itemsDescription', multiline: true },
  { id: 'due', question: 'When is payment due?', placeholder: 'e.g. Net 30, March 15 2026', field: 'dueDate' },
  { id: 'notes', question: 'Any additional notes or terms?', placeholder: 'e.g. Late payment fee 1.5%/month', field: 'notes', multiline: true },
]

interface InvoiceItem {
  description: string
  qty: number
  rate: number
  amount: number
}

interface InvoiceData {
  clientName: string
  clientEmail: string
  dueDate: string
  notes: string
  invoiceNumber: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
}

const existingInvoices = [
  { id: 'INV-2026-001', client: 'Acme Corp', amount: '$12,400', status: 'paid' as const, date: 'Feb 10, 2026' },
  { id: 'INV-2026-002', client: 'TechVentures', amount: '$4,500', status: 'pending' as const, date: 'Feb 18, 2026' },
  { id: 'INV-2026-003', client: 'DataFlow Labs', amount: '$7,800', status: 'overdue' as const, date: 'Jan 28, 2026' },
  { id: 'INV-2026-004', client: 'GlobalTech', amount: '$22,000', status: 'draft' as const, date: 'Feb 25, 2026' },
]

const deals = [
  { name: 'Acme Corp - Enterprise', value: '$120,000', stage: 'Closing', confidence: 82, trend: 'up' as const },
  { name: 'TechVentures - Pro', value: '$45,000', stage: 'Negotiation', confidence: 65, trend: 'up' as const },
  { name: 'DataFlow Labs', value: '$78,000', stage: 'Discovery', confidence: 45, trend: 'flat' as const },
  { name: 'GlobalTech Inc', value: '$200,000', stage: 'Proposal', confidence: 38, trend: 'down' as const },
  { name: 'StartupXYZ', value: '$15,000', stage: 'Closing', confidence: 91, trend: 'up' as const },
]

const statusConfig = {
  paid: { label: 'Paid', icon: CheckCircle2, color: 'text-citrus-lime' },
  pending: { label: 'Pending', icon: Clock, color: 'text-citrus-lemon' },
  overdue: { label: 'Overdue', icon: AlertCircle, color: 'text-destructive' },
  draft: { label: 'Draft', icon: FileText, color: 'text-muted-foreground' },
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-citrus-lime" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-destructive" />
  return <Minus className="w-3 h-3 text-muted-foreground" />
}

type Tab = 'invoices' | 'deals' | 'create'

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('invoices')
  const [wizardStep, setWizardStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [generatedInvoice, setGeneratedInvoice] = useState<InvoiceData | null>(null)
  const { addToast } = useToast()

  const currentStep = wizardSteps[wizardStep]

  const handleExportPDF = () => addToast({ title: 'PDF exported', description: 'Your invoice has been downloaded.', variant: 'success' })
  const handleSendToClient = () => addToast({ title: 'Invoice sent', description: 'The invoice has been sent to the client.', variant: 'success' })
  const currentValue = formData[currentStep?.field ?? ''] ?? ''

  const handleNext = () => {
    if (wizardStep < wizardSteps.length - 1) {
      setWizardStep((s) => s + 1)
    } else {
      setGenerating(true)
      setTimeout(() => {
        const invoice: InvoiceData = {
          clientName: formData.clientName || 'Client',
          clientEmail: formData.clientEmail || '',
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
        }
        setGeneratedInvoice(invoice)
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
    <div className="h-full flex flex-col">
      <header className="px-8 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-citrus-lemon/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-citrus-lemon" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Invoices & Deals</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Pipeline management · AI invoicing</p>
          </div>
        </div>
        <button
          onClick={() => { setActiveTab('create'); resetWizard() }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3 h-3" />
          New Invoice
        </button>
      </header>

      <div className="px-8 py-3 border-b border-border flex gap-1">
        {(['invoices', 'deals', 'create'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); if (tab === 'create') resetWizard() }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            {tab === 'create' ? 'AI Create' : tab === 'deals' ? 'Deals Pipeline' : 'Invoices'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-6">
        {activeTab === 'invoices' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Revenue', value: '$46.7K', sub: 'This month' },
                { label: 'Outstanding', value: '$12.3K', sub: '3 invoices' },
                { label: 'Overdue', value: '$7.8K', sub: '1 invoice' },
                { label: 'Avg. Payment', value: '12d', sub: '-2d vs prior' },
              ].map((kpi) => (
                <div key={kpi.label} className="glass rounded-xl p-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                  <p className="text-2xl font-semibold text-foreground mt-1">{kpi.value}</p>
                  <span className="text-[10px] text-citrus-lime">{kpi.sub}</span>
                </div>
              ))}
            </div>
            <div className="glass rounded-xl overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_100px_80px_100px] gap-4 px-5 py-3 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>Invoice</span><span>Client</span><span>Amount</span><span>Status</span><span>Date</span>
              </div>
              {existingInvoices.map((inv) => {
                const st = statusConfig[inv.status]
                return (
                  <div key={inv.id} className="grid grid-cols-[80px_1fr_100px_80px_100px] gap-4 px-5 py-3.5 border-b border-border/50 hover:bg-secondary/30 transition-colors items-center">
                    <span className="text-xs font-mono text-citrus-lemon">{inv.id}</span>
                    <span className="text-sm font-medium text-foreground">{inv.client}</span>
                    <span className="text-sm font-mono text-foreground">{inv.amount}</span>
                    <span className={`text-xs flex items-center gap-1.5 ${st.color}`}>
                      <st.icon className="w-3 h-3" />{st.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{inv.date}</span>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {activeTab === 'deals' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Pipeline Value', value: '$458K', sub: '+12% MoM' },
                { label: 'Avg. Deal Size', value: '$91.6K', sub: '5 active' },
                { label: 'Win Rate', value: '68%', sub: 'Last 90 days' },
                { label: 'Avg. Cycle', value: '34d', sub: '-3d vs prior' },
              ].map((kpi) => (
                <div key={kpi.label} className="glass rounded-xl p-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                  <p className="text-2xl font-semibold text-foreground mt-1">{kpi.value}</p>
                  <span className="text-[10px] text-citrus-lime">{kpi.sub}</span>
                </div>
              ))}
            </div>
            <div className="glass rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_100px_120px_80px_40px] gap-4 px-5 py-3 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>Deal</span><span>Value</span><span>Stage</span><span>Score</span><span />
              </div>
              {deals.map((deal) => (
                <div key={deal.name} className="grid grid-cols-[1fr_100px_120px_80px_40px] gap-4 px-5 py-3.5 border-b border-border/50 hover:bg-secondary/30 transition-colors items-center">
                  <span className="text-sm font-medium text-foreground">{deal.name}</span>
                  <span className="text-sm font-mono text-foreground">{deal.value}</span>
                  <span className="text-xs text-muted-foreground">{deal.stage}</span>
                  <CircularScore
                    label=""
                    value={deal.confidence}
                    color={
                      deal.confidence >= 70
                        ? 'var(--inkblot-dark-color-status-success)'
                        : deal.confidence >= 50
                          ? 'var(--inkblot-dark-color-status-warning)'
                          : 'var(--inkblot-color-accent-citron-600)'
                    }
                    size={32}
                  />
                  <TrendIcon trend={deal.trend} />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'create' && !generatedInvoice && (
          <div className="max-w-lg mx-auto py-8">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-citrus-lemon" />
              <h2 className="text-sm font-semibold text-foreground">AI Invoice Wizard</h2>
              <span className="ml-auto text-[10px] text-muted-foreground">
                Step {wizardStep + 1} of {wizardSteps.length}
              </span>
            </div>
            <div className="flex gap-1 mb-8">
              {wizardSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${i <= wizardStep ? 'bg-citrus-lemon' : 'bg-surface-3'}`}
                />
              ))}
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">{currentStep?.question}</label>
              {currentStep?.multiline ? (
                <textarea
                  value={currentValue}
                  onChange={(e) => setFormData((d) => ({ ...d, [currentStep.field]: e.target.value }))}
                  placeholder={currentStep.placeholder}
                  rows={4}
                  className="w-full bg-surface-1 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              ) : (
                <input
                  value={currentValue}
                  onChange={(e) => setFormData((d) => ({ ...d, [currentStep!.field]: e.target.value }))}
                  placeholder={currentStep?.placeholder}
                  className="w-full bg-surface-1 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  onKeyDown={(e) => e.key === 'Enter' && currentValue.trim() && handleNext()}
                />
              )}
              <div className="flex gap-3 pt-2">
                {wizardStep > 0 && (
                  <button
                    onClick={() => setWizardStep((s) => s - 1)}
                    className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary/30 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!currentValue.trim() && wizardStep < wizardSteps.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
                >
                  {wizardStep === wizardSteps.length - 1 ? (
                    generating ? (
                      <><Loader2 className="w-3 h-3 animate-spin" />Generating…</>
                    ) : (
                      <><Sparkles className="w-3 h-3" />Generate Invoice</>
                    )
                  ) : (
                    <>Next<ArrowRight className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && generatedInvoice && (
          <div className="max-w-2xl mx-auto py-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-citrus-lime" />
                <span className="text-sm font-medium text-foreground">Invoice Generated</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-xs text-foreground hover:bg-secondary/80 transition-colors">
                  <Download className="w-3 h-3" />Export PDF
                </button>
                <button onClick={handleSendToClient} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                  <Send className="w-3 h-3" />Send to Client
                </button>
              </div>
            </div>
            <div className="glass rounded-xl p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-foreground">INVOICE</h3>
                  <p className="text-xs font-mono text-citrus-lemon mt-1">{generatedInvoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">Your Company</p>
                  <p className="text-xs text-muted-foreground">hello@company.com</p>
                </div>
              </div>
              <div className="border-t border-border pt-4 grid grid-cols-2 gap-8">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Bill To</span>
                  <p className="text-sm font-medium text-foreground mt-1">{generatedInvoice.clientName}</p>
                  <p className="text-xs text-muted-foreground">{generatedInvoice.clientEmail}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Due Date</span>
                  <p className="text-sm text-foreground mt-1">{generatedInvoice.dueDate}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-[1fr_60px_80px_80px] gap-4 pb-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                  <span>Description</span><span>Qty</span><span>Rate</span><span className="text-right">Amount</span>
                </div>
                {generatedInvoice.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_60px_80px_80px] gap-4 py-2.5 border-t border-border/30">
                    <span className="text-sm text-foreground">{item.description}</span>
                    <span className="text-sm font-mono text-foreground">{item.qty}</span>
                    <span className="text-sm font-mono text-foreground">${item.rate}</span>
                    <span className="text-sm font-mono text-foreground text-right">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex justify-end">
                <div className="w-48 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono text-foreground">${generatedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-mono text-foreground">${generatedInvoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="font-mono text-citrus-lime">${generatedInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              {generatedInvoice.notes && (
                <div className="border-t border-border pt-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Notes</span>
                  <p className="text-xs text-muted-foreground mt-1">{generatedInvoice.notes}</p>
                </div>
              )}
            </div>
            <button onClick={resetWizard} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Create another invoice
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
