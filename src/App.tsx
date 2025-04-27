import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode } from "react";
import { MobileProvider } from "@/hooks/use-mobile";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { queryClient } from "@/lib/react-query/queryClient";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Cases from "./pages/Cases";
import CaseDetails from "./pages/CaseDetails";
import ClientsList from "./pages/ClientsList";
import AdvancedStats from "./pages/AdvancedStats";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import SearchPage from "./pages/SearchPage";
import ActivityHistory from "./pages/ActivityHistory";
import NovoCaso from "./pages/NovoCaso";
import WebChatPage from "./pages/WebChatPage";
import Statistics from "./pages/Statistics";
import { FloatingChatButton } from "./components/FloatingChatButton";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-evji-primary"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
}

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <MobileProvider>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Navigate to="/auth" />} />
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/cases/:caseId" 
                    element={
                      <ProtectedRoute>
                        <CaseDetails />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/casos/:caseId" 
                    element={<Navigate to={`/cases/${window.location.pathname.split('/').pop()}`} />} 
                  />
                  <Route 
                    path="/cases/list" 
                    element={
                      <ProtectedRoute>
                        <Cases />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/novo-caso" 
                    element={
                      <ProtectedRoute>
                        <NovoCaso />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/clients" 
                    element={
                      <ProtectedRoute>
                        <ClientsList />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/stats" 
                    element={
                      <ProtectedRoute>
                        <AdvancedStats />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/calendar" 
                    element={
                      <ProtectedRoute>
                        <Calendar />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/search" 
                    element={
                      <ProtectedRoute>
                        <SearchPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/history" 
                    element={
                      <ProtectedRoute>
                        <ActivityHistory />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/webchat" 
                    element={
                      <ProtectedRoute>
                        <WebChatPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <FloatingChatButton />
              </MobileProvider>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
