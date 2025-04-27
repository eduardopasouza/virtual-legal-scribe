
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/components/notification/NotificationSystem';
import { AgentType } from '@/types/agent';
import { getAgent } from '@/agents';

interface SimulationResult {
  success: boolean;
  message: string;
  details?: any;
}

export function useAgentSimulation(caseId?: string) {
  const [isProcessing, setIsProcessing] = useState<{ [key in AgentType]?: boolean }>({});
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const simulateAgent = async (agentType: AgentType): Promise<SimulationResult> => {
    setIsProcessing(prev => ({ ...prev, [agentType]: true }));

    try {
      const agent = getAgent(agentType);
      
      if (!agent) {
        throw new Error(`Agente ${agentType} não encontrado`);
      }

      const result = await agent.execute({ caseId });

      // Usar o formato de toast com sonner para uma experiência melhor
      toast({
        title: result.success ? "Processamento concluído" : "Erro no processamento",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      // Adicionar notificação baseada no resultado
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
