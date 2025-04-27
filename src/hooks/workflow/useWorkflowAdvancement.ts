
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService } from '@/workflow';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useWorkflowAdvancement(caseId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const advanceWorkflow = useMutation({
    mutationFn: async () => {
      if (!caseId) throw new Error("Case ID is required");
      setIsProcessing(true);
      try {
        return await workflowService.advanceWorkflow(caseId);
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['workflow_stages', caseId] });
      queryClient.invalidateQueries({ queryKey: ['current_stage', caseId] });
      
      const previousStageName = result.previousStage?.stage_name || '';
      const stageConfig = workflowService.getStageConfig(previousStageName as any);
      
      if (result.currentStage) {
        const newStageConfig = workflowService.getStageConfig(result.currentStage.stage_name);
        toast({
          title: 'Etapa avançada',
          description: `Concluído: ${stageConfig?.displayName || previousStageName}. Iniciado: ${newStageConfig?.displayName || result.currentStage.stage_name}.`
        });
      } else {
        toast({
          title: 'Fluxo concluído',
          description: `Etapa final (${stageConfig?.displayName || previousStageName}) concluída. O fluxo de trabalho foi concluído.`
        });
      }
      
      const logActivity = async () => {
        await supabase.from('activities').insert({
          case_id: caseId,
          agent: 'coordenador',
          action: 'Avanço de Etapa',
          result: result.currentStage 
            ? `Avançou para etapa: ${result.currentStage.stage_name}` 
            : 'Concluiu fluxo'
        });
      };
      
      logActivity()
        .then(() => queryClient.invalidateQueries({ queryKey: ['activities', caseId] }))
        .catch(console.error);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao avançar etapa',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { advanceWorkflow, isProcessing };
}

