import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Info, CheckCircle, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { useWorkflow } from '@/hooks/workflow';

interface CaseActionsProps {
  caseId: string;
  documents: any[];
  caseData: any;
}

export function CaseActions({ caseId, documents, caseData }: CaseActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { simulateAgent, isProcessing } = useAgentSimulation(caseId);
  const { 
    currentStage, 
    advanceWorkflow, 
    getRecommendedAgent,
    initializeWorkflow,
    isProcessing: isWorkflowProcessing,
    stages,
    isStrategicStage,
    executeCurrentStrategicPhase
  } = useWorkflow(caseId);

  const hasWorkflow = stages && stages.length > 0;

  const handleInitAnalysis = async () => {
    try {
      // First initialize workflow if needed
      if (!hasWorkflow) {
        await initializeWorkflow.mutateAsync(caseData?.created_by);
      }
      
      // Then trigger the analyst agent
      await simulateAgent('analista-requisitos');
      
      toast({
        title: "Triagem concluída",
        description: "O analista de requisitos processou os documentos com sucesso.",
      });
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      queryClient.invalidateQueries({ queryKey: ["activities", caseId] });
      queryClient.invalidateQueries({ queryKey: ["workflow_stages", caseId] });
    } catch (error: any) {
      toast({
        title: "Erro ao processar triagem",
        description: `Falha na triagem: ${error.message}. Tente novamente.`,
        variant: "destructive",
      });
    }
  };

  const handleAdvanceWorkflow = async () => {
    try {
      // Get recommended agent for current stage before advancing
      const recommendedAgent = getRecommendedAgent();
      
      // If we're in a strategic stage, execute the strategic phase
      if (isStrategicStage()) {
        await executeCurrentStrategicPhase();
      }
      // Otherwise execute recommended agent if possible
      else if (recommendedAgent && !isProcessing[recommendedAgent]) {
        await simulateAgent(recommendedAgent);
      }
      
      // Then advance workflow
      await advanceWorkflow.mutateAsync();
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      queryClient.invalidateQueries({ queryKey: ["activities", caseId] });
      queryClient.invalidateQueries({ queryKey: ["workflow_stages", caseId] });
    } catch (error: any) {
      toast({
        title: "Erro ao avançar etapa",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExecuteStrategy = async () => {
    try {
      if (!isStrategicStage()) {
        toast({
          title: "Ação indisponível",
          description: "Esta ação só está disponível em etapas estratégicas.",
          variant: "destructive",
        });
        return;
      }
      
      await executeCurrentStrategicPhase();
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      queryClient.invalidateQueries({ queryKey: ["activities", caseId] });
    } catch (error: any) {
      toast({
        title: "Erro ao executar estratégia",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isCurrentStageStrategic = isStrategicStage();

  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        onClick={handleInitAnalysis}
        disabled={isProcessing['analista-requisitos'] || isWorkflowProcessing}
        variant="outline"
      >
        {isProcessing['analista-requisitos'] || isWorkflowProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Info className="mr-2 h-4 w-4" />
            Acionar Analista de Requisitos
          </>
        )}
      </Button>
      
      {isCurrentStageStrategic && (
        <Button 
          onClick={handleExecuteStrategy}
          disabled={isWorkflowProcessing}
          variant="outline"
          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
        >
          {isWorkflowProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <BarChart2 className="mr-2 h-4 w-4" />
              Executar Estratégia
            </>
          )}
        </Button>
      )}
      
      <Button 
        className="bg-evji-primary hover:bg-evji-primary/90"
        onClick={handleAdvanceWorkflow}
        disabled={advanceWorkflow.isPending || !currentStage}
      >
        {advanceWorkflow.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Atualizando...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Avançar Etapa
          </>
        )}
      </Button>
    </div>
  );
}
