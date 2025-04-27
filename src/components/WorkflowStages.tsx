
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Gavel, 
  FileText, 
  FileSearch, 
  FilePen, 
  CheckSquare, 
  MessageSquare 
} from "lucide-react";

interface WorkflowStage {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  agents: string[];
  tasks: string[];
}

export function WorkflowStages() {
  const stages: WorkflowStage[] = [
    {
      id: 1,
      name: "Recepção e Triagem",
      description: "Entrada de casos, upload de documentos e classificação",
      icon: Upload,
      agents: ["Analista de Requisitos e Triagem", "Coordenador Geral"],
      tasks: [
        "Receber documentos do caso",
        "Classificar por área do direito", 
        "Gerar briefing inicial",
        "Verificar documentos necessários"
      ]
    },
    {
      id: 2,
      name: "Planejamento Estratégico",
      description: "Análise de viabilidade e mapeamento de riscos",
      icon: Gavel,
      agents: ["Estrategista Jurídico", "Coordenador Geral"],
      tasks: [
        "Analisar viabilidade do caso",
        "Definir objetivos principais", 
        "Mapear riscos potenciais",
        "Criar plano estratégico"
      ]
    },
    {
      id: 3,
      name: "Análise Jurídica",
      description: "Extração de fatos e questões jurídicas",
      icon: FileText,
      agents: ["Analista de Fatos e Questões Jurídicas", "Especialista Jurídico Adaptável"],
      tasks: [
        "Extrair cronologia de fatos",
        "Identificar questões jurídicas", 
        "Mapear pontos controvertidos",
        "Definir teses aplicáveis"
      ]
    },
    {
      id: 4,
      name: "Pesquisa e Fundamentação",
      description: "Busca de legislação e jurisprudência",
      icon: FileSearch,
      agents: ["Pesquisador Jurídico", "Analista de Argumentação"],
      tasks: [
        "Pesquisar legislação aplicável",
        "Compilar jurisprudência relevante", 
        "Analisar doutrina especializada",
        "Construir argumentos principais"
      ]
    },
    {
      id: 5,
      name: "Elaboração de Documento",
      description: "Redação e estruturação de peças jurídicas",
      icon: FilePen,
      agents: ["Redator Jurídico", "Especialista Jurídico Adaptável"],
      tasks: [
        "Estruturar documento conforme tipo",
        "Redigir fundamentação jurídica", 
        "Incorporar argumentos e provas",
        "Formular pedidos específicos"
      ]
    },
    {
      id: 6,
      name: "Verificação e Revisão",
      description: "Conformidade, revisão textual e formatação",
      icon: CheckSquare,
      agents: ["Verificador de Conformidade", "Revisor e Integrador"],
      tasks: [
        "Verificar requisitos formais",
        "Revisar citações e referências", 
        "Validar coerência estratégica",
        "Formatar documento final"
      ]
    },
    {
      id: 7,
      name: "Entrega e Feedback",
      description: "Apresentação ao cliente e coleta de feedback",
      icon: MessageSquare,
      agents: ["Comunicador com Cliente", "Coordenador Geral"],
      tasks: [
        "Preparar apresentação ao cliente",
        "Realizar reunião de entrega", 
        "Coletar feedback do cliente",
        "Documentar lições aprendidas"
      ]
    }
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fluxo de Trabalho</CardTitle>
        <CardDescription>
          O processo completo do EVJI em 7 etapas principais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={stages[0].id.toString()} className="w-full">
          <TabsList className="grid grid-cols-7">
            {stages.map((stage) => (
              <TabsTrigger key={stage.id} value={stage.id.toString()} className="text-xs md:text-sm">
                {stage.id}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {stages.map((stage) => (
            <TabsContent key={stage.id} value={stage.id.toString()} className="mt-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-evji-primary/10 p-2 rounded-md">
                    <stage.icon className="h-6 w-6 text-evji-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{stage.name}</h3>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Agentes Envolvidos</h4>
                    <ul className="text-sm space-y-1">
                      {stage.agents.map((agent, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-evji-accent"></div>
                          {agent}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tarefas Principais</h4>
                    <ul className="text-sm space-y-1">
                      {stage.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-evji-primary"></div>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
