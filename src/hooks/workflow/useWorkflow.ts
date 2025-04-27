import { useState } from 'react';
import { workflowService } from '@/workflow';
import { useWorkflowInitialization } from './useWorkflowInitialization';
import { useWorkflowStages } from './useWorkflowStages';
import { useWorkflowAdvancement } from './useWorkflowAdvancement';
import { useWorkflowAlerts } from './useWorkflowAlerts';
import { useWorkflowStatus } from './useWorkflowStatus';
import { useWorkflowStrategy } from './useWorkflowStrategy';
import { useFactsAnalysis } from './useFactsAnalysis';
import { useAdvancedLayersAnalysis } from './useAdvancedLayersAnalysis';
import { useDocumentDrafting } from './useDocumentDrafting';
import { useDocumentVerification } from './useDocumentVerification';
import { useDocumentRevision } from './useDocumentRevision';
import { useClientCommunication } from './useClientCommunication';

export function useWorkflow(caseId?: string) {
  const [isProcessing, setIsProcessing] = useState(false);

  const { initializeWorkflow } = useWorkflowInitialization(caseId);
  const { stages, currentStage, isLoading, error } = useWorkflowStages(caseId);
  const { advanceWorkflow } = useWorkflowAdvancement(caseId);
  const { createWorkflowAlert } = useWorkflowAlerts(caseId);
  const { updateStageStatus } = useWorkflowStatus(caseId);
  const { 
    executeInitialStrategy, 
    executeIntermediateStrategy, 
    executeFinalStrategy,
    isProcessingStrategy 
  } = useWorkflowStrategy(caseId);
  const {
    executeFactsAnalysis,
    factsAnalysis,
    isAnalyzing: isAnalyzingFacts
  } = useFactsAnalysis(caseId);
  const {
    executeAdvancedAnalysis,
    isAnalyzing: isAnalyzingAdvanced,
    advancedAnalyses
  } = useAdvancedLayersAnalysis(caseId);
  const {
    draftDocument,
    isDrafting
  } = useDocumentDrafting(caseId);
  const {
    verifyDocument,
    isVerifying
  } = useDocumentVerification(caseId);
  const {
    reviseDocument,
    isRevising
  } = useDocumentRevision(caseId);
  
  const {
    generateCommunication,
    isGenerating: isGeneratingCommunication
  } = useClientCommunication(caseId);

  const getRecommendedAgent = () => {
    if (!currentStage?.stage_name) return null;
    return workflowService.getRecommendedAgent(currentStage.stage_name);
  };

  const verifyStageCompleteness = async (stageName: any) => {
    if (!caseId) return { complete: false, missingItems: ['ID do caso não informado'] };
    return await workflowService.verifyStageCompleteness(caseId, stageName);
  };

  const logWorkflowProgress = async (message: string, details?: any) => {
    if (!caseId) return;
    return await workflowService.logProgress(caseId, message, details);
  };

  const isStrategicStage = () => {
    if (!currentStage?.stage_name) return false;
    return ['planning', 'strategy-review', 'strategic-validation'].includes(currentStage.stage_name);
  };

  const isFactsAnalysisStage = () => {
    if (!currentStage?.stage_name) return false;
    return currentStage.stage_name === 'facts-analysis';
  };
  
  const isAdvancedAnalysisStage = () => {
    if (!currentStage?.stage_name) return false;
    return ['research', 'constitutional-review', 'international-law'].includes(currentStage.stage_name);
  };
  
  const isReviewStage = () => {
    if (!currentStage?.stage_name) return false;
    return currentStage.stage_name === 'review';
  };
  
  const isFinalRevisionStage = () => {
    if (!currentStage?.stage_name) return false;
    return currentStage.stage_name === 'final-revision';
  };

  const isClientCommunicationStage = () => {
    if (!currentStage?.stage_name) return false;
    return currentStage.stage_name === 'delivery';
  };

  const getCurrentStrategicPhase = () => {
    if (!currentStage?.stage_name) return null;
    
    switch (currentStage.stage_name) {
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

  const executeCurrentStrategicPhase = async () => {
    if (!currentStage?.stage_name) return null;
    
    const phase = getCurrentStrategicPhase();
    if (!phase) return null;
    
    switch (phase) {
      case 'initial':
        return await executeInitialStrategy.mutateAsync();
      case 'intermediate':
        return await executeIntermediateStrategy.mutateAsync({});
      case 'final':
        return await executeFinalStrategy.mutateAsync('');
      default:
        return null;
    }
  };

  const executeCurrentStage = async () => {
    if (!currentStage?.stage_name) return null;
    
    if (isStrategicStage()) {
      return await executeCurrentStrategicPhase();
    }
    
    if (isFactsAnalysisStage()) {
      return await executeFactsAnalysis.mutateAsync();
    }
    
    if (isAdvancedAnalysisStage()) {
      const specialtyType = currentStage.stage_name === 'constitutional-review' ? 'constitutional' : 
                          currentStage.stage_name === 'international-law' ? 'international' : 'interdisciplinary';
      
      return await executeAdvancedAnalysis.mutateAsync({ specialtyType });
    }
    
    if (isReviewStage()) {
      return await verifyDocument.mutateAsync({});
    }
    
    if (isFinalRevisionStage()) {
      return await reviseDocument.mutateAsync({});
    }
    
    if (isClientCommunicationStage()) {
      return await generateCommunication.mutateAsync();
    }
    
    return null;
  };

  return {
    stages,
    currentStage,
    isLoading,
    isProcessing: isProcessing || isProcessingStrategy || isAnalyzingFacts || 
                  isAnalyzingAdvanced || isDrafting || isVerifying || isRevising || 
                  isGeneratingCommunication,
    error,
    initializeWorkflow,
    advanceWorkflow,
    updateStageStatus,
    getRecommendedAgent,
    createWorkflowAlert,
    verifyStageCompleteness,
    logWorkflowProgress,
    workflowMetadata: workflowService.getWorkflowMetadata(),
    isStrategicStage,
    getCurrentStrategicPhase,
    executeCurrentStrategicPhase,
    executeInitialStrategy,
    executeIntermediateStrategy,
    executeFinalStrategy,
    isFactsAnalysisStage,
    executeFactsAnalysis,
    factsAnalysis,
    isAdvancedAnalysisStage,
    executeAdvancedAnalysis,
    advancedAnalyses,
    draftDocument,
    isReviewStage,
    verifyDocument,
    isFinalRevisionStage,
    reviseDocument,
    isClientCommunicationStage,
    generateCommunication,
    executeCurrentStage
  };
}
