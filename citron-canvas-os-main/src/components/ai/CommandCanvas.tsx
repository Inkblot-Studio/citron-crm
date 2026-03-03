import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EntityCard } from "../cards/EntityCard";
import { IntelligenceCard } from "../cards/IntelligenceCard";
import { useCanvas } from "./CanvasContext";

export function CommandCanvas() {
  const { blocks } = useCanvas();

  return (
    <div className="flex flex-col h-full">
      <header className="px-8 py-5 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Command Canvas
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            AI-native interface — results appear here
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-citrus-lime" />
          System ready
        </div>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence mode="popLayout">
            {blocks.map((block) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {block.type === "text" && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed pt-0.5">
                      {block.content}
                    </p>
                  </div>
                )}
                {block.type === "entity" && <EntityCard />}
                {block.type === "intelligence" && <IntelligenceCard />}
                {block.type === "loading" && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                    </div>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-8 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          Citron OS v1.0 · AI-native Revenue & Operations Platform
        </p>
      </div>
    </div>
  );
}
