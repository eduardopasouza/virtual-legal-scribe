
import { useEffect } from 'react';
import { useChatMessages } from './chat/useChatMessages';
import { useChatState } from './chat/useChatState';
import { useAgentInteraction } from './chat/useAgentInteraction';
import { Message } from '@/types/agent-chat';
import { AgentType } from '@/hooks/agent/types';

export function useWebChat(caseId?: string) {
  const {
    messages,
    newMessage,
    setNewMessage,
    addMessage,
    addWelcomeMessage
  } = useChatMessages();

  const {
    currentStage,
    activeAgent,
    setActiveAgent,
    isProcessing,
    setIsProcessing,
    clientInfo,
    workflowSelected
  } = useChatState();

  const { handleAgentInteraction, changeAgent: handleAgentChange } = useAgentInteraction(
    caseId,
    activeAgent,
    addMessage,
    setIsProcessing
  );

  useEffect(() => {
    if (messages.length === 0) {
      addWelcomeMessage();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setNewMessage('');
    
    await handleAgentInteraction(newMessage);
  };

  const changeAgent = (agentType: AgentType) => {
    setActiveAgent(agentType);
    handleAgentChange(agentType, addMessage);
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
