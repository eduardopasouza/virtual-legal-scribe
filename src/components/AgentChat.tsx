
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from 'lucide-react';
import { AgentChatProps } from '@/types/agent-chat';
import { MessageBubble } from './chat/MessageBubble';
import { ChatInput } from './chat/ChatInput';
import { useAgentChat } from '@/hooks/useAgentChat';
import { agentOptions, suggestionsByAgent } from '@/constants/agents';

export function AgentChat({ caseId }: AgentChatProps) {
  const {
    messages,
    newMessage,
    setNewMessage,
    selectedAgent,
    changeAgent,
    handleSendMessage,
    isProcessing,
    messagesEndRef
  } = useAgentChat(caseId);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const useSuggestion = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Chat com Agente</CardTitle>
          <Tabs value={selectedAgent}>
            <TabsList className="grid grid-cols-5 gap-1">
              {agentOptions.map(agent => (
                <TabsTrigger
                  key={agent.value}
                  value={agent.value}
                  onClick={() => changeAgent(agent.value)}
                  title={agent.description}
                  className="text-xs px-2 py-1"
                >
                  {agent.label.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {suggestionsByAgent[selectedAgent].map((suggestion, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-accent"
              onClick={() => useSuggestion(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>

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
