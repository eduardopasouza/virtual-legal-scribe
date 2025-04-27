
import { Card } from "@/components/ui/card";
import { Case, Activity } from "@/types/case";
import { ActivityList } from "@/components/case/ActivityList";
import { CaseContentTabs } from "@/components/case/CaseContentTabs";
import { WebChat } from "@/components/WebChat";
import { MessageSquare } from 'lucide-react';
import { CaseHeader } from "@/components/case/CaseHeader";

interface CaseDetailsContentProps {
  caseId: string;
  caseData: Case;
  activities: Activity[];
  isLoadingActivities: boolean;
  isLoadingCase?: boolean;
}

export function CaseDetailsContent({
  caseId,
  caseData,
  activities,
  isLoadingActivities,
  isLoadingCase = false
}: CaseDetailsContentProps) {
  if (isLoadingCase) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-muted rounded-lg" />
        <div className="h-[400px] bg-muted rounded-lg" />
      </div>
    );
  }

  // Map case status to display format
  const statusDisplay = caseData.status === 'em_andamento' ? 'Em Andamento' : 
                       caseData.status === 'concluido' ? 'Concluído' : 'Arquivado';

  // Format created_at date
  const createdAt = new Date(caseData.created_at);

  return (
    <div className="space-y-4">
      {/* Case Header with essential information */}
      <CaseHeader 
        title={caseData.title}
        type={caseData.type || 'Não especificado'}
        status={statusDisplay}
        createdAt={createdAt}
      />

      {/* Basic Case Information Card */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Número do Processo</p>
            <p className="font-medium">{caseData.number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cliente</p>
            <p className="font-medium">{caseData.client}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Área do Direito</p>
            <p>{caseData.area_direito || 'Não especificada'}</p>
          </div>
        </div>
      </Card>

      {/* Comprehensive Content Tabs System */}
      <CaseContentTabs 
        caseId={caseId}
        activities={activities}
        deadlines={[]} // Will be loaded via the CaseContentTabs component
        workflowStages={[]} // Will be loaded via the CaseContentTabs component
        alerts={[]} // Will be loaded via the CaseContentTabs component
        documents={[]} // Will be loaded via the CaseContentTabs component
        objective={caseData.description}
      />
      
      {/* Interactive WebChat for Case-Specific Assistance */}
      <Card className="mt-6">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Assistência Específica para este Caso
          </h3>
          <p className="text-sm text-muted-foreground">
            Interaja com o assistente jurídico para tirar dúvidas específicas sobre este caso
          </p>
        </div>
        <div className="h-[400px]">
          <WebChat caseId={caseId} fullScreen={false} />
        </div>
      </Card>
    </div>
  );
}
