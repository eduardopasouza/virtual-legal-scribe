
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Loader2 } from 'lucide-react';
import { CaseHeader } from '@/components/case/CaseHeader';
import { CaseInformation } from '@/components/case/CaseInformation';
import { CaseContentTabs } from '@/components/case/CaseContentTabs';
import { CaseActions } from '@/components/case/CaseActions';
import { useCaseDetails } from '@/hooks/useCaseDetails';

const CaseDetails = () => {
  const { caseId } = useParams<{ caseId: string }>();
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
              
              <CaseActions 
                caseId={caseId}
                documents={documents}
                caseData={caseData}
              />
            </div>
            
            <CaseInformation 
              number={caseData.number || "Não informado"}
              court={caseData.court || "Não informado"}
              client={caseData.client}
              mainAgent={caseData.main_agent || "Não definido"}
              description={caseData.description || "Sem descrição"}
            />
            
            <CaseContentTabs
              caseId={caseId}
              activities={activities}
              deadlines={deadlines}
              workflowStages={workflowStages}
              alerts={alerts}
              documents={documents}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CaseDetails;
