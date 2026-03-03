import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Check, Command } from "lucide-react";

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='sidebar']",
    title: "Navigation Sidebar",
    description: "Access all CRM modules from this sidebar. Each icon represents a different module — Deals, Contacts, Campaigns, and more.",
    position: "right",
  },
  {
    target: "[data-tour='canvas']",
    title: "AI Command Canvas",
    description: "This is your AI-powered command center. Chat with the system to manage deals, create emails, generate reports, and control your entire CRM.",
    position: "bottom",
  },
  {
    target: "[data-tour='event-feed']",
    title: "Real-Time Event Feed",
    description: "Stay on top of everything. This feed shows live system events — new deals, invoice updates, email opens, and team activity in real time.",
    position: "left",
  },
  {
    target: "[data-tour='nav-deals']",
    title: "Deals Pipeline",
    description: "Track and manage your sales pipeline. View deal stages, confidence scores, and revenue forecasts at a glance.",
    position: "right",
  },
  {
    target: "[data-tour='nav-contacts']",
    title: "Contacts Directory",
    description: "Your complete contact database with relationship scoring, organization mapping, and engagement tracking.",
    position: "right",
  },
  {
    target: "[data-tour='nav-campaigns']",
    title: "Email Campaigns",
    description: "Create and send email campaigns with AI-powered templates, a drag-and-drop editor, and detailed analytics.",
    position: "right",
  },
  {
    target: "[data-tour='nav-invoices']",
    title: "Invoices",
    description: "Generate professional invoices using AI. Just describe the work and the system handles the rest.",
    position: "right",
  },
  {
    target: "[data-tour='system-status']",
    title: "System Status",
    description: "This indicator shows your platform status. Green means all systems are operational. You're all set!",
    position: "right",
  },
];

interface GuidedTourProps {
  onComplete: () => void;
}

export function GuidedTour({ onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = tourSteps[currentStep];

  const updateRect = useCallback(() => {
    const el = document.querySelector(step.target);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [step.target]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [updateRect]);

  const next = () => {
    if (currentStep === tourSteps.length - 1) {
      onComplete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const prev = () => setCurrentStep((s) => Math.max(0, s - 1));

  const isLast = currentStep === tourSteps.length - 1;

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    const gap = 16;
    const tooltipWidth = 320;

    switch (step.position) {
      case "right":
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + gap,
          transform: "translateY(-50%)",
        };
      case "left":
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - gap - tooltipWidth,
          transform: "translateY(-50%)",
        };
      case "bottom":
        return {
          top: targetRect.bottom + gap,
          left: targetRect.left + targetRect.width / 2,
          transform: "translateX(-50%)",
        };
      case "top":
        return {
          top: targetRect.top - gap,
          left: targetRect.left + targetRect.width / 2,
          transform: "translate(-50%, -100%)",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Overlay with spotlight */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.75)"
          mask="url(#tour-mask)"
          style={{ pointerEvents: "all" }}
        />
      </svg>

      {/* Spotlight border glow */}
      {targetRect && (
        <div
          className="absolute rounded-xl border-2 border-primary/50 pointer-events-none"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            boxShadow: "0 0 30px hsl(var(--primary) / 0.2)",
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{ ...getTooltipStyle(), position: "absolute", width: 320, zIndex: 210 }}
          className="glass rounded-xl p-5 shadow-lg"
        >
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
            <button
              onClick={onComplete}
              className="p-1 rounded hover:bg-secondary/50 transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-1.5">{step.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>

          {/* Progress dots */}
          <div className="flex gap-1 mt-4 mb-3">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? "bg-primary" : "bg-surface-3"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prev}
              disabled={currentStep === 0}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
            <button
              onClick={next}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              {isLast ? (
                <>
                  <Check className="w-3 h-3" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
