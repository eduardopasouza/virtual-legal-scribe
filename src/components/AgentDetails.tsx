
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LayoutDashboard, FileText, Clock, Users, FolderOpen, FileSearch, Gavel, FilePen, FileCheck, MessageSquare, Settings } from "lucide-react";

interface AgentDetailsProps {
  agentId: string;
  onBack: () => void;
}

interface AgentInfo {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ElementType;
  color: string;
  skills: string[];
  tools: string[];
  workflows: {
    name: string;
    role: string;
  }[];
}

export function AgentDetails({ agentId, onBack }: AgentDetailsProps) {
  const agents: Record<string, AgentInfo> = {
    "coordinator": {
      id: "coordinator",
      name: "Coordenador Geral",
      role: "Gerenciamento e supervisão",
      description: "Responsável pela visão geral, distribuição de tarefas e monitoramento de prazos em todos os casos do escritório virtual.",
      icon: LayoutDashboard,
      color: "bg-blue-500",
      skills: [
        "Visão geral de casos",
        "Gerenciamento de prazos",
        "Distribuição de tarefas",
        "Monitoramento de progresso",
        "Acionamento de alertas"
      ],
      tools: [
        "Dashboard central",
        "Calendário integrado",
        "Sistema de notificações",
        "Relatórios de progresso",
        "Gerenciador de recursos"
      ],
      workflows: [
        { name: "Recepção e Triagem", role: "Supervisão" },
        { name: "Planejamento Estratégico", role: "Aprovação" },
        { name: "Entrega e Feedback", role: "Coordenação" }
      ]
    },
    "analyst": {
      id: "analyst",
      name: "Analista de Requisitos e Triagem",
      role: "Entrada e classificação de casos",
      description: "Especializado na recepção, classificação e organização inicial dos documentos e informações de novos casos.",
      icon: FileText,
      color: "bg-green-500",
      skills: [
        "Classificação de documentos",
        "Identificação de áreas do direito",
        "Organização documental",
        "Extração de informações-chave",
        "Geração de briefing inicial"
      ],
      tools: [
        "Sistema de upload de documentos",
        "Classificador automático",
        "OCR especializado",
        "Formulários inteligentes",
        "Extrator de metadados"
      ],
      workflows: [
        { name: "Recepção e Triagem", role: "Principal" }
      ]
    },
    "strategist": {
      id: "strategist",
      name: "Estrategista Jurídico",
      role: "Planejamento e estratégia",
      description: "Desenvolve a estratégia jurídica do caso com base nos objetivos do cliente e na análise preliminar dos documentos.",
      icon: Gavel,
      color: "bg-amber-500",
      skills: [
        "Análise de viabilidade",
        "Mapeamento de riscos",
        "Definição de objetivos",
        "Planejamento estratégico",
        "Avaliação de cenários"
      ],
      tools: [
        "Matriz de riscos",
        "Gerador de plano estratégico",
        "Análise de precedentes",
        "Calculadora de chances",
        "Árvore de decisão"
      ],
      workflows: [
        { name: "Planejamento Estratégico", role: "Principal" }
      ]
    },
    "facts-analyst": {
      id: "facts-analyst",
      name: "Analista de Fatos e Questões Jurídicas",
      role: "Análise de fatos e questões",
      description: "Extrai e organiza cronologicamente os fatos relevantes e identifica as questões jurídicas a serem resolvidas.",
      icon: Clock,
      color: "bg-purple-500",
      skills: [
        "Extração cronológica",
        "Identificação de fatos relevantes",
        "Formulação de questões jurídicas",
        "Mapeamento de controvérsias",
        "Classificação de relevância"
      ],
      tools: [
        "Linha do tempo interativa",
        "Extrator de fatos",
        "Classificador de relevância",
        "Sistematizador de questões",
        "Mapeador de relações causais"
      ],
      workflows: [
        { name: "Análise Jurídica", role: "Principal" }
      ]
    },
    "researcher": {
      id: "researcher",
      name: "Pesquisador Jurídico",
      role: "Pesquisa e fundamentação",
      description: "Realiza pesquisas aprofundadas de legislação, jurisprudência e doutrina para fundamentar os argumentos jurídicos.",
      icon: FileSearch,
      color: "bg-cyan-500",
      skills: [
        "Pesquisa legislativa",
        "Compilação jurisprudencial",
        "Análise doutrinária",
        "Verificação de atualidade",
        "Síntese de informações"
      ],
      tools: [
        "Motor de busca especializado",
        "Base de dados jurídica",
        "Analisador de precedentes",
        "Verificador de vigência",
        "Organizador de fontes"
      ],
      workflows: [
        { name: "Pesquisa e Fundamentação", role: "Principal" }
      ]
    },
    "arguments-analyst": {
      id: "arguments-analyst",
      name: "Analista de Argumentação",
      role: "Desenvolvimento de argumentos",
      description: "Especializado na construção e avaliação de argumentos jurídicos sólidos e na antecipação de contra-argumentos.",
      icon: FolderOpen,
      color: "bg-red-500",
      skills: [
        "Construção de argumentos",
        "Avaliação de premissas",
        "Antecipação de contra-argumentos",
        "Análise de solidez",
        "Desenvolvimento de teses"
      ],
      tools: [
        "Construtor de argumentos",
        "Matriz de refutação",
        "Quadros comparativos",
        "Analisador de solidez",
        "Gerador de contra-argumentos"
      ],
      workflows: [
        { name: "Pesquisa e Fundamentação", role: "Auxiliar" }
      ]
    },
    "writer": {
      id: "writer",
      name: "Redator Jurídico",
      role: "Redação de documentos",
      description: "Responsável pela redação clara, precisa e persuasiva de documentos jurídicos com base no material preparado.",
      icon: FilePen,
      color: "bg-emerald-500",
      skills: [
        "Redação técnica",
        "Estruturação de documentos",
        "Adequação ao tipo processual",
        "Linguagem persuasiva",
        "Clareza expositiva"
      ],
      tools: [
        "Editor especializado",
        "Biblioteca de modelos",
        "Assistente de redação",
        "Estruturador de documentos",
        "Verificador de persuasão"
      ],
      workflows: [
        { name: "Elaboração de Documento", role: "Principal" }
      ]
    },
    "specialist": {
      id: "specialist",
      name: "Especialista Jurídico Adaptável",
      role: "Especialização por área",
      description: "Agente adaptável que se especializa na área do direito específica de cada caso para fornecer conhecimento técnico.",
      icon: Users,
      color: "bg-indigo-500",
      skills: [
        "Auto-capacitação por área",
        "Conhecimento específico",
        "Elaboração de pareceres",
        "Consultas especializadas",
        "Adaptação contextual"
      ],
      tools: [
        "Base de conhecimento adaptativa",
        "Auto-aprendizado",
        "Gerador de pareceres",
        "Sistema de consulta especializada",
        "Modelagem de domínio"
      ],
      workflows: [
        { name: "Análise Jurídica", role: "Auxiliar" },
        { name: "Elaboração de Documento", role: "Auxiliar" }
      ]
    },
    "compliance": {
      id: "compliance",
      name: "Verificador de Conformidade",
      role: "Verificação e conformidade",
      description: "Verifica a conformidade dos documentos com requisitos legais, formatação adequada e presença de elementos obrigatórios.",
      icon: FileCheck,
      color: "bg-orange-500",
      skills: [
        "Verificação de requisitos",
        "Validação de citações",
        "Conformidade legal",
        "Checagem de prazos",
        "Detecção de inconformidades"
      ],
      tools: [
        "Checklist automatizado",
        "Validador de citações",
        "Verificador de conformidade",
        "Relatórios de verificação",
        "Detector de inconsistências"
      ],
      workflows: [
        { name: "Verificação e Revisão", role: "Principal" }
      ]
    },
    "reviewer": {
      id: "reviewer",
      name: "Revisor e Integrador",
      role: "Revisão e integração",
      description: "Responsável pela revisão textual, correção gramatical especializada e integração final de todos os elementos do documento.",
      icon: Settings,
      color: "bg-rose-500",
      skills: [
        "Revisão textual",
        "Correção gramatical",
        "Integração de documentos",
        "Formatação padronizada",
        "Verificação de coesão"
      ],
      tools: [
        "Revisor gramatical especializado",
        "Formatador automático",
        "Integrador de elementos",
        "Verificador de coerência",
        "Sistema de padronização"
      ],
      workflows: [
        { name: "Verificação e Revisão", role: "Auxiliar" }
      ]
    },
    "communicator": {
      id: "communicator",
      name: "Comunicador com Cliente",
      role: "Comunicação e feedback",
      description: "Especializado na comunicação clara com o cliente, apresentação de resultados e coleta de feedback para aprimoramento.",
      icon: MessageSquare,
      color: "bg-pink-500",
      skills: [
        "Comunicação técnico-leiga",
        "Elaboração de apresentações",
        "Coleta de feedback",
        "Documentação de reuniões",
        "Gestão de expectativas"
      ],
      tools: [
        "Gerador de apresentações",
        "Sistema de comunicação",
        "Formulários de feedback",
        "Registro de comunicações",
        "Simplificador de linguagem"
      ],
      workflows: [
        { name: "Entrega e Feedback", role: "Principal" }
      ]
    }
  };

  const agent = agents[agentId];
  
  if (!agent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Agente não encontrado</p>
          <Button onClick={onBack} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista
          </Button>
          <Badge className={agent.color + "/10 text-" + agent.color.replace("bg-", "") + "-700"}>
            {agent.role}
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className={`${agent.color} p-3 rounded-lg`}>
            <agent.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">{agent.name}</CardTitle>
            <CardDescription className="mt-1">{agent.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="tools">Ferramentas</TabsTrigger>
            <TabsTrigger value="workflows">Fluxos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="mt-4">
            <div className="grid grid-cols-1 gap-2">
              {agent.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-evji-accent"></div>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="mt-4">
            <div className="grid grid-cols-1 gap-2">
              {agent.tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-evji-primary"></div>
                  <span>{tool}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="workflows" className="mt-4">
            <div className="grid grid-cols-1 gap-2">
              {agent.workflows.map((workflow, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <span>{workflow.name}</span>
                  <Badge variant="outline">{workflow.role}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <Button>Acessar Interface do Agente</Button>
      </CardFooter>
    </Card>
  );
}
