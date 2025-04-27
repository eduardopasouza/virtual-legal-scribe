
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService, WorkflowStage, WorkflowStageName, WorkflowStatus, WorkflowAlert } from '@/workflow';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/components/notification/NotificationSystem';
import { supabase } from '@/integrations/supabase/client';

export function useWorkflow(caseId?: string) {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch all workflow stages for a case
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

  // Fetch current active stage
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

  // Initialize workflow for a new case
  const initializeWorkflow = useMutation({
    mutationFn: async (userId?: string) => {
      if (!caseId) throw new Error("Case ID is required");
      setIsProcessing(true);
      try {
        return await workflowService.initializeWorkflow(caseId, userId);
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow_stages', caseId] });
      queryClient.invalidateQueries({ queryKey: ['current_stage', caseId] });
      
      toast({
        title: 'Fluxo iniciado',
        description: 'O fluxo de trabalho foi iniciado com sucesso.'
      });
      
      addNotification(
        'success',
        'Fluxo de trabalho',
        'O fluxo de trabalho foi iniciado para este caso.',
        'case'
      );
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao iniciar fluxo',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Advance to the next workflow stage
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
      // Using type assertion to ensure we pass a valid WorkflowStageName
      const stageConfig = workflowService.getStageConfig(previousStageName as WorkflowStageName);
      
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
      
      // Also update case activities
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

  // Update status of a specific stage
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

  // Get recommended agent for current stage
  const getRecommendedAgent = () => {
    if (!currentStage || !currentStage.stage_name) return null;
    
    // Type guards to ensure we're passing a valid WorkflowStageName
    if (!currentStage.stage_name) return null;
    
    return workflowService.getRecommendedAgent(currentStage.stage_name as WorkflowStageName);
  };

  // Create an alert for workflow issues
  const createWorkflowAlert = useMutation({
    mutationFn: async (alert: WorkflowAlert) => {
      if (!caseId) throw new Error("Case ID is required");
      return await workflowService.createAlert(caseId, alert);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['alerts', caseId] });
      
      toast({
        title: 'Alerta criado',
        description: `Um novo alerta foi registrado: ${data.title}`,
        variant: 'destructive' // Changed from 'warning' to 'destructive' to fix the error
      });
      
      addNotification(
        'warning',
        'Alerta de fluxo',
        `${data.title}: ${data.description || 'Intercorrência detectada no fluxo'}`,
        'case'
      );
    }
  });

  // Verify stage completeness and requirements
  const verifyStageCompleteness = async (stageName: WorkflowStageName) => {
    if (!caseId) return { complete: false, missingItems: ['ID do caso não informado'] };
    return await workflowService.verifyStageCompleteness(caseId, stageName);
  };

  // Log workflow progress
  const logWorkflowProgress = async (message: string, details?: any) => {
    if (!caseId) return;
    return await workflowService.logProgress(caseId, message, details);
  };

  return {
    stages,
    currentStage,
    isLoading: isLoading || isLoadingCurrentStage,
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
