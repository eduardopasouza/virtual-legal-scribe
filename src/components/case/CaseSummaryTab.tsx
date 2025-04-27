
import React from 'react';
import { AgentInteraction } from '@/components/AgentInteraction';
import { CaseTimeline } from './CaseTimeline';
import { CaseAlerts } from './CaseAlerts';
import { DocumentUploader } from '@/components/DocumentUploader';
import { Alert } from '@/types/case';
import { useQueryClient } from '@tanstack/react-query';
import { AgentCoordinator } from '@/components/agent/AgentCoordinator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WorkflowStage } from '@/types/workflow';
import { mapWorkflowStatus } from '@/types/workflow';

interface CaseSummaryTabProps {
  caseId: string;
  workflowStages: WorkflowStage[];
  alerts: Alert[];
}

export function CaseSummaryTab({ caseId, workflowStages, alerts }: CaseSummaryTabProps) {
  const queryClient = useQueryClient();
  const mappedWorkflowStages = workflowStages.map(stage => ({
    ...stage,
    status: mapWorkflowStatus(stage.status)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Fluxo do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <CaseTimeline stages={workflowStages} />
          </CardContent>
        </Card>
        
        <AgentCoordinator caseId={caseId} workflowStages={workflowStages} />
        
        <Separator className="my-6" />
        
        <AgentInteraction caseId={caseId} />
        {alerts.length > 0 && <CaseAlerts alerts={alerts} />}
      </div>
      
      <div className="lg:col-span-4">
        <DocumentUploader caseId={caseId} onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
        }} />
      </div>
    </div>
  );
}
