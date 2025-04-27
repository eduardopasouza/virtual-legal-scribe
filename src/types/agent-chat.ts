import { AgentType } from '@/hooks/agent/types';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentType?: AgentType;
  action?: 'info' | 'request' | 'confirmation' | 'warning' | 'analysis';
  metadata?: any;
}

export interface AgentOption {
  value: AgentType;
  label: string;
  description: string;
}

export interface AgentChatProps {
  caseId?: string;
  initialAgent?: AgentType;
  onAgentResponse?: (response: any) => void;
  onWorkflowAction?: (action: string, data: any) => void;
}

export interface AgentAction {
  type: string;
  payload: any;
  timestamp: Date;
}
