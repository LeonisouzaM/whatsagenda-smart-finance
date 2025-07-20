import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthPage } from "@/components/auth/AuthPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Agenda } from "@/pages/Agenda";
import { Finances } from "@/pages/Finances";
import { AISuggestions } from "@/pages/AISuggestions";
import { WhatsApp } from "@/pages/WhatsApp";
import { Profile } from "@/pages/Profile";
import { Subscription } from "@/pages/Subscription";
import { Support } from "@/pages/Support";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/agenda" element={<DashboardLayout><Agenda /></DashboardLayout>} />
            <Route path="/finances" element={<DashboardLayout><Finances /></DashboardLayout>} />
            <Route path="/ai-suggestions" element={<DashboardLayout><AISuggestions /></DashboardLayout>} />
            <Route path="/whatsapp" element={<DashboardLayout><WhatsApp /></DashboardLayout>} />
            <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
            <Route path="/subscription" element={<DashboardLayout><Subscription /></DashboardLayout>} />
            <Route path="/support" element={<DashboardLayout><Support /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
