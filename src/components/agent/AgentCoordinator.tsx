
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle, ArrowRight, Info, FileX } from 'lucide-react';
import { AgentType } from '@/hooks/agent/types';
import { WorkflowStage } from '@/workflow';
import { useWorkflow } from '@/hooks/useWorkflow';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    getRecommendedAgent,
    verifyStageCompleteness,
    logWorkflowProgress
  } = useWorkflow(caseId);
  
  const [verificationStatus, setVerificationStatus] = useState<{
    checking: boolean;
    result?: { complete: boolean; missingItems: string[] };
  }>({
    checking: false
  });

  // Determine next agent to trigger based on current stage
  const nextAgentToTrigger = currentStage ? getRecommendedAgent() : null;
  
  // Fetch the current stage configuration
  const currentStageConfig = currentStage?.stage_name 
    ? stages.find(s => s.stage_name === currentStage.stage_name)
    : null;

  // Effect to log coordinator activity when stages change
  useEffect(() => {
    if (caseId && stages?.length > 0) {
      const completedStages = stages.filter(s => s.status === 'completed').length;
      const totalStages = stages.length;
      
      logWorkflowProgress(
        `Status do fluxo: ${completedStages}/${totalStages} etapas concluídas`,
        { completedStages, totalStages }
      );
    }
  }, [caseId, stages?.length]);

  const triggerCurrentAgent = async () => {
    if (!nextAgentToTrigger || !currentStage) return;
    
    try {
      // Log the operation
      await logWorkflowProgress(
        `Acionando agente ${nextAgentToTrigger} para etapa ${currentStage.stage_name}`,
        { agent: nextAgentToTrigger, stage: currentStage.stage_name }
      );
      
      // Trigger the appropriate agent
      await simulateAgent(nextAgentToTrigger);
    } catch (error) {
      console.error("Error executing agent:", error);
    }
  };

  const checkStageCompleteness = async () => {
    if (!currentStage?.stage_name) return;
    
    setVerificationStatus({ checking: true });
    
    try {
      const result = await verifyStageCompleteness(currentStage.stage_name);
      setVerificationStatus({ checking: false, result });
      
      // Log the verification result
      await logWorkflowProgress(
        `Verificação de completude da etapa ${currentStage.stage_name}`,
        { complete: result.complete, missingItems: result.missingItems }
      );
    } catch (error) {
      console.error("Error checking stage completeness:", error);
      setVerificationStatus({ checking: false });
    }
  };

  const handleAdvanceWorkflow = async () => {
    try {
      // First check if stage is complete
      if (currentStage?.stage_name) {
        const result = await verifyStageCompleteness(currentStage.stage_name);
        
        if (!result.complete) {
          setVerificationStatus({ checking: false, result });
          return; // Don't advance if stage is incomplete
        }
      }
      
      // Proceed with advancing the workflow
      await advanceWorkflow.mutateAsync();
      
      // Reset verification status
      setVerificationStatus({ checking: false });
    } catch (error) {
      console.error("Error advancing workflow:", error);
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
        <div className="flex items-center justify-between">
          <CardTitle>Coordenador de Agentes</CardTitle>
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Sobre o Coordenador</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>O Coordenador de Agentes supervisiona todo o fluxo de trabalho, monitora o progresso de 
                todas as etapas, identifica gargalos e intercorrências, resolve conflitos e valida as entregas 
                antes do envio ao cliente. Ele garante a qualidade e os prazos do processo.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Supervisiona o fluxo de trabalho do caso e orquestra os agentes especializados
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
              <h4 className="text-sm font-medium mb-1">Trilha do Processo:</h4>
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
              <p className="text-xs text-muted-foreground mt-2">
                O coordenador está guiando o caso por uma sequência ordenada de etapas para atingir o objetivo.
              </p>
            </div>
            
            <div className="p-3 border rounded-md bg-muted/20">
              <h4 className="text-sm font-medium mb-1">Etapa atual:</h4>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {currentStage.stage_name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Iniciada em {new Date(currentStage.started_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
              
              {verificationStatus.result && !verificationStatus.result.complete && (
                <Alert variant="destructive" className="mt-3 mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Etapa incompleta</AlertTitle>
                  <AlertDescription>
                    <ul className="text-xs list-disc pl-4 mt-1">
                      {verificationStatus.result.missingItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex items-center gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={checkStageCompleteness}
                  disabled={verificationStatus.checking || !currentStage}
                  className="text-xs"
                >
                  {verificationStatus.checking ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verificar completude
                    </>
                  )}
                </Button>
                
                {verificationStatus.result?.complete && (
                  <span className="text-xs text-green-600 inline-flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Etapa completa
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-3 border rounded-md bg-muted/20">
              <h4 className="text-sm font-medium mb-1">Próxima ação recomendada:</h4>
              {nextAgentToTrigger ? (
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="capitalize">{nextAgentToTrigger.replace('-', ' ')}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Este agente é especializado na etapa atual do processo
                    </p>
                  </div>
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
                  Nenhuma ação recomendada para a etapa atual
                </p>
              )}
            </div>
          </div>
        )}
        
        {currentStage && (
          <>
            <Separator />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Status da coordenação:</p>
              <ul className="space-y-1 pl-1">
                <li className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Monitorando atividades do caso
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Controlando fluxo de etapas
                </li>
                {verificationStatus.result?.complete === false && (
                  <li className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    Detectadas pendências na etapa atual
                  </li>
                )}
                {!nextAgentToTrigger && (
                  <li className="flex items-center gap-1 text-red-500">
                    <FileX className="h-3 w-3" />
                    Nenhum agente disponível para esta etapa
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
        <span>Última atualização: {new Date().toLocaleTimeString()}</span>
        {currentStage && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAdvanceWorkflow}
            disabled={advanceWorkflow.isPending || verificationStatus.checking}
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
