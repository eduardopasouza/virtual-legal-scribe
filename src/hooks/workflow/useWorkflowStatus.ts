
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService, WorkflowStageName, WorkflowStatus } from '@/workflow';
import { useToast } from '@/hooks/use-toast';

export function useWorkflowStatus(caseId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStageStatus = useMutation({
    mutationFn: async ({ 
      stageName, 
      status 
    }: { 
      stageName: WorkflowStageName, 
      status: WorkflowStatus 
    }) => {
      if (!caseId || !stageName) throw new Error("Case ID and stage name are required");
      return await workflowService.updateStageStatus(caseId, stageName, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow_stages', caseId] });
      queryClient.invalidateQueries({ queryKey: ['current_stage', caseId] });
      
      toast({
        title: 'Status atualizado',
        description: 'O status da etapa foi atualizado com sucesso.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { updateStageStatus };
}

