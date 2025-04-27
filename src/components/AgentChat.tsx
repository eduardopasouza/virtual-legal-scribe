
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Send, User, Bot, ChevronDown } from 'lucide-react';
import { useAgentSimulation, AgentType } from '@/hooks/useAgentSimulation';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

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
  const agentOptions: { value: AgentType; label: string; description: string }[] = [
    { value: 'analista-requisitos', label: 'Analista de Requisitos', description: 'Especialista em extrair informações e identificar requisitos legais de documentos' },
    { value: 'estrategista', label: 'Estrategista', description: 'Desenvolve estratégias jurídicas e planos de ação para o caso' },
    { value: 'revisor-legal', label: 'Revisor Legal', description: 'Verifica aspectos legais e conformidade com a legislação' },
    { value: 'assistente-redacao', label: 'Assistente de Redação', description: 'Ajuda a elaborar e estruturar documentos jurídicos' },
    { value: 'pesquisador', label: 'Pesquisador', description: 'Busca jurisprudência e referências legais relevantes' },
  ];

  // Sugestões de perguntas comuns para cada agente
  const suggestionsByAgent: Record<AgentType, string[]> = {
    'analista-requisitos': [
      'O que você pode identificar neste documento?',
      'Quais são os principais pontos de atenção?',
      'Quais documentos adicionais preciso fornecer?'
    ],
    'estrategista': [
      'Qual sua recomendação para este caso?',
      'Quais são os riscos envolvidos?',
      'Qual a probabilidade de sucesso?'
    ],
    'revisor-legal': [
      'Este documento está conforme a legislação?',
      'Há alguma inconsistência legal?',
      'Quais são os pontos fortes e fracos?'
    ],
    'assistente-redacao': [
      'Ajude-me a redigir uma resposta',
      'Como posso melhorar este argumento?',
      'Preciso de um modelo de petição'
    ],
    'pesquisador': [
      'Busque jurisprudência sobre este assunto',
      'Quais precedentes se aplicam a este caso?',
      'Encontre legislação relacionada a este tema'
    ]
  };
  
  // Add welcome message from agent on first render
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = caseId 
        ? `Olá! Sou o ${agentOptions.find(agent => agent.value === selectedAgent)?.label}. Como posso ajudar com este caso específico?`
        : `Olá! Sou o ${agentOptions.find(agent => agent.value === selectedAgent)?.label}. Como posso ajudar hoje?`;
      
      setMessages([
        {
          id: 'welcome',
          text: welcomeMessage,
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

  const useSuggestion = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Chat com Agente</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                {agentOptions.find(agent => agent.value === selectedAgent)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="py-1">
                {agentOptions.map((agent) => (
                  <button
                    key={agent.value}
                    onClick={() => changeAgent(agent.value)}
                    className={`block w-full text-left px-4 py-2 ${
                      agent.value === selectedAgent
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium">{agent.label}</div>
                    <div className="text-xs text-muted-foreground">{agent.description}</div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
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
