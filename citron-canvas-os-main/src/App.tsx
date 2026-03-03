import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InvoicesPage from "./pages/InvoicesPage";
import EmailCampaignsPage from "./pages/EmailCampaignsPage";
import ContactsPage from "./pages/ContactsPage";
import TasksPage from "./pages/TasksPage";
import SettingsPage from "./pages/SettingsPage";
import { OnboardingWizard } from "./components/onboarding/OnboardingWizard";
import { GuidedTour } from "./components/onboarding/GuidedTour";

const queryClient = new QueryClient();

const App = () => {
  const [onboardingDone, setOnboardingDone] = useState(() => {
    return localStorage.getItem("citron-onboarding-done") === "true";
  });
  const [tourActive, setTourActive] = useState(false);

  const handleOnboardingComplete = () => {
    localStorage.setItem("citron-onboarding-done", "true");
    setOnboardingDone(true);
    setTourActive(true);
  };

  const handleTourComplete = () => {
    localStorage.setItem("citron-tour-done", "true");
    setTourActive(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!onboardingDone && <OnboardingWizard onComplete={handleOnboardingComplete} />}
        <BrowserRouter>
          {tourActive && <GuidedTour onComplete={handleTourComplete} />}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/campaigns" element={<EmailCampaignsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
