
import { AgentResult, AgentTask } from "@/types/agent";

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

export interface AgentSimulationOptions {
  caseId?: string;
  contextData?: Record<string, any>;
}

export interface AgentSimulationState {
  [key: string]: boolean;
}

export interface AgentSimulationHook {
  simulateAgent: (agentType: AgentType, task?: Omit<AgentTask, 'caseId'>) => Promise<AgentResult>;
  isProcessing: AgentSimulationState;
}

export type { AgentResult };
