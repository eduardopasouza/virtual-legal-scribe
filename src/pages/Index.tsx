
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DashboardStats } from '@/components/DashboardStats';
import { AgentsList } from '@/components/AgentsList';
import { WorkflowTimeline } from '@/components/WorkflowTimeline';
import { WorkflowStages } from '@/components/WorkflowStages';
import { AgentDetails } from '@/components/AgentDetails';
import { DocumentUploader } from '@/components/DocumentUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Folder } from "lucide-react";

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'new-case'>('dashboard');
  
  // Handler for creating a new case
  const handleNewCase = () => {
    setCurrentView('new-case');
  };
  
  // Handler for going back to dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedAgent(null);
  };

  // Content for the new case view
  const renderNewCaseView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-serif text-3xl font-bold text-evji-primary">Novo Caso</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentUploader />
        <WorkflowTimeline />
      </div>
    </div>
  );
  
  // Content for the dashboard view
  const renderDashboardView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-3xl font-bold text-evji-primary">Dashboard</h2>
        <Button className="bg-evji-primary hover:bg-evji-primary/90" onClick={handleNewCase}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Caso
        </Button>
      </div>
      
      {/* Stats */}
      <DashboardStats />
      
      {/* Tabs para facilitar navegação entre visões */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="agents">Agentes de IA</TabsTrigger>
          <TabsTrigger value="workflow">Fluxo de Trabalho</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <AgentsList onAgentSelect={(agentId) => setSelectedAgent(agentId)} />
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              <WorkflowTimeline />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-6">
          {selectedAgent ? (
            <AgentDetails agentId={selectedAgent} onBack={() => setSelectedAgent(null)} />
          ) : (
            <AgentsList expanded onAgentSelect={(agentId) => setSelectedAgent(agentId)} />
          )}
        </TabsContent>
        
        <TabsContent value="workflow" className="space-y-6">
          <WorkflowStages />
        </TabsContent>
      </Tabs>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {currentView === 'dashboard' ? renderDashboardView() : renderNewCaseView()}
        </main>
      </div>
    </div>
  );
};

export default Index;
