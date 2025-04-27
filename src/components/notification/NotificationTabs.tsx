
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Briefcase, Calendar, FileText } from 'lucide-react';

interface NotificationTabsProps {
  activeTab: string;
}

export function NotificationTabs({ activeTab }: NotificationTabsProps) {
  return (
    <TabsList className="grid grid-cols-5 w-full bg-transparent">
      <TabsTrigger 
        value="all" 
        className={`${activeTab === 'all' ? 'border-b-2 border-primary rounded-none' : ''}`}
      >
        <Bell className="h-4 w-4 mr-1 md:mr-2" />
        <span className="hidden md:inline">Todos</span>
      </TabsTrigger>
      <TabsTrigger 
        value="case" 
        className={`${activeTab === 'case' ? 'border-b-2 border-primary rounded-none' : ''}`}
      >
        <Briefcase className="h-4 w-4 mr-1 md:mr-2" />
        <span className="hidden md:inline">Casos</span>
      </TabsTrigger>
      <TabsTrigger 
        value="deadline" 
        className={`${activeTab === 'deadline' ? 'border-b-2 border-primary rounded-none' : ''}`}
      >
        <Calendar className="h-4 w-4 mr-1 md:mr-2" />
        <span className="hidden md:inline">Prazos</span>
      </TabsTrigger>
      <TabsTrigger 
        value="document" 
        className={`${activeTab === 'document' ? 'border-b-2 border-primary rounded-none' : ''}`}
      >
        <FileText className="h-4 w-4 mr-1 md:mr-2" />
        <span className="hidden md:inline">Docs</span>
      </TabsTrigger>
      <TabsTrigger 
        value="system" 
        className={`${activeTab === 'system' ? 'border-b-2 border-primary rounded-none' : ''}`}
      >
        <svg className="h-4 w-4 mr-1 md:mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
        </svg>
        <span className="hidden md:inline">Sistema</span>
      </TabsTrigger>
    </TabsList>
  );
}
