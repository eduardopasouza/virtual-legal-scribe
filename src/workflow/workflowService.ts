
import { supabase } from '@/integrations/supabase/client';
import { 
  WorkflowDefinition, 
  WorkflowStage, 
  WorkflowStageName, 
  WorkflowStatus,
  WorkflowAlert,
  WorkflowVerificationResult,
  WorkflowContext
} from './types';
import { defaultWorkflow } from './configurations/defaultWorkflow';
import { AgentType } from '@/types/agent';

/**
 * Service for managing workflow operations
 */
export class WorkflowService {
  private workflow: WorkflowDefinition;
  private contextCache: Map<string, WorkflowContext> = new Map();
  
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
    
    // Initialize workflow context
    this.initializeContext(caseId);
    
    // Log workflow initiation
    this.logProgress(caseId, 'Workflow initialized', { createdBy });
    
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
    
    // Update context with current stage
    const context = this.getContext(caseId);
    if (context && data.stage_name) {
      // Ensure stage_name is a valid WorkflowStageName
      const stageName = data.stage_name as WorkflowStageName;
      context.currentStageName = stageName;
      this.contextCache.set(caseId, context);
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
    
    // Verify stage completeness before advancing
    // Ensure we're passing a valid WorkflowStageName
    const stageName = currentStage.stage_name as WorkflowStageName;
    const verification = await this.verifyStageCompleteness(caseId, stageName);
    if (!verification.complete) {
      // Create alert for missing items
      await this.createAlert(caseId, {
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
      // Complete the final stage but don't advance further
      await supabase
        .from('workflow_stages')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', currentStage.id);
        
      // Log completion of workflow
      this.logProgress(caseId, 'Workflow completed', { finalStage: stageName });
        
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
    
    // Update context
    const context = this.getContext(caseId);
    if (context && updatedNextStage.stage_name) {
      // Ensure stage_name is a valid WorkflowStageName
      const nextStageName = updatedNextStage.stage_name as WorkflowStageName;
      context.currentStageName = nextStageName;
      this.logToContext(caseId, `Advanced from ${stageName} to ${nextStageName}`);
    }
    
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
    
    // Log status update
    this.logProgress(caseId, `Stage ${stageName} status updated to ${status}`);
    
    return data as WorkflowStage;
  }
  
  /**
   * Verify if a stage has all requirements met to be completed
   */
  async verifyStageCompleteness(caseId: string, stageName: WorkflowStageName): Promise<WorkflowVerificationResult> {
    const stageConfig = this.getStageConfig(stageName);
    if (!stageConfig) {
      return {
        complete: false,
        missingItems: ['Configuração de etapa não encontrada']
      };
    }
    
    const missingItems: string[] = [];
    
    // Check for required documents if specified
    if (stageConfig.requiredDocuments && stageConfig.requiredDocuments.length > 0) {
      // Get case documents
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
    
    // Check for completion criteria
    if (stageConfig.completionCriteria && stageConfig.completionCriteria.length > 0) {
      // This would need to be implemented based on specific criteria
      // For now, just log that we're checking
      this.logProgress(caseId, `Checking completion criteria for ${stageName}`);
    }
    
    // Check context for stage results
    const context = this.getContext(caseId);
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
  
  /**
   * Create an alert for workflow issues
   */
  async createAlert(caseId: string, alert: WorkflowAlert) {
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        case_id: caseId,
        title: alert.title,
        description: alert.description || '',
        type: alert.type,
        priority: alert.severity,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Add to context
    const context = this.getContext(caseId);
    if (context) {
      context.alerts.push(alert);
      this.contextCache.set(caseId, context);
    }
    
    return data;
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
  
  /**
   * Log workflow progress
   */
  async logProgress(caseId: string, message: string, details?: any) {
    // Log to database
    const { error } = await supabase
      .from('activities')
      .insert({
        case_id: caseId,
        agent: 'coordenador',
        action: 'Log de progresso',
        result: message,
        details: details ? JSON.stringify(details) : null
      });
    
    if (error) console.error('Failed to log workflow progress:', error);
    
    // Log to context
    this.logToContext(caseId, message, details);
    
    return !error;
  }
  
  /**
   * Initialize workflow context
   */
  private initializeContext(caseId: string) {
    const newContext: WorkflowContext = {
      caseId,
      stageResults: {} as Record<WorkflowStageName, any>,
      currentStageName: null,
      alerts: [],
      logs: [{
        timestamp: new Date().toISOString(),
        message: 'Workflow context initialized'
      }]
    };
    
    this.contextCache.set(caseId, newContext);
  }
  
  /**
   * Get workflow context
   */
  private getContext(caseId: string) {
    let context = this.contextCache.get(caseId);
    
    if (!context) {
      this.initializeContext(caseId);
      context = this.contextCache.get(caseId);
    }
    
    return context;
  }
  
  /**
   * Log message to context
   */
  private logToContext(caseId: string, message: string, details?: any) {
    const context = this.getContext(caseId);
    if (context) {
      context.logs.push({
        timestamp: new Date().toISOString(),
        message,
        details
      });
      
      this.contextCache.set(caseId, context);
    }
  }
}

// Export a singleton instance
export const workflowService = new WorkflowService();
