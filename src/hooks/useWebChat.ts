
import { useState, useEffect } from 'react';
import { Message } from '@/types/agent-chat';
import { AgentType, useAgentSimulation } from './useAgentSimulation';
import { useToast } from '@/hooks/use-toast';
import { agents } from '@/constants/agents';

interface WebChatState {
  currentStage: 'reception' | 'analysis' | 'strategy' | 'research' | 'drafting' | 'review';
  clientInfo: any | null;
  workflowSelected: string | null;
}

export function useWebChat(caseId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentStage, setCurrentStage] = useState<WebChatState['currentStage']>('reception');
  const [activeAgent, setActiveAgent] = useState<AgentType>('analista-requisitos');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [workflowSelected, setWorkflowSelected] = useState<string | null>(null);
  
  const { simulateAgent } = useAgentSimulation(caseId);
  const { toast } = useToast();

  useEffect(() => {
    if (messages.length === 0) {
      addWelcomeMessage();
    }
  }, []);

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      text: `Olá! Sou a assistente de IA do EVJI. Como posso ajudar você hoje? Gostaria de discutir um caso existente ou criar um novo?`,
      sender: 'agent',
      timestamp: new Date(),
      agentType: 'analista-requisitos'
    };
    
    setMessages([welcomeMessage]);
    
    if (!caseId) {
      setTimeout(() => {
        const followUpMessage: Message = {
          id: `request-info-${Date.now()}`,
          text: `Para começarmos, poderia por favor me informar o nome do cliente para quem estamos prestando serviços? Se for um novo cliente, informe o nome completo.`,
          sender: 'agent',
          timestamp: new Date(),
          agentType: 'analista-requisitos',
          action: 'request'
        };
        
        setMessages(prev => [...prev, followUpMessage]);
      }, 1500);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
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
      
      setMessages(prev => [...prev, agentMessage]);
      
    } catch (error: any) {
      console.error('Erro no processamento do agente:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `Desculpe, ocorreu um erro ao processar sua solicitação.`,
        sender: 'agent',
        timestamp: new Date(),
        agentType: activeAgent
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro de comunicação",
        description: error.message || "Não foi possível processar sua solicitação",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const changeAgent = (agentType: AgentType) => {
    if (agentType === activeAgent) return;
    
    setActiveAgent(agentType);
    
    const switchMessage: Message = {
      id: `switch-${Date.now()}`,
      text: `Olá! Agora você está falando com o ${agents.find(a => a.type === agentType)?.name || 'especialista'}. Como posso ajudar com o caso?`,
      sender: 'agent',
      timestamp: new Date(),
      agentType: agentType
    };
    
    setMessages(prev => [...prev, switchMessage]);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    currentStage,
    activeAgent,
    isProcessing,
    clientInfo,
    workflowSelected,
    handleSendMessage,
    changeAgent
  };
}
