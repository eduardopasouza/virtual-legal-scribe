
import { supabase } from '@/integrations/supabase/client';
import { WorkflowDefinition, WorkflowStage, WorkflowStageName, WorkflowStatus } from './types';
import { defaultWorkflow } from './configurations/defaultWorkflow';
import { AgentType } from '@/types/agent';

/**
 * Service for managing workflow operations
 */
export class WorkflowService {
  private workflow: WorkflowDefinition;
  
  constructor(workflowDefinition: WorkflowDefinition = defaultWorkflow) {
    this.workflow = workflowDefinition;
  }

  /**
   * Initialize a new workflow for a case
   */
  async initializeWorkflow(caseId: string, createdBy?: string): Promise<WorkflowStage[]> {
    // Delete any existing workflow stages for this case
    await supabase.from('workflow_stages').delete().eq('case_id', caseId);
    
    // Create stages based on the workflow definition
    const stages = this.workflow.stages.map((stageConfig, index) => ({
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
    
    return data as WorkflowStage[];
  }
  
  /**
   * Get the current active stage for a case
   */
  async getCurrentStage(caseId: string): Promise<WorkflowStage | null> {
    const { data, error } = await supabase
      .from('workflow_stages')
      .select('*')
      .eq('case_id', caseId)
      .eq('status', 'in_progress')
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No in-progress stage found
        return null;
      }
      throw error;
    }
    
    return data as WorkflowStage;
  }
  
  /**
   * Get all workflow stages for a case
   */
  async getWorkflowStages(caseId: string): Promise<WorkflowStage[]> {
    const { data, error } = await supabase
      .from('workflow_stages')
      .select('*')
      .eq('case_id', caseId)
      .order('stage_number', { ascending: true });
      
    if (error) throw error;
    
    return data as WorkflowStage[];
  }
  
  /**
   * Advance the workflow to the next stage
   */
  async advanceWorkflow(caseId: string): Promise<{
    previousStage: WorkflowStage | null,
    currentStage: WorkflowStage | null
  }> {
    // Get current in-progress stage
    const currentStage = await this.getCurrentStage(caseId);
    if (!currentStage) {
      throw new Error('No active stage found for this case');
    }
    
    // Get all stages for proper ordering
    const allStages = await this.getWorkflowStages(caseId);
    
    // Find current stage index
    const currentIndex = allStages.findIndex(s => s.id === currentStage.id);
    if (currentIndex === -1) {
      throw new Error('Current stage not found in workflow');
    }
    
    // Check if this is the last stage
    if (currentIndex >= allStages.length - 1) {
      // Complete the final stage but don't advance further
      await supabase
        .from('workflow_stages')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', currentStage.id);
        
      return { previousStage: currentStage, currentStage: null };
    }
    
    // Get next stage
    const nextStage = allStages[currentIndex + 1];
    
    // Begin transaction: Complete current stage and start next stage
    const updates = [
      // Complete current stage
      supabase
        .from('workflow_stages')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', currentStage.id),
        
      // Start next stage
      supabase
        .from('workflow_stages')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', nextStage.id)
    ];
    
    // Execute both updates
    await Promise.all(updates);
    
    // Fetch updated next stage
    const { data: updatedNextStage, error } = await supabase
      .from('workflow_stages')
      .select('*')
      .eq('id', nextStage.id)
      .single();
      
    if (error) throw error;
    
    return {
      previousStage: currentStage,
      currentStage: updatedNextStage as WorkflowStage
    };
  }
  
  /**
   * Update the status of a specific workflow stage
   */
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
    return data as WorkflowStage;
  }
  
  /**
   * Get the primary agent recommended for the current stage
   */
  getRecommendedAgent(stageName: WorkflowStageName): AgentType | null {
    const stage = this.workflow.stages.find(s => s.name === stageName);
    return stage ? stage.primaryAgent : null;
  }
  
  /**
   * Get stage configuration details
   */
  getStageConfig(stageName: WorkflowStageName) {
    return this.workflow.stages.find(s => s.name === stageName);
  }
  
  /**
   * Get all workflow metadata
   */
  getWorkflowMetadata() {
    return {
      id: this.workflow.id,
      name: this.workflow.name,
      description: this.workflow.description,
      stages: this.workflow.stages.map(stage => ({
        name: stage.name,
        displayName: stage.displayName,
        description: stage.description,
        primaryAgent: stage.primaryAgent
      }))
    };
  }
}

// Export a singleton instance
export const workflowService = new WorkflowService();
