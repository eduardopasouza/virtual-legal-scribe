
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare } from 'lucide-react';
import { AgentType } from '@/hooks/useAgentSimulation';
import { agents } from '@/constants/agents';

interface ChatHeaderProps {
  activeAgent: AgentType;
  onAgentChange: (agent: AgentType) => void;
  currentStage: string;
  clientInfo: any | null;
}

export function ChatHeader({ activeAgent, onAgentChange, currentStage, clientInfo }: ChatHeaderProps) {
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

  return (
    <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between space-y-0">
      <div>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
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
              onClick={() => onAgentChange(agent.type)}
              title={agent.description}
              className="text-xs px-2 py-1"
            >
              {agent.name.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </CardHeader>
  );
}
