
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Calendar, Users, Bell, Info, MessageSquare } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Case, Activity } from "@/types/case";
import { ActivityList } from "@/components/case/ActivityList";
import { CaseContentTabs } from "@/components/case/CaseContentTabs";
import { WebChat } from "@/components/WebChat";

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
        <div className="h-24 bg-gray-200 rounded-lg" />
        <div className="h-[400px] bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Case Header with essential information */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-semibold text-evji-primary">{caseData.title}</h2>
            <p className="text-sm text-muted-foreground">Processo: {caseData.number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cliente</p>
            <p className="font-medium">{caseData.client}</p>
            <p className="text-sm font-medium text-muted-foreground mt-2">Status</p>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              caseData.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' : 
              caseData.status === 'concluido' ? 'bg-green-100 text-green-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {caseData.status === 'em_andamento' ? 'Em Andamento' : 
               caseData.status === 'concluido' ? 'Concluído' : 'Arquivado'}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Área do Direito</p>
            <p>{caseData.area_direito || 'Não especificada'}</p>
            <p className="text-sm font-medium text-muted-foreground mt-2">Tipo</p>
            <p>{caseData.type || 'Não especificado'}</p>
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
