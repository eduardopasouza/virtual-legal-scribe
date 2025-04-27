
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { Case, Activity } from "@/types/case";

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
    <Card>
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none px-6">
          <TabsTrigger value="summary">Resumo</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{caseData.title}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                <p>{caseData.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p>{caseData.status === 'em_andamento' ? 'Em Andamento' : 
                    caseData.status === 'concluido' ? 'Concluído' : 'Arquivado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                <p>{caseData.client}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="p-6">
          <ActivityList 
            activities={activities} 
            isLoading={isLoadingActivities}
          />
        </TabsContent>

        <TabsContent value="details" className="p-6">
          {/* Additional case details can be added here */}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
