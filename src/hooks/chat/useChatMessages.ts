
import { useState } from 'react';
import { Message } from '@/types/agent-chat';

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      text: `Olá! Sou a assistente de IA do EVJI. Como posso ajudar você hoje? Gostaria de discutir um caso existente ou criar um novo?`,
      sender: 'agent',
      timestamp: new Date(),
      agentType: 'analista-requisitos'
    };
    
    setMessages([welcomeMessage]);
    
    setTimeout(() => {
      const followUpMessage: Message = {
        id: `request-info-${Date.now()}`,
        text: `Para começarmos, poderia por favor me informar o nome do cliente para quem estamos prestando serviços? Se for um novo cliente, informe o nome completo.`,
        sender: 'agent',
        timestamp: new Date(),
        agentType: 'analista-requisitos',
        action: 'request'
      };
      
      addMessage(followUpMessage);
    }, 1500);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    addMessage,
    addWelcomeMessage
  };
}
