
import { workflowService } from '@/workflow';
import { useWorkflowStageValidation } from './useWorkflowStageValidation';
import { useWorkflowStageActions } from './useWorkflowStageActions';
import { WorkflowStageName } from '@/workflow/types';

export function useWorkflowExecution(caseId?: string) {
  const stageValidation = useWorkflowStageValidation(caseId);
  const stageActions = useWorkflowStageActions(caseId);

  const executeCurrentStage = async (currentStageName?: WorkflowStageName) => {
    if (!currentStageName || !caseId) return null;
    
    if (stageValidation.isStrategicStage(currentStageName)) {
      const phase = stageValidation.getCurrentStrategicPhase(currentStageName);
      if (phase) {
        return await stageActions.executeCurrentStrategicPhase(currentStageName);
      }
    }
    
    if (stageValidation.isFactsAnalysisStage(currentStageName)) {
      return await stageActions.executeFactsAnalysis.mutateAsync();
    }
    
    if (stageValidation.isAdvancedAnalysisStage(currentStageName)) {
      const specialtyType = currentStageName === 'constitutional-review' ? 'constitutional' : 
                          currentStageName === 'international-law' ? 'international' : 'interdisciplinary';
      
      return await stageActions.executeAdvancedAnalysis.mutateAsync({ specialtyType });
    }
    
    if (stageValidation.isReviewStage(currentStageName)) {
      return await stageActions.verifyDocument.mutateAsync({});
    }
    
    if (stageValidation.isFinalRevisionStage(currentStageName)) {
      return await stageActions.reviseDocument.mutateAsync({});
    }
    
    if (stageValidation.isClientCommunicationStage(currentStageName)) {
      return await stageActions.generateCommunication.mutateAsync();
    }
    
    return null;
  };

  return {
    executeCurrentStage,
    isProcessing: stageActions.isProcessing
  };
}
