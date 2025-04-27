
import { useState } from 'react';
import { workflowService } from '@/workflow';
import { useWorkflowInitialization } from './useWorkflowInitialization';
import { useWorkflowStages } from './useWorkflowStages';
import { useWorkflowAdvancement } from './useWorkflowAdvancement';
import { useWorkflowAlerts } from './useWorkflowAlerts';
import { useWorkflowStatus } from './useWorkflowStatus';
import { useWorkflowStrategy } from './useWorkflowStrategy';

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

  return {
    stages,
    currentStage,
    isLoading,
    isProcessing: isProcessing || isProcessingStrategy,
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
    executeFinalStrategy
  };
}
