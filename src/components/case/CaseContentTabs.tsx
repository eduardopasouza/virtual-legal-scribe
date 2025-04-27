import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText, MessageSquare, Calendar, Users, Bell, Info } from 'lucide-react';
import { CaseDocuments } from './CaseDocuments';
import { CaseTimeline } from './CaseTimeline';
import { CaseAlerts } from './CaseAlerts';
import { CaseActivities } from './CaseActivities';
import { CaseDeadlines } from './CaseDeadlines';
import { CasePeople } from './CasePeople';
import { AgentChat } from '@/components/AgentChat';
import { DocumentMetadata } from '@/hooks/useDocuments';
import { Alert, Activity, Deadline, WorkflowStage } from '@/types/case';
import { CaseSummaryTab } from './CaseSummaryTab';

interface CaseContentTabsProps {
  caseId: string;
  activities: Activity[];
  deadlines: Deadline[];
  workflowStages: WorkflowStage[];
  alerts: Alert[];
  documents: DocumentMetadata[];
}

export function CaseContentTabs({
  caseId,
  activities,
  deadlines,
  workflowStages,
  alerts,
  documents
}: CaseContentTabsProps) {
  const [activeTab, setActiveTab] = React.useState('summary');

  return (
    <Tabs 
      defaultValue="summary" 
      value={activeTab}
      onValueChange={setActiveTab} 
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
        <TabsTrigger value="alerts">
          <Bell className="h-4 w-4 mr-2" />
          Alertas {alerts.length > 0 && <span className="ml-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center">{alerts.length}</span>}
        </TabsTrigger>
        <TabsTrigger value="activities">
          <MessageSquare className="h-4 w-4 mr-2" />
          Atividades
        </TabsTrigger>
        <TabsTrigger value="deadlines">
          <Calendar className="h-4 w-4 mr-2" />
          Prazos
        </TabsTrigger>
        <TabsTrigger value="people">
          <Users className="h-4 w-4 mr-2" />
          Pessoas
        </TabsTrigger>
        <TabsTrigger value="agentchat">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat com Agentes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
        <CaseSummaryTab
          caseId={caseId}
          workflowStages={workflowStages}
          alerts={alerts}
        />
      </TabsContent>

      <TabsContent value="documents">
        <CaseDocuments caseId={caseId} />
      </TabsContent>

      <TabsContent value="timeline">
        <CaseTimeline stages={workflowStages} />
      </TabsContent>

      <TabsContent value="alerts">
        <CaseAlerts alerts={alerts} />
      </TabsContent>

      <TabsContent value="activities">
        <CaseActivities activities={activities} />
      </TabsContent>

      <TabsContent value="deadlines">
        <CaseDeadlines deadlines={deadlines} />
      </TabsContent>

      <TabsContent value="people">
        <CasePeople />
      </TabsContent>

      <TabsContent value="agentchat">
        <div className="h-[600px]">
          <AgentChat caseId={caseId} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
