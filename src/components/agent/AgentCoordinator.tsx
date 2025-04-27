
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAgentSimulation } from '@/hooks/useAgentSimulation';
import { WorkflowStage } from '@/workflow';
import { useWorkflow } from '@/hooks/useWorkflow';

interface AgentCoordinatorProps {
  caseId: string;
  workflowStages?: WorkflowStage[];
}

export function AgentCoordinator({ caseId, workflowStages }: AgentCoordinatorProps) {
  const { simulateAgent, isProcessing: isAgentProcessing } = useAgentSimulation(caseId);
  const { 
    currentStage,
    stages,
    isLoading: isWorkflowLoading,
    advanceWorkflow,
    getRecommendedAgent
  } = useWorkflow(caseId);

  // Determine next agent to trigger based on current stage
  const nextAgentToTrigger = currentStage ? getRecommendedAgent() : null;

  const triggerCurrentAgent = async () => {
    if (!nextAgentToTrigger || !currentStage) return;
    
    try {
      // Trigger the appropriate agent
      await simulateAgent(nextAgentToTrigger);
    } catch (error) {
      console.error("Error executing agent:", error);
    }
  };

  if (isWorkflowLoading) {
    return (
      <Card className="border-dashed border-muted">
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Carregando coordenação...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Coordenador de Agentes</span>
          {currentStage && (
            <Badge variant="outline" className="ml-2">
              Etapa atual: {currentStage.stage_name}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Coordena o fluxo de trabalho e o acionamento de agentes em cada etapa
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!currentStage ? (
          <div className="p-4 text-center border rounded-md border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900">
            <AlertTriangle className="h-6 w-6 mx-auto text-yellow-600 dark:text-yellow-400" />
            <p className="mt-2 text-sm">Nenhuma etapa em andamento. Inicie o processo ou verifique o status do caso.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 border rounded-md bg-muted/20">
              <h4 className="text-sm font-medium mb-1">Status do Workflow:</h4>
              <div className="flex gap-2 flex-wrap">
                {stages?.map((stage) => (
                  <Badge 
                    key={stage.id}
                    variant={stage.status === 'completed' ? 'default' : 
                            stage.status === 'in_progress' ? 'secondary' : 'outline'}
                    className="flex items-center gap-1"
                  >
                    {stage.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                    {stage.status === 'in_progress' && <Loader2 className="h-3 w-3 animate-spin" />}
                    {stage.stage_name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="p-3 border rounded-md bg-muted/20">
              <h4 className="text-sm font-medium mb-1">Próximo agente recomendado:</h4>
              {nextAgentToTrigger ? (
                <div className="flex items-center justify-between">
                  <Badge className="capitalize">{nextAgentToTrigger.replace('-', ' ')}</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={isAgentProcessing[nextAgentToTrigger]}
                    onClick={triggerCurrentAgent}
                    className="flex items-center gap-1"
                  >
                    {isAgentProcessing[nextAgentToTrigger] ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Executando...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-3 w-3" />
                        Acionar
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum agente recomendado para a etapa atual
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
        <span>Última atualização: {new Date().toLocaleTimeString()}</span>
        {currentStage && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => advanceWorkflow.mutate()}
            disabled={advanceWorkflow.isPending}
          >
            {advanceWorkflow.isPending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Avançando...
              </>
            ) : (
              'Avançar Etapa'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
