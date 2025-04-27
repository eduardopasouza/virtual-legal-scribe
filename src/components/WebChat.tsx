import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  User, 
  Bot, 
  Send, 
  FileText, 
  Clock, 
  Calendar,
  Users,
  Folder,
  Link,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAgentSimulation, AgentType } from '@/hooks/useAgentSimulation';
import { useQueryClient } from '@tanstack/react-query';
import { useCaseOperations } from '@/hooks/useCaseOperations';
import { useAuth } from '@/lib/auth/AuthContext';
import { Message } from '@/types/agent-chat';

interface WebChatProps {
  fullScreen?: boolean;
  caseId?: string;
  onClientIdentified?: (clientData: any) => void;
  onWorkflowSelected?: (workflow: string) => void;
  onAgentAssigned?: (agent: AgentType) => void;
}

export function WebChat({ 
  fullScreen = false, 
  caseId,
  onClientIdentified,
  onWorkflowSelected,
  onAgentAssigned
}: WebChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentStage, setCurrentStage] = useState<'reception' | 'analysis' | 'strategy' | 'research' | 'drafting' | 'review'>('reception');
  const [activeAgent, setActiveAgent] = useState<AgentType>('analista-requisitos');
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [workflowSelected, setWorkflowSelected] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { simulateAgent } = useAgentSimulation(caseId);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { createCase } = useCaseOperations();
  const { user } = useAuth();
  
  // Agentes disponíveis e suas descrições
  const agents = [
    { 
      type: 'analista-requisitos' as AgentType, 
      name: 'Analista de Requisitos',
      description: 'Especializado em extrair informações essenciais de documentos e conversas',
      stage: 'reception'
    },
    { 
      type: 'estrategista' as AgentType, 
      name: 'Estrategista',
      description: 'Desenvolve o plano de ação e determina a melhor abordagem legal',
      stage: 'strategy'
    },
    { 
      type: 'pesquisador' as AgentType, 
      name: 'Pesquisador',
      description: 'Localiza legislação, jurisprudência e fundamentação para o caso',
      stage: 'research'
    },
    { 
      type: 'assistente-redacao' as AgentType, 
      name: 'Redator',
      description: 'Especialista em elaboração de documentos jurídicos',
      stage: 'drafting'
    },
    { 
      type: 'revisor-legal' as AgentType, 
      name: 'Revisor Legal',
      description: 'Verifica a conformidade e qualidade dos documentos produzidos',
      stage: 'review'
    }
  ];
  
  // Áreas do direito expandidas
  const areasJuridicas = [
    { id: 'civil', name: 'Direito Civil' },
    { id: 'penal', name: 'Direito Penal' },
    { id: 'trabalhista', name: 'Direito Trabalhista' },
    { id: 'tributario', name: 'Direito Tributário' },
    { id: 'administrativo', name: 'Direito Administrativo' },
    { id: 'previdenciario', name: 'Direito Previdenciário' },
    { id: 'ambiental', name: 'Direito Ambiental' },
    { id: 'consumidor', name: 'Direito do Consumidor' },
    { id: 'empresarial', name: 'Direito Empresarial' },
    { id: 'digital', name: 'Direito Digital' },
    { id: 'familia', name: 'Direito de Família' },
    { id: 'sucessoes', name: 'Direito das Sucessões' },
    { id: 'imobiliario', name: 'Direito Imobiliário' }
  ];
  
  // Adiciona mensagem de boas-vindas do agente quando o componente é montado
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        text: `Olá! Sou a assistente de IA do EVJI. Como posso ajudar você hoje? Gostaria de discutir um caso existente ou criar um novo?`,
        sender: 'agent',
        timestamp: new Date(),
        agentType: 'analista-requisitos'
      };
      
      setMessages([welcomeMessage]);
      
      // Se não tiver caseId, inicia fluxo de identificação do cliente
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
    }
  }, []);
  
  // Rola para a parte inferior quando novas mensagens são adicionadas
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
      // Caso esteja no estágio de recepção e ainda não tem informações do cliente
      if (currentStage === 'reception' && !clientInfo) {
        // Simula identificação do cliente pelo nome
        await processClientIdentification(newMessage);
        
      } else if (currentStage === 'reception' && clientInfo && !workflowSelected) {
        // Cliente já identificado, agora escolhe o workflow
        await processWorkflowSelection(newMessage);
        
      } else {
        // Processamento normal com o agente atual
        const result = await simulateAgent(activeAgent);
        
        const agentResponse: Message = {
          id: `agent-${Date.now()}`,
          text: result.message,
          sender: 'agent',
          timestamp: new Date(),
          agentType: activeAgent,
          metadata: result.details
        };
        
        setMessages(prev => [...prev, agentResponse]);
        
        // Adiciona informações de próximas etapas quando apropriado
        if (Math.random() > 0.5) {
          setTimeout(() => {
            const nextStepsMessage: Message = {
              id: `next-steps-${Date.now()}`,
              text: `Com base na nossa conversa, recomendo avançarmos para a próxima etapa: ${getNextStageName()}. Você gostaria de prosseguir?`,
              sender: 'agent',
              timestamp: new Date(),
              agentType: activeAgent,
              action: 'confirmation'
            };
            
            setMessages(prev => [...prev, nextStepsMessage]);
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error('Erro no processamento do agente:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.`,
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
  
  const processClientIdentification = async (clientName: string) => {
    // Simular verificação do cliente no banco de dados
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simula um cliente encontrado ou não
    const clientFound = Math.random() > 0.7;
    
    if (clientFound) {
      // Simula cliente encontrado
      const mockClientData = {
        id: `client-${Date.now()}`,
        name: clientName,
        email: `${clientName.toLowerCase().replace(/\s/g, '.')}@exemplo.com`,
        phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        cases: Math.floor(Math.random() * 5),
        status: 'active'
      };
      
      setClientInfo(mockClientData);
      
      if (onClientIdentified) {
        onClientIdentified(mockClientData);
      }
      
      const foundMessage: Message = {
        id: `client-found-${Date.now()}`,
        text: `Encontrei o registro do cliente ${clientName} no sistema. Vejo que já temos ${mockClientData.cases} caso(s) anterior(es). Qual o assunto do caso que gostaria de discutir hoje?`,
        sender: 'agent',
        timestamp: new Date(),
        agentType: activeAgent,
        action: 'info',
        metadata: mockClientData
      };
      
      setMessages(prev => [...prev, foundMessage]);
      
    } else {
      // Simula cliente não encontrado - precisa coletar mais informações
      const newClientMessage: Message = {
        id: `new-client-${Date.now()}`,
        text: `Não encontrei registros para "${clientName}". Vamos criar um novo cadastro. Por favor, informe o email e telefone de contato do cliente no formato: email@dominio.com | (00) 00000-0000`,
        sender: 'agent',
        timestamp: new Date(),
        agentType: activeAgent,
        action: 'request'
      };
      
      setMessages(prev => [...prev, newClientMessage]);
      
      // Simulamos recebimento das informações adicionais
      setTimeout(() => {
        const mockClientData = {
          id: `client-${Date.now()}`,
          name: clientName,
          email: `${clientName.toLowerCase().replace(/\s/g, '.')}@exemplo.com`,
          phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
          cases: 0,
          status: 'active'
        };
        
        setClientInfo(mockClientData);
        
        if (onClientIdentified) {
          onClientIdentified(mockClientData);
        }
        
        const confirmationMessage: Message = {
          id: `client-created-${Date.now()}`,
          text: `Ótimo! Registrei o novo cliente. Agora, me conte qual é o assunto ou área do direito relacionada ao caso que deseja discutir?`,
          sender: 'agent',
          timestamp: new Date(),
          agentType: activeAgent,
          action: 'info',
          metadata: mockClientData
        };
        
        setMessages(prev => [...prev, confirmationMessage]);
      }, 3000);
    }
  };
  
  const processWorkflowSelection = async (description: string) => {
    // Simular análise do texto para determinar área/workflow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Lógica simples para simular seleção de área baseada em palavras-chave
    const areaKeywords = {
      civil: ['civil', 'contrato', 'danos', 'indenização'],
      penal: ['penal', 'crime', 'criminal', 'infração'],
      trabalhista: ['trabalho', 'trabalhista', 'demissão', 'salário'],
      tributario: ['imposto', 'tributário', 'fiscal', 'receita'],
      empresarial: ['empresa', 'societário', 'sócio', 'fusão'],
      consumidor: ['consumidor', 'produto', 'serviço', 'defeito']
    };
    
    // Determina a área com base em palavras-chave
    const lowerDesc = description.toLowerCase();
    let selectedArea = 'civil'; // padrão
    
    Object.entries(areaKeywords).forEach(([area, keywords]) => {
      if (keywords.some(word => lowerDesc.includes(word))) {
        selectedArea = area;
      }
    });
    
    const selectedAreaObj = areasJuridicas.find(area => area.id === selectedArea);
    
    setWorkflowSelected(selectedArea);
    
    if (onWorkflowSelected) {
      onWorkflowSelected(selectedArea);
    }
    
    // Atualiza o estágio e agente com base na área selecionada
    setCurrentStage('analysis');
    setActiveAgent('analista-requisitos');
    
    if (onAgentAssigned) {
      onAgentAssigned('analista-requisitos');
    }
    
    // Mensagem de confirmação da área e próximos passos
    const workflowMessage: Message = {
      id: `workflow-${Date.now()}`,
      text: `Baseado na sua descrição, identifiquei que este caso está relacionado à área de ${selectedAreaObj?.name || selectedArea}. Vou iniciar a análise dos requisitos. Há algum detalhe específico ou documento que você gostaria de destacar neste momento?`,
      sender: 'agent',
      timestamp: new Date(),
      agentType: 'analista-requisitos',
      action: 'info',
      metadata: { area: selectedArea }
    };
    
    setMessages(prev => [...prev, workflowMessage]);
    
    // Oferece opções de próximos passos
    setTimeout(() => {
      const optionsMessage: Message = {
        id: `options-${Date.now()}`,
        text: `Posso ajudar você com as seguintes ações:\n1. Analisar documentos relacionados ao caso\n2. Definir uma estratégia inicial\n3. Pesquisar jurisprudência relevante\n4. Elaborar um documento preliminar\n\nO que você prefere fazer primeiro?`,
        sender: 'agent',
        timestamp: new Date(),
        agentType: 'analista-requisitos',
        action: 'request'
      };
      
      setMessages(prev => [...prev, optionsMessage]);
    }, 2500);
  };
  
  const getNextStageName = () => {
    switch (currentStage) {
      case 'reception': return 'Análise Jurídica';
      case 'analysis': return 'Planejamento Estratégico';
      case 'strategy': return 'Pesquisa e Fundamentação';
      case 'research': return 'Elaboração de Documentos';
      case 'drafting': return 'Revisão Legal';
      case 'review': return 'Entrega e Feedback';
      default: return 'Próxima etapa';
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const changeAgent = (agentType: AgentType) => {
    if (agentType === activeAgent) return;
    
    setActiveAgent(agentType);
    
    // Atualiza o estágio com base no novo agente
    const selectedAgent = agents.find(agent => agent.type === agentType);
    if (selectedAgent && selectedAgent.stage) {
      setCurrentStage(selectedAgent.stage as any);
    }
    
    if (onAgentAssigned) {
      onAgentAssigned(agentType);
    }
    
    // Adiciona mensagem de boas-vindas do novo agente
    const switchMessage: Message = {
      id: `switch-${Date.now()}`,
      text: `Olá! Agora você está falando com o ${agents.find(a => a.type === agentType)?.name || 'especialista'}. Como posso ajudar com o caso?`,
      sender: 'agent',
      timestamp: new Date(),
      agentType: agentType
    };
    
    setMessages(prev => [...prev, switchMessage]);
  };

  return (
    <Card className={`flex flex-col ${fullScreen ? 'h-[calc(100vh-8rem)]' : 'h-[600px]'}`}>
      <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-evji-primary" />
            <span>Assistente EVJI</span>
            {clientInfo && (
              <Badge variant="outline" className="ml-2">
                Cliente: {clientInfo.name}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {currentStage === 'reception' 
              ? 'Identificação de necessidades e coleta de informações' 
              : `Etapa: ${getNextStageName()}`}
          </CardDescription>
        </div>
        
        <Tabs value={activeAgent} className="w-auto">
          <TabsList className="grid grid-cols-5 gap-1">
            {agents.map(agent => (
              <TabsTrigger
                key={agent.type}
                value={agent.type}
                onClick={() => changeAgent(agent.type)}
                title={agent.description}
                className="text-xs px-2 py-1"
              >
                {agent.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : message.action === 'request'
                  ? 'bg-blue-50 border border-blue-200'
                  : message.action === 'confirmation'
                  ? 'bg-green-50 border border-green-200'
                  : message.action === 'info'
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-muted'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'agent' && (
                  <Avatar className={`h-6 w-6 ${message.action ? 'bg-blue-100' : 'bg-background'}`}>
                    <Bot className="h-4 w-4" />
                  </Avatar>
                )}
                <div>
                  <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                  
                  {/* Mostra metadados quando relevantes */}
                  {message.metadata && message.action === 'info' && (
                    <div className="mt-2 border-t pt-2 text-xs space-y-1">
                      {Object.entries(message.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs mt-1 opacity-70">
                    {message.sender === 'agent' && message.agentType && (
                      <span className="mr-2">
                        {agents.find(a => a.type === message.agentType)?.name || 'Agente'}
                      </span>
                    )}
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-6 w-6 bg-background">
                    <User className="h-4 w-4" />
                  </Avatar>
                )}
              </div>
              
              {/* Botões de ação para certos tipos de mensagens */}
              {message.action === 'confirmation' && (
                <div className="mt-2 flex gap-2 justify-end">
                  <Button variant="outline" size="sm">Não agora</Button>
                  <Button size="sm">Continuar</Button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t pt-3 pb-3">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isProcessing}
          >
            {isProcessing ? (
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
