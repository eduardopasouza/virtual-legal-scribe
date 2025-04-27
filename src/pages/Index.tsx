
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DashboardStats } from '@/components/DashboardStats';
import { ChatbotAssistant } from '@/components/ChatbotAssistant';
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { QuickAccess } from '@/components/dashboard/QuickAccess';
import { OngoingActivities } from '@/components/dashboard/OngoingActivities';
import { SystemGuide } from '@/components/dashboard/SystemGuide';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const goToNewCase = () => {
    navigate('/novo-caso');
    toast.success("Iniciando criação de novo caso");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 m-2 hover:bg-accent"
            onClick={() => document.querySelector('.sidebar')?.classList.toggle('hidden')}
            aria-label="Toggle menu"
          >
            <FileText className="h-5 w-5" />
          </Button>
        </div>
        <div className="sidebar hidden lg:block lg:w-64 flex-shrink-0 border-r border-border">
          <Sidebar />
        </div>
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-background p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-sm p-2 -mx-2 z-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-evji-primary">Dashboard</h2>
              <Button 
                className="w-full sm:w-auto bg-evji-primary hover:bg-evji-primary/90 flex items-center gap-2 shadow-sm" 
                onClick={goToNewCase}
              >
                <FileText className="h-4 w-4" />
                Novo Caso
              </Button>
            </div>
            
            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                <QuickAccess />
                <OngoingActivities />
                <SystemGuide />
              </div>
              <div className="space-y-4 lg:space-y-6">
                <DashboardSidebar />
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
      <ChatbotAssistant />
      <Toaster />
    </div>
  );
};

export default Index;
