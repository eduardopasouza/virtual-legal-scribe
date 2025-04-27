
import { supabase } from '@/integrations/supabase/client';
import { WorkflowStage, WorkflowStageName, WorkflowStatus, WorkflowVerificationResult } from '../types';
import { workflowContextService } from './workflow-context.service';
import { workflowConfigService } from './workflow-config.service';
import { workflowAlertService } from './workflow-alert.service';

export class WorkflowStageService {
  async initializeWorkflow(caseId: string, createdBy?: string): Promise<WorkflowStage[]> {
    // Delete any existing workflow stages for this case
    await supabase.from('workflow_stages').delete().eq('case_id', caseId);
    
    // Create stages based on the workflow definition
    const stages = workflowConfigService.getWorkflowDefinition().stages.map((stageConfig, index) => ({
      case_id: caseId,
      stage_name: stageConfig.name,
      stage_number: index + 1,
      status: index === 0 ? 'in_progress' : 'pending',
      started_at: index === 0 ? new Date().toISOString() : null,
      created_by: createdBy
    }));
    
    const { data, error } = await supabase
      .from('workflow_stages')
      .insert(stages)
      .select();
      
    if (error) throw error;
    
    // Initialize workflow context
    workflowContextService.initializeContext(caseId);
    
    // Log workflow initiation
    workflowContextService.logProgress(caseId, 'Workflow initialized', { createdBy });
    
    return data as WorkflowStage[];
  }

  async getCurrentStage(caseId: string): Promise<WorkflowStage | null> {
    const { data, error } = await supabase
      .from('workflow_stages')
      .select('*')
      .eq('case_id', caseId)
      .eq('status', 'in_progress')
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    // Update context with current stage
    const context = workflowContextService.getContext(caseId);
    if (context && data.stage_name) {
      const stageName = data.stage_name as WorkflowStageName;
      context.currentStageName = stageName;
      workflowContextService.updateContext(caseId, context);
    }
    
    return data as WorkflowStage;
  }

  async getWorkflowStages(caseId: string): Promise<WorkflowStage[]> {
    const { data, error } = await supabase
      .from('workflow_stages')
      .select('*')
      .eq('case_id', caseId)
      .order('stage_number', { ascending: true });
      
    if (error) throw error;
    
    return data as WorkflowStage[];
  }

  async updateStageStatus(
    caseId: string, 
    stageName: WorkflowStageName, 
    status: WorkflowStatus
  ): Promise<WorkflowStage> {
    const { data, error } = await supabase
      .from('workflow_stages')
      .update({ 
        status: status,
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
        ...(status === 'in_progress' ? { started_at: new Date().toISOString() } : {})
      })
      .eq('case_id', caseId)
      .eq('stage_name', stageName)
      .select()
      .single();
      
    if (error) throw error;
    
    workflowContextService.logProgress(caseId, `Stage ${stageName} status updated to ${status}`);
    
    return data as WorkflowStage;
  }

  async advanceWorkflow(caseId: string): Promise<{
    previousStage: WorkflowStage | null,
    currentStage: WorkflowStage | null
  }> {
    const currentStage = await this.getCurrentStage(caseId);
    if (!currentStage) throw new Error('No active stage found for this case');
    
    const allStages = await this.getWorkflowStages(caseId);
    const currentIndex = allStages.findIndex(s => s.id === currentStage.id);
    if (currentIndex === -1) throw new Error('Current stage not found in workflow');
    
    // Verify stage completeness before advancing
    const stageName = currentStage.stage_name as WorkflowStageName;
    const verification = await this.verifyStageCompleteness(caseId, stageName);
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
    
    // Check if this is the last stage
    if (currentIndex >= allStages.length - 1) {
      await this.updateStageStatus(caseId, currentStage.stage_name, 'completed');
      workflowContextService.logProgress(caseId, 'Workflow completed', { finalStage: stageName });
      return { previousStage: currentStage, currentStage: null };
    }
    
    const nextStage = allStages[currentIndex + 1];
    
    // Begin transaction: Complete current stage and start next stage
    const updates = [
      this.updateStageStatus(caseId, currentStage.stage_name, 'completed'),
      this.updateStageStatus(caseId, nextStage.stage_name, 'in_progress')
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

  async verifyStageCompleteness(caseId: string, stageName: WorkflowStageName): Promise<WorkflowVerificationResult> {
    const stageConfig = workflowConfigService.getStageConfig(stageName);
    if (!stageConfig) {
      return {
        complete: false,
        missingItems: ['Configuração de etapa não encontrada']
      };
    }
    
    const missingItems: string[] = [];
    
    if (stageConfig.requiredDocuments && stageConfig.requiredDocuments.length > 0) {
      const { data: documents } = await supabase
        .from('documents')
        .select('type, name')
        .eq('case_id', caseId);
      
      const documentTypes = documents?.map(doc => doc.type) || [];
      const missingDocs = stageConfig.requiredDocuments.filter(
        docType => !documentTypes.includes(docType)
      );
      
      if (missingDocs.length > 0) {
        missingItems.push(`Documentos necessários: ${missingDocs.join(', ')}`);
      }
    }
    
    if (stageConfig.completionCriteria && stageConfig.completionCriteria.length > 0) {
      workflowContextService.logProgress(caseId, `Checking completion criteria for ${stageName}`);
    }
    
    const context = workflowContextService.getContext(caseId);
    if (context && !context.stageResults[stageName]) {
      missingItems.push('Resultados da etapa não registrados');
    }
    
    return {
      complete: missingItems.length === 0,
      missingItems,
      recommendations: missingItems.length > 0 
        ? ['Resolva os itens faltantes antes de avançar'] 
        : undefined
    };
  }
}

export const workflowStageService = new WorkflowStageService();
