
import { supabase } from '@/integrations/supabase/client';
import { WorkflowStage, WorkflowStageName } from '../types';
import { workflowStageManager } from './workflow-stage-manager.service';
import { workflowStageValidator } from './workflow-stage-validator.service';
import { workflowContextService } from './workflow-context.service';
import { workflowAlertService } from './workflow-alert.service';

export class WorkflowStageProcessorService {
  async advanceWorkflow(caseId: string): Promise<{
    previousStage: WorkflowStage | null,
    currentStage: WorkflowStage | null
  }> {
    const currentStage = await workflowStageManager.getCurrentStage(caseId);
    if (!currentStage) throw new Error('No active stage found for this case');
    
    const allStages = await workflowStageManager.getWorkflowStages(caseId);
    const currentIndex = allStages.findIndex(s => s.id === currentStage.id);
    if (currentIndex === -1) throw new Error('Current stage not found in workflow');
    
    const stageName = currentStage.stage_name as WorkflowStageName;
    const verification = await workflowStageValidator.verifyStageCompleteness(caseId, stageName);
    if (!verification.complete) {
      await workflowAlertService.createAlert(caseId, {
        title: 'Etapa incompleta',
        description: `Não é possível avançar: ${verification.missingItems.join(', ')}`,
        severity: 'medium',
        type: 'quality',
        relatedStage: stageName,
        suggestedAction: 'Verifique os itens faltantes antes de avançar'
      });
      
      throw new Error(`Etapa incompleta: ${verification.missingItems.join(', ')}`);
    }
    
    if (currentIndex >= allStages.length - 1) {
      await workflowStageManager.updateStageStatus(caseId, currentStage.stage_name, 'completed');
      workflowContextService.logProgress(caseId, 'Workflow completed', { finalStage: stageName });
      return { previousStage: currentStage, currentStage: null };
    }
    
    const nextStage = allStages[currentIndex + 1];
    
    const updates = [
      workflowStageManager.updateStageStatus(caseId, currentStage.stage_name, 'completed'),
      workflowStageManager.updateStageStatus(caseId, nextStage.stage_name, 'in_progress')
    ];
    
    await Promise.all(updates);
    
    const { data: updatedNextStage, error } = await supabase
      .from('workflow_stages')
      .select('*')
      .eq('id', nextStage.id)
      .single();
      
    if (error) throw error;
    
    const nextStageName = updatedNextStage.stage_name as WorkflowStageName;
    workflowContextService.logProgress(caseId, `Advanced from ${stageName} to ${nextStageName}`);
    
    return {
      previousStage: currentStage,
      currentStage: updatedNextStage as WorkflowStage
    };
  }
}

export const workflowStageProcessor = new WorkflowStageProcessorService();

