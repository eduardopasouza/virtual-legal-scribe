import { AgentType } from '@/types/agent';

export type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface WorkflowStage {
  id: string;
  case_id: string;
  stage_number: number;
  stage_name: WorkflowStageName;
  status: WorkflowStatus;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
  created_by?: string;
}

export type WorkflowStageName = 
  | 'reception'
  | 'planning'
  | 'analysis'
  | 'research'
  | 'drafting'
  | 'review'
  | 'delivery';

export interface WorkflowStageConfig {
  name: WorkflowStageName;
  displayName: string;
  description: string;
  primaryAgent: AgentType;
  supportAgents: AgentType[];
  requiredDocuments?: string[];
  nextStage?: WorkflowStageName;
  previousStage?: WorkflowStageName;
  completionCriteria?: string[];
}

export interface WorkflowTransition {
  from: WorkflowStageName;
  to: WorkflowStageName;
  condition?: (caseData: any) => boolean;
  autoAdvance?: boolean;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStageConfig[];
  transitions: WorkflowTransition[];
  initialStage: WorkflowStageName;
}

export interface WorkflowAlert {
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high';
  type: 'missing_document' | 'conflict' | 'deadline' | 'quality' | 'other';
  relatedStage?: WorkflowStageName;
  suggestedAction?: string;
}

export interface WorkflowVerificationResult {
  complete: boolean;
  missingItems: string[];
  recommendations?: string[];
}

export interface WorkflowContext {
  caseId: string;
  stageResults: Record<WorkflowStageName, any>;
  currentStageName: WorkflowStageName | null;
  alerts: WorkflowAlert[];
  logs: Array<{
    timestamp: string;
    message: string;
    details?: any;
  }>;
}

export interface DocumentRequirement {
  type: string;
  name: string;
  isRequired: boolean;
  description?: string;
  relatedTo?: WorkflowStageName[];
}

export interface CaseObjective {
  description: string;
  createdAt: string;
  updatedAt?: string;
  achievementCriteria?: string[];
  relatedDocuments?: string[];
}

// Correctly re-export AgentType using export type
export type { AgentType };
