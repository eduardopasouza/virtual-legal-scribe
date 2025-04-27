
import { useState } from 'react';
import { AgentType } from '@/hooks/agent/types';

export type ChatStage = 'reception' | 'analysis' | 'strategy' | 'research' | 'drafting' | 'review';

export function useChatState() {
  const [currentStage, setCurrentStage] = useState<ChatStage>('reception');
  const [activeAgent, setActiveAgent] = useState<AgentType>('analista-requisitos');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [workflowSelected, setWorkflowSelected] = useState<string | null>(null);

  return {
    currentStage,
    setCurrentStage,
    activeAgent,
    setActiveAgent,
    isProcessing,
    setIsProcessing,
    clientInfo,
    setClientInfo,
    workflowSelected,
    setWorkflowSelected
  };
}
