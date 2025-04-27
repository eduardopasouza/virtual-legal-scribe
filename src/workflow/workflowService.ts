
import { workflowStageService } from './services/workflow-stage.service';
import { workflowContextService } from './services/workflow-context.service';
import { workflowAlertService } from './services/workflow-alert.service';
import { workflowConfigService } from './services/workflow-config.service';
import { supabase } from '@/integrations/supabase/client';
import { 
  WorkflowDefinition, 
  WorkflowStage, 
  WorkflowStageName, 
  WorkflowStatus, 
  WorkflowAlert,
  WorkflowVerificationResult,
} from './types';
import { AgentType } from '@/types/agent';

/**
 * Service for managing workflow operations
 */
export class WorkflowService {
  async initializeWorkflow(caseId: string, createdBy?: string): Promise<WorkflowStage[]> {
    return workflowStageService.initializeWorkflow(caseId, createdBy);
  }
  
  async getCurrentStage(caseId: string): Promise<WorkflowStage | null> {
    return workflowStageService.getCurrentStage(caseId);
  }
  
  async getWorkflowStages(caseId: string): Promise<WorkflowStage[]> {
    return workflowStageService.getWorkflowStages(caseId);
  }
  
  async advanceWorkflow(caseId: string) {
    return workflowStageService.advanceWorkflow(caseId);
  }
  
  async updateStageStatus(
    caseId: string, 
    stageName: WorkflowStageName, 
    status: WorkflowStatus
  ): Promise<WorkflowStage> {
    return workflowStageService.updateStageStatus(caseId, stageName, status);
  }
  
  async verifyStageCompleteness(caseId: string, stageName: WorkflowStageName): Promise<WorkflowVerificationResult> {
    return workflowStageService.verifyStageCompleteness(caseId, stageName);
  }
  
  getRecommendedAgent(stageName: WorkflowStageName): AgentType | null {
    return workflowConfigService.getRecommendedAgent(stageName);
  }
  
  getStageConfig(stageName: WorkflowStageName) {
    return workflowConfigService.getStageConfig(stageName);
  }
  
  getWorkflowMetadata() {
    return workflowConfigService.getWorkflowMetadata();
  }
  
  async createAlert(caseId: string, alert: WorkflowAlert) {
    return workflowAlertService.createAlert(caseId, alert);
  }
  
  async logProgress(caseId: string, message: string, details?: any) {
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
    
    workflowContextService.logProgress(caseId, message, details);
    
    return !error;
  }
}

// Export a singleton instance
export const workflowService = new WorkflowService();
