
import { AgentType } from '@/hooks/useAgentSimulation';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentType?: AgentType;
  action?: 'info' | 'request' | 'confirmation';
  metadata?: any;
}

export interface AgentOption {
  value: AgentType;
  label: string;
  description: string;
}

export interface AgentChatProps {
  caseId?: string;
}
