
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/components/notification/NotificationSystem';
import { getAgent } from '@/agents';
import { AgentType, AgentResult, AgentSimulationState, AgentSimulationHook } from '@/types/agent';

export { AgentType };

export function useAgentSimulation(caseId?: string): AgentSimulationHook {
  const [isProcessing, setIsProcessing] = useState<AgentSimulationState>({});
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const simulateAgent = async (agentType: AgentType): Promise<AgentResult> => {
    setIsProcessing(prev => ({ ...prev, [agentType]: true }));

    try {
      const agent = getAgent(agentType);
      
      if (!agent) {
        throw new Error(`Agente ${agentType} não encontrado`);
      }

      const result = await agent.execute({ caseId });

      toast({
        title: result.success ? "Processamento concluído" : "Erro no processamento",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      addNotification(
        result.success ? 'success' : 'alert',
        agent.name,
        result.message,
        'case'
      );

      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao executar o agente";
      
      toast({
        title: "Erro no processamento",
        description: errorMessage,
        variant: "destructive",
      });
      
      addNotification('alert', 'Erro no Processamento', errorMessage, 'system');
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsProcessing(prev => ({ ...prev, [agentType]: false }));
    }
  };

  return {
    simulateAgent,
    isProcessing
  };
}
