
import { WorkflowDefinition, WorkflowStageName, AgentType } from '../types';
import { defaultWorkflow } from '../configurations/defaultWorkflow';

export class WorkflowConfigService {
  private workflow: WorkflowDefinition;

  constructor(workflowDefinition: WorkflowDefinition = defaultWorkflow) {
    this.workflow = workflowDefinition;
  }

  getWorkflowDefinition(): WorkflowDefinition {
    return this.workflow;
  }

  getStageConfig(stageName: WorkflowStageName) {
    return this.workflow.stages.find(s => s.name === stageName);
  }

  getRecommendedAgent(stageName: WorkflowStageName): AgentType | null {
    const stage = this.workflow.stages.find(s => s.name === stageName);
    return stage ? stage.primaryAgent : null;
  }

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

export const workflowConfigService = new WorkflowConfigService();
