
import React from 'react';
import { AgentInteraction } from '@/components/AgentInteraction';
import { CaseTimeline } from './CaseTimeline';
import { CaseAlerts } from './CaseAlerts';
import { DocumentUploader } from '@/components/DocumentUploader';
import { Alert, WorkflowStage as CaseWorkflowStage } from '@/types/case';
import { useQueryClient } from '@tanstack/react-query';
import { AgentCoordinator } from '@/components/agent/AgentCoordinator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mapWorkflowStatus } from '@/types/workflow';
import { CaseStrategy } from './CaseStrategy';
import { CaseFacts } from './CaseFacts';
import { useFactsAnalysis } from '@/hooks/workflow';
import { CaseDrafts } from './CaseDrafts';
import { CaseAdvancedAnalysis } from './CaseAdvancedAnalysis';

interface CaseSummaryTabProps {
  caseId: string;
  workflowStages: CaseWorkflowStage[];
  alerts: Alert[];
  objective?: string;
}

export function CaseSummaryTab({ 
  caseId, 
  workflowStages, 
  alerts,
  objective 
}: CaseSummaryTabProps) {
  const queryClient = useQueryClient();
  const { factsAnalysis, isLoading: isLoadingFacts, executeFactsAnalysis } = useFactsAnalysis(caseId);
  
  const mappedWorkflowStages = workflowStages.map(stage => ({
    ...stage,
    status: mapWorkflowStatus(stage.status)
  }));

  // Mock strategy data for demonstration (in a real app, this would come from the API)
  const mockStrategyData = {
    mainThesis: 'Abordagem baseada na violação contratual com foco em restituição econômica',
    objectives: [
      'Demonstrar descumprimento dos termos contratuais',
      'Estabelecer nexo causal entre violação e danos'
    ],
    risks: [
      'Documentação insuficiente para comprovar danos',
      'Possível alegação de força maior pela contraparte'
    ],
    recommendations: [
      'Priorizar argumentos de boa-fé contratual',
      'Focar em jurisprudência favorável identificada na pesquisa'
    ],
    currentPhase: 'intermediate' as 'initial' | 'intermediate' | 'final'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        {objective && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Objetivo do Caso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{objective}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Facts Analysis Section */}
        <CaseFacts 
          analysisData={factsAnalysis} 
          isLoading={isLoadingFacts} 
        />
        
        <CaseStrategy strategyData={mockStrategyData} />
        
        {/* Advanced Layers Analysis Section */}
        <CaseAdvancedAnalysis caseId={caseId} />
        
        {/* Document Drafting Section */}
        <CaseDrafts caseId={caseId} />
        
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
