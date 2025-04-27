
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAgentSimulation } from '@/hooks/useAgentSimulation';
import { WorkflowStage } from '@/types/case';
import { supabase } from '@/integrations/supabase/client';

interface AgentCoordinatorProps {
  caseId: string;
  workflowStages?: WorkflowStage[];
}

export function AgentCoordinator({ caseId, workflowStages }: AgentCoordinatorProps) {
  const { toast } = useToast();
  const { simulateAgent, isProcessing } = useAgentSimulation(caseId);
  const [currentStage, setCurrentStage] = useState<WorkflowStage | null>(null);
  const [nextAgentToTrigger, setNextAgentToTrigger] = useState<string | null>(null);

  // Get current workflow status
  const { data: stages, isLoading: isLoadingStages } = useQuery({
    queryKey: ["workflow_stages", caseId],
    queryFn: async () => {
      if (!caseId) return [];
      const { data, error } = await supabase
        .from("workflow_stages")
        .select("*")
        .eq("case_id", caseId)
        .order("stage_number", { ascending: true });
        
      if (error) throw error;
      return data;
    },
    enabled: !!caseId,
    initialData: workflowStages
  });

  // Determine current stage and next agent to trigger
  useEffect(() => {
    if (stages && stages.length > 0) {
      // Find current in-progress stage
      const inProgressStage = stages.find(stage => stage.status === 'in_progress');
      setCurrentStage(inProgressStage || null);
      
      // Determine which agent should be triggered based on the current stage
      if (inProgressStage) {
        const stageName = inProgressStage.stage_name;
        switch (stageName) {
          case 'reception':
            setNextAgentToTrigger('analista-requisitos');
            break;
          case 'planning':
            setNextAgentToTrigger('estrategista');
            break;
          case 'analysis':
            setNextAgentToTrigger('revisor-legal');
            break;
          case 'research':
            setNextAgentToTrigger('pesquisador');
            break;
          case 'drafting':
            setNextAgentToTrigger('assistente-redacao');
            break;
          case 'review':
            setNextAgentToTrigger('revisor-legal');
            break;
          default:
            setNextAgentToTrigger(null);
        }
      }
    }
  }, [stages]);

  const triggerCurrentAgent = async () => {
    if (!nextAgentToTrigger || !currentStage) return;
    
    try {
      // Trigger the appropriate agent
      const result = await simulateAgent(nextAgentToTrigger as any);
      
      if (result.success) {
        toast({
          title: "Agente executado com sucesso",
          description: `${result.message}`,
        });
      } else {
        toast({
          title: "Falha ao executar agente",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao executar agente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoadingStages) {
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
                    disabled={isProcessing[nextAgentToTrigger as any]}
                    onClick={triggerCurrentAgent}
                    className="flex items-center gap-1"
                  >
                    {isProcessing[nextAgentToTrigger as any] ? (
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
      </CardFooter>
    </Card>
  );
}
