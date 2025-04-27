
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { UploadContainer } from '@/components/upload/UploadContainer';
import { useSingleCase } from '@/hooks/useCase';
import { useActivitiesList } from '@/hooks/useActivities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity } from '@/types/case';

// Creating the missing components inline
function CaseDetailsHeader({ caseData }: { caseData: any }) {
  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-evji-primary">{caseData.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {caseData.type || 'Sem tipo'}
            </span>
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {caseData.status === 'em_andamento' ? 'Em andamento' : 'Concluído'}
            </span>
            {caseData.created_at && (
              <span className="text-sm text-muted-foreground">
                Aberto em {format(new Date(caseData.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityList({ activities, isLoading }: { activities: Activity[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-evji-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando atividades...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <p className="text-muted-foreground">Nenhuma atividade registrada.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6 pb-8 last:pb-0">
              <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
              <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-border"></div>
              <div className="space-y-1">
                <div className="font-medium">{activity.agent}</div>
                <p className="text-sm">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(activity.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentList({ caseId }: { caseId?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Documentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-4">
          <p className="text-muted-foreground">Nenhum documento disponível.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CaseTimeline({ caseId }: { caseId?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Linha do tempo</CardTitle>
      </CardHeader>
      <CardContent className="text-center p-4">
        <p className="text-muted-foreground">Nenhum evento registrado.</p>
      </CardContent>
    </Card>
  );
}

function CaseAlerts({ caseId }: { caseId?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alertas</CardTitle>
      </CardHeader>
      <CardContent className="text-center p-4">
        <p className="text-muted-foreground">Nenhum alerta pendente.</p>
      </CardContent>
    </Card>
  );
}

export default function CaseDetails() {
  const { caseId } = useParams<{ caseId: string }>();
  
  const { caseData, isLoading } = useSingleCase(caseId);
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

  if (!caseData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="text-center p-12">
              <p className="text-red-500">Erro ao carregar detalhes do caso.</p>
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
                <ActivityList activities={activities || []} isLoading={isLoadingActivities} />
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
