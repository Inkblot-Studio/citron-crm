import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { EmailBlock } from "./EmailBlockEditor";

const promptSuggestions = [
  "Write a product launch announcement for a SaaS tool",
  "Create a re-engagement email for churned users",
  "Draft a welcome email for new customers",
  "Write a quarterly business review summary",
  "Create a seasonal promotion email with urgency",
];

interface AIEmailGeneratorProps {
  onGenerate: (blocks: EmailBlock[]) => void;
}

export function AIEmailGenerator({ onGenerate }: AIEmailGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    // Simulate AI generation → produces blocks
    setTimeout(() => {
      const blocks: EmailBlock[] = [
        { id: `ai-${Date.now()}-1`, type: "heading", content: "Exciting News from Our Team" },
        {
          id: `ai-${Date.now()}-2`,
          type: "text",
          content:
            "We're thrilled to share something we've been working on. Based on your prompt, here's a professionally crafted email that's ready to customize and send.",
        },
        { id: `ai-${Date.now()}-3`, type: "image", content: "" },
        {
          id: `ai-${Date.now()}-4`,
          type: "text",
          content:
            "Our latest updates are designed to help you achieve more with less effort. We've listened to your feedback and built features that truly make a difference.",
        },
        { id: `ai-${Date.now()}-5`, type: "button", content: "Learn More" },
        { id: `ai-${Date.now()}-6`, type: "divider", content: "" },
        {
          id: `ai-${Date.now()}-7`,
          type: "text",
          content: "Best regards,\nThe Team",
        },
      ];
      onGenerate(blocks);
      setIsGenerating(false);
      setGenerated(true);
      setTimeout(() => setGenerated(false), 2000);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-citrus-lemon" />
        <span className="text-xs font-medium text-foreground">AI Email Generator</span>
      </div>

      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the email you want to create…"
          rows={3}
          className="w-full bg-surface-1 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
        <div className="flex flex-wrap gap-1.5">
          {promptSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              className="px-2.5 py-1 rounded-md bg-secondary text-[10px] text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-citrus-lemon/10 text-citrus-lemon text-xs font-medium hover:bg-citrus-lemon/20 transition-colors disabled:opacity-40"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating…
            </>
          ) : generated ? (
            <>
              <Check className="w-3 h-3" />
              Applied to Editor
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              Generate Email
            </>
          )}
        </button>
      </div>
    </div>
  );
}
