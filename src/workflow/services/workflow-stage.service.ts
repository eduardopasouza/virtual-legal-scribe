
import { WorkflowStage, WorkflowStageName, WorkflowStatus, WorkflowVerificationResult } from '../types';
import { workflowStageManager } from './workflow-stage-manager.service';
import { workflowStageValidator } from './workflow-stage-validator.service';
import { workflowStageProcessor } from './workflow-stage-processor.service';

export class WorkflowStageService {
  async initializeWorkflow(caseId: string, createdBy?: string): Promise<WorkflowStage[]> {
    return workflowStageManager.initializeWorkflow(caseId, createdBy);
  }

  async getCurrentStage(caseId: string): Promise<WorkflowStage | null> {
    return workflowStageManager.getCurrentStage(caseId);
  }

  async getWorkflowStages(caseId: string): Promise<WorkflowStage[]> {
    return workflowStageManager.getWorkflowStages(caseId);
  }

  async updateStageStatus(
    caseId: string, 
    stageName: WorkflowStageName, 
    status: WorkflowStatus
  ): Promise<WorkflowStage> {
    return workflowStageManager.updateStageStatus(caseId, stageName, status);
  }

  async advanceWorkflow(caseId: string) {
    return workflowStageProcessor.advanceWorkflow(caseId);
  }

  async verifyStageCompleteness(caseId: string, stageName: WorkflowStageName): Promise<WorkflowVerificationResult> {
    return workflowStageValidator.verifyStageCompleteness(caseId, stageName);
  }
}

export const workflowStageService = new WorkflowStageService();

