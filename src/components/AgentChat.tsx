
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Send, User, Bot, ChevronDown } from 'lucide-react';
import { useAgentSimulation, AgentType } from '@/hooks/useAgentSimulation';

interface AgentChatProps {
  caseId?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentType?: AgentType;
}

export function AgentChat({ caseId }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('analista-requisitos');
  const { simulateAgent, isProcessing } = useAgentSimulation(caseId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Agent options
  const agentOptions: { value: AgentType; label: string }[] = [
    { value: 'analista-requisitos', label: 'Analista de Requisitos' },
    { value: 'estrategista', label: 'Estrategista' },
    { value: 'revisor-legal', label: 'Revisor Legal' },
    { value: 'assistente-redacao', label: 'Assistente de Redação' },
    { value: 'pesquisador', label: 'Pesquisador' },
  ];
  
  // Add welcome message from agent on first render
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: `Olá! Sou o ${agentOptions.find(agent => agent.value === selectedAgent)?.label}. Como posso ajudar com este caso?`,
          sender: 'agent',
          timestamp: new Date(),
          agentType: selectedAgent
        }
      ]);
    }
  }, []);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isProcessing[selectedAgent]) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    try {
      // Simulate agent processing
      const result = await simulateAgent(selectedAgent);
      
      // Add agent response
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        text: result.message + (result.details ? `\n\n${JSON.stringify(result.details, null, 2)}` : ''),
        sender: 'agent',
        timestamp: new Date(),
        agentType: selectedAgent
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error getting agent response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Desculpe, ocorreu um erro ao processar sua solicitação.',
        sender: 'agent',
        timestamp: new Date(),
        agentType: selectedAgent
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const changeAgent = (agent: AgentType) => {
    if (agent === selectedAgent) return;
    
    setSelectedAgent(agent);
    // Add a message from the new agent
    const switchMessage: Message = {
      id: `switch-${Date.now()}`,
      text: `Olá! Agora você está conversando com ${agentOptions.find(a => a.value === agent)?.label}. Como posso ajudar?`,
      sender: 'agent',
      timestamp: new Date(),
      agentType: agent
    };
    
    setMessages(prev => [...prev, switchMessage]);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Chat com Agente</CardTitle>
          <div className="relative group">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              {agentOptions.find(agent => agent.value === selectedAgent)?.label}
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-popover text-popover-foreground z-10 hidden group-hover:block">
              <div className="py-1">
                {agentOptions.map((agent) => (
                  <button
                    key={agent.value}
                    onClick={() => changeAgent(agent.value)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      agent.value === selectedAgent
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {agent.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto mb-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'agent' && (
                    <Avatar className="h-6 w-6 bg-background">
                      <Bot className="h-4 w-4" />
                    </Avatar>
                  )}
                  <div>
                    <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-6 w-6 bg-background">
                      <User className="h-4 w-4" />
                    </Avatar>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing[selectedAgent]}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isProcessing[selectedAgent]}
          >
            {isProcessing[selectedAgent] ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
