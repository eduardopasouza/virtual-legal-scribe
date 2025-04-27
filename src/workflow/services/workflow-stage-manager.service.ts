
import { supabase } from '@/integrations/supabase/client';
import { WorkflowStage, WorkflowStageName, WorkflowStatus } from '../types';
import { workflowContextService } from './workflow-context.service';
import { workflowConfigService } from './workflow-config.service';

export class WorkflowStageManagerService {
  async initializeWorkflow(caseId: string, createdBy?: string): Promise<WorkflowStage[]> {
    await supabase.from('workflow_stages').delete().eq('case_id', caseId);
    
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
    
    workflowContextService.initializeContext(caseId);
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
}

export const workflowStageManager = new WorkflowStageManagerService();

