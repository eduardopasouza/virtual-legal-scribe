export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  agentType?: string;
  isSystemMessage?: boolean;
  action?: 'info' | 'request' | 'legal_advice' | 'document_analysis' | 
          'confirmation' | 'warning' | 'analysis';
  metadata?: {
    documentAnalysis?: {
      keyPoints?: string[];
      summary?: string;
      riskLevel?: 'low' | 'medium' | 'high';
    };
    legalReferences?: string[];
    nextSteps?: string[];
    [key: string]: any;
  }
}

export interface AgentChatProps {
  caseId?: string;
  onMessageSent?: (message: Message) => void;
  onAgentChange?: (agentType: string) => void;
}
