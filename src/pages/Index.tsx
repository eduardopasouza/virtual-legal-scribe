
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DashboardStats } from '@/components/DashboardStats';
import { DocumentUploader } from '@/components/DocumentUploader';
import { AgentsList } from '@/components/AgentsList';
import { RecentDocuments } from '@/components/RecentDocuments';
import { WorkflowTimeline } from '@/components/WorkflowTimeline';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-evji-primary">Dashboard</h2>
            
            {/* Stats */}
            <DashboardStats />
            
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                <DocumentUploader />
                <AgentsList />
                <RecentDocuments />
              </div>
              
              {/* Right column */}
              <div className="space-y-6">
                <WorkflowTimeline />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
