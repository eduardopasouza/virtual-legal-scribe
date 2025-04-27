
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowTimeline } from '@/components/WorkflowTimeline';
import { Clock, FileText, MessageSquare, Calendar, Users, Bell, Loader2 } from 'lucide-react';
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

const CaseDetails = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
      
      // Recarregar os dados
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      queryClient.invalidateQueries({ queryKey: ["activities", caseId] });
      queryClient.invalidateQueries({ queryKey: ["workflow_stages", caseId] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao processar triagem",
        description: `Ocorreu um erro: ${error.message}`,
        variant: "destructive",
      });
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
            <div className="flex justify-between items-center">
              <CaseHeader 
                title={caseData.title}
                type={caseData.type || ""}
                status={caseData.status || "em_andamento"}
                createdAt={new Date(caseData.created_at)}
              />
              
              <Button 
                onClick={() => chamarAnalistaMutation.mutate()}
                disabled={chamarAnalistaMutation.isPending}
                className="ml-4"
              >
                {chamarAnalistaMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Acionar Analista de Requisitos (simulado)"
                )}
              </Button>
            </div>
            
            <CaseInformation 
              number={caseData.number || "Não informado"}
              court={caseData.court || "Não informado"}
              client={caseData.client}
              mainAgent={caseData.main_agent || "Não definido"}
              description={caseData.description || "Sem descrição"}
            />
            
            <Tabs defaultValue="summary" className="mt-6">
              <TabsList>
                <TabsTrigger value="summary">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Resumo
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <Clock className="h-4 w-4 mr-2" />
                  Linha do Tempo
                </TabsTrigger>
                <TabsTrigger value="alerts">
                  <Bell className="h-4 w-4 mr-2" />
                  Alertas
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
              
              <TabsContent value="summary" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <CaseTimeline stages={workflowStages} />
                    {alerts.length > 0 && <CaseAlerts alerts={alerts} />}
                  </div>
                  
                  <div>
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
