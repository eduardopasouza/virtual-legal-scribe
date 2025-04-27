
import { workflowService } from '@/workflow';
import { WorkflowStageName } from '@/workflow/types';

export function useWorkflowStageValidation(caseId?: string) {
  const isStrategicStage = (stageName?: WorkflowStageName) => {
    if (!stageName) return false;
    return ['planning', 'strategy-review', 'strategic-validation'].includes(stageName);
  };

  const isFactsAnalysisStage = (stageName?: WorkflowStageName) => {
    if (!stageName) return false;
    return stageName === 'facts-analysis';
  };
  
  const isAdvancedAnalysisStage = (stageName?: WorkflowStageName) => {
    if (!stageName) return false;
    return ['research', 'constitutional-review', 'international-law'].includes(stageName);
  };
  
  const isReviewStage = (stageName?: WorkflowStageName) => {
    if (!stageName) return false;
    return stageName === 'review';
  };
  
  const isFinalRevisionStage = (stageName?: WorkflowStageName) => {
    if (!stageName) return false;
    return stageName === 'final-revision';
  };

  const isClientCommunicationStage = (stageName?: WorkflowStageName) => {
    if (!stageName) return false;
    return stageName === 'delivery';
  };

  const getCurrentStrategicPhase = (stageName?: WorkflowStageName) => {
    if (!stageName) return null;
    
    switch (stageName) {
      case 'planning':
        return 'initial';
      case 'strategy-review':
        return 'intermediate';
      case 'strategic-validation':
        return 'final';
      default:
        return null;
    }
  };

  return {
    isStrategicStage,
    isFactsAnalysisStage,
    isAdvancedAnalysisStage,
    isReviewStage,
    isFinalRevisionStage,
    isClientCommunicationStage,
    getCurrentStrategicPhase
  };
}
