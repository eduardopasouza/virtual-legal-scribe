
import { useState } from 'react';
import { workflowService } from '@/workflow';
import { useWorkflowInitialization } from './useWorkflowInitialization';
import { useWorkflowStages } from './useWorkflowStages';
import { useWorkflowAdvancement } from './useWorkflowAdvancement';
import { useWorkflowAlerts } from './useWorkflowAlerts';
import { useWorkflowStatus } from './useWorkflowStatus';

export function useWorkflow(caseId?: string) {
  const [isProcessing, setIsProcessing] = useState(false);

  const { initializeWorkflow } = useWorkflowInitialization(caseId);
  const { stages, currentStage, isLoading, error } = useWorkflowStages(caseId);
  const { advanceWorkflow } = useWorkflowAdvancement(caseId);
  const { createWorkflowAlert } = useWorkflowAlerts(caseId);
  const { updateStageStatus } = useWorkflowStatus(caseId);

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

  return {
    stages,
    currentStage,
    isLoading,
    isProcessing,
    error,
    initializeWorkflow,
    advanceWorkflow,
    updateStageStatus,
    getRecommendedAgent,
    createWorkflowAlert,
    verifyStageCompleteness,
    logWorkflowProgress,
    workflowMetadata: workflowService.getWorkflowMetadata()
  };
}

