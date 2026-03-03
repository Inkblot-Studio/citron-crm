import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { EntityCard } from "../cards/EntityCard";
import { IntelligenceCard } from "../cards/IntelligenceCard";

export interface CanvasBlock {
  id: string;
  type: "text" | "entity" | "intelligence" | "loading";
  content?: string;
}

interface CanvasContextType {
  blocks: CanvasBlock[];
  addBlocks: (blocks: CanvasBlock[]) => void;
  clearBlocks: () => void;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export function useCanvas() {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used within CanvasProvider");
  return ctx;
}

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<CanvasBlock[]>([
    { id: "welcome-1", type: "text", content: "Welcome to Citron OS. Use the AI chat on the right to interact with your revenue engine." },
    { id: "welcome-2", type: "entity" },
    { id: "welcome-3", type: "intelligence" },
  ]);

  const addBlocks = useCallback((newBlocks: CanvasBlock[]) => {
    setBlocks((prev) => [...prev, ...newBlocks]);
  }, []);

  const clearBlocks = useCallback(() => setBlocks([]), []);

  return (
    <CanvasContext.Provider value={{ blocks, addBlocks, clearBlocks }}>
      {children}
    </CanvasContext.Provider>
  );
}
