
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { AgentType } from '@/hooks/agent/types';
import { Loader2, CheckCircle, AlertCircle, Info, FileText, GitPullRequest, BookOpen, ClipboardCheck, Edit } from "lucide-react";

interface AgentInteractionProps {
  caseId?: string;
}

interface AgentInfo {
  type: AgentType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export function AgentInteraction({ caseId }: AgentInteractionProps) {
  const { simulateAgent, isProcessing } = useAgentSimulation(caseId);
  const [results, setResults] = useState<{ [key in AgentType]?: any }>({});

  const agents: AgentInfo[] = [
    {
      type: 'analista-requisitos',
      name: 'Analista de Requisitos',
      description: 'Analisa documentos e identifica requisitos legais e fatos relevantes.',
      icon: <Info className="h-5 w-5" />
    },
    {
      type: 'estrategista',
      name: 'Estrategista Jurídico',
      description: 'Desenvolve estratégias legais baseadas na análise do caso.',
      icon: <GitPullRequest className="h-5 w-5" />
    },
    {
      type: 'analista-fatos',
      name: 'Analista de Fatos',
      description: 'Extrai e categoriza fatos do caso, identificando quais são controversos ou incontroversos.',
      icon: <FileText className="h-5 w-5" />
    },
    {
      type: 'especialista-adaptavel',
      name: 'Especialista Adaptável',
      description: 'Analisa camadas avançadas como aspectos constitucionais, direito internacional e interdisciplinaridades.',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      type: 'redator',
      name: 'Redator Jurídico',
      description: 'Elabora documentos jurídicos baseados nas análises do caso.',
      icon: <FileText className="h-5 w-5" />
    },
    {
      type: 'revisor-legal',
      name: 'Verificador de Conformidade',
      description: 'Verifica requisitos formais, conformidade legal, citações, coerência e alinhamento com objetivos.',
      icon: <ClipboardCheck className="h-5 w-5" />
    },
    {
      type: 'revisor-integrador',
      name: 'Revisor Integrador',
      description: 'Revisa e aprimora os documentos jurídicos, integrando contribuições e garantindo coesão e uniformidade.',
      icon: <Edit className="h-5 w-5" />
    }
  ];

  const handleAgentAction = async (agentType: AgentType) => {
    const result = await simulateAgent(agentType);
    if (result.success) {
      setResults(prev => ({ ...prev, [agentType]: result.details }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Agentes de IA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <Card key={agent.type} className="relative overflow-hidden">
            {results[agent.type] && (
              <div className="absolute top-0 right-0">
                <Badge variant="outline" className="m-2 bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Processado
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {agent.icon}
                {agent.name}
              </CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              {results[agent.type] ? (
                <div className="text-sm space-y-2">
                  <p className="font-medium text-green-600">Processamento concluído</p>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <dl className="space-y-1">
                      {Object.entries(results[agent.type]).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2">
                          <dt className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </dt>
                          <dd>{value as string}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Clique no botão abaixo para acionar este agente e processar os documentos do caso.
                </p>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => handleAgentAction(agent.type)} 
                disabled={isProcessing[agent.type]} 
                className="w-full"
              >
                {isProcessing[agent.type] ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : results[agent.type] ? (
                  "Processar novamente"
                ) : (
                  "Acionar agente"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
