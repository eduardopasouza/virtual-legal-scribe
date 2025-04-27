
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AgentAccuracyChart } from '../AgentAccuracyChart';
import { WorkflowAnalysisChart } from '../WorkflowAnalysisChart';
import { AgentMetrics, WorkflowMetrics } from '@/types/statistics';

interface AgentsAnalysisTabProps {
  agentMetrics?: AgentMetrics[];
  workflowMetrics?: WorkflowMetrics[];
  isLoading: boolean;
}

export const AgentsAnalysisTab = ({
  agentMetrics,
  workflowMetrics,
  isLoading
}: AgentsAnalysisTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho de Agentes</CardTitle>
        <CardDescription>
          Análise detalhada do desempenho de cada agente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AgentAccuracyChart data={agentMetrics} isLoading={isLoading} />
          <WorkflowAnalysisChart data={workflowMetrics} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
};
