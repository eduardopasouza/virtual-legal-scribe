
import React from 'react';
import { AgentInteraction } from '@/components/AgentInteraction';
import { CaseTimeline } from './CaseTimeline';
import { CaseAlerts } from './CaseAlerts';
import { DocumentUploader } from '@/components/DocumentUploader';
import { Alert, WorkflowStage } from '@/types/case';
import { useQueryClient } from '@tanstack/react-query';

interface CaseSummaryTabProps {
  caseId: string;
  workflowStages: WorkflowStage[];
  alerts: Alert[];
}

export function CaseSummaryTab({ caseId, workflowStages, alerts }: CaseSummaryTabProps) {
  const queryClient = useQueryClient();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <CaseTimeline stages={workflowStages} />
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
