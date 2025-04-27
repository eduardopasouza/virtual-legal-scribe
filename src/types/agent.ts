
export interface AgentResult {
  success: boolean;
  message: string;
  details?: Record<string, any>;
}

export interface AgentTask {
  caseId?: string;
  input?: any;
  metadata?: Record<string, any>;
}

export interface Agent {
  type: AgentType;
  name: string;
  description: string;
  execute: (task: AgentTask) => Promise<AgentResult>;
  isAvailable: () => boolean;
}

export type AgentType = 
  | 'coordenador'
  | 'analista-requisitos' 
  | 'estrategista'
  | 'analista-fatos'
  | 'pesquisador'
  | 'analista-argumentacao'
  | 'redator'
  | 'assistente-redacao'
  | 'especialista'
  | 'especialista-adaptavel'
  | 'revisor-legal'
  | 'revisor-integrador'
  | 'revisor-texto'
  | 'comunicador'
  | 'arquivista'
  | 'extrator-dados'
  | 'secretaria';

export type AgentSimulationState = {
  [key in AgentType]?: boolean;
};

export interface AgentSimulationHook {
  simulateAgent: (agentType: AgentType, task?: Omit<AgentTask, 'caseId'>) => Promise<AgentResult>;
  isProcessing: AgentSimulationState;
}
