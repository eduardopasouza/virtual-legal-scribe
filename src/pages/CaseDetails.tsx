import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ActivityList } from '@/components/ActivityList';
import { DocumentList } from '@/components/DocumentList';
import { UploadContainer } from '@/components/upload/UploadContainer';
import { CaseDetailsHeader } from '@/components/cases/CaseDetailsHeader';
import { CaseTimeline } from '@/components/cases/CaseTimeline';
import { CaseAlerts } from '@/components/cases/CaseAlerts';
import { useSingleCase } from '@/hooks/useCase';
import { useActivitiesList } from '@/hooks/useActivities';
import { useFileProcessing } from '@/hooks/useFileProcessing';

export default function CaseDetails() {
  const { caseId } = useParams<{ caseId: string }>();
  
  const { caseData, isLoading, error } = useSingleCase(caseId);
  const { activities, isLoading: isLoadingActivities } = useActivitiesList(caseId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="text-center p-12">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-evji-primary mx-auto"></div>
              <p className="mt-4">Carregando detalhes do caso...</p>
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
            <div className="text-center p-12">
              <p className="text-red-500">Erro ao carregar detalhes do caso.</p>
              {error && <p>{error.message}</p>}
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
            <CaseDetailsHeader caseData={caseData} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <UploadContainer caseId={caseId} />
                <ActivityList activities={activities} isLoading={isLoadingActivities} />
              </div>

              <div className="space-y-4">
                <CaseTimeline caseId={caseId} />
                <CaseAlerts caseId={caseId} />
                <DocumentList caseId={caseId} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
