
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User2, FileSearch, Lightbulb, Search, PenTool, CheckSquare, Eye } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  role: string;
  description: string;
  status: 'active' | 'idle' | 'offline';
  icon: React.ReactNode;
}

export function AgentsList() {
  const agents: Agent[] = [
    {
      id: 1,
      name: "Recepcionista",
      role: "Atendimento",
      description: "Recebe documentos e coordena o fluxo inicial",
      status: 'active',
      icon: <User2 className="h-5 w-5 text-blue-500" />
    },
    {
      id: 2,
      name: "Analisador",
      role: "Análise",
      description: "Extrai informações relevantes dos documentos",
      status: 'active',
      icon: <FileSearch className="h-5 w-5 text-purple-500" />
    },
    {
      id: 3,
      name: "Estrategista",
      role: "Estratégia",
      description: "Define o plano de ação para o caso",
      status: 'idle',
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />
    },
    {
      id: 4,
      name: "Pesquisador",
      role: "Pesquisa",
      description: "Localiza legislação e jurisprudência relevantes",
      status: 'idle',
      icon: <Search className="h-5 w-5 text-green-500" />
    },
    {
      id: 5,
      name: "Redator",
      role: "Redação",
      description: "Elabora peças processuais conforme metodologia FIRAC",
      status: 'offline',
      icon: <PenTool className="h-5 w-5 text-rose-500" />
    },
    {
      id: 6,
      name: "Revisor",
      role: "Revisão",
      description: "Verifica a qualidade e precisão do conteúdo",
      status: 'offline',
      icon: <CheckSquare className="h-5 w-5 text-sky-500" />
    },
    {
      id: 7,
      name: "Supervisor",
      role: "Supervisão",
      description: "Coordena os demais agentes e garante qualidade",
      status: 'active',
      icon: <Eye className="h-5 w-5 text-evji-accent" />
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agentes</CardTitle>
        <CardDescription>
          Status dos agentes especializados do EVJI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="agent-card rounded-lg p-4 flex items-start gap-3">
              <div className="mt-1">{agent.icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{agent.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} animate-pulse-subtle`} />
                </div>
                <Badge variant="outline" className="mt-1 text-xs">
                  {agent.role}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {agent.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
