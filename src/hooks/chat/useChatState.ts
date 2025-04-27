
import { useState } from 'react';
import { AgentType } from '@/hooks/agent/types';
import { WorkflowStage } from '@/workflow/types';

export function useChatState() {
  const [currentStage, setCurrentStage] = useState<WorkflowStage | undefined>(undefined);
  const [activeAgent, setActiveAgent] = useState<AgentType>('comunicador');
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
