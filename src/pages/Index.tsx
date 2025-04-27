
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

const Index = () => {
  const navigate = useNavigate();
  const goToNewCase = () => navigate('/novo-caso');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto flex flex-col">
          <div className="space-y-6 flex-1">
            {/* Título do Dashboard */}
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-3xl font-bold text-evji-primary">Dashboard</h2>
              <Button 
                className="bg-evji-primary hover:bg-evji-primary/90 flex items-center gap-2" 
                onClick={goToNewCase}
              >
                <FileText className="h-4 w-4" />
                Novo Caso
              </Button>
            </div>
            
            {/* Estatísticas do Sistema */}
            <DashboardStats />
            
            {/* Layout principal em grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna da esquerda (2/3 da largura) */}
              <div className="lg:col-span-2 space-y-6">
                <QuickAccess />
                <OngoingActivities />
                <SystemGuide />
              </div>
              
              {/* Coluna da direita (1/3 da largura) */}
              <DashboardSidebar />
            </div>
          </div>
          <Footer />
        </main>
      </div>
      <ChatbotAssistant />
    </div>
  );
};

export default Index;
