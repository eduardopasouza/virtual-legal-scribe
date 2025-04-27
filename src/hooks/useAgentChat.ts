
import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/agent-chat';
import { AgentType, useAgentSimulation } from './useAgentSimulation';
import { agentOptions } from '@/constants/agents';

export function useAgentChat(caseId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('analista-requisitos');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { simulateAgent } = useAgentSimulation(caseId);

  // Add welcome message on first render
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `Olá! Sou o ${agentOptions.find(agent => agent.value === selectedAgent)?.label}. Como posso ajudar hoje?`,
        sender: 'agent',
        timestamp: new Date(),
        agentType: selectedAgent
      };
      
      setMessages([welcomeMessage]);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const result = await simulateAgent(selectedAgent);
      
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        text: result.message,
        sender: 'agent',
        timestamp: new Date(),
        agentType: selectedAgent,
        metadata: result.details
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error: any) {
      console.error('Error in agent chat:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Desculpe, ocorreu um erro ao processar sua solicitação.',
        sender: 'agent',
        timestamp: new Date(),
        agentType: selectedAgent
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const changeAgent = (agent: AgentType) => {
    if (agent === selectedAgent) return;
    
    setSelectedAgent(agent);
    
    const switchMessage: Message = {
      id: `switch-${Date.now()}`,
      text: `Olá! Agora você está falando com ${agentOptions.find(a => a.value === agent)?.label}. Como posso ajudar?`,
      sender: 'agent',
      timestamp: new Date(),
      agentType: agent
    };
    
    setMessages(prev => [...prev, switchMessage]);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    selectedAgent,
    changeAgent,
    handleSendMessage,
    isProcessing,
    messagesEndRef
  };
}
