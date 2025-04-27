
import { useQuery } from '@tanstack/react-query';
import { workflowService } from '@/workflow';

export function useWorkflowStages(caseId?: string) {
  const { 
    data: stages = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['workflow_stages', caseId],
    queryFn: async () => {
      if (!caseId) return [];
      return await workflowService.getWorkflowStages(caseId);
    },
    enabled: !!caseId
  });

  const { 
    data: currentStage,
    isLoading: isLoadingCurrentStage
  } = useQuery({
    queryKey: ['current_stage', caseId],
    queryFn: async () => {
      if (!caseId) return null;
      return await workflowService.getCurrentStage(caseId);
    },
    enabled: !!caseId
  });

  return {
    stages,
    currentStage,
    isLoading: isLoading || isLoadingCurrentStage,
    error
  };
}

