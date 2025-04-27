
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { AgentType } from '@/hooks/agent/types';
import { Message } from '@/types/agent-chat';
import { agents } from '@/constants/agents';
import { toast } from 'sonner';

export function useAgentInteraction(
  caseId?: string,
  activeAgent?: AgentType,
  addMessage?: (message: Message) => void,
  setIsProcessing?: (isProcessing: boolean) => void
) {
  const { simulateAgent } = useAgentSimulation(caseId);

  const handleAgentInteraction = async (userMessage: string) => {
    if (!activeAgent || !addMessage || !setIsProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const result = await simulateAgent(activeAgent);
      
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        text: result.message,
        sender: 'agent',
        timestamp: new Date(),
        agentType: activeAgent,
        metadata: result.details
      };
      
      addMessage(agentMessage);
      
    } catch (error: any) {
      console.error('Erro no processamento do agente:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `Desculpe, ocorreu um erro ao processar sua solicitação.`,
        sender: 'agent',
        timestamp: new Date(),
        agentType: activeAgent
      };
      
      addMessage(errorMessage);
      
      // Fix: Updating the toast function call to match the sonner API
      toast.error("Erro de comunicação", {
        description: error.message || "Não foi possível processar sua solicitação"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const changeAgent = (agentType: AgentType, addMessage: (message: Message) => void) => {
    if (agentType === activeAgent) return;
    
    const switchMessage: Message = {
      id: `switch-${Date.now()}`,
      text: `Olá! Agora você está falando com o ${agents.find(a => a.type === agentType)?.name || 'especialista'}. Como posso ajudar com o caso?`,
      sender: 'agent',
      timestamp: new Date(),
      agentType: agentType
    };
    
    addMessage(switchMessage);
  };

  return {
    handleAgentInteraction,
    changeAgent
  };
}
