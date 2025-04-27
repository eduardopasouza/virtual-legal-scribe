
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User2, FileSearch, Lightbulb, Search, PenTool, CheckSquare, Eye } from "lucide-react";

interface AgentsListProps {
  onAgentSelect?: (agentId: string) => void;
  expanded?: boolean;
}

interface Agent {
  id: number;
  name: string;
  role: string;
  description: string;
  status: 'active' | 'idle' | 'offline';
  icon: React.ReactNode;
  tasks?: string[];
}

export function AgentsList({ onAgentSelect, expanded }: AgentsListProps) {
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  
  const agents: Agent[] = [
    {
      id: 1,
      name: "Recepcionista",
      role: "Atendimento",
      description: "Recebe documentos e coordena o fluxo inicial",
      status: 'active',
      icon: <User2 className="h-5 w-5 text-blue-500" />,
      tasks: [
        "Receber documentos do caso",
        "Classificar por área do direito",
        "Gerar briefing inicial",
        "Verificar documentos necessários"
      ]
    },
    {
      id: 2,
      name: "Analisador",
      role: "Análise",
      description: "Extrai informações relevantes dos documentos",
      status: 'active',
      icon: <FileSearch className="h-5 w-5 text-purple-500" />,
      tasks: [
        "Analisar documentos recebidos",
        "Extrair dados relevantes",
        "Identificar inconsistências",
        "Preparar relatório analítico"
      ]
    },
    {
      id: 3,
      name: "Estrategista",
      role: "Estratégia",
      description: "Define o plano de ação para o caso",
      status: 'idle',
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      tasks: [
        "Analisar viabilidade do caso",
        "Definir objetivos principais",
        "Mapear riscos potenciais",
        "Criar plano estratégico"
      ]
    },
    {
      id: 4,
      name: "Pesquisador",
      role: "Pesquisa",
      description: "Localiza legislação e jurisprudência relevantes",
      status: 'idle',
      icon: <Search className="h-5 w-5 text-green-500" />,
      tasks: [
        "Pesquisar legislação aplicável",
        "Compilar jurisprudência relevante",
        "Analisar doutrina especializada",
        "Construir argumentos principais"
      ]
    },
    {
      id: 5,
      name: "Redator",
      role: "Redação",
      description: "Elabora peças processuais conforme metodologia FIRAC",
      status: 'offline',
      icon: <PenTool className="h-5 w-5 text-rose-500" />,
      tasks: [
        "Estruturar documento conforme tipo",
        "Redigir fundamentação jurídica",
        "Incorporar argumentos e provas",
        "Formular pedidos específicos"
      ]
    },
    {
      id: 6,
      name: "Revisor",
      role: "Revisão",
      description: "Verifica a qualidade e precisão do conteúdo",
      status: 'offline',
      icon: <CheckSquare className="h-5 w-5 text-sky-500" />,
      tasks: [
        "Verificar requisitos formais",
        "Revisar citações e referências",
        "Validar coerência estratégica",
        "Formatar documento final"
      ]
    },
    {
      id: 7,
      name: "Supervisor",
      role: "Supervisão",
      description: "Coordena os demais agentes e garante qualidade",
      status: 'active',
      icon: <Eye className="h-5 w-5 text-evji-accent" />,
      tasks: [
        "Coordenar atividades dos agentes",
        "Monitorar prazos e alertas",
        "Avaliar qualidade das entregas",
        "Reportar progresso ao cliente"
      ]
    },
  ];
  
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-amber-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'idle':
        return 'Em espera';
      case 'offline':
        return 'Offline';
      default:
        return 'Desconhecido';
    }
  };

  // Determine the grid columns based on expanded prop
  const gridColumns = expanded 
    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agentes</CardTitle>
        <CardDescription>
          Status dos agentes especializados do EVJI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`grid ${gridColumns} gap-4`}>
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              className={`agent-card rounded-lg p-4 flex flex-col cursor-pointer transition-all duration-200 ${
                hoveredAgent === agent.id ? 'bg-secondary/70 shadow-md' : 'hover:bg-secondary/50'
              }`}
              onClick={() => onAgentSelect && onAgentSelect(agent.id.toString())}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{agent.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{agent.name}</h3>
                    <div 
                      className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} animate-pulse-subtle`}
                      title={getStatusText(agent.status)}
                    />
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {agent.role}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    {agent.description}
                  </p>
                </div>
              </div>
              
              {/* Show tasks on hover */}
              {hoveredAgent === agent.id && agent.tasks && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <h4 className="text-xs font-medium mb-1">Funções principais:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {agent.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
