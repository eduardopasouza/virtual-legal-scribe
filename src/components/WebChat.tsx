
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { useWebChat } from '@/hooks/useWebChat';

interface WebChatProps {
  fullScreen?: boolean;
  caseId?: string;
  onClientIdentified?: (clientData: any) => void;
  onWorkflowSelected?: (workflow: string) => void;
  onAgentAssigned?: (agent: any) => void;
}

export function WebChat({ 
  fullScreen = false, 
  caseId,
  onClientIdentified,
  onWorkflowSelected,
  onAgentAssigned
}: WebChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    newMessage,
    setNewMessage,
    currentStage,
    activeAgent,
    isProcessing,
    clientInfo,
    handleSendMessage,
    changeAgent
  } = useWebChat(caseId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className={`flex flex-col ${fullScreen ? 'h-[calc(100vh-8rem)]' : 'h-[600px]'}`}>
      <ChatHeader
        activeAgent={activeAgent}
        onAgentChange={changeAgent}
        currentStage={currentStage}
        clientInfo={clientInfo}
      />
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ChatMessages 
          messages={messages}
          messagesEndRef={messagesEndRef}
        />
      </CardContent>
      
      <CardFooter className="border-t pt-3 pb-3">
        <ChatInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          isProcessing={isProcessing}
        />
      </CardFooter>
    </Card>
  );
}
