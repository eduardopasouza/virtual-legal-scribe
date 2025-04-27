
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

  // Get recommended agent for current stage
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

  // Determinar se estamos em uma fase estratégica
  const isStrategicStage = () => {
    if (!currentStage?.stage_name) return false;
    return ['planning', 'strategy-review', 'strategic-validation'].includes(currentStage.stage_name);
  };

  // Determinar se estamos na fase de análise de fatos
  const isFactsAnalysisStage = () => {
    if (!currentStage?.stage_name) return false;
    return currentStage.stage_name === 'facts-analysis';
  };
  
  // Determinar se estamos em uma fase que requer análise avançada
  const isAdvancedAnalysisStage = () => {
    if (!currentStage?.stage_name) return false;
    return ['research', 'constitutional-review', 'international-law'].includes(currentStage.stage_name);
  };
  
  // Determinar se estamos na fase de revisão/verificação
  const isReviewStage = () => {
    if (!currentStage?.stage_name) return false;
    return currentStage.stage_name === 'review';
  };
  
  // Determinar se estamos na fase de revisão final/integração
  const isFinalRevisionStage = () => {
    if (!currentStage?.stage_name) return false;
    return currentStage.stage_name === 'final-revision';
  };

  // Identificar qual fase estratégica estamos
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

  // Executar a fase estratégica atual automaticamente
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

  // Execute current workflow stage based on its type
  const executeCurrentStage = async () => {
    if (!currentStage?.stage_name) return null;
    
    if (isStrategicStage()) {
      return await executeCurrentStrategicPhase();
    }
    
    if (isFactsAnalysisStage()) {
      return await executeFactsAnalysis.mutateAsync();
    }
    
    if (isAdvancedAnalysisStage()) {
      // Determine which type of advanced analysis to execute based on the stage
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
    
    return null;
  };

  return {
    stages,
    currentStage,
    isLoading,
    isProcessing: isProcessing || isProcessingStrategy || isAnalyzingFacts || 
                  isAnalyzingAdvanced || isDrafting || isVerifying || isRevising,
    error,
    initializeWorkflow,
    advanceWorkflow,
    updateStageStatus,
    getRecommendedAgent,
    createWorkflowAlert,
    verifyStageCompleteness,
    logWorkflowProgress,
    workflowMetadata: workflowService.getWorkflowMetadata(),
    // Strategic methods
    isStrategicStage,
    getCurrentStrategicPhase,
    executeCurrentStrategicPhase,
    executeInitialStrategy,
    executeIntermediateStrategy,
    executeFinalStrategy,
    // Facts analysis methods
    isFactsAnalysisStage,
    executeFactsAnalysis,
    factsAnalysis,
    // Advanced analysis methods
    isAdvancedAnalysisStage,
    executeAdvancedAnalysis,
    advancedAnalyses,
    // Document drafting
    draftDocument,
    // Review methods
    isReviewStage,
    verifyDocument,
    // Final revision methods
    isFinalRevisionStage,
    reviseDocument,
    // Execute current stage based on type
    executeCurrentStage
  };
}
