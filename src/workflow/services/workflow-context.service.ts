
import { WorkflowContext } from '../types';

export class WorkflowContextService {
  private contextCache: Map<string, WorkflowContext> = new Map();

  initializeContext(caseId: string) {
    const newContext: WorkflowContext = {
      caseId,
      stageResults: {} as Record<string, any>,
      currentStageName: null,
      alerts: [],
      logs: [{
        timestamp: new Date().toISOString(),
        message: 'Workflow context initialized'
      }]
    };
    
    this.contextCache.set(caseId, newContext);
  }

  getContext(caseId: string): WorkflowContext | undefined {
    return this.contextCache.get(caseId);
  }

  updateContext(caseId: string, context: WorkflowContext) {
    this.contextCache.set(caseId, context);
  }

  logProgress(caseId: string, message: string, details?: any) {
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

export const workflowContextService = new WorkflowContextService();
