import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  Globe,
  Megaphone,
  Target,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Check,
  Command,
  Sparkles,
} from "lucide-react";

interface OnboardingWizardProps {
  onComplete: () => void;
}

interface StepConfig {
  id: string;
  question: string;
  subtitle: string;
  icon: typeof Building2;
  type: "input" | "select" | "multi-select";
  field: string;
  placeholder?: string;
  options?: { value: string; label: string; icon?: string }[];
}

const steps: StepConfig[] = [
  {
    id: "company",
    question: "What's your company name?",
    subtitle: "We'll personalize your workspace around your brand.",
    icon: Building2,
    type: "input",
    field: "companyName",
    placeholder: "e.g. Acme Corporation",
  },
  {
    id: "size",
    question: "How many employees does your company have?",
    subtitle: "This helps us tailor the right features for your team size.",
    icon: Users,
    type: "select",
    field: "companySize",
    options: [
      { value: "1-10", label: "1–10" },
      { value: "11-50", label: "11–50" },
      { value: "51-200", label: "51–200" },
      { value: "201-1000", label: "201–1,000" },
      { value: "1000+", label: "1,000+" },
    ],
  },
  {
    id: "industry",
    question: "What industry are you in?",
    subtitle: "We'll pre-configure pipelines and templates for your sector.",
    icon: Briefcase,
    type: "select",
    field: "industry",
    options: [
      { value: "saas", label: "SaaS / Software" },
      { value: "agency", label: "Agency / Consulting" },
      { value: "ecommerce", label: "E-Commerce" },
      { value: "fintech", label: "Fintech" },
      { value: "healthcare", label: "Healthcare" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "real-estate", label: "Real Estate" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "role",
    question: "What's your role?",
    subtitle: "So we can surface the most relevant modules first.",
    icon: Target,
    type: "select",
    field: "role",
    options: [
      { value: "founder", label: "Founder / CEO" },
      { value: "sales", label: "Sales Leader" },
      { value: "marketing", label: "Marketing" },
      { value: "ops", label: "Operations" },
      { value: "engineering", label: "Engineering" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "goals",
    question: "What do you want to achieve?",
    subtitle: "Select all that apply. We'll prioritize these in your dashboard.",
    icon: Target,
    type: "multi-select",
    field: "goals",
    options: [
      { value: "pipeline", label: "Manage Sales Pipeline" },
      { value: "contacts", label: "Organize Contacts" },
      { value: "email", label: "Email Campaigns" },
      { value: "invoicing", label: "Invoicing" },
      { value: "reporting", label: "Analytics & Reporting" },
      { value: "automation", label: "Workflow Automation" },
    ],
  },
  {
    id: "source",
    question: "How did you hear about us?",
    subtitle: "Just curious — helps us improve our outreach.",
    icon: Megaphone,
    type: "select",
    field: "source",
    options: [
      { value: "google", label: "Google Search" },
      { value: "social", label: "Social Media" },
      { value: "referral", label: "Friend / Colleague" },
      { value: "blog", label: "Blog / Article" },
      { value: "event", label: "Conference / Event" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "website",
    question: "What's your company website?",
    subtitle: "Optional — we'll try to auto-import your branding.",
    icon: Globe,
    type: "input",
    field: "website",
    placeholder: "e.g. https://acme.com",
  },
];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string | string[]>>({});
  const [direction, setDirection] = useState(1);

  const current = steps[step];
  const value = data[current.field] ?? (current.type === "multi-select" ? [] : "");

  const canProceed =
    current.type === "multi-select"
      ? (value as string[]).length > 0
      : typeof value === "string" && value.trim().length > 0;

  const isLast = step === steps.length - 1;

  const goNext = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const toggleMulti = (val: string) => {
    const arr = (data[current.field] as string[]) || [];
    setData({
      ...data,
      [current.field]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-citrus-lime/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-citrus-lemon/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Command className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground tracking-tight">Citron OS</span>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-surface-3"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Icon + Question */}
            <div>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <current.icon className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground tracking-tight">{current.question}</h2>
              <p className="text-sm text-muted-foreground mt-1">{current.subtitle}</p>
            </div>

            {/* Input */}
            {current.type === "input" && (
              <input
                autoFocus
                value={(value as string) || ""}
                onChange={(e) => setData({ ...data, [current.field]: e.target.value })}
                placeholder={current.placeholder}
                onKeyDown={(e) => e.key === "Enter" && canProceed && goNext()}
                className="w-full bg-surface-1 border border-border rounded-xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            )}

            {/* Select */}
            {current.type === "select" && (
              <div className="grid grid-cols-2 gap-2">
                {current.options?.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setData({ ...data, [current.field]: opt.value })}
                    className={`px-4 py-3 rounded-xl text-sm text-left transition-all border ${
                      value === opt.value
                        ? "bg-primary/10 border-primary text-foreground"
                        : "bg-surface-1 border-border text-muted-foreground hover:border-border hover:bg-surface-2"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Multi-select */}
            {current.type === "multi-select" && (
              <div className="grid grid-cols-2 gap-2">
                {current.options?.map((opt) => {
                  const selected = (value as string[]).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleMulti(opt.value)}
                      className={`px-4 py-3 rounded-xl text-sm text-left transition-all border flex items-center gap-2 ${
                        selected
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-surface-1 border-border text-muted-foreground hover:bg-surface-2"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          selected ? "bg-primary border-primary" : "border-border"
                        }`}
                      >
                        {selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                      </div>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
          <div className="flex items-center gap-3">
            {!isLast && (
              <button
                onClick={goNext}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!canProceed && !isLast}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              {isLast ? (
                <>
                  <Sparkles className="w-3 h-3" />
                  Launch Citron OS
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
