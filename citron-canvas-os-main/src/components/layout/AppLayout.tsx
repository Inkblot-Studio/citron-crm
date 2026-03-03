import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { RightPanel } from "../ai/RightPanel";
import { CanvasProvider } from "../ai/CanvasContext";

interface AppLayoutProps {
  children: ReactNode;
  showRightPanel?: boolean;
}

export function AppLayout({ children, showRightPanel = false }: AppLayoutProps) {
  return (
    <CanvasProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto hide-scrollbar" data-tour="canvas">
            {children}
          </div>
          {showRightPanel && (
            <div className="w-80 border-l border-border overflow-hidden flex flex-col" data-tour="right-panel">
              <RightPanel />
            </div>
          )}
        </main>
      </div>
    </CanvasProvider>
  );
}
