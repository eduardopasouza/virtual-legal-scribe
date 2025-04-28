
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Calendar, Users, Bell, Info, FileStack } from 'lucide-react';
import { CaseDocuments } from './CaseDocuments';
import { CaseTimeline } from './CaseTimeline';
import { CaseAlerts } from './CaseAlerts';
import { CaseActivities } from './CaseActivities';
import { CaseDeadlines } from './CaseDeadlines';
import { CasePeople } from './CasePeople';
import { DocumentMetadata } from '@/hooks/useDocuments';
import { Alert, Activity, Deadline, WorkflowStage } from '@/types/case';
import { CaseSummaryTab } from './CaseSummaryTab';
import { toast } from "sonner";
import { useLocation } from 'react-router-dom';
import { CaseEventsTimeline } from './CaseEventsTimeline';
import { CaseProceduralTimeline } from './CaseProceduralTimeline';

interface CaseContentTabsProps {
  caseId: string;
  activities: Activity[];
  deadlines: Deadline[];
  workflowStages: WorkflowStage[];
  alerts: Alert[];
  documents: DocumentMetadata[];
  objective?: string;
}

export function CaseContentTabs({
  caseId,
  activities,
  deadlines,
  workflowStages,
  alerts,
  documents,
  objective
}: CaseContentTabsProps) {
  const [activeTab, setActiveTab] = React.useState('summary');
  const location = useLocation();
  
  // Extract tab from URL hash if present
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['summary', 'documents', 'timeline', 'events', 'people', 'procedural'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Update URL hash when tab changes, but prevent auto-scrolling
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL hash without scrolling
    const currentScrollPosition = window.scrollY;
    window.history.replaceState(null, '', `${location.pathname}#${value}`);
    window.scrollTo(0, currentScrollPosition);
    
    // Provide feedback based on tab
    const tabFeedback: Record<string, { title: string, description: string }> = {
      alerts: { 
        title: "Alertas", 
        description: alerts.length > 0 ? `${alerts.length} alertas pendentes` : "Nenhum alerta pendente" 
      },
      documents: { 
        title: "Documentos", 
        description: `${documents.length} documentos disponíveis` 
      },
      events: { 
        title: "Eventos", 
        description: `Atividades, alertas e prazos consolidados` 
      },
      procedural: {
        title: "Movimentação Processual",
        description: "Linha do tempo dos eventos do processo"
      }
    };
    
    if (tabFeedback[value]) {
      toast.info(tabFeedback[value].title, {
        description: tabFeedback[value].description,
        duration: 3000,
        closeButton: true
      });
    }
  };

  return (
    <Tabs 
      value={activeTab}
      onValueChange={handleTabChange} 
      className="mt-6"
    >
      <TabsList className="mb-4 overflow-auto flex-nowrap max-w-full max-md:justify-start">
        <TabsTrigger value="summary">
          <Info className="h-4 w-4 mr-2" />
          Resumo
        </TabsTrigger>
        <TabsTrigger value="documents">
          <FileText className="h-4 w-4 mr-2" />
          Documentos
        </TabsTrigger>
        <TabsTrigger value="timeline">
          <Clock className="h-4 w-4 mr-2" />
          Linha do Tempo
        </TabsTrigger>
        <TabsTrigger value="procedural">
          <FileStack className="h-4 w-4 mr-2" />
          Movimentação
        </TabsTrigger>
        <TabsTrigger value="events">
          <Bell className="h-4 w-4 mr-2" />
          Eventos {alerts.length > 0 && <span className="ml-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center">{alerts.length}</span>}
        </TabsTrigger>
        <TabsTrigger value="people">
          <Users className="h-4 w-4 mr-2" />
          Pessoas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="focus:outline-none">
        <CaseSummaryTab
          caseId={caseId}
          workflowStages={workflowStages}
          alerts={alerts}
          objective={objective}
        />
      </TabsContent>

      <TabsContent value="documents" className="focus:outline-none">
        <CaseDocuments caseId={caseId} />
      </TabsContent>

      <TabsContent value="timeline" className="focus:outline-none">
        <CaseTimeline stages={workflowStages} />
      </TabsContent>
      
      <TabsContent value="procedural" className="focus:outline-none">
        <CaseProceduralTimeline 
          activities={activities}
          deadlines={deadlines}
          documents={documents}
          alerts={alerts}
        />
      </TabsContent>

      <TabsContent value="events" className="focus:outline-none">
        <CaseEventsTimeline 
          activities={activities}
          deadlines={deadlines}
          alerts={alerts}
        />
      </TabsContent>

      <TabsContent value="people" className="focus:outline-none">
        <CasePeople />
      </TabsContent>
    </Tabs>
  );
}
