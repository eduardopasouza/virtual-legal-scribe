
import { useState } from 'react';
import { AgentType, AgentSimulationState } from './types';

export function useAgentProcessing() {
  const [isProcessing, setIsProcessing] = useState<AgentSimulationState>({});

  const startProcessing = (agentType: AgentType) => {
    setIsProcessing(prev => ({ ...prev, [agentType]: true }));
  };

  const stopProcessing = (agentType: AgentType) => {
    setIsProcessing(prev => ({ ...prev, [agentType]: false }));
  };

  return {
    isProcessing,
    startProcessing,
    stopProcessing
  };
}
