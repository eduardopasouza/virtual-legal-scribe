
import { getAgent } from '@/agents';
import { AgentType, AgentResult, AgentSimulationHook, AgentTask } from './types';
import { useAgentProcessing } from './useAgentProcessing';
import { useAgentNotifications } from './useAgentNotifications';

export function useAgentSimulation(caseId?: string): AgentSimulationHook {
  const { isProcessing, startProcessing, stopProcessing } = useAgentProcessing();
  const { notifyResult, notifyError } = useAgentNotifications();

  const simulateAgent = async (agentType: AgentType, task?: Omit<AgentTask, 'caseId'>): Promise<AgentResult> => {
    startProcessing(agentType);

    try {
      const agent = getAgent(agentType);
      
      if (!agent) {
        throw new Error(`Agente ${agentType} não encontrado`);
      }

      const result = await agent.execute({ 
        caseId,
        ...task 
      });
      
      notifyResult(agent.name, result);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao executar o agente";
      notifyError(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      stopProcessing(agentType);
    }
  };

  return {
    simulateAgent,
    isProcessing
  };
}

export type { AgentType };
