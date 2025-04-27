import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText, MessageSquare, Calendar, Users, Bell, Loader2, Info, CheckCircle } from 'lucide-react';
import { CaseHeader } from '@/components/case/CaseHeader';
import { CaseInformation } from '@/components/case/CaseInformation';
import { CaseDocuments } from '@/components/case/CaseDocuments';
import { CaseActivities } from '@/components/case/CaseActivities';
import { CaseDeadlines } from '@/components/case/CaseDeadlines';
import { CasePeople } from '@/components/case/CasePeople';
import { Button } from '@/components/ui/button';
import { useCaseDetails } from '@/hooks/useCaseDetails';
import { useToast } from '@/hooks/use-toast';
import { DocumentUploader } from '@/components/DocumentUploader';
import { CaseTimeline } from '@/components/case/CaseTimeline';
import { CaseAlerts } from '@/components/case/CaseAlerts';
import { chamarAnalistaRequisitos, criarAnalise, atualizarEtapa } from '@/lib/api/agentsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentInteraction } from '@/components/AgentInteraction';
import { NotificationSystem } from '@/components/notification/NotificationSystem';

const CaseDetails = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('summary');
  
  const { 
    caseData, 
    documents, 
    workflowStages, 
    alerts,
    activities,
    deadlines,
    isLoading, 
    error 
  } = useCaseDetails(caseId);

  const chamarAnalistaMutation = useMutation({
    mutationFn: async () => {
      if (!caseData || !caseId) throw new Error("Caso não encontrado");
      
      // Chamar o analista e processar os resultados
      const res = await chamarAnalistaRequisitos(documents, caseData);
      await criarAnalise({ 
        caso_id: caseId, 
        agente: 'analista-requisitos', 
        conteudo: JSON.stringify(res) 
      });
      await atualizarEtapa(caseId, 'reception', 'completed');
      await atualizarEtapa(caseId, 'planning', 'in_progress');
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Triagem concluída",
        description: "O analista de requisitos processou os documentos com sucesso.",
      });
      
      // Adicionar notificação
      if ((window as any).addNotification) {
        (window as any).addNotification(
          'success', 
          'Triagem finalizada', 
          'O analista de requisitos finalizou a triagem do caso.'
        );
      }
      
      // Recarregar os dados
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      queryClient.invalidateQueries({ queryKey: ["activities", caseId] });
      queryClient.invalidateQueries({ queryKey: ["workflow_stages", caseId] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao processar triagem",
        description: `Ocorreu um erro: ${error.message}`,
        variant: "destructive",
      });
      
      // Adicionar notificação de erro
      if ((window as any).addNotification) {
        (window as any).addNotification(
          'alert', 
          'Erro na triagem', 
          'Ocorreu um erro ao processar a triagem do caso.'
        );
      }
    }
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="mt-2">Carregando informações do caso...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (error || !caseData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="mt-2">Erro ao carregar caso. {error?.message}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CaseHeader 
                title={caseData.title}
                type={caseData.type || ""}
                status={caseData.status || "em_andamento"}
                createdAt={new Date(caseData.created_at)}
              />
              
              <div className="flex gap-2 flex-wrap">
                {/* Evolua para um dropdown com mais opções futuras */}
                <Button 
                  onClick={() => chamarAnalistaMutation.mutate()}
                  disabled={chamarAnalistaMutation.isPending}
                  variant="outline"
                >
                  {chamarAnalistaMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Info className="mr-2 h-4 w-4" />
                      Acionar Analista de Requisitos
                    </>
                  )}
                </Button>
                
                <Button className="bg-evji-primary hover:bg-evji-primary/90">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Avançar Etapa
                </Button>
              </div>
            </div>
            
            <CaseInformation 
              number={caseData.number || "Não informado"}
              court={caseData.court || "Não informado"}
              client={caseData.client}
              mainAgent={caseData.main_agent || "Não definido"}
              description={caseData.description || "Sem descrição"}
            />
            
            <Tabs 
              defaultValue="summary" 
              value={activeTab}
              onValueChange={setActiveTab} 
              className="mt-6"
            >
              <TabsList className="mb-4 overflow-auto flex-nowrap max-w-full max-md:justify-start">
                <TabsTrigger value="summary" className="whitespace-nowrap">
                  <Info className="h-4 w-4 mr-2" />
                  Resumo
                </TabsTrigger>
                <TabsTrigger value="documents" className="whitespace-nowrap">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="timeline" className="whitespace-nowrap">
                  <Clock className="h-4 w-4 mr-2" />
                  Linha do Tempo
                </TabsTrigger>
                <TabsTrigger value="alerts" className="whitespace-nowrap">
                  <Bell className="h-4 w-4 mr-2" />
                  Alertas {alerts.length > 0 && <span className="ml-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center">{alerts.length}</span>}
                </TabsTrigger>
                <TabsTrigger value="activities" className="whitespace-nowrap">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Atividades
                </TabsTrigger>
                <TabsTrigger value="deadlines" className="whitespace-nowrap">
                  <Calendar className="h-4 w-4 mr-2" />
                  Prazos
                </TabsTrigger>
                <TabsTrigger value="people" className="whitespace-nowrap">
                  <Users className="h-4 w-4 mr-2" />
                  Pessoas
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 space-y-6">
                    <CaseTimeline stages={workflowStages} />
                    <AgentInteraction caseId={caseId} />
                    {alerts.length > 0 && <CaseAlerts alerts={alerts} />}
                  </div>
                  
                  <div className="lg:col-span-4">
                    <DocumentUploader caseId={caseId} onSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
                    }} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <CaseDocuments caseId={caseId} />
              </TabsContent>
              
              <TabsContent value="timeline" className="mt-4">
                <CaseTimeline stages={workflowStages} />
              </TabsContent>
              
              <TabsContent value="alerts" className="mt-4">
                <CaseAlerts alerts={alerts} />
              </TabsContent>
              
              <TabsContent value="activities" className="mt-4">
                <CaseActivities activities={activities} />
              </TabsContent>
              
              <TabsContent value="deadlines" className="mt-4">
                <CaseDeadlines deadlines={deadlines} />
              </TabsContent>
              
              <TabsContent value="people" className="mt-4">
                <CasePeople />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CaseDetails;
