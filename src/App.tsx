import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { MobileProvider } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import CaseDetails from "./pages/CaseDetails";
import ClientsList from "./pages/ClientsList";
import AdvancedStats from "./pages/AdvancedStats";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import SearchPage from "./pages/SearchPage";
import ActivityHistory from "./pages/ActivityHistory";
import NovoCaso from "./pages/NovoCaso";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <MobileProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />
                <Route path="/cases/:caseId" element={<CaseDetails />} />
                <Route path="/cases/list" element={<Index />} />
                <Route path="/novo-caso" element={<NovoCaso />} />
                <Route path="/clients" element={<ClientsList />} />
                <Route path="/stats" element={<AdvancedStats />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/history" element={<ActivityHistory />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MobileProvider>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
