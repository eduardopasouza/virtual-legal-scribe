
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DashboardStats } from '@/components/DashboardStats';
import { ChatbotAssistant } from '@/components/ChatbotAssistant';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  Database, 
  FileText, 
  Users, 
  BarChart2,
  Info
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Index = () => {
  const navigate = useNavigate();
  const [openGuide, setOpenGuide] = useState(false);
  
  // Funções para navegar para outras páginas
  const goToNewCase = () => navigate('/novo-caso');
  const goToCases = () => navigate('/cases/list');
  const goToCalendar = () => navigate('/calendar');
  const goToClients = () => navigate('/clients');
  const goToStats = () => navigate('/stats');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Título do Dashboard */}
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-3xl font-bold text-evji-primary">Dashboard</h2>
              <Button 
                className="bg-evji-primary hover:bg-evji-primary/90 flex items-center gap-2" 
                onClick={goToNewCase}
              >
                <FileText className="h-4 w-4" />
                Novo Caso
              </Button>
            </div>
            
            {/* Estatísticas do Sistema */}
            <DashboardStats />
            
            {/* Layout principal em grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna da esquerda (2/3 da largura) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Atalhos para funções principais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-evji-accent" />
                      Acesso Rápido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-24 gap-2 p-3 hover:bg-evji-accent/10"
                        onClick={goToNewCase}
                      >
                        <FileText className="h-10 w-10 text-evji-primary" />
                        <span>Novo Caso</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-24 gap-2 p-3 hover:bg-evji-accent/10"
                        onClick={goToCases}
                      >
                        <FileText className="h-10 w-10 text-evji-primary" />
                        <span>Casos</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-24 gap-2 p-3 hover:bg-evji-accent/10"
                        onClick={goToClients}
                      >
                        <Users className="h-10 w-10 text-evji-primary" />
                        <span>Clientes</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-24 gap-2 p-3 hover:bg-evji-accent/10"
                        onClick={goToStats}
                      >
                        <BarChart2 className="h-10 w-10 text-evji-primary" />
                        <span>Estatísticas</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Atividades em andamento */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-evji-accent" />
                      Atividades em Andamento
                    </CardTitle>
                    <CardDescription>
                      Últimas atividades registradas no sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0">
                          <div>
                            <p className="font-medium">Análise de documentação - Caso #{123 + index}</p>
                            <p className="text-sm text-muted-foreground">Agente: Analista de Fatos</p>
                          </div>
                          <Badge variant={index === 0 ? "default" : "outline"}>
                            {index === 0 ? "Em andamento" : "Pendente"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
                      Ver todas as atividades
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Guia sobre o sistema */}
                <Collapsible
                  open={openGuide}
                  onOpenChange={setOpenGuide}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-medium text-evji-primary flex items-center gap-2">
                      <Info className="h-5 w-5 text-evji-accent" />
                      Como funciona o sistema EVJI
                    </h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {openGuide ? "Fechar" : "Expandir"}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="mt-4 space-y-4">
                    <p className="text-muted-foreground">
                      O sistema EVJI foi projetado para otimizar o fluxo de trabalho jurídico através
                      da coordenação de agentes de IA especializados que trabalham em conjunto para analisar,
                      processar e preparar documentação legal.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded p-3">
                        <h4 className="font-medium mb-2">Fluxo de Trabalho</h4>
                        <ol className="list-decimal ml-4 text-sm space-y-1">
                          <li>Cadastro do caso e upload de documentos</li>
                          <li>Análise de fatos e requisitos pelo Analista de Fatos</li>
                          <li>Elaboração de estratégia pelo Estrategista</li>
                          <li>Redação de documentos pelo Redator</li>
                          <li>Revisão legal pelo Revisor Legal</li>
                        </ol>
                      </div>
                      
                      <div className="border rounded p-3">
                        <h4 className="font-medium mb-2">Principais Recursos</h4>
                        <ul className="list-disc ml-4 text-sm space-y-1">
                          <li>Orquestração de agentes de IA especializados</li>
                          <li>Análise automática de documentos</li>
                          <li>Geração assistida de peças processuais</li>
                          <li>Comunicação simplificada com clientes</li>
                          <li>Dashboard analítico para acompanhamento</li>
                        </ul>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              {/* Coluna da direita (1/3 da largura) */}
              <div className="space-y-6">
                {/* Alertas Importantes */}
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      Alertas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm">Sem alertas pendentes no momento.</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Compromissos próximos */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-evji-accent" />
                      Compromissos Próximos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-l-2 border-evji-accent pl-3 py-1">
                        <p className="font-medium">Audiência Preliminar</p>
                        <p className="text-xs text-muted-foreground">Hoje, 14:00 - Caso #12345</p>
                      </div>
                      <div className="border-l-2 border-gray-300 pl-3 py-1">
                        <p className="font-medium">Prazo para Contestação</p>
                        <p className="text-xs text-muted-foreground">Amanhã, 18:00 - Caso #12349</p>
                      </div>
                      <div className="border-l-2 border-gray-300 pl-3 py-1">
                        <p className="font-medium">Reunião com Cliente</p>
                        <p className="text-xs text-muted-foreground">23/04, 10:00 - Caso #12356</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" onClick={goToCalendar}>
                      Ver calendário completo
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Acesso ao banco de dados */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5 text-evji-accent" />
                      Banco de Dados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate('/clients')}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Clientes
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate('/cases/list')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Casos
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate('/stats')}
                      >
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Estatísticas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
      <ChatbotAssistant />
    </div>
  );
};

export default Index;
