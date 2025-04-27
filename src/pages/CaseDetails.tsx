
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowTimeline } from '@/components/WorkflowTimeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Users, Clock, MessageSquare, Calendar, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const mockCaseData = {
  id: '1',
  title: 'Ação de Indenização por Danos Morais',
  client: 'Maria Silva',
  status: 'Em andamento',
  createdAt: new Date('2024-04-10'),
  type: 'Cível',
  number: '0123456-78.2024.8.26.0100',
  court: '3ª Vara Cível de São Paulo',
  mainAgent: 'Estrategista',
  description: 'Caso de indenização por danos morais devido a publicação indevida de dados pessoais da cliente em plataforma digital.',
  documents: [
    { name: 'Petição Inicial.pdf', size: '1.4MB', date: new Date('2024-04-10') },
    { name: 'Procuração.pdf', size: '320KB', date: new Date('2024-04-10') },
    { name: 'Comprovantes.zip', size: '4.2MB', date: new Date('2024-04-12') }
  ],
  activities: [
    { 
      id: '1', 
      agent: 'Recepcionista', 
      action: 'Recebeu os documentos e abriu o caso', 
      date: new Date('2024-04-10T09:30:00') 
    },
    { 
      id: '2', 
      agent: 'Analisador', 
      action: 'Extraiu informações dos documentos', 
      date: new Date('2024-04-10T10:15:00') 
    },
    { 
      id: '3', 
      agent: 'Estrategista', 
      action: 'Definiu estratégia para o caso', 
      date: new Date('2024-04-11T14:20:00') 
    },
    { 
      id: '4', 
      agent: 'Pesquisador', 
      action: 'Localizou 3 jurisprudências relevantes', 
      date: new Date('2024-04-12T11:45:00') 
    }
  ],
  deadlines: [
    { 
      id: '1', 
      description: 'Prazo para contestação', 
      date: new Date('2024-05-05'), 
      status: 'pendente' 
    },
    { 
      id: '2', 
      description: 'Audiência de conciliação', 
      date: new Date('2024-06-15'), 
      status: 'pendente' 
    }
  ]
};

const CaseDetails = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { toast } = useToast();
  
  // Simulando carregamento de dados do caso
  const caseData = mockCaseData;
  
  const handleShareCase = () => {
    toast({
      title: "Link compartilhável copiado",
      description: "O link para este caso foi copiado para a área de transferência",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Header do caso */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-evji-primary">{caseData.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{caseData.type}</Badge>
                    <Badge 
                      className={caseData.status === 'Em andamento' ? 'bg-amber-500' : 'bg-green-500'}
                    >
                      {caseData.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Aberto em {format(caseData.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShareCase}>
                    Compartilhar
                  </Button>
                  <Button size="sm">Ações</Button>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
            
            {/* Informações principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Informações do Processo</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Número do processo</dt>
                      <dd>{caseData.number}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Vara</dt>
                      <dd>{caseData.court}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Cliente</dt>
                      <dd className="font-medium">{caseData.client}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Agente principal</dt>
                      <dd>{caseData.mainAgent}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{caseData.description}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Tabs com diferentes visualizações */}
            <Tabs defaultValue="timeline" className="mt-6">
              <TabsList>
                <TabsTrigger value="timeline">
                  <Clock className="h-4 w-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="activities">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Atividades
                </TabsTrigger>
                <TabsTrigger value="deadlines">
                  <Calendar className="h-4 w-4 mr-2" />
                  Prazos
                </TabsTrigger>
                <TabsTrigger value="people">
                  <Users className="h-4 w-4 mr-2" />
                  Pessoas
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="mt-4">
                <WorkflowTimeline />
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Documentos do Caso</CardTitle>
                    <CardDescription>
                      Todos os documentos relacionados a este caso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {caseData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.size} • {format(doc.date, 'dd/MM/yyyy', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Paperclip className="h-4 w-4 mr-2" />
                            Baixar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Histórico de Atividades</CardTitle>
                    <CardDescription>
                      Todas as ações realizadas pelos agentes neste caso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {caseData.activities.map((activity) => (
                        <div key={activity.id} className="relative pl-6 pb-8 last:pb-0">
                          <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
                          <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-border"></div>
                          <div className="space-y-1">
                            <div className="font-medium">{activity.agent}</div>
                            <p className="text-sm">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(activity.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="deadlines" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Prazos</CardTitle>
                    <CardDescription>
                      Prazos e datas importantes para este caso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {caseData.deadlines.map((deadline) => (
                        <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="font-medium">{deadline.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(deadline.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                          </div>
                          <Badge 
                            className={
                              deadline.status === 'pendente' 
                                ? 'bg-amber-500' 
                                : deadline.status === 'concluído' 
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                            }
                          >
                            {deadline.status === 'pendente' ? 'Pendente' : 
                             deadline.status === 'concluído' ? 'Concluído' : 'Atrasado'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="people" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pessoas Vinculadas</CardTitle>
                    <CardDescription>
                      Pessoas envolvidas neste caso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-1">Cliente</h3>
                        <p>Maria Silva</p>
                        <p className="text-sm text-muted-foreground">cliente@email.com</p>
                        <p className="text-sm text-muted-foreground">(11) 98765-4321</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-1">Advogado Responsável</h3>
                        <p>Dr. Paulo Oliveira</p>
                        <p className="text-sm text-muted-foreground">advogado@escritorio.com</p>
                        <p className="text-sm text-muted-foreground">(11) 91234-5678</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CaseDetails;
