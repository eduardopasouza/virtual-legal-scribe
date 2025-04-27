
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import { queryClient } from "./lib/react-query/queryClient";
import { MobileProvider } from "./hooks/use-mobile";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Cases from "./pages/Cases";
import CaseDetails from "./pages/CaseDetails";
import NovoCaso from "./pages/NovoCaso";
import WebChatPage from "./pages/WebChatPage";
import Calendar from "./pages/Calendar";
import ClientsList from "./pages/ClientsList";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import ActivityHistory from "./pages/ActivityHistory";
import SearchPage from "./pages/SearchPage";
import DocumentsPage from "./pages/DocumentsPage";
import NotFound from "./pages/NotFound";

// Styles
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <MobileProvider>
          <Toaster richColors closeButton position="top-right" />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/case/:caseId" element={<CaseDetails />} />
              <Route path="/novo-caso" element={<NovoCaso />} />
              <Route path="/webchat" element={<WebChatPage />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/activity-history" element={<ActivityHistory />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </MobileProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
